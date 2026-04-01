import { SupabaseClient } from '@supabase/supabase-js'
import { creerClient, listerClients } from '@/lib/db/clients'
import { creerDevis, genererReference, listerDevis } from '@/lib/db/devis'
import { creerFacture, genererReferenceFacture, listerFactures, modifierStatutFacture } from '@/lib/db/factures'
import { creerChantier, listerChantiers } from '@/lib/db/chantiers'
import { getDevis } from '@/lib/db/devis'
import { listerEmployes, creerEmploye } from '@/lib/db/employes'
import { creerRelance } from '@/lib/db/relances'
import type { StatutDevis, StatutFacture, StatutChantier, RoleEmploye, TypeContrat } from '@/types'

export async function executerTool(
  supabase: SupabaseClient,
  profileId: string,
  toolName: string,
  input: Record<string, unknown>
): Promise<{ result: string; metadata?: Record<string, unknown> }> {
  switch (toolName) {
    case 'creer_client': {
      const client = await creerClient(supabase, profileId, {
        name: input.name as string,
        email: input.email as string | undefined,
        phone: input.phone as string | undefined,
        address: input.address as string | undefined,
        city: input.city as string | undefined,
        postal_code: input.postal_code as string | undefined,
        type: (input.type as 'particulier' | 'professionnel') || 'particulier',
      })
      return {
        result: `Client "${client.name}" créé avec succès (ID: ${client.id})`,
        metadata: { action: 'client_cree', client_id: client.id, client_name: client.name },
      }
    }

    case 'lister_clients': {
      const clients = await listerClients(supabase, profileId)
      if (clients.length === 0) return { result: 'Aucun client enregistré.' }
      const liste = clients.map(c =>
        `- ${c.name}${c.phone ? ` (${c.phone})` : ''}${c.email ? ` — ${c.email}` : ''} [ID: ${c.id}]`
      ).join('\n')
      return { result: `${clients.length} client(s) :\n${liste}` }
    }

    case 'creer_devis': {
      const reference = await genererReference(supabase, profileId)
      const lignes = (input.lignes as Array<{
        description: string
        quantity: number
        unit?: string
        unit_price: number
        tva_rate?: number
      }>).map((l, i) => ({
        description: l.description,
        quantity: l.quantity,
        unit: l.unit || 'h',
        unit_price: l.unit_price,
        tva_rate: l.tva_rate || 20,
        order_index: i,
      }))

      const devis = await creerDevis(supabase, profileId, {
        reference,
        client_id: input.client_id as string | undefined,
        objet: input.objet as string | undefined,
        lieu_chantier: input.lieu_chantier as string | undefined,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }, lignes)

      const totalHT = lignes.reduce((s, l) => s + l.quantity * l.unit_price, 0)
      const totalTVA = lignes.reduce((s, l) => s + l.quantity * l.unit_price * l.tva_rate / 100, 0)
      const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

      return {
        result: `Devis ${reference} créé !\n` +
          `Objet : ${input.objet}\n` +
          `${lignes.length} ligne(s) — Total HT : ${fmt.format(totalHT)} — TVA : ${fmt.format(totalTVA)} — TTC : ${fmt.format(totalHT + totalTVA)}\n` +
          `Valide 30 jours. Tu peux le retrouver dans l'onglet Devis.`,
        metadata: { action: 'devis_cree', devis_id: devis.id, reference },
      }
    }

    case 'lister_devis': {
      const devisList = await listerDevis(supabase, profileId, input.statut as StatutDevis | undefined)
      if (devisList.length === 0) return { result: 'Aucun devis trouvé.' }
      const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
      const liste = devisList.slice(0, 10).map(d =>
        `- ${d.reference} — ${d.clients?.name || 'Sans client'} — ${fmt.format(d.total_ttc)} TTC — ${d.status} [ID: ${d.id}]`
      ).join('\n')
      return { result: `${devisList.length} devis :\n${liste}` }
    }

    case 'creer_facture': {
      const devisId = input.devis_id as string
      const devis = await getDevis(supabase, devisId)

      const reference = await genererReferenceFacture(supabase, profileId)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30)

      const facture = await creerFacture(supabase, profileId, {
        devis_id: devisId,
        client_id: devis.client_id || undefined,
        reference,
        type: (input.type as 'acompte' | 'situation' | 'solde' | 'finale') || 'finale',
        due_date: dueDate.toISOString().split('T')[0],
        total_ht: devis.total_ht,
        tva_amount: devis.tva_amount,
        total_ttc: devis.total_ttc,
      })

      const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
      return {
        result: `Facture ${reference} créée depuis le devis ${devis.reference} !\n` +
          `Montant : ${fmt.format(facture.total_ttc)} TTC — Échéance : ${dueDate.toLocaleDateString('fr-FR')}\n` +
          `Tu la retrouves dans l'onglet Factures.`,
        metadata: { action: 'facture_creee', facture_id: facture.id, reference },
      }
    }

    case 'lister_factures': {
      const facturesList = await listerFactures(supabase, profileId, input.statut as StatutFacture | undefined)
      if (facturesList.length === 0) return { result: 'Aucune facture trouvée.' }
      const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
      const liste = facturesList.slice(0, 10).map(f =>
        `- ${f.reference} — ${f.clients?.name || 'Sans client'} — ${fmt.format(f.total_ttc)} TTC — ${f.status} [ID: ${f.id}]`
      ).join('\n')
      return { result: `${facturesList.length} facture(s) :\n${liste}` }
    }

    case 'marquer_facture_payee': {
      const facture = await modifierStatutFacture(supabase, input.facture_id as string, 'payee')
      return {
        result: `Facture ${facture.reference} marquée comme payée !`,
        metadata: { action: 'facture_payee', facture_id: facture.id },
      }
    }

    case 'creer_chantier': {
      const chantier = await creerChantier(supabase, profileId, {
        name: input.name as string,
        client_id: input.client_id as string | undefined,
        address: input.address as string | undefined,
        start_date: input.start_date as string | undefined,
        estimated_hours: input.estimated_hours as number | undefined,
        estimated_amount: input.estimated_amount as number | undefined,
      })
      return {
        result: `Chantier "${chantier.name}" créé ! Tu le retrouves dans l'onglet Chantiers.`,
        metadata: { action: 'chantier_cree', chantier_id: chantier.id },
      }
    }

    case 'lister_chantiers': {
      const chantiersList = await listerChantiers(supabase, profileId, input.statut as StatutChantier | undefined)
      if (chantiersList.length === 0) return { result: 'Aucun chantier trouvé.' }
      const liste = chantiersList.slice(0, 10).map(c =>
        `- ${c.name} — ${c.clients?.name || 'Sans client'} — ${c.status}${c.actual_hours ? ` — ${c.actual_hours}h` : ''} [ID: ${c.id}]`
      ).join('\n')
      return { result: `${chantiersList.length} chantier(s) :\n${liste}` }
    }

    case 'tableau_de_bord': {
      const [devisRes, facturesRes, chantiersRes] = await Promise.all([
        listerDevis(supabase, profileId),
        listerFactures(supabase, profileId),
        listerChantiers(supabase, profileId),
      ])

      const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

      const devisEnAttente = devisRes.filter(d => d.status === 'envoye' || d.status === 'vu')
      const facturesPayees = facturesRes.filter(f => f.status === 'payee')
      const facturesImpayees = facturesRes.filter(f => f.status === 'impayee' || f.status === 'envoyee')
      const chantiersEnCours = chantiersRes.filter(c => c.status === 'en_cours')

      const caTotal = facturesPayees.reduce((s, f) => s + f.total_ttc, 0)
      const montantAttente = devisEnAttente.reduce((s, d) => s + d.total_ttc, 0)
      const montantImpayes = facturesImpayees.reduce((s, f) => s + f.total_ttc, 0)

      return {
        result: `Tableau de bord :\n` +
          `- CA encaissé : ${fmt.format(caTotal)} (${facturesPayees.length} facture(s) payée(s))\n` +
          `- Devis en attente : ${devisEnAttente.length} pour ${fmt.format(montantAttente)}\n` +
          `- Factures impayées : ${facturesImpayees.length} pour ${fmt.format(montantImpayes)}\n` +
          `- Chantiers en cours : ${chantiersEnCours.length}\n` +
          `- Total devis : ${devisRes.length} | Total factures : ${facturesRes.length}`,
      }
    }

    case 'lister_employes': {
      const employes = await listerEmployes(supabase, profileId)
      if (employes.length === 0) return { result: 'Aucun employé enregistré.' }
      const liste = employes.map(e =>
        `- ${e.first_name} ${e.last_name} — ${e.role} — ${e.contract_type}${e.hourly_rate ? ` — ${e.hourly_rate}€/h` : ''} [ID: ${e.id}]`
      ).join('\n')
      return { result: `${employes.length} employé(s) :\n${liste}` }
    }

    case 'creer_employe': {
      const employe = await creerEmploye(supabase, profileId, {
        first_name: input.first_name as string,
        last_name: input.last_name as string,
        email: input.email as string | undefined,
        role: (input.role as RoleEmploye) || 'ouvrier',
        hourly_rate: input.hourly_rate as number | undefined,
        contract_type: (input.contract_type as TypeContrat) || 'cdi',
        start_date: input.start_date as string | undefined,
      })
      return {
        result: `Employé ${employe.first_name} ${employe.last_name} ajouté !`,
        metadata: { action: 'employe_cree', employe_id: employe.id },
      }
    }

    case 'planifier_relance': {
      const jours = (input.jours as number) || 7
      const scheduledAt = new Date(Date.now() + jours * 24 * 60 * 60 * 1000).toISOString()

      const type = input.devis_id ? 'devis' : 'impaye'
      const relance = await creerRelance(supabase, profileId, {
        devis_id: input.devis_id as string | undefined,
        facture_id: input.facture_id as string | undefined,
        scheduled_at: scheduledAt,
        type,
      })
      return {
        result: `Relance planifiée dans ${jours} jour(s) pour le ${new Date(scheduledAt).toLocaleDateString('fr-FR')}.`,
        metadata: { action: 'relance_planifiee', relance_id: relance.id },
      }
    }

    default:
      return { result: `Outil inconnu : ${toolName}` }
  }
}
