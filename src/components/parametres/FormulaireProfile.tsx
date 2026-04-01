'use client'

import { useState } from 'react'
import { creerClientSupabase } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function FormulaireProfile({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    company_name: profile.company_name || '',
    siret: profile.siret || '',
    address: profile.address || '',
    city: profile.city || '',
    postal_code: profile.postal_code || '',
    phone: profile.phone || '',
    email: profile.email || '',
    trade: profile.trade || '',
    tva_rate: profile.tva_rate,
    hourly_rate: profile.hourly_rate || 0,
    payment_terms: profile.payment_terms,
    decennale_number: profile.decennale_number || '',
    tva_number: profile.tva_number || '',
  })
  const [sauvegarde, setSauvegarde] = useState(false)
  const [chargement, setChargement] = useState(false)

  const supabase = creerClientSupabase()

  function maj(champ: string, valeur: string | number) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
    setSauvegarde(false)
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: form.company_name,
          siret: form.siret || null,
          address: form.address || null,
          city: form.city || null,
          postal_code: form.postal_code || null,
          phone: form.phone || null,
          email: form.email || null,
          trade: form.trade || null,
          tva_rate: form.tva_rate,
          hourly_rate: form.hourly_rate || null,
          payment_terms: form.payment_terms,
          decennale_number: form.decennale_number || null,
          tva_number: form.tva_number || null,
        })
        .eq('id', profile.id)

      if (error) throw error
      setSauvegarde(true)
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <form onSubmit={soumettre} className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase text-gray-400">Entreprise</h2>

        <div>
          <label className="mb-1 block text-xs text-gray-500">Nom entreprise</label>
          <input type="text" value={form.company_name} onChange={e => maj('company_name', e.target.value)} required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Corps de métier</label>
          <input type="text" value={form.trade} onChange={e => maj('trade', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">SIRET</label>
          <input type="text" value={form.siret} onChange={e => maj('siret', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500">Ville</label>
            <input type="text" value={form.city} onChange={e => maj('city', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="w-28">
            <label className="mb-1 block text-xs text-gray-500">Code postal</label>
            <input type="text" value={form.postal_code} onChange={e => maj('postal_code', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Adresse</label>
          <input type="text" value={form.address} onChange={e => maj('address', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase text-gray-400">Contact</h2>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Téléphone</label>
          <input type="tel" value={form.phone} onChange={e => maj('phone', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Email</label>
          <input type="email" value={form.email} onChange={e => maj('email', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase text-gray-400">Facturation</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500">Taux horaire</label>
            <input type="number" value={form.hourly_rate} onChange={e => maj('hourly_rate', parseFloat(e.target.value) || 0)} min="0" step="0.5" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500">TVA (%)</label>
            <select value={form.tva_rate} onChange={e => maj('tva_rate', parseFloat(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value={20}>20%</option>
              <option value={10}>10%</option>
              <option value={5.5}>5.5%</option>
              <option value={0}>0%</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Délai de paiement (jours)</label>
          <input type="number" value={form.payment_terms} onChange={e => maj('payment_terms', parseInt(e.target.value) || 30)} min="0" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">N° TVA intracommunautaire</label>
          <input type="text" value={form.tva_number} onChange={e => maj('tva_number', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">N° décennale</label>
          <input type="text" value={form.decennale_number} onChange={e => maj('decennale_number', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <button
        type="submit"
        disabled={chargement}
        className="rounded-xl bg-orange py-3 text-center font-semibold text-white disabled:opacity-50"
      >
        {chargement ? 'Sauvegarde...' : sauvegarde ? 'Sauvegardé !' : 'Enregistrer'}
      </button>

      <p className="text-center text-xs text-gray-400">Plan actuel : {profile.plan}</p>
    </form>
  )
}
