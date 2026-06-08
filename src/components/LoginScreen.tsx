'use client'

import { useState } from 'react'
import { Zap, Globe, Smartphone, ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

type Mode = 'password' | 'magic' | 'signup'

type Props = {
  onSignIn: (email: string) => Promise<{ error: unknown }>
  onGoogleSignIn: () => Promise<unknown>
  onPasswordSignIn: (email: string, password: string) => Promise<{ error: unknown }>
  onSignUp: (email: string, password: string) => Promise<{ error: unknown }>
}

export function LoginScreen({ onSignIn, onGoogleSignIn, onPasswordSignIn, onSignUp }: Props) {
  const [mode, setMode]           = useState<Mode>('password')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const reset = (m: Mode) => { setMode(m); setErrorMsg(''); setSuccessMsg('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErrorMsg(''); setSuccessMsg('')

    try {
      if (mode === 'magic') {
        const { error } = await onSignIn(email)
        if (error) setErrorMsg((error as { message?: string })?.message ?? 'Fehler')
        else setSuccessMsg('✉️ Magic Link gesendet — check deine Mails!')
      } else if (mode === 'password') {
        const { error } = await onPasswordSignIn(email, password)
        if (error) setErrorMsg((error as { message?: string })?.message ?? 'E-Mail oder Passwort falsch')
      } else {
        if (password.length < 6) { setErrorMsg('Passwort muss mind. 6 Zeichen haben'); setLoading(false); return }
        const { error } = await onSignUp(email, password)
        if (error) setErrorMsg((error as { message?: string })?.message ?? 'Fehler')
        else setSuccessMsg('✅ Account erstellt! Check deine Mails zur Bestätigung.')
      }
    } catch { setErrorMsg('Verbindungsfehler') }

    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    color: 'var(--text)', borderRadius: '12px', padding: '11px 14px',
    fontSize: '14px', width: '100%', outline: 'none', transition: 'border-color 0.15s',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦆</span>
            <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>Duckit</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm" style={{ color: 'var(--text-muted)' }}>Preise</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
             style={{ background: 'var(--bg-subtle)', color: 'var(--accent-hover)', border: '1px solid var(--border)' }}>
          <Zap size={11} /> Realtime-Sync in unter 1 Sekunde
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-tight mb-5" style={{ color: 'var(--text)' }}>
          Duck it away.<br />
          <span style={{ color: 'var(--accent)' }}>Überall abrufen.</span>
        </h1>
        <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Markiere Text im Browser, teile Links vom Handy — Duckit speichert alles sofort
          und synchronisiert es live auf all deinen Geräten.
        </p>

        {/* Auth Card */}
        <div className="max-w-sm mx-auto rounded-2xl p-6"
             style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Mode Tabs */}
          <div className="flex rounded-xl p-1 mb-5 gap-1" style={{ background: 'var(--bg-subtle)' }}>
            {([['password', 'Anmelden'], ['signup', 'Registrieren']] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => reset(m)}
                className="flex-1 text-sm font-semibold py-2 rounded-lg transition-all"
                style={{
                  background: mode === m ? 'var(--bg-card)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Google */}
          <button onClick={onGoogleSignIn} disabled={loading}
            className="w-full flex items-center justify-center gap-3 font-bold py-3 px-5 rounded-xl transition-all text-sm mb-4"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.6 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Mit Google {mode === 'signup' ? 'registrieren' : 'anmelden'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>oder</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="E-Mail" required style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Passwort"
                required={mode !== 'magic'}
                style={{ ...inputStyle, paddingRight: '42px' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs rounded-xl px-3 py-2"
                 style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                ⚠️ {errorMsg}
              </p>
            )}
            {successMsg && (
              <p className="text-xs rounded-xl px-3 py-2"
                 style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                {successMsg}
              </p>
            )}

            <button type="submit" disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors text-sm"
              style={{
                background: loading || !email ? 'var(--bg-subtle)' : 'var(--accent)',
                color: loading || !email ? 'var(--text-muted)' : 'var(--accent-fg)',
              }}>
              {loading ? 'Bitte warten…' : mode === 'signup' ? 'Account erstellen' : 'Anmelden'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Magic Link toggle */}
          <button onClick={() => reset(mode === 'magic' ? 'password' : 'magic')}
            className="w-full text-xs mt-3 py-1"
            style={{ color: 'var(--text-muted)' }}>
            {mode === 'magic' ? '← Zurück zum Passwort-Login' : 'Lieber per Magic Link anmelden'}
          </button>
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Kein Kreditkarte. Kein Abo. Einfach loslegen.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: <Globe size={20} />, title: 'Browser-Extension', desc: 'Rechtsklick auf markierten Text → sofort in Duckit. Chrome, Firefox & Safari.' },
          { icon: <Smartphone size={20} />, title: 'iOS & Android', desc: 'Über den nativen Teilen-Button direkt clippen — ohne die App zu wechseln.' },
          { icon: <Zap size={20} />, title: 'Realtime überall', desc: 'Clips erscheinen in unter einer Sekunde auf allen Geräten. Gleichzeitig.' },
        ].map(f => (
          <div key={f.title} className="rounded-2xl p-5"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: 'var(--bg-subtle)', color: 'var(--accent-hover)', border: '1px solid var(--border)' }}>
              {f.icon}
            </div>
            <h3 className="font-bold text-sm mb-1.5" style={{ color: 'var(--text)' }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Einfache Preise</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Starte kostenlos. Upgrade wenn du mehr brauchst.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            { name: 'Free', price: '0€', period: 'für immer', features: ['100 Clips', 'Web-App', 'Browser-Extension', '1 Gerät'], cta: 'Jetzt starten', highlight: false },
            { name: 'Pro', price: '3€', period: 'pro Monat', features: ['Unbegrenzte Clips', 'Alle Plattformen', 'Unbegrenzte Geräte', 'Tags & Suche'], cta: 'Pro starten', highlight: true },
          ].map(plan => (
            <div key={plan.name} className="rounded-2xl p-6 text-left"
                 style={plan.highlight ? { background: 'var(--accent)', border: '1px solid var(--accent)' } : { background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1"
                 style={{ color: plan.highlight ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)' }}>{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black" style={{ color: plan.highlight ? '#000' : 'var(--text)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: plan.highlight ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)' }}>/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: plan.highlight ? '#000' : 'var(--text)' }}>
                    <Check size={13} style={{ color: plan.highlight ? '#000' : 'var(--accent)' }} />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.querySelector('input[type=email]')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={plan.highlight ? { background: '#000', color: '#fff' } : { background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        🦆 © {new Date().getFullYear()} Duckit
      </footer>
    </div>
  )
}
