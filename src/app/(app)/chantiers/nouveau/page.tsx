'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { creerClientSupabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function PageNouveauChantier() {
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [clientId, setClientId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [heuresEstimees, setHeuresEstimees] = useState('')
  const [montantEstime, setMontantEstime] = useState('')
  const [notes, setNotes] = useState('')
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([])
  const [chargement, setChargement] = useState(false)
  const [clientsCharges, setClientsCharges] = useState(false)

  const supabase = creerClientSupabase()

  async function chargerClients() {
    if (clientsCharges) return
    const { data } = await supabase.from('clients').select('id, name').order('name')
    setClients(data || [])
    setClientsCharges(true)
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault()
    if (!nom.trim()) return
    setChargement(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chantiers')
        .insert({
          profile_id: user.id,
          name: nom,
          client_id: clientId || null,
          address: adresse || null,
          start_date: dateDebut || null,
          estimated_hours: heuresEstimees ? parseFloat(heuresEstimees) : null,
          estimated_amount: montantEstime ? parseFloat(montantEstime) : null,
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/chantiers/${data.id}`)
    } catch (err) {
      console.error('Erreur création chantier:', err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/chantiers" className="text-sm text-gray-500">&larr; Retour</Link>
      <h1 className="text-xl font-bold text-bleu">Nouveau chantier</h1>

      <form onSubmit={soumettre} className="flex flex-col gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Nom du chantier *</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
              placeholder="Ex: Rénovation appartement Dupont"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Client</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              onFocus={chargerClients}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">Sans client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              placeholder="Adresse du chantier"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Date de début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={e => setDateDebut(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Heures estimées</label>
              <input
                type="number"
                value={heuresEstimees}
                onChange={e => setHeuresEstimees(e.target.value)}
                min="0"
                step="0.5"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Montant estimé</label>
              <input
                type="number"
                value={montantEstime}
                onChange={e => setMontantEstime(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes, particularités..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={chargement || !nom.trim()}
          className="rounded-xl bg-orange py-3 text-center font-semibold text-white disabled:opacity-50"
        >
          {chargement ? 'Création...' : 'Créer le chantier'}
        </button>
      </form>
    </div>
  )
}
