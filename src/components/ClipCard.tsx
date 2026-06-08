'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import { ExternalLink, Trash2, Link, FileText, Copy, Check } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

type Props = { clip: Clip; onDelete: (id: string) => void }

export function ClipCard({ clip, onDelete }: Props) {
  const [copied, setCopied] = useState(false)
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

  const isUrl = clip.type === 'url' || clip.source_url

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm
        hover:shadow-md hover:border-zinc-300 transition-all duration-200
        ${deleting ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* Type icon */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 text-zinc-400">
            {isUrl ? <Link size={14} /> : <FileText size={14} />}
          </span>
          {clip.source_title && (
            <span className="text-xs text-zinc-500 truncate font-medium">
              {clip.source_title}
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-zinc-400">
          {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true, locale: de })}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-zinc-800 leading-relaxed line-clamp-4 whitespace-pre-wrap break-words">
        {clip.content}
      </p>

      {/* Source URL */}
      {clip.source_url && (
        <a
          href={clip.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 truncate transition-colors"
        >
          <ExternalLink size={11} />
          <span className="truncate">{clip.source_url}</span>
        </a>
      )}

      {/* Tags */}
      {clip.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {clip.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions — visible on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={copy}
          className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-400 transition-all shadow-sm"
          title="Kopieren"
        >
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-300 transition-all shadow-sm"
          title="Löschen"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
