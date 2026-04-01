import { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export async function getProfile(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function modifierProfile(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}
