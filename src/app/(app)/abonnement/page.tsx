'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  { id: 'free', nom: 'Gratuit', prix: 0, features: ['5 devis/mois', 'Chat IA', 'Gestion clients'], cta: null },
  { id: 'pro', nom: 'Pro', prix: 29, features: ['Devis illimités', 'Factures + PDF', 'Envoi email', 'Chantiers'], cta: 'Passer en Pro' },
  { id: 'business', nom: 'Business', prix: 59, features: ['Tout Pro +', 'Employés & paie', 'Relances auto', 'Stats avancées'], cta: 'Passer en Business' },
  { id: 'premium', nom: 'Premium', prix: 99, features: ['Tout Business +', 'Support prioritaire', 'API', 'Multi-utilisateurs'], cta: 'Passer en Premium' },
]

export default function PageAbonnement() {
  const [chargement, setChargement] = useState<string | null>(null)

  async function choisirPlan(planId: string) {
    if (planId === 'free') return
    setChargement(planId)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
    } finally {
      setChargement(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/parametres" className="text-sm text-gray-500">&larr; Retour</Link>
      <h1 className="text-xl font-bold text-bleu">Choisir un plan</h1>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-4 ${
              plan.id === 'pro' ? 'border-orange bg-orange/5' : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-bleu">{plan.nom}</h2>
                <p className="text-2xl font-bold text-bleu">
                  {plan.prix === 0 ? 'Gratuit' : `${plan.prix}€`}
                  {plan.prix > 0 && <span className="text-sm font-normal text-gray-400">/mois</span>}
                </p>
              </div>
              {plan.id === 'pro' && (
                <span className="rounded-full bg-orange px-3 py-1 text-xs font-medium text-white">Populaire</span>
              )}
            </div>

            <ul className="flex flex-col gap-1 mb-4">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-gray-600">• {f}</li>
              ))}
            </ul>

            {plan.cta && (
              <button
                onClick={() => choisirPlan(plan.id)}
                disabled={chargement !== null}
                className={`w-full rounded-xl py-2.5 text-center text-sm font-semibold ${
                  plan.id === 'pro'
                    ? 'bg-orange text-white'
                    : 'border border-bleu text-bleu'
                } disabled:opacity-50`}
              >
                {chargement === plan.id ? 'Redirection...' : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
