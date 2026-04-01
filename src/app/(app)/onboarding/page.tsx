"use client"

import { useState } from "react"
import { creerClientSupabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const METIERS = [
  "Plombier", "Électricien", "Maçon", "Peintre", "Carreleur",
  "Menuisier", "Couvreur", "Chauffagiste", "Plaquiste", "Serrurier",
  "Terrassier", "Façadier", "Charpentier", "Climaticien", "Autre"
]

export default function Onboarding() {
  const [etape, setEtape] = useState(1)
  const [donnees, setDonnees] = useState({
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

  function majDonnees(champ: string, valeur: string) {
    setDonnees((prev) => ({ ...prev, [champ]: valeur }))
  }

  async function terminerOnboarding() {
    setChargement(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").update({
      company_name: donnees.company_name,
      trade: donnees.trade,
      city: donnees.city,
      siret: donnees.siret || null,
      phone: donnees.phone || null,
      hourly_rate: donnees.hourly_rate ? parseFloat(donnees.hourly_rate) : null,
      decennale_number: donnees.decennale_number || null,
      onboarding_done: true,
    }).eq("id", user.id)

    router.push("/chat")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-bleu">
          Bienvenue sur Quoti<span className="text-orange">Pro</span>
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Étape {etape}/2 — {etape === 1 ? "Ton entreprise" : "Tes infos métier"}
        </p>

        {/* Barre de progression */}
        <div className="mt-6 flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${etape >= 1 ? "bg-orange" : "bg-gray-200"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${etape >= 2 ? "bg-orange" : "bg-gray-200"}`} />
        </div>

        {etape === 1 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de ton entreprise *
              </label>
              <input
                type="text"
                required
                value={donnees.company_name}
                onChange={(e) => majDonnees("company_name", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="Ex: Dupont Plomberie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ton métier *
              </label>
              <select
                value={donnees.trade}
                onChange={(e) => majDonnees("trade", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
              >
                <option value="">Choisis ton métier</option>
                {METIERS.map((m) => (
                  <option key={m} value={m.toLowerCase()}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ville *
              </label>
              <input
                type="text"
                required
                value={donnees.city}
                onChange={(e) => majDonnees("city", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="Ex: Marseille"
              />
            </div>

            <button
              onClick={() => {
                if (donnees.company_name && donnees.trade && donnees.city) setEtape(2)
              }}
              className="w-full rounded-lg bg-orange py-3 font-semibold text-white transition hover:bg-orange/90"
            >
              Continuer
            </button>
          </div>
        )}

        {etape === 2 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SIRET <span className="text-gray-400">(facultatif)</span>
              </label>
              <input
                type="text"
                value={donnees.siret}
                onChange={(e) => majDonnees("siret", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="14 chiffres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                value={donnees.phone}
                onChange={(e) => majDonnees("phone", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="06 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taux horaire habituel (€/h)
              </label>
              <input
                type="number"
                value={donnees.hourly_rate}
                onChange={(e) => majDonnees("hourly_rate", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="Ex: 45"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                N° garantie décennale
              </label>
              <input
                type="text"
                value={donnees.decennale_number}
                onChange={(e) => majDonnees("decennale_number", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEtape(1)}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={terminerOnboarding}
                disabled={chargement}
                className="flex-1 rounded-lg bg-orange py-3 font-semibold text-white transition hover:bg-orange/90 disabled:opacity-50"
              >
                {chargement ? "..." : "C'est parti !"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
