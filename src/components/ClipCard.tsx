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

      <div className="flex-1 p-6">
        {/* Group badge */}
        {clip.group_name && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-bold mb-3"
               style={{ fontSize: 12, background: accent + '22', color: accent }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0 }} />
            {clip.group_name}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: 'var(--text-muted)' }}>
              {clip.source_url ? <Link size={15} /> : <FileText size={15} />}
            </span>
            {clip.source_title && (
              <span className="truncate font-medium" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {clip.source_title}
              </span>
            )}
          </div>
          <span className="shrink-0" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true, locale: de })}
          </span>
        </div>

        {/* Content */}
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {clip.content}
        </p>

        {/* Source URL */}
        {clip.source_url && (
          <a href={clip.source_url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 truncate"
             style={{ marginTop: 10, fontSize: 12, color: 'var(--accent-hover)' }}>
            <ExternalLink size={13} />
            <span className="truncate">{clip.source_url}</span>
          </a>
        )}

        {/* Due date */}
        {clip.due_date && (
          <p style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: accent }}>
            {new Date(clip.due_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        )}

        {/* Tags */}
        {clip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: 10 }}>
            {clip.tags.map(tag => (
              <span key={tag} style={{ padding: '3px 10px', fontSize: 12, borderRadius: 100, fontWeight: 500, background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2" style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <button onClick={copy} className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
            style={{ padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: 'none', fontFamily: 'inherit' }}>
            {copied ? <Check size={14} style={{ color: 'var(--accent)' }} /> : <Copy size={14} />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </button>
          <button onClick={() => onEdit(clip)} className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
            style={{ padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: 'none', fontFamily: 'inherit' }}>
            <Pencil size={14} /> Bearbeiten
          </button>
          <button onClick={() => { setDeleting(true); onDelete(clip.id) }} className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70 ml-auto"
            style={{ padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', fontFamily: 'inherit' }}>
            <Trash2 size={14} /> Löschen
          </button>
        </div>
      </div>
    </div>
  )
}
