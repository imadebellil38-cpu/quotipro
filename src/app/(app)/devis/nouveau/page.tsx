'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { creerClientSupabase } from '@/lib/supabase/client'
import Link from 'next/link'

interface LigneForm {
  description: string
  quantity: number
  unit: string
  unit_price: number
  tva_rate: number
}

const ligneVide: LigneForm = { description: '', quantity: 1, unit: 'h', unit_price: 0, tva_rate: 20 }

export default function PageNouveauDevis() {
  const router = useRouter()
  const [objet, setObjet] = useState('')
  const [lieuChantier, setLieuChantier] = useState('')
  const [clientId, setClientId] = useState('')
  const [lignes, setLignes] = useState<LigneForm[]>([{ ...ligneVide }])
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

  function majLigne(index: number, champ: keyof LigneForm, valeur: string | number) {
    setLignes(prev => prev.map((l, i) => i === index ? { ...l, [champ]: valeur } : l))
  }

  function ajouterLigne() {
    setLignes(prev => [...prev, { ...ligneVide }])
  }

  function supprimerLigne(index: number) {
    if (lignes.length <= 1) return
    setLignes(prev => prev.filter((_, i) => i !== index))
  }

  const totalHT = lignes.reduce((s, l) => s + l.quantity * l.unit_price, 0)
  const totalTVA = lignes.reduce((s, l) => s + l.quantity * l.unit_price * l.tva_rate / 100, 0)
  const totalTTC = totalHT + totalTVA

  async function soumettre(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Générer référence
      const now = new Date()
      const prefix = `DEV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
      const { count } = await supabase
        .from('devis')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .like('reference', `${prefix}%`)
      const reference = `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`

      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + 30)

      const { data: newDevis, error } = await supabase
        .from('devis')
        .insert({
          profile_id: user.id,
          client_id: clientId || null,
          reference,
          objet: objet || null,
          lieu_chantier: lieuChantier || null,
          valid_until: validUntil.toISOString().split('T')[0],
          total_ht: totalHT,
          tva_amount: totalTVA,
          total_ttc: totalTTC,
        })
        .select()
        .single()

      if (error) throw error

      // Insérer les lignes
      const lignesData = lignes
        .filter(l => l.description && l.unit_price > 0)
        .map((l, i) => ({
          devis_id: newDevis.id,
          description: l.description,
          quantity: l.quantity,
          unit: l.unit,
          unit_price: l.unit_price,
          tva_rate: l.tva_rate,
          total: l.quantity * l.unit_price,
          order_index: i,
        }))

      if (lignesData.length > 0) {
        await supabase.from('devis_lignes').insert(lignesData)
      }

      router.push(`/devis/${newDevis.id}`)
    } catch (err) {
      console.error('Erreur création devis:', err)
    } finally {
      setChargement(false)
    }
  }

  const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/devis" className="text-sm text-gray-500">&larr; Retour</Link>
      <h1 className="text-xl font-bold text-bleu">Nouveau devis</h1>

      <form onSubmit={soumettre} className="flex flex-col gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
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

          <label className="mb-1 mt-3 block text-xs font-semibold uppercase text-gray-400">Objet</label>
          <input
            type="text"
            value={objet}
            onChange={e => setObjet(e.target.value)}
            placeholder="Ex: Rénovation salle de bain"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />

          <label className="mb-1 mt-3 block text-xs font-semibold uppercase text-gray-400">Lieu du chantier</label>
          <input
            type="text"
            value={lieuChantier}
            onChange={e => setLieuChantier(e.target.value)}
            placeholder="Adresse du chantier"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase text-gray-400">Prestations</h2>
          {lignes.map((l, i) => (
            <div key={i} className="mb-3 flex flex-col gap-2 border-b border-gray-50 pb-3 last:border-0">
              <input
                type="text"
                value={l.description}
                onChange={e => majLigne(i, 'description', e.target.value)}
                placeholder="Description"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={l.quantity}
                  onChange={e => majLigne(i, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                  className="w-20 rounded-lg border border-gray-200 px-2 py-2 text-sm"
                  placeholder="Qté"
                />
                <select
                  value={l.unit}
                  onChange={e => majLigne(i, 'unit', e.target.value)}
                  className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
                >
                  <option value="h">h</option>
                  <option value="forfait">forfait</option>
                  <option value="m2">m2</option>
                  <option value="m">m</option>
                  <option value="piece">pce</option>
                  <option value="kg">kg</option>
                  <option value="lot">lot</option>
                </select>
                <input
                  type="number"
                  value={l.unit_price}
                  onChange={e => majLigne(i, 'unit_price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="flex-1 rounded-lg border border-gray-200 px-2 py-2 text-sm"
                  placeholder="Prix unit. HT"
                />
                {lignes.length > 1 && (
                  <button type="button" onClick={() => supprimerLigne(i)} className="text-red-400 text-sm px-1">X</button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">TVA</label>
                <select
                  value={l.tva_rate}
                  onChange={e => majLigne(i, 'tva_rate', parseFloat(e.target.value))}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                >
                  <option value={20}>20%</option>
                  <option value={10}>10%</option>
                  <option value={5.5}>5.5%</option>
                  <option value={0}>0%</option>
                </select>
                <span className="ml-auto text-sm font-medium">{fmt.format(l.quantity * l.unit_price)}</span>
              </div>
            </div>
          ))}
          <button type="button" onClick={ajouterLigne} className="text-sm font-medium text-orange">
            + Ajouter une ligne
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total HT</span>
            <span>{fmt.format(totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA</span>
            <span>{fmt.format(totalTVA)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 text-base font-bold">
            <span className="text-bleu">Total TTC</span>
            <span className="text-orange">{fmt.format(totalTTC)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={chargement}
          className="rounded-xl bg-orange py-3 text-center font-semibold text-white disabled:opacity-50"
        >
          {chargement ? 'Création...' : 'Créer le devis'}
        </button>
      </form>
    </div>
  )
}
