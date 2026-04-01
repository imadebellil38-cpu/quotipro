// ============================================
// QuotiPro — Types principaux
// ============================================

export type Plan = 'free' | 'pro' | 'business' | 'premium'
export type TypeClient = 'particulier' | 'professionnel'
export type StatutDevis = 'brouillon' | 'envoye' | 'vu' | 'accepte' | 'refuse'
export type StatutFacture = 'emise' | 'envoyee' | 'payee' | 'impayee'
export type TypeFacture = 'acompte' | 'situation' | 'solde' | 'finale'
export type StatutChantier = 'en_cours' | 'termine' | 'en_pause'
export type RoleEmploye = 'ouvrier' | 'etam' | 'cadre'
export type TypeContrat = 'cdi' | 'cdd' | 'interim'
export type Unite = 'h' | 'forfait' | 'm2' | 'm' | 'piece' | 'kg' | 'lot'
export type RoleMessage = 'user' | 'assistant'

export interface Profile {
  id: string
  company_name: string
  siret: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  decennale_number: string | null
  decennale_expiry: string | null
  tva_number: string | null
  tva_rate: number
  hourly_rate: number | null
  payment_terms: number
  trade: string | null
  plan: Plan
  onboarding_done: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  profile_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  type: TypeClient
  created_at: string
  updated_at: string
}

export interface Prestation {
  id: string
  profile_id: string
  name: string
  description: string | null
  unit_price: number
  unit: Unite
  category: string | null
  created_at: string
}

export interface Chantier {
  id: string
  profile_id: string
  client_id: string | null
  name: string
  address: string | null
  status: StatutChantier
  start_date: string | null
  end_date: string | null
  estimated_hours: number | null
  actual_hours: number
  estimated_amount: number | null
  actual_amount: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Devis {
  id: string
  profile_id: string
  client_id: string | null
  chantier_id: string | null
  reference: string
  objet: string | null
  lieu_chantier: string | null
  status: StatutDevis
  created_at: string
  sent_at: string | null
  valid_until: string | null
  total_ht: number
  tva_amount: number
  total_ttc: number
  notes: string | null
  pdf_url: string | null
}

export interface DevisLigne {
  id: string
  devis_id: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  tva_rate: number
  total: number
  order_index: number
}

export interface Facture {
  id: string
  profile_id: string
  devis_id: string | null
  client_id: string | null
  reference: string
  type: TypeFacture
  status: StatutFacture
  issued_at: string
  due_date: string | null
  paid_at: string | null
  total_ht: number
  tva_amount: number
  total_ttc: number
  pdf_url: string | null
  facturx_xml: string | null
  created_at: string
  updated_at: string
}

export interface Employe {
  id: string
  profile_id: string
  first_name: string
  last_name: string
  email: string | null
  role: RoleEmploye
  coefficient: string | null
  hourly_rate: number | null
  contract_type: TypeContrat
  start_date: string | null
  convention_collective: string | null
  created_at: string
}

export interface FichePaie {
  id: string
  employe_id: string
  profile_id: string
  period_month: number
  period_year: number
  base_hours: number
  overtime_hours: number
  gross_salary: number | null
  net_salary: number | null
  intemperies_days: number
  conges_days_taken: number
  pdf_url: string | null
  created_at: string
}

export interface Conversation {
  id: string
  profile_id: string
  title: string | null
  context: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: RoleMessage
  content: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface Relance {
  id: string
  profile_id: string
  devis_id: string | null
  facture_id: string | null
  scheduled_at: string
  sent_at: string | null
  type: 'devis' | 'impaye'
  created_at: string
}

// Types pour l'agent IA
export type IntentionAgent =
  | 'creer_devis'
  | 'modifier_devis'
  | 'envoyer_devis'
  | 'creer_facture'
  | 'envoyer_facture'
  | 'marquer_paye'
  | 'creer_chantier'
  | 'maj_chantier'
  | 'enregistrer_heures'
  | 'generer_fiche_paie'
  | 'question_metier'
  | 'dashboard'
  | 'gerer_client'
  | 'relancer'
  | 'conversation_libre'

export interface ActionAgent {
  intention: IntentionAgent
  parametres: Record<string, unknown>
  reponse: string
}
