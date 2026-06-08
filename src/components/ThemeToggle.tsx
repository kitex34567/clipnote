'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
      style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
