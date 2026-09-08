'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useAudio } from '@/components/audio'
import { Button } from '@/components/ui/button'
import { IconMusic, IconTrash, IconPlus, IconLoader2, IconKey } from '@tabler/icons-react'
import PagePanel from '@/components/PagePanel'
import { getDrafts, deleteDraft } from '@/components/upload/draftApi'
import type { UploadDraftListItem } from '@/components/upload/UploadDraft.types'
import { logger } from '@/lib/logger'

export default function DraftsPage() {
  const t = useTranslations('upload.drafts')
  const { getValidToken, isAuthenticated, isCheckingAuth } = useAudio()
  const [drafts, setDrafts] = useState<UploadDraftListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (isCheckingAuth) return

    const fetchDrafts = async () => {
      try {
        const token = await getValidToken()
        if (!token) return
        const data = await getDrafts(token)
        setDrafts(data)
      } catch (err) {
        logger.error('Failed to fetch drafts', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchDrafts()
    } else {
      setLoading(false)
    }
  }, [getValidToken, isAuthenticated, isCheckingAuth])

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      const token = await getValidToken()
      if (!token) return
      await deleteDraft(id, token)
      setDrafts((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      logger.error('Failed to delete draft', err)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <PagePanel className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-midnight dark:text-white">{t('title')}</h1>
          <p className="text-sm text-midnight/60 dark:text-white/60">{t('subtitle')}</p>
        </div>
        <Link href="/upload">
          <Button className="bg-cyber-pink hover:bg-cyber-pink/90 text-midnight font-bold px-4 py-2 h-auto rounded-xl transition-all">
            <IconPlus size={16} className="mr-1.5" />
            {t('newUpload')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={32} className="animate-spin text-cyber-pink" />
        </div>
      ) : !isAuthenticated ? (
        <div className="text-center py-16 glass-surface rounded-2xl">
          <IconKey size={40} className="mx-auto mb-4 text-midnight/40 dark:text-white/40" />
          <p className="text-midnight/70 dark:text-white/70 mb-4">Sign in to view and manage your drafts.</p>
          <Link href="/profile">
            <Button className="bg-cyber-pink hover:bg-cyber-pink/90 text-midnight font-bold rounded-xl transition-all">
              Go to Profile
            </Button>
          </Link>
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-16 glass-surface rounded-2xl">
          <IconMusic size={40} className="mx-auto mb-4 text-midnight/40 dark:text-white/40" />
          <p className="text-midnight/70 dark:text-white/70">{t('empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center justify-between p-4 glass-surface rounded-2xl hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-midnight dark:text-white truncate">
                  {draft.name || t('untitled')}
                </div>
                <div className="text-xs text-midnight/50 dark:text-white/50 mt-0.5">
                  {draft.type === 'album' ? t('album') : t('single')} · {formatDate(draft.updated_at)}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/upload?draft=${draft.id}`}>
                  <Button
                    variant="ghost"
                    className="text-cyber-pink hover:bg-cyber-pink/10 font-semibold"
                  >
                    {t('continue')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(draft.id)}
                  disabled={deletingId === draft.id}
                  className="text-midnight/60 dark:text-white/60 hover:text-red-500 hover:bg-red-500/10"
                >
                  {deletingId === draft.id ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconTrash size={16} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PagePanel>
  )
}
