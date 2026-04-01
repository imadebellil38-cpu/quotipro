'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { creerClientSupabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function PageNouvelEmploye() {
  const router = useRouter()
  const supabase = creerClientSupabase()
  const [chargement, setChargement] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'ouvrier',
    hourly_rate: '',
    contract_type: 'cdi',
    start_date: '',
    coefficient: '',
    convention_collective: '',
  })

  function maj(champ: string, valeur: string) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) return
    setChargement(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('employes')
        .insert({
          profile_id: user.id,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email || null,
          role: form.role,
          hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
          contract_type: form.contract_type,
          start_date: form.start_date || null,
          coefficient: form.coefficient || null,
          convention_collective: form.convention_collective || null,
        })

      if (error) throw error
      router.push('/parametres/employes')
    } catch (err) {
      console.error('Erreur création employé:', err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/parametres/employes" className="text-sm text-gray-500">&larr; Retour</Link>
      <h1 className="text-xl font-bold text-bleu">Nouvel employé</h1>

      <form onSubmit={soumettre} className="flex flex-col gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Prénom *</label>
              <input type="text" value={form.first_name} onChange={e => maj('first_name', e.target.value)} required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Nom *</label>
              <input type="text" value={form.last_name} onChange={e => maj('last_name', e.target.value)} required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Email</label>
            <input type="email" value={form.email} onChange={e => maj('email', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Rôle</label>
              <select value={form.role} onChange={e => maj('role', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option value="ouvrier">Ouvrier</option>
                <option value="etam">ETAM</option>
                <option value="cadre">Cadre</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Contrat</label>
              <select value={form.contract_type} onChange={e => maj('contract_type', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="interim">Intérim</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Taux horaire</label>
              <input type="number" value={form.hourly_rate} onChange={e => maj('hourly_rate', e.target.value)} min="0" step="0.5" placeholder="€/h" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Coefficient</label>
              <input type="text" value={form.coefficient} onChange={e => maj('coefficient', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date d&apos;embauche</label>
            <input type="date" value={form.start_date} onChange={e => maj('start_date', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Convention collective</label>
            <input type="text" value={form.convention_collective} onChange={e => maj('convention_collective', e.target.value)} placeholder="Ex: BTP ouvriers" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={chargement || !form.first_name.trim() || !form.last_name.trim()}
          className="rounded-xl bg-orange py-3 text-center font-semibold text-white disabled:opacity-50"
        >
          {chargement ? 'Création...' : 'Ajouter l\'employé'}
        </button>
      </form>
    </div>
  )
}
