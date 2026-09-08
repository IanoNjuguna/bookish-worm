import { logger } from '@/lib/logger'
import { DIRECT_BACKEND_URL, API_URL } from './UploadView.constants'

export const formatAddress = (addr: string | undefined) => {
  if (!addr || addr.length <= 16) return addr || ''
  return `${addr.substring(0, 10)}...${addr.substring(addr.length - 6)}`
}

export const apiUrl = (path: string) => `${API_URL.replace(/\/$/, '')}${path}`

export const formatElapsed = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const buildAuthHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {}
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  if (apiKey && apiKey.trim() !== '') {
    headers['X-API-Key'] = apiKey.trim()
  }
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token.trim()}`
  }
  return headers
}

export async function uploadToPinataDirect(
  file: File,
  name: string,
  pinataJwt: string
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('pinataMetadata', JSON.stringify({ name }))

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${pinataJwt}` },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Pinata direct upload failed: ${await res.text()}`)
  }

  const data = await res.json()
  return data.IpfsHash as string
}

export async function uploadAssetsWithFallback(
  formData: FormData,
  headers: Record<string, string>
): Promise<Response> {
  try {
    const directRes = await fetch(`${DIRECT_BACKEND_URL}/upload-assets`, {
      method: 'POST',
      headers,
      body: formData,
    })
    if (directRes.ok) return directRes
    logger.warn('Direct asset upload returned non-200 status, attempting proxy fallback...')
  } catch (err) {
    logger.warn('Direct asset upload network error, attempting proxy fallback...', err)
  }

  return fetch(`${API_URL}/upload-assets`, {
    method: 'POST',
    headers,
    body: formData,
  })
}
