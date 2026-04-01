"use client"

import { useState } from "react"
import { creerClientSupabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const metiers = [
  "Plombier", "Electricien", "Maçon", "Peintre", "Carreleur",
  "Menuisier", "Couvreur", "Chauffagiste", "Serrurier", "Terrassier",
  "Plaquiste", "Charpentier", "Autre"
]

export default function Onboarding() {
  const [etape, setEtape] = useState(1)
  const [form, setForm] = useState({
    company_name: "",
    trade: "",
    city: "",
    siret: "",
    phone: "",
    hourly_rate: "",
    decennale_number: "",
  })
  const [chargement, setChargement] = useState(false)
  const router = useRouter()
  const supabase = creerClientSupabase()

  function maj(champ: string, valeur: string) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  async function terminer() {
    if (!form.company_name.trim()) return
    setChargement(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").update({
      company_name: form.company_name,
      trade: form.trade || null,
      city: form.city || null,
      siret: form.siret || null,
      phone: form.phone || null,
      hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      decennale_number: form.decennale_number || null,
      onboarding_done: true,
    }).eq("id", user.id)

    router.push("/chat")
  }

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className={`h-1.5 flex-1 rounded-full ${etape >= 1 ? 'bg-orange' : 'bg-gray-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${etape >= 2 ? 'bg-orange' : 'bg-gray-200'}`} />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-xl font-extrabold text-bleu">
            {etape === 1 ? "Ton entreprise" : "Tes infos"}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {etape === 1 ? "Etape 1/2 — On a besoin de quelques infos" : "Etape 2/2 — Presque fini !"}
          </p>

          {etape === 1 ? (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Nom de ton entreprise *</label>
                <input type="text" value={form.company_name} onChange={e => maj('company_name', e.target.value)} placeholder="Ex: Dupont Plomberie" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Ton métier</label>
                <select value={form.trade} onChange={e => maj('trade', e.target.value)} className={inputClass}>
                  <option value="">Sélectionner</option>
                  {metiers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Ville</label>
                <input type="text" value={form.city} onChange={e => maj('city', e.target.value)} placeholder="Ex: Lyon" className={inputClass} />
              </div>
              <button
                onClick={() => form.company_name.trim() && setEtape(2)}
                disabled={!form.company_name.trim()}
                className="bg-gradient-orange mt-2 w-full rounded-xl py-3.5 font-bold text-white shadow-md shadow-orange-200 disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">SIRET</label>
                <input type="text" value={form.siret} onChange={e => maj('siret', e.target.value)} placeholder="14 chiffres" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Téléphone</label>
                <input type="tel" value={form.phone} onChange={e => maj('phone', e.target.value)} placeholder="06 XX XX XX XX" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Taux horaire</label>
                <input type="number" value={form.hourly_rate} onChange={e => maj('hourly_rate', e.target.value)} placeholder="45" min="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">N° décennale</label>
                <input type="text" value={form.decennale_number} onChange={e => maj('decennale_number', e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setEtape(1)} className="flex-1 rounded-xl border-2 border-gray-200 py-3.5 font-bold text-gray-500">
                  Retour
                </button>
                <button
                  onClick={terminer}
                  disabled={chargement}
                  className="bg-gradient-orange flex-1 rounded-xl py-3.5 font-bold text-white shadow-md shadow-orange-200 disabled:opacity-50"
                >
                  {chargement ? "..." : "Commencer"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-300">Tu pourras modifier tout ça plus tard</p>
      </div>
    </main>
  )
}
