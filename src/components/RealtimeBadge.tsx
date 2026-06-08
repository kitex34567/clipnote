'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function RealtimeBadge() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  useEffect(() => {
    const channel = supabase.channel('heartbeat')
      .subscribe(s => {
        if (s === 'SUBSCRIBED') setStatus('connected')
        else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') setStatus('disconnected')
      })
    return () => { supabase.removeChannel(channel) }
  }, [])

  const colors = { connecting: '#eab308', connected: '#22c55e', disconnected: '#ef4444' }
  const labels = { connecting: 'Verbinde…', connected: 'Live', disconnected: 'Offline' }

  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
      <span className="w-2 h-2 rounded-full"
            style={{
              background: colors[status],
              boxShadow: status === 'connected' ? `0 0 6px ${colors.connected}` : 'none',
            }} />
      {labels[status]}
    </div>
  )
}
