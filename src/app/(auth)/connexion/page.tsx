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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-hero px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-bleu">
              Quoti<span className="text-orange">Pro</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">Connecte-toi à ton compte</p>
          </div>

          <form onSubmit={gererConnexion} className="mt-8 space-y-4">
            {erreur && (
              <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">{erreur}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20"
                placeholder="ton@email.fr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="bg-gradient-orange w-full rounded-xl py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition hover:shadow-xl disabled:opacity-50"
            >
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-orange hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
