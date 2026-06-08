'use client'

import { useState } from 'react'
import { Zap, Globe, Smartphone, ArrowRight, Check } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

type Props = { onSignIn: (email: string) => Promise<{ error: unknown }> }

export function LoginScreen({ onSignIn }: Props) {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const { error } = await onSignIn(email)
      if (error) {
        setErrorMsg((error as { message?: string })?.message ?? 'Unbekannter Fehler')
      } else {
        setSent(true)
      }
    } catch {
      setErrorMsg('Verbindungsfehler — bitte versuche es erneut.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)' }}
           className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦆</span>
            <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>
              Duckit
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
              Preise
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
             style={{ background: 'var(--bg-subtle)', color: 'var(--accent-hover)', border: '1px solid var(--border)' }}>
          <Zap size={11} />
          Realtime-Sync in unter 1 Sekunde
        </div>

        <h1 className="text-5xl font-black tracking-tight leading-tight mb-5"
            style={{ color: 'var(--text)' }}>
          Duck it away.<br />
          <span style={{ color: 'var(--accent)' }}>Überall abrufen.</span>
        </h1>

        <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
           style={{ color: 'var(--text-muted)' }}>
          Markiere Text im Browser, teile Links vom Handy — Duckit speichert alles sofort
          und synchronisiert es live auf all deinen Geräten.
        </p>

        {/* Auth form */}
        {sent ? (
          <div className="max-w-sm mx-auto rounded-2xl p-6 text-center"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl"
                 style={{ background: 'var(--bg-subtle)' }}>✉️</div>
            <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>Magic Link gesendet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Schau in dein Postfach bei <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
              style={{
                background: loading || !email ? 'var(--bg-subtle)' : 'var(--accent)',
                color: loading || !email ? 'var(--text-muted)' : 'var(--accent-fg)',
              }}
            >
              {loading ? 'Sende…' : 'Kostenlos starten'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        {errorMsg && (
          <p className="text-xs mt-3 rounded-xl px-3 py-2 max-w-sm mx-auto"
             style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            ⚠️ {errorMsg}
          </p>
        )}
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Kein Passwort. Kein Abo. Einfach loslegen.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: <Globe size={20} />, title: 'Browser-Extension', desc: 'Rechtsklick auf markierten Text → sofort in Duckit. Chrome, Firefox & Safari.' },
          { icon: <Smartphone size={20} />, title: 'iOS & Android', desc: 'Über den nativen Teilen-Button direkt clippen — ohne die App zu wechseln.' },
          { icon: <Zap size={20} />, title: 'Realtime überall', desc: 'Clips erscheinen in unter einer Sekunde auf allen Geräten. Gleichzeitig.' },
        ].map(f => (
          <div key={f.title} className="rounded-2xl p-5 transition-all"
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
      <section id="pricing" className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Einfache Preise</h2>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Starte kostenlos. Upgrade wenn du mehr brauchst.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            { name: 'Free', price: '0€', period: 'für immer', features: ['100 Clips', 'Web-App', 'Browser-Extension', '1 Gerät'], cta: 'Jetzt starten', highlight: false },
            { name: 'Pro', price: '3€', period: 'pro Monat', features: ['Unbegrenzte Clips', 'Alle Plattformen', 'Unbegrenzte Geräte', 'Tags & Suche'], cta: 'Pro starten', highlight: true },
          ].map(plan => (
            <div key={plan.name} className="rounded-2xl p-6 text-left"
                 style={plan.highlight
                   ? { background: 'var(--accent)', border: '1px solid var(--accent)' }
                   : { background: 'var(--bg-card)', border: '1px solid var(--border-card)' }
                 }>
              <p className="text-xs font-bold uppercase tracking-wider mb-1"
                 style={{ color: plan.highlight ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)' }}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black" style={{ color: plan.highlight ? '#000' : 'var(--text)' }}>
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: plan.highlight ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)' }}>
                  /{plan.period}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"
                      style={{ color: plan.highlight ? '#000' : 'var(--text)' }}>
                    <Check size={13} style={{ color: plan.highlight ? '#000' : 'var(--accent)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.querySelector('input[type=email]')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={plan.highlight
                  ? { background: '#000', color: '#fff' }
                  : { background: 'var(--accent)', color: 'var(--accent-fg)' }
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        🦆 © {new Date().getFullYear()} Duckit
      </footer>
    </div>
  )
}
