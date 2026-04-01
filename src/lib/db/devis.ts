import { SupabaseClient } from '@supabase/supabase-js'
import type { Devis, DevisLigne, StatutDevis } from '@/types'

export type DevisAvecClient = Devis & { clients: { name: string; email: string | null } | null }
export type DevisComplet = Devis & {
  clients: { name: string; email: string | null; phone: string | null; address: string | null; city: string | null; postal_code: string | null } | null
  devis_lignes: DevisLigne[]
}

export async function listerDevis(supabase: SupabaseClient, profileId: string, statut?: StatutDevis) {
  let query = supabase
    .from('devis')
    .select('*, clients(name, email)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (statut) query = query.eq('status', statut)

  const { data, error } = await query
  if (error) throw error
  return data as DevisAvecClient[]
}

export async function getDevis(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('devis')
    .select('*, clients(name, email, phone, address, city, postal_code), devis_lignes(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as DevisComplet
}

export async function genererReference(supabase: SupabaseClient, profileId: string) {
  const now = new Date()
  const prefix = `DEV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`

  const { count } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .like('reference', `${prefix}%`)

  return `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`
}

export async function creerDevis(
  supabase: SupabaseClient,
  profileId: string,
  devis: {
    client_id?: string
    chantier_id?: string
    reference: string
    objet?: string
    lieu_chantier?: string
    valid_until?: string
    notes?: string
  },
  lignes: Array<{
    description: string
    quantity: number
    unit: string
    unit_price: number
    tva_rate: number
    order_index: number
  }>
) {
  const total_ht = lignes.reduce((sum, l) => sum + l.quantity * l.unit_price, 0)
  const tva_amount = lignes.reduce((sum, l) => sum + l.quantity * l.unit_price * l.tva_rate / 100, 0)
  const total_ttc = total_ht + tva_amount

  const { data: newDevis, error } = await supabase
    .from('devis')
    .insert({
      ...devis,
      profile_id: profileId,
      total_ht,
      tva_amount,
      total_ttc,
    })
    .select()
    .single()

  if (error) throw error

  if (lignes.length > 0) {
    const lignesAvecDevis = lignes.map(l => ({
      ...l,
      devis_id: newDevis.id,
      total: l.quantity * l.unit_price,
    }))

    const { error: lignesError } = await supabase
      .from('devis_lignes')
      .insert(lignesAvecDevis)

    if (lignesError) throw lignesError
  }

  return newDevis as Devis
}

export async function modifierStatutDevis(supabase: SupabaseClient, id: string, status: StatutDevis) {
  const updates: Record<string, unknown> = { status }
  if (status === 'envoye') updates.sent_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('devis')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Devis
}

export async function supprimerDevis(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('devis').delete().eq('id', id)
  if (error) throw error
}
