import { API_URL } from './UploadView.constants'
import type { UploadDraft, UploadDraftInput, UploadDraftListItem } from './UploadDraft.types'

function apiUrl(path: string): string {
  return `${API_URL.replace(/\/$/, '')}${path}`
}

function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function getDrafts(token: string): Promise<UploadDraftListItem[]> {
  const res = await fetch(apiUrl('/drafts'), { headers: authHeaders(token) })
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`)
    throw new Error(`Failed to fetch drafts: ${text}`)
  }
  return res.json()
}

export async function getDraft(id: number, token: string): Promise<UploadDraft> {
  const res = await fetch(apiUrl(`/drafts/${id}`), { headers: authHeaders(token) })
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`)
    throw new Error(`Failed to fetch draft: ${text}`)
  }
  return res.json()
}

export async function createDraft(draft: UploadDraftInput, token: string): Promise<number> {
  const res = await fetch(apiUrl('/drafts'), {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(draft)
  })
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`)
    throw new Error(`Failed to create draft: ${text}`)
  }
  const data = await res.json()
  return data.id
}

export async function saveDraft(id: number, draft: UploadDraftInput, token: string): Promise<void> {
  const res = await fetch(apiUrl(`/drafts/${id}`), {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(draft)
  })
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`)
    throw new Error(`Failed to save draft: ${text}`)
  }
}

export async function deleteDraft(id: number, token: string): Promise<void> {
  const res = await fetch(apiUrl(`/drafts/${id}`), {
    method: 'DELETE',
    headers: authHeaders(token)
  })
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`)
    throw new Error(`Failed to delete draft: ${text}`)
  }
}
