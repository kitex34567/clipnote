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

  const colors = {
    connecting: 'bg-yellow-400',
    connected: 'bg-green-400',
    disconnected: 'bg-red-400',
  }

  const labels = {
    connecting: 'Verbinde…',
    connected: 'Live',
    disconnected: 'Offline',
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className={`w-2 h-2 rounded-full ${colors[status]} ${status === 'connected' ? 'animate-pulse' : ''}`} />
      {labels[status]}
    </div>
  )
}
