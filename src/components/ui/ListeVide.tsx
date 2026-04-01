import Link from 'next/link'

export default function ListeVide({
  message,
  actionLabel,
  actionHref,
}: {
  message: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl text-gray-300">0</div>
      <p className="mb-4 text-gray-500">{message}</p>
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
