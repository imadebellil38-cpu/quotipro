import { SupabaseClient } from '@supabase/supabase-js'
import type { Relance } from '@/types'

export async function listerRelances(supabase: SupabaseClient, profileId: string) {
  const { data, error } = await supabase
    .from('relances')
    .select('*, devis(reference, total_ttc, clients(name, email)), factures(reference, total_ttc, clients(name, email))')
    .eq('profile_id', profileId)
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data
}

export async function listerRelancesAEnvoyer(supabase: SupabaseClient) {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('relances')
    .select('*, devis(reference, total_ttc, clients(name, email)), factures(reference, total_ttc, clients(name, email)), profiles(company_name, phone, email)')
    .is('sent_at', null)
    .lte('scheduled_at', now)
    .limit(50)

  if (error) throw error
  return data
}

export async function creerRelance(
  supabase: SupabaseClient,
  profileId: string,
  relance: {
    devis_id?: string
    facture_id?: string
    scheduled_at: string
    type: 'devis' | 'impaye'
  }
) {
  const { data, error } = await supabase
    .from('relances')
    .insert({ ...relance, profile_id: profileId })
    .select()
    .single()

  if (error) throw error
  return data as Relance
}

export async function marquerRelanceEnvoyee(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('relances')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}
