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
  const { user, loading: authLoading, isAnonymous, signInWithEmail, signInWithPassword, signUp, signInWithGoogle, signInWithApple, linkWithGoogle, linkWithApple, linkWithEmail, signOut } = useAuth()
  const { clips, loading: clipsLoading, addClip, deleteClip, updateClip } = useClips(user?.id ?? null)
  const [showAdd, setShowAdd]         = useState(false)
  const [editClip, setEditClip]       = useState<Clip | null>(null)
  const [search, setSearch]           = useState('')
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [showLinkBanner, setShowLinkBanner] = useState(true)

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!user) return (
    <LoginScreen
      onSignIn={signInWithEmail}
      onGoogleSignIn={signInWithGoogle}
      onAppleSignIn={signInWithApple}
      onPasswordSignIn={signInWithPassword}
      onSignUp={signUp}
    />
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        padding: '28px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 8, marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="DuckPad" width={36} height={36} style={{ borderRadius: 10 }} />
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, color: 'var(--text)' }}>DuckPad</span>
        </div>

        {/* New Clip button */}
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontWeight: 700, fontSize: 15, padding: '13px 16px', borderRadius: 14,
          border: 'none', cursor: 'pointer', background: 'var(--accent)',
          color: 'var(--accent-fg)', marginBottom: 24, fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}>
          <Plus size={18} /> Neuer Clip
        </button>

        {/* Group filters */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', paddingLeft: 10, marginBottom: 6 }}>
          Gruppen
        </p>

        {[null, ...groups].map(g => {
          const active = g === activeGroup || (g === null && !activeGroup)
          const col = g ? (clips.find(c => c.group_name === g)?.color ?? 'var(--accent)') : 'var(--accent)'
          return (
            <button key={g ?? '__all'} onClick={() => setActiveGroup(g)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 15, fontWeight: active ? 700 : 500,
              background: active ? 'var(--bg-card)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              textAlign: 'left', marginBottom: 2,
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: g ? col : 'var(--accent)', flexShrink: 0 }} />
              {g ?? 'Alle'}
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                {g ? clips.filter(c => c.group_name === g).length : clips.length}
              </span>
            </button>
          )
        })}

        {/* Bottom */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <RealtimeBadge />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <ThemeToggle />
            <button onClick={signOut} style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 14,
              color: 'var(--text-muted)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px 10px', borderRadius: 10, fontFamily: 'inherit',
            }}>
              <LogOut size={16} /> Abmelden
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, padding: '32px 40px', overflowY: 'auto' }}>

        {/* Anonymous banner */}
        {isAnonymous && showLinkBanner && (
          <div style={{
            marginBottom: 28, padding: '16px 20px', borderRadius: 16,
            background: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#000', margin: 0 }}>Sichere deine Clips</p>
              <p style={{ fontSize: 13, color: '#00000088', margin: 0 }}>Verbinde deinen Account — deine Daten bleiben erhalten.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={linkWithGoogle} style={{ fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 10, border: '2px solid #000', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span style={{ color: '#4285F4', fontWeight: 900 }}>G</span> Google
              </button>
              <button onClick={linkWithApple} style={{ fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 10, border: '2px solid #000', background: '#000', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                 Apple
              </button>
            </div>
            <button onClick={() => setShowLinkBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00000066', padding: 4, fontSize: 18 }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Clips durchsuchen…"
            style={{
              width: '100%', paddingLeft: 48, paddingRight: search ? 44 : 16,
              paddingTop: 14, paddingBottom: 14,
              borderRadius: 14, fontSize: 16, outline: 'none', fontFamily: 'inherit',
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              color: 'var(--text)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Stats */}
        {clips.length > 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            {filtered.length} Clip{filtered.length !== 1 ? 's' : ''}
            {activeGroup ? ` · ${activeGroup}` : ''}
          </p>
        )}

        {/* Content */}
        {clipsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', textAlign: 'center' }}>
            {search || activeGroup ? (
              <>
                <Search size={40} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.4 }} />
                <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {search ? `Keine Clips für „${search}"` : `Keine Clips in „${activeGroup}"`}
                </p>
                <button onClick={() => { setSearch(''); setActiveGroup(null) }}
                  style={{ fontSize: 14, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Filter zurücksetzen
                </button>
              </>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.png" alt="" width={72} height={72} style={{ borderRadius: 18, marginBottom: 20, opacity: 0.4 }} />
                <p style={{ fontWeight: 900, fontSize: 20, marginBottom: 8, color: 'var(--text)' }}>Noch keine Clips</p>
                <p style={{ fontSize: 15, marginBottom: 24, color: 'var(--text-muted)' }}>Duck deinen ersten Inhalt weg.</p>
                <button onClick={() => setShowAdd(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15,
                  padding: '12px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: 'var(--accent)', color: 'var(--accent-fg)', fontFamily: 'inherit',
                }}>
                  <Plus size={16} /> Ersten Clip erstellen
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4" style={{ gap: '20px', columnGap: '20px' }}>
            {filtered.map(clip => (
              <div key={clip.id} style={{ breakInside: 'avoid', marginBottom: 20 }}>
                <ClipCard clip={clip} onDelete={deleteClip} onEdit={setEditClip} />
              </div>
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddClipModal
          title="🦆 Neuer Clip"
          onSave={async d => { await addClip(d); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}
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
