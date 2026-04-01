'use client'

import Link from 'next/link'
import Markdown from 'react-markdown'

interface Props {
  role: "user" | "assistant"
  contenu: string
  metadata?: Record<string, unknown>
}

const actionLinks: Record<string, { label: string; href: (id: string) => string; icon: string }> = {
  devis_cree: { label: 'Voir le devis', href: (id) => `/devis/${id}`, icon: '📄' },
  facture_creee: { label: 'Voir la facture', href: (id) => `/factures/${id}`, icon: '🧾' },
  chantier_cree: { label: 'Voir le chantier', href: (id) => `/chantiers/${id}`, icon: '🏗' },
}

export default function MessageBulle({ role, contenu, metadata }: Props) {
  const estUtilisateur = role === "user"

  const action = metadata?.action as string | undefined
  const actionConfig = action ? actionLinks[action] : null
  const actionId = (metadata?.devis_id || metadata?.facture_id || metadata?.chantier_id) as string | undefined

  return (
    <div className={`flex ${estUtilisateur ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[85%] gap-2.5">
        {!estUtilisateur && (
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-orange text-xs font-bold text-white shadow-md shadow-orange-200">
            Q
          </div>
        )}
        <div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              estUtilisateur
                ? "rounded-br-md bg-gradient-orange text-white shadow-md shadow-orange-200"
                : "rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-sm"
            }`}
          >
            {estUtilisateur ? (
              <div className="whitespace-pre-wrap">{contenu}</div>
            ) : contenu === "..." ? (
              <div className="flex gap-1.5 py-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms" }} />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                <Markdown>{contenu}</Markdown>
              </div>
            )}
          </div>
          {actionConfig && actionId && (
            <Link
              href={actionConfig.href(actionId)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-orange/20 bg-orange-light px-3 py-2 text-xs font-semibold text-orange transition hover:bg-orange hover:text-white"
            >
              <span>{actionConfig.icon}</span>
              {actionConfig.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
