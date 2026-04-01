"use client"

import { useState } from "react"
import { creerClientSupabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Connexion() {
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)
  const router = useRouter()
  const supabase = creerClientSupabase()

  async function gererConnexion(e: React.FormEvent) {
    e.preventDefault()
    setErreur("")
    setChargement(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })

    if (error) {
      setErreur("Email ou mot de passe incorrect")
      setChargement(false)
      return
    }

    router.push("/chat")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-bleu">
          Quoti<span className="text-orange">Pro</span>
        </h1>
        <p className="mt-2 text-center text-gray-500">Connecte-toi à ton compte</p>

        <form onSubmit={gererConnexion} className="mt-8 space-y-4">
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
            />
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-lg bg-orange py-3 font-semibold text-white transition hover:bg-orange/90 disabled:opacity-50"
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-orange hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  )
}
