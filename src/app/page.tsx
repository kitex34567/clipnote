'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Scissors, LogOut, X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useClips } from '@/lib/hooks/useClips'
import { ClipCard } from '@/components/ClipCard'
import { AddClipModal } from '@/components/AddClipModal'
import { LoginScreen } from '@/components/LoginScreen'
import { RealtimeBadge } from '@/components/RealtimeBadge'

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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onSignIn={signInWithEmail} />
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <Scissors size={15} className="text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-base tracking-tight">ClipNote</span>
          </div>

          <div className="flex items-center gap-3">
            <RealtimeBadge />
            <button
              onClick={signOut}
              className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
              title="Abmelden"
            >
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
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Clips durchsuchen…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm
                focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white
              font-medium px-4 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Neuer Clip</span>
          </button>
        </div>

        {/* Stats bar */}
        {clips.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-zinc-400">
            <span>{clips.length} Clip{clips.length !== 1 ? 's' : ''}</span>
            {search && filtered.length !== clips.length && (
              <span>· {filtered.length} Treffer</span>
            )}
          </div>
        )}

        {/* Clips grid */}
        {clipsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {search ? (
              <>
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-zinc-500 text-sm">Keine Clips für „{search}"</p>
                <button onClick={() => setSearch('')} className="mt-2 text-xs text-zinc-400 hover:text-zinc-700 underline">
                  Suche zurücksetzen
                </button>
              </>
            ) : (
              <>
                <span className="text-4xl mb-3">✂️</span>
                <p className="font-medium text-zinc-700 mb-1">Noch keine Clips</p>
                <p className="text-sm text-zinc-400 mb-4">Füge deinen ersten Clip hinzu.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
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

      {showModal && (
        <AddClipModal
          onAdd={addClip}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
