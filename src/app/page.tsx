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
  const [showAdd, setShowAdd]       = useState(false)
  const [editClip, setEditClip]     = useState<Clip | null>(null)
  const [search, setSearch]         = useState('')
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sidebar + Main layout ── */}
      <div style={{ display: 'flex', flex: 1, width: '100%', padding: '0 32px', gap: 40, paddingTop: 32, paddingBottom: 32 }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8,
          position: 'sticky', top: 24, alignSelf: 'flex-start', height: 'calc(100vh - 48px)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="DuckPad" width={32} height={32} style={{ borderRadius: 9 }} />
            <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5, color: 'var(--text)' }}>DuckPad</span>
          </div>

          {/* New Clip button */}
          <button onClick={() => setShowAdd(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14,
              padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: 'var(--accent-fg)', marginBottom: 8,
              fontFamily: 'inherit',
            }}>
            <Plus size={16} /> Neuer Clip
          </button>

          {/* Group filters */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px', marginBottom: 4 }}>
            Gruppen
          </p>
          {[null, ...groups].map(g => {
            const active = g === activeGroup || (g === null && !activeGroup)
            const col = g ? (clips.find(c => c.group_name === g)?.color ?? 'var(--accent)') : 'var(--accent)'
            return (
              <button key={g ?? '__all'} onClick={() => setActiveGroup(g)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 700 : 500,
                  background: active ? 'var(--bg-card)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  textAlign: 'left',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: g ? col : 'var(--accent)', flexShrink: 0 }} />
                {g ?? 'Alle'}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  {g ? clips.filter(c => c.group_name === g).length : clips.length}
                </span>
              </button>
            )
          })}

          {/* Bottom actions */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
              <RealtimeBadge />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <ThemeToggle />
              <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: 8, fontFamily: 'inherit' }}>
                <LogOut size={15} /> Abmelden
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Anonymous account banner */}
          {isAnonymous && showLinkBanner && (
            <div style={{
              marginBottom: 20, padding: '14px 16px', borderRadius: 14,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 18 }}>🦆</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: '#000', margin: 0 }}>Sichere deine Clips</p>
                <p style={{ fontSize: 12, color: '#00000088', margin: 0 }}>Verbinde deinen Account — deine Daten bleiben erhalten.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={linkWithGoogle}
                  style={{ fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 9, border: '2px solid #000', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <span style={{ color: '#4285F4', fontWeight: 900 }}>G</span> Google
                </button>
                <button onClick={linkWithApple}
                  style={{ fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 9, border: '2px solid #000', background: '#000', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                   Apple
                </button>
                <button onClick={() => {
                  const email = window.prompt('E-Mail-Adresse:')
                  const pw = email ? window.prompt('Passwort (min. 6 Zeichen):') : null
                  if (email && pw) linkWithEmail(email, pw)
                }}
                  style={{ fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 9, border: '2px solid #000', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✉️ E-Mail
                </button>
              </div>
              <button onClick={() => setShowLinkBanner(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00000066', padding: 4, fontFamily: 'inherit', fontSize: 16 }}>
                ✕
              </button>
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Clips durchsuchen…"
              style={{
                width: '100%', paddingLeft: 40, paddingRight: search ? 36 : 14, paddingTop: 10, paddingBottom: 10,
                borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'inherit',
                background: 'var(--bg-card)', border: '1.5px solid var(--border)', color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats */}
          {clips.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              {filtered.length} Clip{filtered.length !== 1 ? 's' : ''}
              {activeGroup ? ` · ${activeGroup}` : ''}
              {search && filtered.length !== clips.length ? ` · ${filtered.length} Treffer` : ''}
            </p>
          )}

          {/* Content */}
          {clipsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                   style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
              {search || activeGroup ? (
                <>
                  <span style={{ fontSize: 36, marginBottom: 12 }}>🔍</span>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    {search ? `Keine Clips für „${search}"` : `Keine Clips in „${activeGroup}"`}
                  </p>
                  <button onClick={() => { setSearch(''); setActiveGroup(null) }}
                    style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                    Filter zurücksetzen
                  </button>
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="" width={64} height={64} style={{ borderRadius: 16, marginBottom: 16, opacity: 0.5 }} />
                  <p style={{ fontWeight: 900, marginBottom: 6, color: 'var(--text)' }}>Noch keine Clips</p>
                  <p style={{ fontSize: 14, marginBottom: 20, color: 'var(--text-muted)' }}>Duck deinen ersten Inhalt weg.</p>
                  <button onClick={() => setShowAdd(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--accent)', color: 'var(--accent-fg)', fontFamily: 'inherit' }}>
                    <Plus size={14} /> Ersten Clip erstellen
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
              {filtered.map(clip => (
                <div key={clip.id} className="break-inside-avoid">
                  <ClipCard clip={clip} onDelete={deleteClip} onEdit={setEditClip} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

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
