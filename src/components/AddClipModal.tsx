'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

type Props = {
  onAdd: (clip: Omit<Clip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<unknown>
  onClose: () => void
}

export function AddClipModal({ onAdd, onClose }: Props) {
  const [content, setContent]   = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [tags, setTags]         = useState('')
  const [saving, setSaving]     = useState(false)

  const isUrl = (str: string) => { try { new URL(str); return true } catch { return false } }

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

  const inputStyle = {
    background: 'var(--bg)',
    border: '1.5px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300"
           style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text)' }}>
            🦆 Neuer Clip
          </h2>
          <button onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                   style={{ color: 'var(--text-muted)' }}>Inhalt *</label>
            <textarea
              autoFocus value={content} onChange={e => setContent(e.target.value)}
              placeholder="Text, URL oder Notiz einfügen…"
              rows={5} style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                   style={{ color: 'var(--text-muted)' }}>Quelle (URL)</label>
            <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://…" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                   style={{ color: 'var(--text-muted)' }}>Tags (kommagetrennt)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="arbeit, idee, später lesen" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <button type="submit" disabled={!content.trim() || saving}
            className="w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
            style={{
              background: !content.trim() || saving ? 'var(--bg-subtle)' : 'var(--accent)',
              color:      !content.trim() || saving ? 'var(--text-muted)' : 'var(--accent-fg)',
            }}>
            <Plus size={16} />
            {saving ? 'Wird gespeichert…' : 'Clip speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
