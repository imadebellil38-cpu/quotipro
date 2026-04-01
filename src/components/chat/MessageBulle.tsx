import Link from 'next/link'

interface Props {
  role: "user" | "assistant"
  contenu: string
  metadata?: Record<string, unknown>
}

const actionLinks: Record<string, { label: string; href: (id: string) => string }> = {
  devis_cree: { label: 'Voir le devis', href: (id) => `/devis/${id}` },
  facture_creee: { label: 'Voir la facture', href: (id) => `/factures/${id}` },
  chantier_cree: { label: 'Voir le chantier', href: (id) => `/chantiers/${id}` },
}

export default function MessageBulle({ role, contenu, metadata }: Props) {
  const estUtilisateur = role === "user"

  const action = metadata?.action as string | undefined
  const actionConfig = action ? actionLinks[action] : null
  const actionId = (metadata?.devis_id || metadata?.facture_id || metadata?.chantier_id) as string | undefined

  return (
    <div className={`flex ${estUtilisateur ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          estUtilisateur
            ? "rounded-br-md bg-orange text-white"
            : "rounded-bl-md bg-white text-gray-800 shadow-sm"
        }`}
      >
        <div className="whitespace-pre-wrap">{contenu}</div>
        {actionConfig && actionId && (
          <Link
            href={actionConfig.href(actionId)}
            className={`mt-2 inline-block rounded-lg px-3 py-1 text-xs font-medium ${
              estUtilisateur
                ? 'bg-white/20 text-white'
                : 'bg-orange/10 text-orange'
            }`}
          >
            {actionConfig.label} &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}
