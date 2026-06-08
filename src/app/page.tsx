'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, LogOut, X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useClips } from '@/lib/hooks/useClips'
import { ClipCard } from '@/components/ClipCard'
import { AddClipModal } from '@/components/AddClipModal'
import { LoginScreen } from '@/components/LoginScreen'
import { RealtimeBadge } from '@/components/RealtimeBadge'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  const { user, loading: authLoading, signInWithEmail, signOut } = useAuth()
  const { clips, loading: clipsLoading, addClip, deleteClip } = useClips(user?.id ?? null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return clips
    return clips.filter(c =>
      c.content.toLowerCase().includes(q) ||
      c.source_url?.toLowerCase().includes(q) ||
      c.source_title?.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [clips, search])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
             style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!user) return <LoginScreen onSignIn={signInWithEmail} />

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <header className="sticky top-0 z-30"
              style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦆</span>
            <span className="font-black tracking-tight" style={{ color: 'var(--text)' }}>Duckit</span>
          </div>
          <div className="flex items-center gap-3">
            <RealtimeBadge />
            <ThemeToggle />
            <button onClick={signOut}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)' }}
              title="Abmelden">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search + Add */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Clips durchsuchen…"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
            <Plus size={16} />
            <span className="hidden sm:inline">Neuer Clip</span>
          </button>
        </div>

        {/* Stats */}
        {clips.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>🦆 {clips.length} Clip{clips.length !== 1 ? 's' : ''}</span>
            {search && filtered.length !== clips.length && <span>· {filtered.length} Treffer</span>}
          </div>
        )}

        {/* Content */}
        {clipsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {search ? (
              <>
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Keine Clips für „{search}"</p>
                <button onClick={() => setSearch('')}
                  className="mt-2 text-xs underline" style={{ color: 'var(--text-muted)' }}>
                  Suche zurücksetzen
                </button>
              </>
            ) : (
              <>
                <span className="text-5xl mb-4">🦆</span>
                <p className="font-black mb-1" style={{ color: 'var(--text)' }}>Noch keine Clips</p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Duck deinen ersten Inhalt weg.</p>
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                  <Plus size={14} /> Ersten Clip erstellen
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 gap-3 space-y-3">
            {filtered.map(clip => (
              <div key={clip.id} className="break-inside-avoid">
                <ClipCard clip={clip} onDelete={deleteClip} />
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && <AddClipModal onAdd={addClip} onClose={() => setShowModal(false)} />}
    </div>
  )
}
