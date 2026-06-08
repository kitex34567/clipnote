'use client'

export function SetupScreen() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg text-white text-xl">
            ✂️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ClipNote</h1>
            <p className="text-xs text-zinc-500">Setup erforderlich</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900 mb-4">Supabase verbinden</h2>

          <ol className="space-y-4 text-sm text-zinc-700">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
              <div>
                Erstelle ein kostenloses Projekt auf{' '}
                <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">supabase.com</code>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
              <div>
                Führe das SQL-Schema aus:{' '}
                <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
              <div>
                Trage deine Keys in{' '}
                <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>{' '}
                ein:
                <pre className="mt-2 bg-zinc-900 text-green-400 text-xs rounded-xl p-3 overflow-x-auto leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
                </pre>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">4</span>
              <div>Starte den Dev-Server neu: <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">npm run dev</code></div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
