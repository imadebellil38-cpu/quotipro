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
      className="border-t border-gray-200 bg-white px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Dis-moi ce que tu veux faire..."
          disabled={desactive}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={desactive || !texte.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white transition hover:bg-orange/90 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
