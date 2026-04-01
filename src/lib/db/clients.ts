import { SupabaseClient } from '@supabase/supabase-js'
import type { Client, TypeClient } from '@/types'

export async function listerClients(supabase: SupabaseClient, profileId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Client[]
}

export async function getClient(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Client
}

export async function creerClient(
  supabase: SupabaseClient,
  profileId: string,
  client: {
    name: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    type?: TypeClient
  }
) {
  const { data, error } = await supabase
    .from('clients')
    .insert({ ...client, profile_id: profileId })
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function modifierClient(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Omit<Client, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function supprimerClient(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}
