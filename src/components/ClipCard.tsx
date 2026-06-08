'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import { ExternalLink, Trash2, Link, FileText, Copy, Check } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

type Props = { clip: Clip; onDelete: (id: string) => void }

export function ClipCard({ clip, onDelete }: Props) {
  const [copied, setCopied]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(clip.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(clip.id)
  }

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-200 ${
        deleting ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
    >
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
           className="mt-2 flex items-center gap-1 text-xs truncate transition-colors"
           style={{ color: 'var(--accent-hover)' }}>
          <ExternalLink size={11} />
          <span className="truncate">{clip.source_url}</span>
        </a>
      )}

      {/* Tags */}
      {clip.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {clip.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--accent-hover)', border: '1px solid var(--border)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={copy}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title="Kopieren">
          {copied
            ? <Check size={13} style={{ color: 'var(--accent)' }} />
            : <Copy size={13} />
          }
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title="Löschen">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
