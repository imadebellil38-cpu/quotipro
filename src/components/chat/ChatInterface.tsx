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

const SUGGESTIONS = [
  { label: "Créer un devis", icon: "📄" },
  { label: "Tableau de bord", icon: "📊" },
  { label: "Mes factures impayées", icon: "💰" },
  { label: "Mes chantiers", icon: "🏗" },
]

export default function ChatInterface({ profileId }: { profileId: string }) {
  const [messages, setMessages] = useState<MessageChat[]>([MESSAGE_BIENVENUE])
  const [chargement, setChargement] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [historiqueCharge, setHistoriqueCharge] = useState(false)
  const finMessages = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finMessages.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      // Pas grave
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

  const showSuggestions = messages.length <= 1

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="glass-nav flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-orange text-sm font-bold text-white shadow-md shadow-orange-200">
            Q
          </div>
          <div>
            <h1 className="text-sm font-bold text-bleu">Assistant IA</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">En ligne</span>
            </div>
          </div>
        </div>
        <button
          onClick={nouvelleConversation}
          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm hover:bg-gray-50"
        >
          + Nouvelle
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <MessageBulle key={msg.id} role={msg.role} contenu={msg.content} metadata={msg.metadata} />
          ))}
          {chargement && (
            <MessageBulle role="assistant" contenu="..." />
          )}
          <div ref={finMessages} />
        </div>
      </div>

      {/* Action cards pour suggestions */}
      {showSuggestions && (
        <div className="mx-auto w-full max-w-2xl px-4 pb-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Je peux vous aider a
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => envoyerMessage(s.label)}
                disabled={chargement}
                className="card-hover flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm disabled:opacity-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-light text-lg">
                  {s.icon}
                </div>
                <span className="text-sm font-semibold text-bleu">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saisie */}
      <div className="mx-auto w-full max-w-2xl">
        <SaisieMessage onEnvoyer={envoyerMessage} desactive={chargement} />
      </div>
    </div>
  )
}
