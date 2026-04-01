"use client"

import { useState, useRef, useEffect } from "react"
import MessageBulle from "./MessageBulle"
import SaisieMessage from "./SaisieMessage"

interface MessageChat {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface({ profileId }: { profileId: string }) {
  const [messages, setMessages] = useState<MessageChat[]>([
    {
      id: "bienvenue",
      role: "assistant",
      content: "Salut ! Je suis ton assistant QuotiPro. Dis-moi ce que tu veux faire : un devis, une facture, un suivi de chantier... Je m'occupe de tout.",
    },
  ])
  const [chargement, setChargement] = useState(false)
  const finMessages = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finMessages.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function envoyerMessage(contenu: string) {
    const nouveauMessage: MessageChat = {
      id: Date.now().toString(),
      role: "user",
      content: contenu,
    }

    setMessages((prev) => [...prev, nouveauMessage])
    setChargement(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contenu,
          profileId,
          historique: messages.slice(-10),
        }),
      })

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: data.reponse || "Désolé, j'ai eu un souci. Réessaie.",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-erreur",
          role: "assistant",
          content: "Oups, problème de connexion. Réessaie.",
        },
      ])
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-bleu">
          Quoti<span className="text-orange">Pro</span>
        </h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.map((msg) => (
            <MessageBulle key={msg.id} role={msg.role} contenu={msg.content} />
          ))}
          {chargement && (
            <MessageBulle role="assistant" contenu="..." />
          )}
          <div ref={finMessages} />
        </div>
      </div>

      {/* Saisie */}
      <div className="mx-auto w-full max-w-2xl">
        <SaisieMessage onEnvoyer={envoyerMessage} desactive={chargement} />
      </div>
    </div>
  )
}
