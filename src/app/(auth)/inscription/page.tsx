"use client"

import { useState } from "react"
import { creerClientSupabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Inscription() {
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)
  const router = useRouter()
  const supabase = creerClientSupabase()

  async function gererInscription(e: React.FormEvent) {
    e.preventDefault()
    setErreur("")
    setChargement(true)

    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit faire au moins 6 caractères")
      setChargement(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    })

    if (error) {
      setErreur("Impossible de créer le compte. Réessaie.")
      setChargement(false)
      return
    }

    router.push("/onboarding")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-bleu">
          Quoti<span className="text-orange">Pro</span>
        </h1>
        <p className="mt-2 text-center text-gray-500">Crée ton compte en 30 secondes</p>

        <form onSubmit={gererInscription} className="mt-8 space-y-4">
          {erreur && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{erreur}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
              placeholder="ton@email.fr"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
              placeholder="6 caractères minimum"
            />
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-lg bg-orange py-3 font-semibold text-white transition hover:bg-orange/90 disabled:opacity-50"
          >
            {chargement ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-orange hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  )
}
