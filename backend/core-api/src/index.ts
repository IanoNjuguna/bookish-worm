import { logger } from './lib/logger'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { rateLimiter } from 'hono-rate-limiter'
import { bodyLimit } from 'hono/body-limit'
import { z } from 'zod'
import { getTrack, addTrack, getAllTracks, deleteTrack, deleteAllTracks, getUser, addUser, getTrackCollaborators, addCollaborator, isAdmin, type Track, type RefreshToken, addRefreshToken, getRefreshToken, revokeRefreshToken, revokeRefreshTokenFamily, addMint, getUserMints, addPlay, getAnalytics, getMonthlyBillboard, createAuthNonce, consumeAuthNonce, cleanupExpiredNonces } from './database'
import { verifyOwnershipOnChain, getRemainingFractionsOnChain } from './web3'
import { verifyWalletSignature, signJWT, verifyJWT, generateRefreshToken, getAccessTokenPayload } from './auth'
import axios from 'axios'
import FormData from 'form-data'
import { Buffer } from 'buffer'
import { jwt } from 'hono/jwt'
import { Storage } from '@google-cloud/storage'

const storage = new Storage()
const app = new Hono()

function parseCsvEnv(value: string | undefined, fallback: string[]) {
  if (!value) return fallback
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
}

// CORS allowlist (comma-separated CORS_ORIGINS env var)
const ALLOWED_ORIGINS = parseCsvEnv(process.env.CORS_ORIGINS, [
  'https://doba.world',
  'https://about.doba.world',
  'http://localhost:3000',
  'http://localhost:3001',
])

app.use('/*', cors({
  origin: (origin) => {
    if (!origin) return '*' // Non-browser clients (curl, server-to-server)
    return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  },
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Accept', 'Origin', 'X-Requested-With'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}))

const SERVER_VERSION = '1.2.5-fix-download-proxy'

// Global Error Handler
app.onError((err, c) => {
  logger.error(`[API ERROR] ${c.req.method} ${c.req.url}`, err)

  // Return generic message for internal errors
  return c.json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.'
  }, 500)
})

// 404 Handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', message: `Route ${c.req.path} does not exist` }, 404)
})

const JWT_SECRET = process.env.JWT_SECRET || 'doba-default-secret-change-me'

// Derive cookie settings from environment
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined
const COOKIE_SAME_SITE = process.env.COOKIE_SAMESITE || 'Strict'

function setRefreshCookie(c: any, token: string) {
  const maxAge = 30 * 24 * 60 * 60 // 30 days in seconds
  const parts = [
    `doba_refresh_token=${token}`,
    `Path=/auth`,
    `HttpOnly`,
    `SameSite=${COOKIE_SAME_SITE}`,
    `Max-Age=${maxAge}`,
  ]
  if (IS_PRODUCTION) parts.push('Secure')
  if (COOKIE_DOMAIN) parts.push(`Domain=${COOKIE_DOMAIN}`)
  c.header('Set-Cookie', parts.join('; '))
}

function clearRefreshCookie(c: any) {
  const parts = [
    `doba_refresh_token=`,
    `Path=/auth`,
    `HttpOnly`,
    `SameSite=${COOKIE_SAME_SITE}`,
    `Max-Age=0`,
  ]
  if (IS_PRODUCTION) parts.push('Secure')
  if (COOKIE_DOMAIN) parts.push(`Domain=${COOKIE_DOMAIN}`)
  c.header('Set-Cookie', parts.join('; '))
}

// Authentication Middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid Authorization header' }, 401)
  }

  const token = authHeader.split(' ')[1]

  const payload = await verifyJWT(token, JWT_SECRET)

  if (!payload) {
    return c.json({ error: 'Unauthorized', message: 'Invalid or expired access token' }, 401)
  }

  c.set('jwtPayload', payload)
  await next()
}

// Simple API Key Middleware for mutating routes (POST, DELETE, PUT)
app.use('*', async (c, next) => {
  if (['POST', 'DELETE', 'PUT', 'PATCH'].includes(c.req.method)) {
    // Exclude auth and public play routes from API Key requirement
    if (c.req.path.startsWith('/auth/')) return await next()
    if (c.req.path.includes('/play')) return await next()

    // JWT-authenticated routes (upload/songs/mints/collaborators/users/etc.)
    // should not require a client-exposed API key.
    const authHeader = c.req.header('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) return await next()

    const apiKey = c.req.header('X-API-Key')
    const validKey = process.env.API_SECRET_KEY || process.env.ADMIN_API_KEY

    // If a key is configured on the server, enforce it strictly
    if (validKey && apiKey !== validKey) {
      logger.warn(`Unauthorized ${c.req.method} attempt to ${c.req.path} - Invalid or missing API Key`)
      return c.json({ error: 'Unauthorized. Invalid or missing X-API-Key.' }, 401)
    }
  }
  await next()
})

const getPinataJwt = () => {
  const jwt = process.env.PINATA_JWT?.trim()
  if (!jwt) logger.warn('PINATA_JWT is MISSING from process.env')
  return jwt
}

// IPFS Upload Assets Proxy (PIN INDIVIDUALLY)
app.post('/upload-assets',
  authMiddleware,
  bodyLimit({
    maxSize: 50 * 1024 * 1024, // 50 MB
    onError: (c) => {
      return c.json({ error: 'Payload Too Large', message: 'Request body exceeds 50 MB limit.' }, 413)
    }
  }),
  async (c) => {
    const pinataJwt = getPinataJwt()
  if (!pinataJwt) return c.json({ error: 'Pinata JWT not configured' }, 500)

  try {
    const formData = await c.req.formData()
    const audio = formData.get('audio') as any
    const image = formData.get('image') as any
    const title = formData.get('title') as string || 'assets'

    if (!audio && !image) return c.json({ error: 'Missing files' }, 400)

    logger.info(`[IPFS] Dual-Pin Start: ${title}`)

    let audioHash = ""
    let audioEntryName = ""
    let streamingUrl = ""
    let imageHash = ""
    let imageEntryName = ""

    // 1. PIN AUDIO
    if (audio) {
      const audioFormData = new FormData()
      const audioBuffer = Buffer.from(await audio.arrayBuffer())
      audioEntryName = `audio_${Date.now()}.mp3`
      audioFormData.append('file', audioBuffer, { filename: audioEntryName, contentType: audio.type || 'audio/mpeg' })
      audioFormData.append('pinataMetadata', JSON.stringify({ name: `${title}_audio` }))

      logger.debug(`[IPFS] Pinning audio...`)
      const audioRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", audioFormData, {
        maxBodyLength: Infinity,
        headers: { Authorization: `Bearer ${pinataJwt}`, ...audioFormData.getHeaders() }
      })
      audioHash = audioRes.data.IpfsHash
      logger.info(`[IPFS] Audio Success: ${audioHash}`)

      // UPLOAD AUDIO TO GCS (Optional / Soft Fallback)
      try {
        const bucketName = process.env.GCS_BUCKET_NAME || 'doba-music-streaming'
        const bucket = storage.bucket(bucketName)
        const gcsFile = bucket.file(audioEntryName)
        logger.debug(`[GCS] Uploading audio...`)
        await gcsFile.save(audioBuffer, {
          metadata: {
            contentType: audio.type || 'audio/mpeg'
          }
        })
        streamingUrl = `https://storage.googleapis.com/${bucketName}/${audioEntryName}`
        logger.info(`[GCS] Audio Success: ${streamingUrl}`)
      } catch (gcsErr: any) {
        logger.warn(`[GCS] Upload failed (likely missing credentials). Falling back to IPFS gateway. Error: ${gcsErr.message}`)
        streamingUrl = `https://gateway.pinata.cloud/ipfs/${audioHash}`
      }
    }

    // 2. PIN IMAGE
    if (image) {
      const imageFormData = new FormData()
      const imageBuffer = Buffer.from(await image.arrayBuffer())
      imageEntryName = `cover_${Date.now()}.jpg`
      imageFormData.append('file', imageBuffer, { filename: imageEntryName, contentType: image.type || 'image/jpeg' })
      imageFormData.append('pinataMetadata', JSON.stringify({ name: `${title}_image` }))

      logger.debug(`[IPFS] Pinning image...`)
      const imageRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", imageFormData, {
        maxBodyLength: Infinity,
        headers: { Authorization: `Bearer ${pinataJwt}`, ...imageFormData.getHeaders() }
      })
      imageHash = imageRes.data.IpfsHash
      logger.info(`[IPFS] Image Success: ${imageHash}`)
    }

    return c.json({
      success: true,
      audioHash,
      imageHash,
      audioName: audioEntryName,
      imageName: imageEntryName,
      streamingUrl
    })
  } catch (error: any) {
    logger.error(`[IPFS] Assets upload failed`, error.response?.data || error.message)
    return c.json({ error: 'Assets upload failed' }, 500)
  }
})



// Auth Routes

// Challenge-response: client must request a nonce before signing
// Rate-limited to 5 requests per minute per IP to prevent nonce-table DoS
app.get('/auth/challenge',
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 5,
    keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
    handler: (c) => c.json({ error: 'Too many requests', message: 'Max 5 challenge requests per minute. Try again shortly.' }, 429),
  }),
  async (c) => {
    const address = c.req.query('address')
    if (!address) return c.json({ error: 'address query parameter is required' }, 400)

    const nonce = await createAuthNonce(address)
    return c.json({ nonce })
  }
)

app.post('/auth/login', async (c) => {
  const { address, signature, key, message, nonce } = await c.req.json()

  // Verify the server-issued nonce was included and is valid
  if (!nonce) {
    return c.json({ error: 'Authentication failed', message: 'Missing nonce. Request /auth/challenge first.' }, 400)
  }

  const nonceValid = await consumeAuthNonce(nonce, address)
  if (!nonceValid) {
    return c.json({ error: 'Authentication failed', message: 'Invalid or expired nonce' }, 401)
  }

  const isValid = await verifyWalletSignature(address, signature, key, message)
  if (!isValid) {
    return c.json({ error: 'Authentication failed', message: 'Invalid signature' }, 401)
  }

  // Ensure user exists
  const existingUser = await getUser(address)
  if (!existingUser) {
    await addUser({ address, role: 'user' })
  }

  const accessToken = await signJWT(getAccessTokenPayload(address), JWT_SECRET)
  const refreshTokenString = generateRefreshToken()
  const family = refreshTokenString // Initial token in family

  const rt: RefreshToken = {
    token: refreshTokenString,
    user_address: address,
    family,
    expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    revoked: false
  }
  await addRefreshToken(rt)

  // Set refresh token as HttpOnly cookie and return address and accessToken
  setRefreshCookie(c, refreshTokenString)
  return c.json({ address, accessToken, expiresIn: 15 * 60 })
})

app.post('/auth/refresh', async (c) => {
  // Accept refresh token from body OR HttpOnly cookie
  const body = await c.req.json().catch(() => ({}))
  const cookieHeader = c.req.header('Cookie') || ''
  const cookieMatch = cookieHeader.match(/doba_refresh_token=([^;]+)/)
  const refreshToken = body.refreshToken || (cookieMatch ? cookieMatch[1] : null)

  if (!refreshToken) return c.json({ error: 'Refresh token required' }, 400)

  const rtRecord = await getRefreshToken(refreshToken)
  if (!rtRecord) {
    clearRefreshCookie(c)
    return c.json({ error: 'Invalid refresh token' }, 401)
  }

  if (rtRecord.revoked) {
    // Reuse detected! Revoke EVERYTHING in this family
    logger.warn(`Refresh token reuse detected for family ${rtRecord.family}. Revoking entire family.`)
    await revokeRefreshTokenFamily(rtRecord.family)
    clearRefreshCookie(c)
    return c.json({ error: 'Security alert', message: 'Refresh token has been reused. All sessions revoked.' }, 401)
  }

  if (rtRecord.expires_at < Math.floor(Date.now() / 1000)) {
    clearRefreshCookie(c)
    return c.json({ error: 'Refresh token expired' }, 401)
  }

  // Rotate: revoke only the consumed token (not the whole family)
  await revokeRefreshToken(rtRecord.token)

  const address = rtRecord.user_address
  const accessToken = await signJWT(getAccessTokenPayload(address), JWT_SECRET)
  const newRefreshTokenString = generateRefreshToken()

  const newRt: RefreshToken = {
    token: newRefreshTokenString,
    user_address: address,
    family: rtRecord.family,
    expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    revoked: false
  }
  await addRefreshToken(newRt)

  setRefreshCookie(c, newRefreshTokenString)
  return c.json({ accessToken, expiresIn: 15 * 60 })
})

app.post('/auth/logout', async (c) => {
  const cookieHeader = c.req.header('Cookie') || ''
  const cookieMatch = cookieHeader.match(/doba_refresh_token=([^;]+)/)
  const refreshToken = cookieMatch ? cookieMatch[1] : null

  if (refreshToken) {
    const rtRecord = await getRefreshToken(refreshToken)
    if (rtRecord) {
      await revokeRefreshTokenFamily(rtRecord.family)
    }
  }

  clearRefreshCookie(c)
  return c.json({ success: true })
})



const trackSchema = z.object({
  title: z.string().min(1, "Track title is required"),
  audioHash: z.string().min(1, "Track audioHash is required"),
  audioName: z.string().min(1, "Track audioName is required"),
  duration: z.string().regex(/^PT\d+M\d+S$/, "Track duration must be in ISO-8601 format (e.g. PT3M45S)").optional(),
  track_number: z.number().int().min(1).optional()
})

const uploadMetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ticker: z.string().max(32).optional().nullable(),
  description: z.string().optional().nullable(),
  artist: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  audioHash: z.string().optional().nullable(),
  imageHash: z.string().min(1, "Image IPFS hash is required"),
  audioName: z.string().optional().nullable(),
  imageName: z.string().optional().nullable(),
  duration: z.string().regex(/^PT\d+M\d+S$/, "Duration must be in ISO-8601 format (e.g. PT3M45S)").optional().nullable(),
  isAlbum: z.boolean().optional(),
  tracks: z.array(trackSchema).optional(),
  royaltyRate: z.string().optional().nullable(),
  royaltyAddress: z.string().optional().nullable()
}).refine((data) => {
  if (data.isAlbum) {
    return Array.isArray(data.tracks) && data.tracks.length > 0;
  } else {
    return !!data.audioHash && !!data.audioName;
  }
}, {
  message: "Audio file and metadata are required for a single track",
  path: ["audioHash"]
})

// IPFS Upload Metadata Proxy (Accept dual hashes)
app.post('/upload-metadata', authMiddleware, async (c) => {
  const pinataJwt = getPinataJwt()
  if (!pinataJwt) return c.json({ error: 'Pinata JWT not configured' }, 500)

  try {
    const body = await c.req.json()
    const result = uploadMetadataSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Validation Failed', message: result.error.issues[0].message, details: result.error.issues }, 400)
    }

    const { title, ticker, description, artist, genre, audioHash, imageHash, audioName, imageName, duration, isAlbum, tracks, royaltyRate, royaltyAddress } = result.data

    const finalImageUri = imageHash.startsWith('Qm') || imageHash.startsWith('ba')
      ? `ipfs://${imageHash}`
      : `ipfs://${imageHash}/${imageName}`

    let files = []
    if (isAlbum && Array.isArray(tracks)) {
      files = tracks.map((t: any, idx: number) => {
        const finalTrackAudioUri = t.audioHash.startsWith('Qm') || t.audioHash.startsWith('ba')
          ? `ipfs://${t.audioHash}`
          : `ipfs://${t.audioHash}/${t.audioName}`
        return {
          name: `${t.title} Audio`,
          mediaType: "audio/mpeg",
          src: finalTrackAudioUri,
          song: {
            song_title: t.title,
            song_duration: t.duration || "PT3M45S",
            track_number: t.track_number || (idx + 1),
            artists: [
              {
                name: artist || "Unknown Artist"
              }
            ]
          }
        }
      })
    } else {
      const finalAudioUri = audioHash && (audioHash.startsWith('Qm') || audioHash.startsWith('ba'))
        ? `ipfs://${audioHash}`
        : audioHash ? `ipfs://${audioHash}/${audioName}` : ""

      files = [
        {
          name: `${title} Audio`,
          mediaType: "audio/mpeg",
          src: finalAudioUri,
          song: {
            song_title: title,
            song_duration: duration || "PT3M45S",
            track_number: 1,
            artists: [
              {
                name: artist || "Unknown Artist"
              }
            ]
          }
        }
      ]
    }

    const metadata = {
      name: title,
      ticker: ticker || "",
      description: description || "",
      image: finalImageUri,
      music_metadata_version: 3,
      release: {
        release_title: title,
        release_type: isAlbum ? "Album" : "Single"
      },
      files: files,
      attributes: [
        { trait_type: 'Artist', value: artist },
        { trait_type: 'Genre', value: genre },
      ],
      royalty_rate: royaltyRate || "0.05",
      royalty_address: royaltyAddress || ""
    }

    logger.debug(`[IPFS] Pinning Metadata...`)
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      pinataContent: metadata,
      pinataMetadata: { name: `${title}_metadata` }
    }, {
      headers: { Authorization: `Bearer ${pinataJwt}`, "Content-Type": "application/json" }
    })

    return c.json({ success: true, metadataUri: `https://ipfs.io/ipfs/${res.data.IpfsHash}` })
  } catch (error: any) {
    logger.error(`[IPFS] Metadata upload failed`, error.response?.data || error.message)
    return c.json({ error: 'Metadata upload failed' }, 500)
  }
})

// Remaining endpoints (tracks, health, root)
// Helper: resolve stake addresses to payment addresses for contract interactions.
// The JWT auth flow stores the stake address as uploader_address, but Plutus
// contracts need the payment address to derive policy IDs and script addresses.
function resolveTrackAddress(track: any): any {
  if (
    track.uploader_payment_address &&
    typeof track.uploader_address === 'string' &&
    track.uploader_address.startsWith('stake')
  ) {
    return { ...track, uploader_address: track.uploader_payment_address }
  }
  return track
}

app.get('/songs', async (c) => {
  try {
    const artist = c.req.query('artist')
    const genre = c.req.query('genre')
    const search = c.req.query('search')
    const albumIdStr = c.req.query('album_id')
    const album_id = albumIdStr && !isNaN(parseInt(albumIdStr)) ? parseInt(albumIdStr) : undefined
    const limitStr = c.req.query('limit')
    const limit = limitStr && !isNaN(parseInt(limitStr)) ? parseInt(limitStr) : undefined
    const offsetStr = c.req.query('offset')
    const offset = offsetStr && !isNaN(parseInt(offsetStr)) ? parseInt(offsetStr) : undefined

    const tracks = await getAllTracks({
      artist,
      genre,
      search,
      album_id,
      limit,
      offset
    })

    // Ownership is best-effort for this public endpoint.
    let userMints: number[] = []
    const authHeader = c.req.header('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1]
        const payload = await verifyJWT(token, JWT_SECRET)
        if (payload && payload.sub) {
          userMints = await getUserMints(payload.sub as string)
        }
      } catch (authErr: any) {
        logger.warn('GET /songs ownership lookup skipped due to auth error', authErr?.message || authErr)
      }
    }

    const tracksWithOwnership = tracks.map(track => {
      const parentId = track.album_id ? Number(track.album_id) : null
      const isOwned = userMints.includes(track.token_id) || (parentId !== null && userMints.includes(parentId))
      return {
        ...resolveTrackAddress(track),
        is_owned: isOwned
      }
    })

    return c.json(tracksWithOwnership)
  } catch (error: any) {
    logger.error('Failed to fetch songs list', {
      message: error?.message || 'unknown error',
      artist: c.req.query('artist') || null,
      genre: c.req.query('genre') || null,
      search: c.req.query('search') || null,
      album_id: c.req.query('album_id') || null,
      limit: c.req.query('limit') || null,
      offset: c.req.query('offset') || null,
    })
    return c.json({ error: 'Failed to fetch songs' }, 500)
  }
})

// Health Check
app.get('/health', async (c) => {
  let pinata = 'unknown'
  try { await axios.get('https://api.pinata.cloud/health', { timeout: 2000 }); pinata = 'ok' } catch { pinata = 'error' }
  return c.json({ status: 'ok', version: SERVER_VERSION, pinata })
})

app.get('/songs/:id/download', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid track ID' }, 400)

  const payload = c.get('jwtPayload')
  const userAddress = payload.sub as string

  const track = await getTrack(id)
  if (!track) return c.json({ error: 'Track not found' }, 404)

  const userMints = await getUserMints(userAddress)
  let isOwned = userMints.includes(id)

  if (!isOwned) {
    logger.info(`[DOWNLOAD] DB check failed for ${userAddress} on track ${id}. Checking on-chain...`)
    isOwned = await verifyOwnershipOnChain(userAddress, id)

    if (isOwned) {
      logger.info(`[DOWNLOAD] On-chain verification success. Syncing to DB.`)
      await addMint({ user_address: userAddress, track_id: id })
    }
  }

  if (!isOwned) {
    logger.warn(`Unauthorized download attempt for track ${id} by ${userAddress}`)
    return c.json({ error: 'Forbidden', message: 'You must collect this song to download it.' }, 403)
  }

  let audioUrl = track.streaming_url || track.audio_url
  if (!audioUrl) return c.json({ error: 'Audio file not found' }, 404)

  let resolvedUrl = audioUrl
  if (audioUrl.startsWith('ipfs://')) {
    resolvedUrl = audioUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
  } else if (audioUrl.includes('/ipfs/')) {
    const cid = audioUrl.split('/ipfs/')[1]
    resolvedUrl = `https://gateway.pinata.cloud/ipfs/${cid}`
  }

  try {
    logger.info(`[DOWNLOAD] Proxying track ${id} from ${resolvedUrl.substring(0, 30)}...`)
    const response = await axios.get(resolvedUrl, { responseType: 'stream' })

    // Set headers for file download
    c.header('Content-Type', response.headers['content-type'] || 'audio/mpeg')
    c.header('Content-Disposition', `attachment; filename="${track.artist} - ${track.name}.mp3"`)

    // Return the stream directly
    return c.body(response.data)
  } catch (error: any) {
    logger.error(`Failed to proxy download for track ${id}`, error)
    return c.json({ error: 'Download failed', message: 'Could not fetch file from source.' }, 500)
  }
})

app.post('/songs/:id/play', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid track ID' }, 400)

  // Track is optional, we check it for validity if it's there
  const track = await getTrack(id)
  if (!track) return c.json({ error: 'Track not found' }, 404)

  // Get listener address from JWT if available
  let listenerAddress: string | undefined
  const authHeader = c.req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const payload = await verifyJWT(token, JWT_SECRET)
    if (payload && payload.sub) {
      listenerAddress = payload.sub as string
    }
  }

  try {
    await addPlay(id, listenerAddress)
    return c.json({ success: true })
  } catch (error: any) {
    logger.error(`Failed to record play for track ${id}`, error)
    return c.json({ error: 'Failed to record play' }, 500)
  }
})

app.get('/analytics/billboard/:address', async (c) => {
  const address = c.req.param('address')
  try {
    const billboard = await getMonthlyBillboard(address)
    return c.json(billboard)
  } catch (error: any) {
    logger.error(`Failed to fetch billboard for ${address}`, error)
    return c.json({ error: 'Failed to fetch billboard' }, 500)
  }
})

app.get('/analytics', authMiddleware, async (c) => {
  const payload = c.get('jwtPayload')
  const artistAddress = payload.sub as string

  try {
    const analytics = await getAnalytics(artistAddress)
    return c.json(analytics)
  } catch (error: any) {
    logger.error(`Failed to fetch analytics for ${artistAddress}`, error)
    return c.json({ error: 'Failed to fetch analytics' }, 500)
  }
})

app.get('/songs/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid track ID' }, 400)
  const track = await getTrack(id)
  if (!track) return c.json({ error: 'Track not found' }, 404)

  // Check ownership if user is authenticated
  let isOwned = false
  const authHeader = c.req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const payload = await verifyJWT(token, JWT_SECRET)
    if (payload && payload.sub) {
      const userAddress = payload.sub as string
      const userMints = await getUserMints(userAddress)
      const idToCheck = track.album_id ? Number(track.album_id) : id
      isOwned = userMints.includes(idToCheck)

      if (!isOwned) {
        isOwned = await verifyOwnershipOnChain(userAddress, idToCheck)
        if (isOwned) {
          await addMint({ user_address: userAddress, track_id: idToCheck })
        }
      }
    }
  }

  // Get on-chain remaining fractions and calculate collected count
  let mintCount = track.mint_count || 0
  if (track.splitter) {
    try {
      const remaining = await getRemainingFractionsOnChain(track.splitter, track.ticker || '', id)
      if (remaining === null) {
        mintCount = 0
      } else {
        const maxSupply = Number(track.max_supply || 0)
        mintCount = Math.max(0, maxSupply - remaining)
      }
    } catch (err) {
      logger.error(`Error fetching remaining fractions for track ${id}`, err)
    }
  }

  return c.json({ ...resolveTrackAddress(track), is_owned: isOwned, mint_count: mintCount })
})


app.post('/songs', authMiddleware, async (c) => {
  const track = await c.req.json();
  const payload = c.get('jwtPayload')
  const requesterAddress = payload.sub

  // Verify that the uploader_address matches the authenticated user
  if (track.uploader_address && track.uploader_address.toLowerCase() !== requesterAddress.toLowerCase()) {
    logger.warn(`Unauthorized track upload attempt for ${track.uploader_address} by ${requesterAddress}`)
    return c.json({ error: 'Forbidden. You can only upload tracks to your own address.' }, 403)
  }

  logger.debug('Track Upload Attempt via JWT', { address: requesterAddress, track: track.name })

  try {
    await addTrack({ ...track, uploader_address: requesterAddress })
    return c.json({ success: true })
  } catch (error: any) {
    logger.error('db addTrack failed', error)
    return c.json({ error: 'Failed to add track' }, 500)
  }
})

app.post('/mints', authMiddleware, async (c) => {
  const { track_id, tx_hash } = await c.req.json()
  const payload = c.get('jwtPayload')
  const userAddress = payload.sub

  if (!track_id) return c.json({ error: 'track_id is required' }, 400)

  try {
    await addMint({ user_address: userAddress, track_id, tx_hash })
    return c.json({ success: true })
  } catch (error: any) {
    logger.error('db addMint failed', error)
    return c.json({ error: 'Failed to record mint' }, 500)
  }
})

app.post('/mints/sync', authMiddleware, async (c) => {
  const { mints } = await c.req.json() // Expects { mints: [{ track_id, tx_hash? }, ...] }
  const payload = c.get('jwtPayload')
  const userAddress = payload.sub

  if (!Array.isArray(mints)) return c.json({ error: 'mints array is required' }, 400)

  try {
    // Current addMint is idempotent, so we can just loop. 
    // In a more complex scenario, we'd use a transaction, but for this simple record logging, this is fine.
    await Promise.all(mints.map(m =>
      addMint({
        user_address: userAddress,
        track_id: m.track_id,
        tx_hash: m.tx_hash ?? null
      })
    ))
    return c.json({ success: true, count: mints.length })
  } catch (error: any) {
    logger.error('db sync mints failed', error)
    return c.json({ error: 'Failed to sync mints' }, 500)
  }
})

app.delete('/songs/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

  const payload = c.get('jwtPayload')
  const requesterAddress = payload.sub

  const track = await getTrack(id)
  if (!track) return c.json({ error: 'Track not found' }, 404)

  if (track.uploader_address && track.uploader_address.toLowerCase() !== requesterAddress.toLowerCase()) {
    logger.warn(`Unauthorized DELETE attempt for track ${id} by ${requesterAddress}`)
    return c.json({ error: 'Forbidden. You do not own this track.' }, 403)
  }

  await deleteTrack(id)
  return c.json({ success: true })
})

app.delete('/songs', authMiddleware, async (c) => {
  const payload = c.get('jwtPayload')
  const requesterAddress = payload.sub

  const isUserAdmin = await isAdmin(requesterAddress)
  if (!isUserAdmin) {
    logger.warn(`Unauthorized mass DELETE attempt by ${requesterAddress}`)
    return c.json({ error: 'Forbidden. Admin privileges required.' }, 403)
  }

  await deleteAllTracks()
  return c.json({ success: true })
})

// Hard-fail on missing critical secrets in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.API_SECRET_KEY) {
    logger.error('CRITICAL: API_SECRET_KEY is NOT set in production environment!')
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'doba-default-secret-change-me') {
    logger.error('FATAL: JWT_SECRET is missing or using default value in production. Exiting.')
    process.exit(1)
  }
}

// Periodic cleanup of expired nonces (every 10 minutes)
setInterval(() => {
  cleanupExpiredNonces().catch(err => logger.warn('Nonce cleanup failed:', err))
}, 10 * 60 * 1000)

const port = parseInt(process.env.PORT || '3001')

// Users Endpoints
app.get('/users/:address', async (c) => {
  const address = c.req.param('address')
  const user = await getUser(address)
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json(user)
})

app.post('/users', authMiddleware, async (c) => {
  const user = await c.req.json()
  const payload = c.get('jwtPayload')
  const requesterAddress = payload.sub

  // Users can only update their own profile
  if (user.address.toLowerCase() !== requesterAddress.toLowerCase()) {
    logger.warn(`Unauthorized profile update attempt for ${user.address} by ${requesterAddress}`)
    return c.json({ error: 'Forbidden. You can only update your own profile.' }, 403)
  }

  await addUser(user)
  return c.json({ success: true })
})

// Collaborators Endpoints
app.get('/songs/:id/collaborators', async (c) => {
  const trackId = parseInt(c.req.param('id'))
  if (isNaN(trackId)) return c.json({ error: 'Invalid ID' }, 400)
  const collaborators = await getTrackCollaborators(trackId)
  return c.json(collaborators)
})

app.post('/collaborators', authMiddleware, async (c) => {
  const collab = await c.req.json()
  const payload = c.get('jwtPayload')
  const requesterAddress = payload.sub

  const track = await getTrack(collab.track_id)
  if (!track) return c.json({ error: 'Track not found' }, 404)

  const isUserAdmin = await isAdmin(requesterAddress)

  if (!isUserAdmin && track.uploader_address?.toLowerCase() !== requesterAddress.toLowerCase()) {
    logger.warn(`Unauthorized collaborator addition attempt for track ${collab.track_id} by ${requesterAddress}`)
    return c.json({ error: 'Forbidden. Only the track owner or admin can add collaborators.' }, 403)
  }

  await addCollaborator(collab)
  return c.json({ success: true })
})

export default { port, fetch: app.fetch }
