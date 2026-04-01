import Link from "next/link"

export default function Accueil() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-bleu sm:text-5xl">
          Quoti<span className="text-orange">Pro</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          L&apos;assistant IA qui gère ton administratif.
          <br />
          Devis, factures, chantiers — tout par conversation.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/inscription"
            className="rounded-lg bg-orange px-6 py-3 text-center font-semibold text-white transition hover:bg-orange/90"
          >
            Essayer gratuitement
          </Link>
          <Link
            href="/connexion"
            className="rounded-lg border border-bleu px-6 py-3 text-center font-semibold text-bleu transition hover:bg-bleu hover:text-white"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  )
}
