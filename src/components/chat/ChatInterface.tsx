"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import MessageBulle from "./MessageBulle"
import SaisieMessage from "./SaisieMessage"

interface MessageChat {
  id: string
  role: "user" | "assistant"
  content: string
  metadata?: Record<string, unknown>
}

const MESSAGE_BIENVENUE: MessageChat = {
  id: "bienvenue",
  role: "assistant",
  content: "Salut ! Je suis ton assistant QuotiPro. Dis-moi ce que tu veux faire : un devis, une facture, un suivi de chantier... Je m'occupe de tout.",
}

export default function ChatInterface({ profileId }: { profileId: string }) {
  const [messages, setMessages] = useState<MessageChat[]>([MESSAGE_BIENVENUE])
  const [chargement, setChargement] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [historiqueCharge, setHistoriqueCharge] = useState(false)
  const finMessages = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finMessages.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Charger l'historique au mount
  const chargerHistorique = useCallback(async () => {
    if (historiqueCharge) return
    try {
      const res = await fetch("/api/conversations")
      if (!res.ok) return
      const data = await res.json()
      if (data.conversationId && data.messages?.length > 0) {
        setConversationId(data.conversationId)
        const msgs: MessageChat[] = data.messages.map((m: { id: string; role: string; content: string; metadata?: Record<string, unknown> }) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          metadata: m.metadata,
        }))
        setMessages(msgs)
      }
    } catch {
      // Pas grave, on garde le message de bienvenue
    } finally {
      setHistoriqueCharge(true)
    }
  }, [historiqueCharge])

  useEffect(() => {
    chargerHistorique()
  }, [chargerHistorique])

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
          conversationId,
        }),
      })

      const data = await response.json()

      if (data.conversationId) {
        setConversationId(data.conversationId)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: data.reponse || "Désolé, j'ai eu un souci. Réessaie.",
          metadata: data.metadata,
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

  function nouvelleConversation() {
    setConversationId(null)
    setMessages([MESSAGE_BIENVENUE])
    setHistoriqueCharge(false)
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-bleu">
          Quoti<span className="text-orange">Pro</span>
        </h1>
        <button
          onClick={nouvelleConversation}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          Nouvelle conv.
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.map((msg) => (
            <MessageBulle key={msg.id} role={msg.role} contenu={msg.content} metadata={msg.metadata} />
          ))}
          {chargement && (
            <MessageBulle role="assistant" contenu="..." />
          )}
          <div ref={finMessages} />
        </div>
      </div>

      {/* Suggestions rapides */}
      {messages.length <= 1 && (
        <div className="mx-auto flex max-w-2xl flex-wrap gap-2 px-4 pb-2">
          {["Tableau de bord", "Créer un devis", "Mes factures impayées", "Mes chantiers"].map((s) => (
            <button
              key={s}
              onClick={() => envoyerMessage(s)}
              disabled={chargement}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-orange hover:text-orange disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Saisie */}
      <div className="mx-auto w-full max-w-2xl">
        <SaisieMessage onEnvoyer={envoyerMessage} desactive={chargement} />
      </div>
    </div>
  )
}
