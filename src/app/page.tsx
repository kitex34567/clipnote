'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, LogOut, X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useClips } from '@/lib/hooks/useClips'
import type { Clip } from '@/lib/supabase'
import { ClipCard } from '@/components/ClipCard'
import { AddClipModal } from '@/components/AddClipModal'
import { LoginScreen } from '@/components/LoginScreen'
import { RealtimeBadge } from '@/components/RealtimeBadge'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  const { user, loading: authLoading, signInWithEmail, signInWithPassword, signUp, signInWithGoogle, signOut } = useAuth()
  const { clips, loading: clipsLoading, addClip, deleteClip, updateClip } = useClips(user?.id ?? null)
  const [showAdd, setShowAdd]       = useState(false)
  const [editClip, setEditClip]     = useState<Clip | null>(null)
  const [search, setSearch]         = useState('')
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const groups = useMemo(() => {
    const names = new Set<string>()
    clips.forEach(c => { if (c.group_name) names.add(c.group_name) })
    return Array.from(names)
  }, [clips])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return clips.filter(c => {
      const matchSearch = !q || c.content.toLowerCase().includes(q) ||
        c.source_url?.toLowerCase().includes(q) ||
        c.source_title?.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      const matchGroup = !activeGroup || c.group_name === activeGroup
      return matchSearch && matchGroup
    })
  }, [clips, search, activeGroup])

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  if (!user) return (
    <LoginScreen
      onSignIn={signInWithEmail}
      onGoogleSignIn={signInWithGoogle}
      onPasswordSignIn={signInWithPassword}
      onSignUp={signUp}
    />
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30"
        style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Duckit" width={28} height={28} style={{ borderRadius: 8 }} />
            <span className="font-black tracking-tight text-base" style={{ color: 'var(--text)' }}>Duckit</span>
          </div>
          <div className="flex items-center gap-3">
            <RealtimeBadge />
            <ThemeToggle />
            <button onClick={signOut} className="p-2 rounded-xl" style={{ color: 'var(--text-muted)' }} title="Abmelden">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Search + Add ── */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Clips durchsuchen…"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
            <Plus size={16} />
            <span className="hidden sm:inline">Neuer Clip</span>
          </button>
        </div>

        {/* ── Group chips ── */}
        {groups.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {[null, ...groups].map(g => {
              const active = g === activeGroup || (g === null && !activeGroup)
              const col = g ? (clips.find(c => c.group_name === g)?.color ?? 'var(--accent)') : 'var(--accent)'
              return (
                <button key={g ?? '__all'} onClick={() => setActiveGroup(g)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? col : 'var(--bg-card)',
                    color: active ? '#000' : 'var(--text)',
                    border: `1.5px solid ${active ? col : 'var(--border)'}`,
                  }}>
                  {g && <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#000' : col }} />}
                  {g ?? 'Alle'}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Stats ── */}
        {clips.length > 0 && (
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} Clip{filtered.length !== 1 ? 's' : ''}
            {activeGroup ? ` · ${activeGroup}` : ''}
            {search && filtered.length !== clips.length ? ` · ${filtered.length} Treffer` : ''}
          </p>
        )}

        {/* ── Content ── */}
        {clipsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {search || activeGroup ? (
              <>
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {search ? `Keine Clips für „${search}"` : `Keine Clips in „${activeGroup}"`}
                </p>
                <button onClick={() => { setSearch(''); setActiveGroup(null) }}
                  className="mt-2 text-xs underline" style={{ color: 'var(--text-muted)' }}>
                  Filter zurücksetzen
                </button>
              </>
            ) : (
              <>
                <img src="/icon.png" alt="" width={72} height={72} style={{ borderRadius: 16, marginBottom: 16, opacity: 0.6 }} />
                <p className="font-black mb-1" style={{ color: 'var(--text)' }}>Noch keine Clips</p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Duck deinen ersten Inhalt weg.</p>
                <button onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm"
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
                <ClipCard clip={clip} onDelete={deleteClip} onEdit={setEditClip} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add Modal ── */}
      {showAdd && (
        <AddClipModal
          title="🦆 Neuer Clip"
          onSave={async d => { await addClip(d); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* ── Edit Modal ── */}
      {editClip && (
        <AddClipModal
          title="✏️ Bearbeiten"
          initial={editClip}
          onSave={async d => { await updateClip(editClip.id, d); setEditClip(null) }}
          onClose={() => setEditClip(null)}
        />
      )}
    </div>
  )
}
