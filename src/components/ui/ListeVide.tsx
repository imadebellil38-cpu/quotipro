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
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl text-gray-300 mb-6">
        0
      </div>
      <p className="text-gray-500 mb-6">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-gradient-orange rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
