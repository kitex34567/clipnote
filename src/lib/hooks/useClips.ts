'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type Clip } from '@/lib/supabase'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useClips(userId: string | null) {
  const [clips, setClips] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClips = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('clips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setClips(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchClips()
  }, [fetchClips])

  // Realtime subscription — updates arrive in <1s across all devices
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`clips:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'clips', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Clip>) => {
          setClips(prev => [payload.new as Clip, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'clips', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Clip>) => {
          setClips(prev => prev.map(c => c.id === (payload.new as Clip).id ? payload.new as Clip : c))
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'clips', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Clip>) => {
          setClips(prev => prev.filter(c => c.id !== (payload.old as Clip).id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const addClip = useCallback(async (clip: Omit<Clip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('clips')
      .insert({ ...clip, user_id: userId })
      .select()
      .single()
    if (error) console.error(error)
    return data
  }, [userId])

  const deleteClip = useCallback(async (id: string) => {
    setClips(prev => prev.filter(c => c.id !== id))
    await supabase.from('clips').delete().eq('id', id)
  }, [])

  const updateClip = useCallback(async (id: string, updates: Partial<Clip>) => {
    const now = new Date().toISOString()
    setClips(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: now } : c))
    await supabase.from('clips').update({ ...updates, updated_at: now }).eq('id', id)
  }, [])

  return { clips, loading, addClip, deleteClip, updateClip, refetch: fetchClips }
}
