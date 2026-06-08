'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

type Props = {
  onAdd: (clip: Omit<Clip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<unknown>
  onClose: () => void
}

export function AddClipModal({ onAdd, onClose }: Props) {
  const [content, setContent] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  const isUrl = (str: string) => {
    try { new URL(str); return true } catch { return false }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await onAdd({
      content: content.trim(),
      source_url: sourceUrl.trim() || null,
      source_title: null,
      type: isUrl(content.trim()) ? 'url' : 'text',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-zinc-900">Neuer Clip</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Inhalt *</label>
            <textarea
              autoFocus
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Text, URL oder Notiz einfügen…"
              rows={5}
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-800
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
                resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Quelle (URL)</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-800
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
                transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tags (kommagetrennt)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="arbeit, idee, später lesen"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-800
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
                transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!content.trim() || saving}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800
              disabled:bg-zinc-300 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            {saving ? 'Wird gespeichert…' : 'Clip speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
