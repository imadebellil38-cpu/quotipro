import { SupabaseClient } from '@supabase/supabase-js'
import type { Chantier, StatutChantier } from '@/types'

export type ChantierAvecClient = Chantier & { clients: { name: string } | null }

export async function listerChantiers(supabase: SupabaseClient, profileId: string, statut?: StatutChantier) {
  let query = supabase
    .from('chantiers')
    .select('*, clients(name)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (statut) query = query.eq('status', statut)

  const { data, error } = await query
  if (error) throw error
  return data as ChantierAvecClient[]
}

export async function getChantier(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('chantiers')
    .select('*, clients(name, phone, email)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ChantierAvecClient
}

export async function creerChantier(
  supabase: SupabaseClient,
  profileId: string,
  chantier: {
    name: string
    client_id?: string
    address?: string
    start_date?: string
    end_date?: string
    estimated_hours?: number
    estimated_amount?: number
    notes?: string
  }
) {
  const { data, error } = await supabase
    .from('chantiers')
    .insert({ ...chantier, profile_id: profileId })
    .select()
    .single()

  if (error) throw error
  return data as Chantier
}

export async function modifierChantier(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Omit<Chantier, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('chantiers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Chantier
}

export async function supprimerChantier(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('chantiers').delete().eq('id', id)
  if (error) throw error
}
