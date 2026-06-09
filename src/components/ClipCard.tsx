'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import { ExternalLink, Trash2, Link, FileText, Copy, Check, Pencil } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

type Props = {
  clip: Clip
  onDelete: (id: string) => void
  onEdit: (clip: Clip) => void
}

export function ClipCard({ clip, onDelete, onEdit }: Props) {
  const [copied, setCopied]     = useState(false)
  const [deleting, setDeleting] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(clip.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const accent = clip.color ?? 'var(--accent)'

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 overflow-hidden flex ${
        deleting ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
    >
      {/* Left color bar */}
      <div className="w-1 shrink-0" style={{ background: accent }} />

      <div className="flex-1 p-4">
        {/* Group badge */}
        {clip.group_name && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold mb-2"
               style={{ background: accent + '22', color: accent }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {clip.group_name}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: 'var(--text-muted)' }}>
              {clip.source_url ? <Link size={13} /> : <FileText size={13} />}
            </span>
            {clip.source_title && (
              <span className="text-xs truncate font-medium" style={{ color: 'var(--text-muted)' }}>
                {clip.source_title}
              </span>
            )}
          </div>
          <span className="shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
            {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true, locale: de })}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap break-words"
           style={{ color: 'var(--text)' }}>
          {clip.content}
        </p>

        {/* Source URL */}
        {clip.source_url && (
          <a href={clip.source_url} target="_blank" rel="noopener noreferrer"
             className="mt-2 flex items-center gap-1 text-xs truncate"
             style={{ color: 'var(--accent-hover)' }}>
            <ExternalLink size={11} />
            <span className="truncate">{clip.source_url}</span>
          </a>
        )}

        {/* Due date */}
        {clip.due_date && (
          <p className="mt-1.5 text-xs font-semibold" style={{ color: accent }}>
            📅 {new Date(clip.due_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        {/* Tags */}
        {clip.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {clip.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium"
                    style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={copy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
            {copied ? <Check size={12} style={{ color: 'var(--accent)' }} /> : <Copy size={12} />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </button>
          <button onClick={() => onEdit(clip)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
            <Pencil size={12} /> Bearbeiten
          </button>
          <button onClick={() => { setDeleting(true); onDelete(clip.id) }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ml-auto"
            style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Trash2 size={12} /> Löschen
          </button>
        </div>
      </div>
    </div>
  )
}
