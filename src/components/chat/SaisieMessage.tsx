"use client"

import { useState } from "react"

interface Props {
  onEnvoyer: (message: string) => void
  desactive?: boolean
}

export default function SaisieMessage({ onEnvoyer, desactive }: Props) {
  const [texte, setTexte] = useState("")

  function gererEnvoi(e: React.FormEvent) {
    e.preventDefault()
    const contenu = texte.trim()
    if (!contenu || desactive) return
    onEnvoyer(contenu)
    setTexte("")
  }

  return (
    <form
      onSubmit={gererEnvoi}
      className="border-t border-gray-100 bg-white px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Décrivez votre devis..."
          disabled={desactive}
          className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={desactive || !texte.trim()}
          className="bg-gradient-orange flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md shadow-orange-200 transition hover:shadow-lg disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
