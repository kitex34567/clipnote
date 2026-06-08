import { createClient } from '@supabase/supabase-js'

export type Clip = {
  id: string
  user_id: string
  content: string
  source_url: string | null
  source_title: string | null
  type: 'text' | 'url' | 'image'
  tags: string[]
  created_at: string
  updated_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const isConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10 &&
  !supabaseUrl.includes('placeholder')

// Use a placeholder URL when not configured so the module loads without throwing
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
)
