import { SupabaseClient } from '@supabase/supabase-js'
import type { Employe, RoleEmploye, TypeContrat } from '@/types'

export async function listerEmployes(supabase: SupabaseClient, profileId: string) {
  const { data, error } = await supabase
    .from('employes')
    .select('*')
    .eq('profile_id', profileId)
    .order('last_name')

  if (error) throw error
  return data as Employe[]
}

export async function getEmploye(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('employes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Employe
}

export async function creerEmploye(
  supabase: SupabaseClient,
  profileId: string,
  employe: {
    first_name: string
    last_name: string
    email?: string
    role?: RoleEmploye
    hourly_rate?: number
    contract_type?: TypeContrat
    start_date?: string
    coefficient?: string
    convention_collective?: string
  }
) {
  const { data, error } = await supabase
    .from('employes')
    .insert({ ...employe, profile_id: profileId })
    .select()
    .single()

  if (error) throw error
  return data as Employe
}

export async function modifierEmploye(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Omit<Employe, 'id' | 'profile_id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('employes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Employe
}

export async function supprimerEmploye(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('employes').delete().eq('id', id)
  if (error) throw error
}
