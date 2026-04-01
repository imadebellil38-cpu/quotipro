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
    <div className="flex items-center justify-between px-4 py-5">
      <h1 className="text-2xl font-extrabold text-bleu">{titre}</h1>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-gradient-orange rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
