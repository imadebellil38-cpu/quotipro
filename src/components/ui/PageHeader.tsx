import Link from 'next/link'

export default function PageHeader({
  titre,
  actionLabel,
  actionHref,
}: {
  titre: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="text-xl font-bold text-bleu">{titre}</h1>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
