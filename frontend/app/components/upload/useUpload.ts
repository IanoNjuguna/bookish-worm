'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/audio'
import { logger } from '@/lib/logger'
import { mintTrackOnChain, formatTxError } from '@/lib/contractHelper'
import {
  DEFAULT_PRICE,
  DEFAULT_SUPPLY,
  DEFAULT_ROYALTY,
  DEFAULT_DURATION,
} from './UploadView.constants'
import {
  formatAddress,
  apiUrl,
  formatElapsed,
  buildAuthHeaders,
  uploadToPinataDirect,
  uploadAssetsWithFallback,
} from './UploadView.lib'
import type { AlbumTrack, Collaborator, UploadStep, UseUploadReturn } from './UploadView.types'

export type { UseUploadReturn } from './UploadView.types'

export function useUpload(
  albumTracks: AlbumTrack[],
  setAlbumTracks: React.Dispatch<React.SetStateAction<AlbumTrack[]>>
): UseUploadReturn {
  const t = useTranslations('upload')
  const { address: cardanoAddress, lucid } = useCardano()
  const { accessToken, getValidToken, login, effectiveAddress } = useAudio()

  const [genreOpen, setGenreOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [ticker, setTicker] = useState('')
  const [userEditedTicker, setUserEditedTicker] = useState(false)
  const [artistName, setArtistName] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [price, setPrice] = useState(DEFAULT_PRICE)
  const [supply, setSupply] = useState(DEFAULT_SUPPLY)
  const [royaltyPercentage, setRoyaltyPercentage] = useState(DEFAULT_ROYALTY)
  const [royaltyAddress, setRoyaltyAddress] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [assetsCid, setAssetsCid] = useState<string | null>(null)
  const [audioHash, setAudioHash] = useState('')
  const [imageHash, setImageHash] = useState('')
  const [audioFilename, setAudioFilename] = useState('')
  const [imageFilename, setImageFilename] = useState('')
  const [streamingUrl, setStreamingUrl] = useState('')
  const [isAssetsUploading, setIsAssetsUploading] = useState(false)
  const [publishedSongId, setPublishedSongId] = useState<number | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [adaBalance, setAdaBalance] = useState<bigint | null>(null)
  const [hasCollected, setHasCollected] = useState(false)
  const [audioDuration, setAudioDuration] = useState(DEFAULT_DURATION)
  const [attested, setAttested] = useState(false)
  const [isAlbum, setIsAlbum] = useState(false)

  const [uploadStep, setUploadStep] = useState<UploadStep>(0)
  const [uploadStatusText, setUploadStatusText] = useState('')
  const [targetSeg1, setTargetSeg1] = useState(0)
  const [targetSeg2, setTargetSeg2] = useState(0)
  const [targetSeg3, setTargetSeg3] = useState(0)
  const [targetSeg4, setTargetSeg4] = useState(0)
  const [displaySeg1, setDisplaySeg1] = useState(0)
  const [displaySeg2, setDisplaySeg2] = useState(0)
  const [displaySeg3, setDisplaySeg3] = useState(0)
  const [displaySeg4, setDisplaySeg4] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!isUploading) {
      setElapsedSeconds(0)
      return
    }
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [isUploading])

  useEffect(() => {
    if (!isUploading) {
      setDisplaySeg1(0)
      setDisplaySeg2(0)
      setDisplaySeg3(0)
      setDisplaySeg4(0)
      setTargetSeg1(0)
      setTargetSeg2(0)
      setTargetSeg3(0)
      setTargetSeg4(0)
      return
    }
    const timer = setInterval(() => {
      setDisplaySeg1((prev) => (prev < targetSeg1 ? Math.min(prev + 1, targetSeg1) : prev))
      setDisplaySeg2((prev) => (prev < targetSeg2 ? Math.min(prev + 1, targetSeg2) : prev))
      setDisplaySeg3((prev) => (prev < targetSeg3 ? Math.min(prev + 1, targetSeg3) : prev))
      setDisplaySeg4((prev) => (prev < targetSeg4 ? Math.min(prev + 1, targetSeg4) : prev))
    }, 35)
    return () => clearInterval(timer)
  }, [isUploading, targetSeg1, targetSeg2, targetSeg3, targetSeg4])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault()
        e.returnValue = 'Publishing release in progress. Please do not close or refresh this page.'
        return e.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isUploading])

  useEffect(() => {
    const fetchBalance = async () => {
      if (!cardanoAddress || !lucid) return
      try {
        const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
        let lovelace = 0n

        if (wallet && typeof wallet.getUtxos === 'function') {
          const utxos = (await wallet.getUtxos()) || []
          lovelace = utxos.reduce(
            (total: bigint, utxo: { assets?: { lovelace?: bigint } }) =>
              total + (utxo.assets?.lovelace ?? 0n),
            0n
          )
        } else if (wallet && typeof wallet.getLovelace === 'function') {
          lovelace = BigInt(await wallet.getLovelace())
        } else if (typeof lucid.utxosAt === 'function') {
          const utxos = (await lucid.utxosAt(cardanoAddress)) || []
          lovelace = utxos.reduce(
            (total: bigint, utxo: { assets?: { lovelace?: bigint } }) =>
              total + (utxo.assets?.lovelace ?? 0n),
            0n
          )
        }
        setAdaBalance(lovelace)
      } catch (e) {
        logger.error('UploadView: Failed to fetch ADA balance', e)
      }
    }

    if (cardanoAddress && lucid) {
      fetchBalance()
      const interval = setInterval(fetchBalance, 15000)
      return () => clearInterval(interval)
    }
  }, [cardanoAddress, lucid])

  useEffect(() => {
    if (!userEditedTicker && title) {
      const autoTicker = title.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
      setTicker(autoTicker)
    }
  }, [title, userEditedTicker])

  useEffect(() => {
    const triggerBackgroundUpload = async () => {
      if (isAlbum) return
      if (!audioFile || !coverFile || assetsCid || isAssetsUploading || !accessToken) return

      setIsAssetsUploading(true)
      try {
        const formData = new FormData()
        formData.append('audio', audioFile)
        formData.append('image', coverFile)
        formData.append('title', title || 'Untitled')

        const token = await getValidToken()
        if (!token) return

        const response = await uploadAssetsWithFallback(formData, buildAuthHeaders(token))
        if (response.ok) {
          const data = await response.json()
          setAudioHash(data.audioHash)
          setImageHash(data.imageHash)
          setAudioFilename(data.audioName || '')
          setImageFilename(data.imageName || '')
          setStreamingUrl(data.streamingUrl || '')
          setAssetsCid('READY')
        }
      } catch (e) {
        logger.error('Background upload failed', e)
      } finally {
        setIsAssetsUploading(false)
      }
    }

    triggerBackgroundUpload()
  }, [audioFile, coverFile, title, accessToken, assetsCid, isAssetsUploading, isAlbum, getValidToken])

  const handleAudioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    setAudioFile(file)

    const objectUrl = URL.createObjectURL(file)
    const audio = new Audio(objectUrl)
    audio.addEventListener('loadedmetadata', () => {
      const durationSec = Math.floor(audio.duration)
      const minutes = Math.floor(durationSec / 60)
      const seconds = durationSec % 60
      setAudioDuration(`PT${minutes}M${seconds}S`)
      URL.revokeObjectURL(objectUrl)
    })
  }, [])

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverFile(e.target.files[0])
    }
  }, [])

  const addCollaborator = useCallback(() => {
    setCollaborators((prev) => [...prev, { address: '', split: '' }])
  }, [])

  const updateCollaborator = useCallback(
    (index: number, field: keyof Collaborator, value: string | number) => {
      setCollaborators((prev) => {
        const next = [...prev]
        if (field === 'split') {
          if (value !== '') {
            const sanitized = String(value).replace(/^0+(?=\d)/, '').slice(0, 3)
            const num = Number(sanitized)
            next[index].split = num > 100 ? '100' : sanitized
          } else {
            next[index].split = value
          }
        } else {
          next[index].address = String(value)
        }
        return next
      })
    },
    []
  )

  const removeCollaborator = useCallback((index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent, currentAlbumTracks: AlbumTrack[]) => {
      e.preventDefault()

      let token = await getValidToken()
      if (!token) {
        toast.info('Session expired or missing. Please sign the secure authentication message in your wallet.')
        token = await login()
        if (!token) return
      }

      if (isAlbum) {
        if (
          currentAlbumTracks.length === 0 ||
          currentAlbumTracks.some((t) => !t.file || !t.title)
        ) {
          toast.error('Please ensure all album tracks have a title and an audio file selected.')
          return
        }
      } else if (!audioFile) {
        toast.error('Please select an audio file for your track.')
        return
      }

      if (!coverFile || !cardanoAddress) {
        toast.error('Please ensure you have selected a cover image, and your wallet is connected.')
        return
      }

      const otherSharesSum = collaborators.reduce((sum, c) => sum + (Number(c.split) || 0), 0)
      if (otherSharesSum >= 100) {
        toast.error('Total collaborator split cannot exceed or equal 100% (need to reserve split for yourself).')
        return
      }

      setIsUploading(true)
      setUploadStep(1)
      setTargetSeg1(20)
      setTargetSeg2(0)
      setTargetSeg3(0)
      setTargetSeg4(0)
      setUploadStatusText('Initiating IPFS asset pinning...')
      const mainToast = toast.loading('Initiating upload process...')

      try {
        let currentAudioHash = audioHash || ''
        let currentImageHash = imageHash || ''
        let currentAudioName = audioFilename || (audioHash ? `audio_${audioHash}.mp3` : '')
        let currentImageName = imageFilename || (imageHash ? `cover_${imageHash}.jpg` : '')
        let currentStreamingUrl = streamingUrl || ''

        const getHeaders = () => buildAuthHeaders(token)

        let pinataJwt: string | null = null
        try {
          const jwtRes = await fetch(apiUrl('/pinata-jwt'), { headers: getHeaders() })
          if (jwtRes.ok) {
            const jwtData = await jwtRes.json()
            if (jwtData.pinataJwt) pinataJwt = jwtData.pinataJwt
          }
        } catch (e) {
          logger.warn('Could not fetch direct Pinata JWT, using backend proxy', e)
        }

        let tracksForCatalog = currentAlbumTracks

        if (isAlbum) {
          setTargetSeg1(35)
          setUploadStatusText('Uploading album cover image to IPFS...')
          toast.loading('Uploading album cover image...', { id: mainToast })

          if (pinataJwt && coverFile) {
            currentImageName = `cover_${Date.now()}.jpg`
            currentImageHash = await uploadToPinataDirect(coverFile, `${title}_cover`, pinataJwt)
          } else {
            const imageFormData = new FormData()
            imageFormData.append('image', coverFile)
            imageFormData.append('title', title)
            const imgRes = await uploadAssetsWithFallback(imageFormData, getHeaders())
            if (!imgRes.ok) throw new Error(`Cover image upload failed: ${await imgRes.text()}`)
            const imgData = await imgRes.json()
            currentImageHash = imgData.imageHash
            currentImageName = imgData.imageName
          }

          tracksForCatalog = [...currentAlbumTracks]

          for (let i = 0; i < tracksForCatalog.length; i++) {
            const track = tracksForCatalog[i]
            const trackProg = 35 + Math.round(((i + 1) / tracksForCatalog.length) * 65)
            setTargetSeg1(trackProg)
            setUploadStatusText(`Uploading album track ${i + 1}/${tracksForCatalog.length}: "${track.title}" to IPFS...`)
            toast.loading(`Uploading album track ${i + 1}/${tracksForCatalog.length}: ${track.title}...`, { id: mainToast })

            if (pinataJwt && track.file) {
              const audioName = `audio_${Date.now()}_${i}.mp3`
              const audioHash = await uploadToPinataDirect(track.file, `${track.title}_audio`, pinataJwt)
              tracksForCatalog[i] = {
                ...track,
                audioName,
                audioHash,
                streamingUrl: `https://gateway.pinata.cloud/ipfs/${audioHash}`,
              }
            } else {
              const trackFormData = new FormData()
              trackFormData.append('audio', track.file!)
              trackFormData.append('title', track.title)
              const trackRes = await uploadAssetsWithFallback(trackFormData, getHeaders())
              if (!trackRes.ok) throw new Error(`Track "${track.title}" audio upload failed: ${await trackRes.text()}`)
              const trackData = await trackRes.json()
              tracksForCatalog[i] = {
                ...track,
                audioHash: trackData.audioHash,
                audioName: trackData.audioName,
                streamingUrl: trackData.streamingUrl,
              }
            }
          }

          setAlbumTracks(tracksForCatalog)
          currentAudioHash = tracksForCatalog[0].audioHash
          currentAudioName = tracksForCatalog[0].audioName
          currentStreamingUrl = tracksForCatalog[0].streamingUrl
        } else if (!currentAudioHash || !currentImageHash || !assetsCid) {
          setTargetSeg1(65)
          setUploadStatusText('Uploading cover artwork and audio track to IPFS...')
          toast.loading('Uploading media to IPFS...', { id: mainToast })

          if (pinataJwt && audioFile && coverFile) {
            currentImageName = `cover_${Date.now()}.jpg`
            currentImageHash = await uploadToPinataDirect(coverFile, `${title}_cover`, pinataJwt)
            currentAudioName = `audio_${Date.now()}.mp3`
            currentAudioHash = await uploadToPinataDirect(audioFile, `${title}_audio`, pinataJwt)
            currentStreamingUrl = `https://gateway.pinata.cloud/ipfs/${currentAudioHash}`
          } else {
            const formData = new FormData()
            formData.append('audio', audioFile!)
            formData.append('image', coverFile)
            formData.append('title', title)
            const assetRes = await uploadAssetsWithFallback(formData, getHeaders())
            if (!assetRes.ok) throw new Error(`Media upload failed: ${await assetRes.text()}`)
            const assetData = await assetRes.json()
            currentAudioHash = assetData.audioHash
            currentImageHash = assetData.imageHash
            currentAudioName = assetData.audioName
            currentImageName = assetData.imageName
            currentStreamingUrl = assetData.streamingUrl
          }
        }

        if (!currentAudioHash || !currentImageHash) {
          throw new Error('Media files were not successfully pinned to IPFS. Please re-select your audio and cover files, then try again.')
        }

        setTargetSeg1(100)

        setUploadStep(2)
        setTargetSeg2(45)
        setUploadStatusText('Generating CIP-60 release metadata JSON & pinning to IPFS...')
        toast.loading('Generating release metadata...', { id: mainToast })
        const metaResponse = await fetch(apiUrl('/upload-metadata'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getHeaders() },
          body: JSON.stringify({
            title,
            ticker: ticker || undefined,
            description,
            artist: artistName || 'Unknown Artist',
            genre,
            audioHash: currentAudioHash,
            imageHash: currentImageHash,
            audioName: currentAudioName,
            imageName: currentImageName,
            duration: audioDuration,
            isAlbum,
            tracks: isAlbum
              ? tracksForCatalog.map((t, idx) => ({
                  title: t.title,
                  audioHash: t.audioHash,
                  audioName: t.audioName,
                  duration: t.duration,
                  track_number: idx + 1,
                }))
              : undefined,
            royaltyRate: (Number(royaltyPercentage) / 100).toString(),
            royaltyAddress: royaltyAddress || cardanoAddress || '',
          }),
        })
        if (!metaResponse.ok) throw new Error(`Metadata generation failed: ${await metaResponse.text()}`)
        const { metadataUri } = await metaResponse.json()
        setTargetSeg2(100)

        const tokenId = Math.floor(Date.now())

        setUploadStep(3)
        setTargetSeg3(35)
        setUploadStatusText('Awaiting wallet signature & submitting on-chain Cardano transaction...')
        toast.loading('Signing and submitting mint transaction on-chain...', { id: mainToast })
        setIsMinting(true)
        const { txHash, policyId } = await mintTrackOnChain(lucid, {
          token_id: tokenId,
          ticker: ticker || undefined,
          name: title,
          artist: artistName || 'Unknown Artist',
          description,
          imageUrl: `ipfs://${currentImageHash}`,
          audioUrl: `ipfs://${currentAudioHash}`,
          price: price || '5',
          supply: supply || '5000',
          duration: audioDuration,
          isAlbum,
          tracks: isAlbum
            ? tracksForCatalog.map((t) => ({
                name: t.title,
                audioUrl: `ipfs://${t.audioHash}`,
                duration: t.duration,
              }))
            : undefined,
          royaltyRate: (Number(royaltyPercentage) / 100).toString(),
          royaltyAddress: royaltyAddress || cardanoAddress || '',
        })
        setTargetSeg3(100)

        setUploadStep(4)
        setTargetSeg4(45)
        setUploadStatusText('Registering release catalog & recording creator copy...')
        toast.loading('Registering release catalog...', { id: mainToast })

        if (isAlbum) {
          const albumResponse = await fetch(apiUrl('/songs'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify({
              token_id: tokenId,
              name: title,
              ticker: ticker || undefined,
              description,
              artist: artistName || 'Unknown Artist',
              genre,
              image_url: `ipfs://${currentImageHash}`,
              audio_url: `ipfs://${currentAudioHash}`,
              streaming_url: currentStreamingUrl,
              external_url: metadataUri,
              price: price || '5',
              max_supply: supply || '5000',
              uploader_address: effectiveAddress || cardanoAddress,
              uploader_payment_address: cardanoAddress,
              chain_id: 'cardano',
              splitter: policyId,
              tx_hash: txHash,
              duration: audioDuration,
              release_date: new Date().toISOString().split('T')[0],
              album_id: null,
              track_number: null,
            }),
          })
          if (!albumResponse.ok) throw new Error(`Backend album indexing failed: ${await albumResponse.text()}`)

          for (let idx = 0; idx < tracksForCatalog.length; idx++) {
            const t = tracksForCatalog[idx]
            const trackResponse = await fetch(apiUrl('/songs'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...getHeaders() },
              body: JSON.stringify({
                token_id: tokenId + idx + 1,
                name: t.title,
                ticker: ticker || undefined,
                description: `Track ${idx + 1} from the album "${title}"`,
                artist: artistName || 'Unknown Artist',
                genre,
                image_url: `ipfs://${currentImageHash}`,
                audio_url: `ipfs://${t.audioHash}`,
                streaming_url: t.streamingUrl,
                external_url: metadataUri,
                price: price || '5',
                max_supply: supply || '5000',
                uploader_address: effectiveAddress || cardanoAddress,
                uploader_payment_address: cardanoAddress,
                chain_id: 'cardano',
                splitter: policyId,
                tx_hash: txHash,
                duration: t.duration,
                release_date: new Date().toISOString().split('T')[0],
                album_id: tokenId,
                track_number: idx + 1,
              }),
            })
            if (!trackResponse.ok) throw new Error(`Backend track "${t.title}" indexing failed: ${await trackResponse.text()}`)
          }
        } else {
          const songResponse = await fetch(apiUrl('/songs'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify({
              token_id: tokenId,
              name: title,
              ticker: ticker || undefined,
              description,
              artist: artistName || 'Unknown Artist',
              genre,
              image_url: `ipfs://${currentImageHash}`,
              audio_url: `ipfs://${currentAudioHash}`,
              streaming_url: currentStreamingUrl,
              external_url: metadataUri,
              price: price || '5',
              max_supply: supply || '5000',
              uploader_address: effectiveAddress || cardanoAddress,
              uploader_payment_address: cardanoAddress,
              chain_id: 'cardano',
              splitter: policyId,
              tx_hash: txHash,
              duration: audioDuration,
              release_date: new Date().toISOString().split('T')[0],
            }),
          })
          if (!songResponse.ok) throw new Error(`Backend indexing failed: ${await songResponse.text()}`)
        }

        if (collaborators.length > 0) {
          for (const collab of collaborators) {
            if (!collab.address) continue
            await fetch(apiUrl('/collaborators'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...getHeaders() },
              body: JSON.stringify({
                track_id: tokenId,
                wallet_address: collab.address,
                split_percentage: Number(collab.split) || 0,
              }),
            })
          }
        }

        try {
          await fetch(apiUrl('/mints'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify({ track_id: tokenId, tx_hash: txHash }),
          })
          setHasCollected(true)
        } catch (e) {
          logger.error('Failed to auto-record creator first copy', e)
        }

        setPublishedSongId(tokenId)
        setTargetSeg4(100)
        setUploadStep(5)
        setUploadStatusText('Release published successfully!')
        toast.success(isAlbum ? 'Album published successfully!' : 'Track published successfully!', { id: mainToast })
      } catch (error: any) {
        logger.error('Submit Error', error)
        toast.error(formatTxError(error), { id: mainToast })
      } finally {
        setIsUploading(false)
        setIsMinting(false)
      }
    },
    [
      accessToken,
      adaBalance,
      artistName,
      audioDuration,
      audioFile,
      audioFilename,
      audioHash,
      cardanoAddress,
      collaborators,
      coverFile,
      description,
      effectiveAddress,
      genre,
      imageFilename,
      imageHash,
      isAlbum,
      login,
      getValidToken,
      price,
      royaltyAddress,
      royaltyPercentage,
      setAlbumTracks,
      streamingUrl,
      supply,
      t,
      ticker,
      title,
      assetsCid,
    ]
  )

  return {
    isAlbum,
    setIsAlbum,
    title,
    setTitle,
    ticker,
    setTicker,
    userEditedTicker,
    setUserEditedTicker,
    artistName,
    setArtistName,
    description,
    setDescription,
    genre,
    setGenre,
    genreOpen,
    setGenreOpen,
    price,
    setPrice,
    supply,
    setSupply,
    royaltyPercentage,
    setRoyaltyPercentage,
    royaltyAddress,
    setRoyaltyAddress,
    audioFile,
    setAudioFile,
    coverFile,
    setCoverFile,
    audioDuration,
    setAudioDuration,
    audioHash,
    imageHash,
    audioFilename,
    imageFilename,
    streamingUrl,
    assetsCid,
    isAssetsUploading,
    collaborators,
    setCollaborators,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
    isUploading,
    isMinting,
    uploadStep,
    uploadStatusText,
    elapsedSeconds,
    displaySeg1,
    displaySeg2,
    displaySeg3,
    displaySeg4,
    publishedSongId,
    hasCollected,
    adaBalance,
    cardanoAddress,
    attested,
    setAttested,
    handleAudioChange,
    handleCoverChange,
    handleSubmit,
  }
}
