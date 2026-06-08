'use client'

import { useState } from 'react'
import { Scissors, Zap, Globe, Smartphone, ArrowRight, Check } from 'lucide-react'

type Props = { onSignIn: (email: string) => Promise<{ error: unknown }> }

export function LoginScreen({ onSignIn }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const { error } = await onSignIn(email)
      if (error) {
        const msg = (error as { message?: string })?.message ?? 'Unbekannter Fehler'
        setErrorMsg(msg)
      } else {
        setSent(true)
      }
    } catch (err) {
      setErrorMsg('Verbindungsfehler — bitte versuche es erneut.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
            <Scissors size={15} className="text-white" />
          </div>
          <span className="font-bold text-zinc-900 text-base tracking-tight">ClipNote</span>
        </div>
        <a href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Preise</a>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Zap size={11} className="text-yellow-500" />
          Realtime-Sync in unter 1 Sekunde
        </div>

        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-5">
          Alles clippen.<br />
          <span className="text-zinc-400">Überall verfügbar.</span>
        </h1>

        <p className="text-lg text-zinc-500 leading-relaxed mb-10 max-w-xl mx-auto">
          Markiere Text im Browser, teile Links vom Handy — ClipNote speichert alles sofort und synchronisiert es live auf all deinen Geräten.
        </p>

        {/* Auth form */}
        {sent ? (
          <div className="max-w-sm mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Check size={20} className="text-green-600" />
            </div>
            <p className="font-semibold text-zinc-900 mb-1">Magic Link gesendet</p>
            <p className="text-sm text-zinc-500">Schau in dein Postfach bei <strong>{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800
                disabled:bg-zinc-300 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              {loading ? 'Sende…' : 'Kostenlos starten'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        )}
        {errorMsg && (
          <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 max-w-sm mx-auto">
            ⚠️ {errorMsg}
          </p>
        )}
        <p className="text-xs text-zinc-400 mt-3">Kein Passwort. Kein Abo. Einfach loslegen.</p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: <Globe size={20} />,
            title: 'Browser-Extension',
            desc: 'Rechtsklick auf markierten Text → sofort in ClipNote. Für Chrome, Firefox & Safari.',
          },
          {
            icon: <Smartphone size={20} />,
            title: 'iOS & Android',
            desc: 'Über den nativen Teilen-Button direkt in ClipNote clippen — ohne App wechseln.',
          },
          {
            icon: <Zap size={20} />,
            title: 'Realtime überall',
            desc: 'Clips erscheinen in unter einer Sekunde auf allen deinen Geräten. Gleichzeitig.',
          },
        ].map(f => (
          <div key={f.title} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
            <div className="w-9 h-9 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-700 mb-4 shadow-sm">
              {f.icon}
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1.5 text-sm">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Einfache Preise</h2>
        <p className="text-zinc-500 text-sm mb-10">Starte kostenlos. Upgrade wenn du mehr brauchst.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            {
              name: 'Free',
              price: '0€',
              period: 'für immer',
              features: ['100 Clips', 'Web-App', 'Browser-Extension', '1 Gerät'],
              cta: 'Jetzt starten',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '3€',
              period: 'pro Monat',
              features: ['Unbegrenzte Clips', 'Alle Plattformen', 'Unbegrenzte Geräte', 'Tags & Suche'],
              cta: 'Pro starten',
              highlight: true,
            },
          ].map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 text-left border ${
                plan.highlight
                  ? 'bg-zinc-900 border-zinc-900 text-white'
                  : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={13} className={plan.highlight ? 'text-green-400' : 'text-green-600'} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.querySelector('input[type=email]')?.scrollIntoView({ behavior: 'smooth' })}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} ClipNote · Gebaut mit Next.js & Supabase
      </footer>
    </div>
  )
}
