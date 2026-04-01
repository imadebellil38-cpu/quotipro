import { SupabaseClient } from '@supabase/supabase-js'
import type { Facture, StatutFacture, TypeFacture } from '@/types'

export type FactureAvecClient = Facture & { clients: { name: string; email: string | null } | null }

export async function listerFactures(supabase: SupabaseClient, profileId: string, statut?: StatutFacture) {
  let query = supabase
    .from('factures')
    .select('*, clients(name, email)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (statut) query = query.eq('status', statut)

  const { data, error } = await query
  if (error) throw error
  return data as FactureAvecClient[]
}

export async function getFacture(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('factures')
    .select('*, clients(name, email, phone, address, city, postal_code)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as FactureAvecClient
}

export async function genererReferenceFacture(supabase: SupabaseClient, profileId: string) {
  const now = new Date()
  const prefix = `FAC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`

  const { count } = await supabase
    .from('factures')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .like('reference', `${prefix}%`)

  return `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`
}

export async function creerFacture(
  supabase: SupabaseClient,
  profileId: string,
  facture: {
    client_id?: string
    devis_id?: string
    reference: string
    type?: TypeFacture
    due_date?: string
    total_ht: number
    tva_amount: number
    total_ttc: number
  }
) {
  const { data, error } = await supabase
    .from('factures')
    .insert({ ...facture, profile_id: profileId })
    .select()
    .single()

  if (error) throw error
  return data as Facture
}

export async function modifierStatutFacture(supabase: SupabaseClient, id: string, status: StatutFacture) {
  const updates: Record<string, unknown> = { status }
  if (status === 'payee') updates.paid_at = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('factures')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Facture
}

export async function supprimerFacture(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('factures').delete().eq('id', id)
  if (error) throw error
}
