import { logger } from './lib/logger'
import { createClient } from '@libsql/client'
import { randomBytes } from 'crypto'

const url = process.env.TURSO_URL || 'file:doba.db'
const authToken = process.env.TURSO_AUTH_TOKEN

// Initialize LibSQL client (local or remote)
const db = createClient({
  url: url,
  authToken: authToken,
})

// Initialize tables
async function init() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tracks (
      token_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      artist TEXT NOT NULL,
      genre TEXT,
      duration TEXT,
      release_date TEXT,
      image_url TEXT,
      audio_url TEXT,
      external_url TEXT,
      streaming_url TEXT,
      price TEXT,
      max_supply TEXT,
      splitter TEXT,
      tx_hash TEXT,
      uploader_address TEXT,
      album_id INTEGER,
      track_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  try {
    await db.execute('ALTER TABLE tracks ADD COLUMN album_id INTEGER')
  } catch (e) { /* ignore if column already exists */ }
  try {
    await db.execute('ALTER TABLE tracks ADD COLUMN track_number INTEGER')
  } catch (e) { /* ignore if column already exists */ }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      address TEXT PRIMARY KEY,
      username TEXT,
      bio TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id INTEGER NOT NULL,
      wallet_address TEXT NOT NULL,
      split_percentage REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id),
      UNIQUE(track_id, wallet_address)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS mints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      track_id INTEGER NOT NULL,
      tx_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id),
      UNIQUE(user_address, track_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      user_address TEXT NOT NULL,
      family TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      revoked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_address) REFERENCES users(address)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id INTEGER NOT NULL,
      listener_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS auth_nonces (
      nonce TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_plays_track_id ON plays(track_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_mints_track_id ON mints(track_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_auth_nonces_expires ON auth_nonces(expires_at)`)

  // Simple migrations
  const trackColumns = ['price', 'max_supply', 'splitter', 'tx_hash', 'uploader_address', 'uploader_payment_address', 'chain_id', 'streaming_url', 'ticker']
  for (const col of trackColumns) {
    try {
      await db.execute(`ALTER TABLE tracks ADD COLUMN ${col} TEXT`)
    } catch (e) {
      // Column probably already exists
    }
  }

  const userColumns = ['role']
  for (const col of userColumns) {
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN ${col} TEXT DEFAULT 'user'`)
    } catch (e: any) {
      if (!e.message.includes('already exists') && !e.message.includes('duplicate column name')) {
        logger.error(`Migration failed for column ${col}`, e.message)
      }
    }
  }
  logger.info(`Database initialized (${url.startsWith('file:') ? 'Local' : 'Turso'})`)
}

init().catch(err => logger.error('Database initialization failed', err))

export interface Track {
  token_id: number
  name: string
  ticker?: string
  description?: string
  artist: string
  genre?: string
  duration?: string
  release_date?: string
  image_url?: string
  audio_url?: string
  streaming_url?: string
  external_url?: string
  price?: string
  max_supply?: string
  splitter?: string
  tx_hash?: string
  uploader_address?: string
  uploader_payment_address?: string
  chain_id?: string
  play_count?: number
  album_id?: number
  track_number?: number
}

export interface User {
  address: string
  username?: string
  bio?: string
  avatar_url?: string
  role?: 'admin' | 'user'
}

export interface Collaborator {
  id?: number
  track_id: number
  wallet_address: string
  split_percentage: number
}

export interface RefreshToken {
  token: string
  user_address: string
  family: string
  expires_at: number
  revoked: boolean
}

export async function getTrack(tokenId: number): Promise<Track | null> {
  const rs = await db.execute({
    sql: `
      SELECT *, 
             (SELECT COUNT(*) FROM plays p WHERE p.track_id = token_id) as play_count,
             (SELECT COUNT(*) FROM mints m WHERE m.track_id = token_id) as mint_count
      FROM tracks 
      WHERE token_id = ?
    `,
    args: [tokenId]
  })
  return rs.rows[0] as unknown as Track | null
}

export async function addTrack(track: Track): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO tracks (token_id, name, ticker, description, artist, genre, duration, release_date, image_url, audio_url, streaming_url, external_url, price, max_supply, splitter, tx_hash, uploader_address, uploader_payment_address, chain_id, album_id, track_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(token_id) DO UPDATE SET
        name = excluded.name,
        ticker = excluded.ticker,
        description = excluded.description,
        artist = excluded.artist,
        genre = excluded.genre,
        duration = excluded.duration,
        release_date = excluded.release_date,
        image_url = excluded.image_url,
        audio_url = excluded.audio_url,
        streaming_url = excluded.streaming_url,
        external_url = excluded.external_url,
        price = excluded.price,
        max_supply = excluded.max_supply,
        splitter = excluded.splitter,
        tx_hash = excluded.tx_hash,
        uploader_address = excluded.uploader_address,
        uploader_payment_address = excluded.uploader_payment_address,
        chain_id = excluded.chain_id,
        album_id = excluded.album_id,
        track_number = excluded.track_number
    `,
    args: [
      track.token_id,
      track.name,
      track.ticker ?? null,
      track.description ?? null,
      track.artist,
      track.genre ?? null,
      track.duration ?? null,
      track.release_date ?? null,
      track.image_url ?? null,
      track.audio_url ?? null,
      track.streaming_url ?? null,
      track.external_url ?? null,
      track.price ?? null,
      track.max_supply ?? null,
      track.splitter ?? null,
      track.tx_hash ?? null,
      track.uploader_address ?? null,
      track.uploader_payment_address ?? null,
      track.chain_id ?? null,
      track.album_id ?? null,
      track.track_number ?? null
    ]
  })
}

export interface TrackFilters {
  artist?: string
  genre?: string
  search?: string
  limit?: number
  offset?: number
  album_id?: number
}

export async function getAllTracks(filters: TrackFilters = {}): Promise<Track[]> {
  const { artist, genre, search, limit, offset, album_id } = filters
  const conditions: string[] = []
  const args: any[] = []

  if (artist) {
    conditions.push('(artist = ? OR artist COLLATE NOCASE = ? OR uploader_address = ? OR uploader_address COLLATE NOCASE = ?)')
    args.push(artist, artist, artist, artist)
  }

  if (genre) {
    conditions.push('genre = ?')
    args.push(genre)
  }

  if (search) {
    conditions.push('(name LIKE ? OR artist LIKE ?)')
    const searchPattern = `%${search}%`
    args.push(searchPattern, searchPattern)
  }

  if (album_id !== undefined) {
    conditions.push('album_id = ?')
    args.push(album_id)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  let sql = `
    SELECT *, 
           (SELECT COUNT(*) FROM plays p WHERE p.track_id = token_id) as play_count,
           (SELECT COUNT(*) FROM mints m WHERE m.track_id = token_id) as mint_count
    FROM tracks 
    ${where} 
    ORDER BY token_id DESC
  `

  if (limit !== undefined) {
    sql += ` LIMIT ?`
    args.push(limit)
    if (offset !== undefined) {
      sql += ` OFFSET ?`
      args.push(offset)
    }
  }

  const rs = await db.execute({ sql, args })
  return rs.rows as unknown as Track[]
}

export async function deleteTrack(tokenId: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM tracks WHERE token_id = ?',
    args: [tokenId]
  })
}

export async function addMint(mint: { user_address: string; track_id: number; tx_hash?: string }): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO mints (user_address, track_id, tx_hash)
      VALUES (?, ?, ?)
      ON CONFLICT(user_address, track_id) DO UPDATE SET
        tx_hash = excluded.tx_hash
    `,
    args: [String(mint.user_address).toLowerCase(), mint.track_id, mint.tx_hash ?? null]
  })
}

export async function getUserMints(userAddress: string): Promise<number[]> {
  const rs = await db.execute({
    sql: 'SELECT track_id FROM mints WHERE user_address = ?',
    args: [String(userAddress).toLowerCase()]
  })
  return rs.rows.map(row => Number(row.track_id))
}

export async function deleteAllTracks(): Promise<void> {
  await db.execute('DELETE FROM tracks')
}

// User Methods
export async function getUser(address: string): Promise<User | null> {
  const rs = await db.execute({
    sql: 'SELECT * FROM users WHERE address = ?',
    args: [address]
  })
  return rs.rows[0] as unknown as User | null
}

export async function addUser(user: User): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO users (address, username, bio, avatar_url, role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(address) DO UPDATE SET
        username = excluded.username,
        bio = excluded.bio,
        avatar_url = excluded.avatar_url,
        role = COALESCE(excluded.role, users.role)
    `,
    args: [
      user.address,
      user.username ?? null,
      user.bio ?? null,
      user.avatar_url ?? null,
      user.role ?? 'user'
    ]
  })
}

export async function isAdmin(address: string): Promise<boolean> {
  if (!address) return false
  const user = await getUser(address)
  return user?.role === 'admin'
}

// Collaborator Methods
export async function getTrackCollaborators(trackId: number): Promise<Collaborator[]> {
  const rs = await db.execute({
    sql: 'SELECT * FROM collaborators WHERE track_id = ?',
    args: [trackId]
  })
  return rs.rows as unknown as Collaborator[]
}

export async function addCollaborator(collab: Collaborator): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO collaborators (track_id, wallet_address, split_percentage)
      VALUES (?, ?, ?)
      ON CONFLICT(track_id, wallet_address) DO UPDATE SET
        split_percentage = excluded.split_percentage
    `,
    args: [
      collab.track_id,
      collab.wallet_address,
      collab.split_percentage
    ]
  })
}

export async function deleteTrackCollaborators(trackId: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM collaborators WHERE track_id = ?',
    args: [trackId]
  })
}

// Refresh Token Methods
export async function addRefreshToken(rt: RefreshToken): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO refresh_tokens (token, user_address, family, expires_at) VALUES (?, ?, ?, ?)',
    args: [rt.token, rt.user_address, rt.family, rt.expires_at]
  })
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  const rs = await db.execute({
    sql: 'SELECT * FROM refresh_tokens WHERE token = ?',
    args: [token]
  })
  if (!rs.rows[0]) return null
  const row = rs.rows[0] as any
  return {
    token: row.token,
    user_address: row.user_address,
    family: row.family,
    expires_at: row.expires_at,
    revoked: Boolean(row.revoked)
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE refresh_tokens SET revoked = 1 WHERE token = ?',
    args: [token]
  })
}

export async function revokeRefreshTokenFamily(family: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE refresh_tokens SET revoked = 1 WHERE family = ?',
    args: [family]
  })
}

// Auth Nonce Methods
export async function createAuthNonce(address: string): Promise<string> {
  // Industry standard 256-bit CSPRNG for cryptographic nonces
  const nonce = randomBytes(32).toString('hex')
  const expiresAt = Math.floor(Date.now() / 1000) + 300 // 5 minutes
  await db.execute({
    sql: 'INSERT INTO auth_nonces (nonce, address, expires_at) VALUES (?, ?, ?)',
    args: [nonce, address, expiresAt]
  })
  return nonce
}

export async function consumeAuthNonce(nonce: string, address: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000)
  // Atomic UPDATE to prevent TOCTOU (Time-of-check to time-of-use) race conditions
  const rs = await db.execute({
    sql: 'UPDATE auth_nonces SET used = 1 WHERE nonce = ? AND address = ? AND used = 0 AND expires_at > ?',
    args: [nonce, address, now]
  })
  return rs.rowsAffected > 0
}

export async function cleanupExpiredNonces(): Promise<void> {
  const now = Math.floor(Date.now() / 1000)
  await db.execute({
    sql: 'DELETE FROM auth_nonces WHERE expires_at < ?',
    args: [now]
  })
}

// Analytics Methods
export async function addPlay(trackId: number, listenerAddress?: string): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO plays (track_id, listener_address) VALUES (?, ?)',
    args: [trackId, listenerAddress?.toLowerCase() ?? null]
  })
}

export async function getAnalytics(artistAddress: string): Promise<any> {
  // Get all tracks for this artist
  const tracks = await getAllTracks({ artist: artistAddress })
  const trackIds = tracks.map(t => t.token_id)

  if (trackIds.length === 0) {
    return {
      totalPlays: 0,
      uniqueListeners: 0,
      totalCollectors: 0,
      playsOverTime: [],
      topTracks: []
    }
  }

  const idsPlaceholder = trackIds.map(() => '?').join(',')

  // Total Plays
  const playsRs = await db.execute({
    sql: `SELECT COUNT(*) as count FROM plays WHERE track_id IN (${idsPlaceholder})`,
    args: trackIds
  })
  const totalPlays = Number(playsRs.rows[0].count)

  // Unique Listeners
  const listenersRs = await db.execute({
    sql: `SELECT COUNT(DISTINCT listener_address) as count FROM plays WHERE track_id IN (${idsPlaceholder}) AND listener_address IS NOT NULL`,
    args: trackIds
  })
  const uniqueListeners = Number(listenersRs.rows[0].count)

  // Total Collectors
  const collectorsRs = await db.execute({
    sql: `SELECT COUNT(DISTINCT user_address) as count FROM mints WHERE track_id IN (${idsPlaceholder})`,
    args: trackIds
  })
  const totalCollectors = Number(collectorsRs.rows[0].count)

  // Plays Over Time (Last 30 days)
  const overTimeRs = await db.execute({
    sql: `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM plays 
      WHERE track_id IN (${idsPlaceholder})
      AND timestamp >= DATE('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `,
    args: trackIds
  })
  const playsOverTime = overTimeRs.rows.map(row => ({
    date: row.date,
    count: Number(row.count)
  }))

  // Top Tracks
  const topTracksRs = await db.execute({
    sql: `
      SELECT 
        t.token_id,
        t.name,
        COUNT(p.id) as plays
      FROM tracks t
      JOIN plays p ON t.token_id = p.track_id
      WHERE t.token_id IN (${idsPlaceholder})
      GROUP BY t.token_id
      ORDER BY plays DESC
      LIMIT 5
    `,
    args: trackIds
  })
  const topTracks = topTracksRs.rows.map(row => ({
    tokenId: Number(row.token_id),
    name: row.name,
    plays: Number(row.plays)
  }))

  return {
    totalPlays,
    uniqueListeners,
    totalCollectors,
    playsOverTime,
    topTracks
  }
}

export async function getMonthlyBillboard(artistAddress: string): Promise<Track[]> {
  // Get all tracks for this artist
  const tracks = await getAllTracks({ artist: artistAddress })
  const trackIds = tracks.map(t => t.token_id)

  if (trackIds.length === 0) {
    return []
  }

  const idsPlaceholder = trackIds.map(() => '?').join(',')

  // Get top 7 tracks by plays in the last 30 days
  const billboardRs = await db.execute({
    sql: `
      SELECT 
        t.*,
        COUNT(p.id) as play_count
      FROM tracks t
      LEFT JOIN plays p ON t.token_id = p.track_id AND p.timestamp >= DATE('now', '-30 days')
      WHERE t.token_id IN (${idsPlaceholder})
      GROUP BY t.token_id
      ORDER BY play_count DESC, t.created_at DESC
      LIMIT 7
    `,
    args: trackIds
  })

  return billboardRs.rows as unknown as Track[]
}

export default db
