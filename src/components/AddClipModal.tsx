'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import type { Clip } from '@/lib/supabase'

const GROUP_COLORS = [
  '#FCB903', '#EF5A04', '#EF4444', '#EC4899',
  '#A855F7', '#6366F1', '#0167DB', '#10B981',
]

type ClipData = Omit<Clip, 'id' | 'user_id' | 'created_at' | 'updated_at'>

type Props = {
  initial?: Clip | null
  title?: string
  onSave: (clip: ClipData) => Promise<unknown>
  onClose: () => void
}

export function AddClipModal({ initial, title = '🦆 Neuer Clip', onSave, onClose }: Props) {
  const [content, setContent]     = useState(initial?.content ?? '')
  const [sourceUrl, setSourceUrl] = useState(initial?.source_url ?? '')
  const [group, setGroup]         = useState(initial?.group_name ?? '')
  const [color, setColor]         = useState<string | null>(initial?.color ?? null)
  const [due, setDue]             = useState(
    initial?.due_date ? new Date(initial.due_date).toISOString().slice(0,16) : ''
  )
  const [tags, setTags]           = useState(initial?.tags?.join(', ') ?? '')
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    setContent(initial?.content ?? '')
    setSourceUrl(initial?.source_url ?? '')
    setGroup(initial?.group_name ?? '')
    setColor(initial?.color ?? null)
    setDue(initial?.due_date ? new Date(initial.due_date).toISOString().slice(0,16) : '')
    setTags(initial?.tags?.join(', ') ?? '')
  }, [initial?.id])

  const isUrl = (s: string) => { try { new URL(s); return true } catch { return false } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await onSave({
      content: content.trim(),
      source_url: sourceUrl.trim() || null,
      source_title: null,
      type: isUrl(content.trim()) ? 'url' : 'text',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      color,
      group_name: group.trim() || null,
      due_date: due ? new Date(due).toISOString() : null,
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
         style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300"
           style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Content */}
          <textarea autoFocus={!initial} value={content} onChange={e => setContent(e.target.value)}
            placeholder="Text, URL oder Notiz einfügen…" rows={4}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />

          {/* Source URL */}
          <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
            placeholder="Quelle (URL, optional)" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Group */}
            <input type="text" value={group} onChange={e => setGroup(e.target.value)}
              placeholder="📁 Gruppe (optional)" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            {/* Due date */}
            <input type="datetime-local" value={due} onChange={e => setDue(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Tags */}
          <input type="text" value={tags} onChange={e => setTags(e.target.value)}
            placeholder="Tags (kommagetrennt, optional)" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />

          {/* Color picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => setColor(null)}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition-all"
              style={{ borderColor: !color ? 'var(--accent)' : 'var(--border)', background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              —
            </button>
            {GROUP_COLORS.map(col => (
              <button key={col} type="button" onClick={() => setColor(col)}
                className="w-7 h-7 rounded-full transition-all"
                style={{ background: col, outline: color === col ? `3px solid ${col}` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>

          <button type="submit" disabled={!content.trim() || saving}
            className="w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-sm"
            style={{
              background: !content.trim() || saving ? 'var(--bg-subtle)' : 'var(--accent)',
              color:      !content.trim() || saving ? 'var(--text-muted)' : 'var(--accent-fg)',
            }}>
            <Plus size={16} />
            {saving ? 'Wird gespeichert…' : initial ? 'Änderungen speichern' : 'Clip speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
