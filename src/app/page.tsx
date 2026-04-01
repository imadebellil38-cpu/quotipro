import Link from "next/link"

const features = [
  {
    icon: "🎙",
    title: "Devis par IA",
    description: "Décrivez votre prestation. L'IA génère le devis avec TVA correcte et mentions légales.",
    accent: true,
  },
  {
    icon: "📄",
    title: "PDF professionnel",
    description: "Documents conformes BTP générés instantanément, prêts à envoyer.",
    accent: false,
  },
  {
    icon: "📧",
    title: "Envoi par email",
    description: "Un clic et c'est chez le client. Avec le PDF en pièce jointe.",
    accent: false,
  },
  {
    icon: "🧠",
    title: "IA Intelligente",
    description: "Elle mémorise vos clients et tarifs habituels pour aller encore plus vite.",
    accent: false,
  },
  {
    icon: "📊",
    title: "Tableau de bord",
    description: "CA, impayés, devis en attente. Tout en un coup d'oeil.",
    accent: false,
  },
  {
    icon: "🔔",
    title: "Relances auto",
    description: "Plus de devis oubliés. Les relances partent toutes seules.",
    accent: false,
  },
]

const steps = [
  { num: "1", title: "Décrivez", desc: "Dites ce que vous devez facturer au chat IA." },
  { num: "2", title: "L'IA génère", desc: "Le devis est créé avec TVA, mentions légales, tout." },
  { num: "3", title: "Envoyez", desc: "Le client reçoit le PDF par email en un clic." },
  { num: "4", title: "Facturez", desc: "Convertissez le devis en facture automatiquement." },
]

export default function Accueil() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-xl font-bold text-bleu">
            Quoti<span className="text-orange">Pro</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/connexion" className="text-sm font-medium text-gray-600 hover:text-bleu">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="bg-gradient-orange rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-hero relative overflow-hidden pt-28 pb-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="animate-fade-in">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-orange mb-6">
              Pour les artisans du BTP
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Vos devis créés par l&apos;IA en{" "}
              <span className="text-orange">30 secondes</span>
            </h1>
          </div>
          <p className="animate-fade-in-delay mt-6 text-lg text-gray-300 sm:text-xl">
            Sur le chantier, décrivez simplement. L&apos;IA génère le devis, calcule la TVA et l&apos;envoie pour signature.
          </p>
          <div className="animate-fade-in-delay-2 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/inscription"
              className="bg-gradient-orange pulse-cta w-full rounded-full px-8 py-4 text-center text-lg font-bold text-white shadow-xl shadow-orange-500/30 sm:w-auto"
            >
              Essai gratuit (5 devis offerts)
            </Link>
            <Link
              href="#fonctionnement"
              className="w-full rounded-full border-2 border-white/20 px-8 py-4 text-center font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              Comment ça marche
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Sans engagement. Sans carte bancaire.
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-8 px-4 text-center">
          <div>
            <p className="text-2xl font-bold text-bleu">500+</p>
            <p className="text-xs text-gray-500">Artisans</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-bleu">10k+</p>
            <p className="text-xs text-gray-500">Devis créés</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-bleu">4.8/5</p>
            <p className="text-xs text-gray-500">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="bg-white py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold text-bleu sm:text-4xl">
            Du chantier à la facture.
          </h2>
          <p className="mt-3 text-center text-gray-500">En 4 étapes simples.</p>
          <div className="mt-14 flex flex-col gap-12">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${
                  s.num === "1" ? "bg-gradient-orange text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-400"
                }`}>
                  {s.num}
                </div>
                <h3 className="mt-4 text-xl font-bold text-bleu">{s.title}</h3>
                <p className="mt-2 max-w-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-bleu sm:text-4xl">
            Conçu pour le terrain
          </h2>
          <p className="mt-3 text-center text-gray-500">
            Plus besoin d&apos;attendre le retour au bureau.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`card-hover rounded-2xl p-6 ${
                  f.accent
                    ? "bg-gradient-hero text-white"
                    : "border border-gray-100 bg-white"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                  f.accent ? "bg-white/10" : "bg-orange-light"
                }`}>
                  {f.icon}
                </div>
                <h3 className={`mt-4 text-lg font-bold ${f.accent ? "text-white" : "text-bleu"}`}>
                  {f.title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${f.accent ? "text-gray-300" : "text-gray-500"}`}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold text-bleu sm:text-4xl">
            Un prix simple
          </h2>
          <p className="mt-3 text-center text-gray-500">
            Commencez gratuitement, évoluez quand vous êtes prêt.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Découverte</span>
              <h3 className="mt-2 text-2xl font-bold text-bleu">Gratuit</h3>
              <p className="mt-1 text-sm text-gray-500">5 devis/mois offerts</p>
              <div className="mt-2 text-4xl font-extrabold text-bleu">0€</div>
              <Link
                href="/inscription"
                className="mt-6 block rounded-full border-2 border-bleu py-3 text-center font-semibold text-bleu hover:bg-bleu hover:text-white transition"
              >
                Tester gratuitement
              </Link>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Chat IA</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> PDF professionnels</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Gestion clients</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> 5 devis / mois</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-orange bg-white p-8 shadow-xl shadow-orange-100">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-orange px-4 py-1 text-xs font-bold text-white">
                POPULAIRE
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange">Pro</span>
              <h3 className="mt-2 text-2xl font-bold text-bleu">Illimité</h3>
              <p className="mt-1 text-sm text-gray-500">Tout ce qu&apos;il faut</p>
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-bleu">29€</span>
                <span className="text-gray-400">/mois</span>
              </div>
              <Link
                href="/inscription"
                className="bg-gradient-orange mt-6 block rounded-full py-3 text-center font-semibold text-white shadow-lg shadow-orange-200"
              >
                Commencer maintenant
              </Link>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> <strong>Devis illimités</strong></li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Factures + PDF</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Envoi email auto</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Relances auto</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Chantiers & employés</li>
                <li className="flex items-center gap-2"><span className="text-orange">✓</span> Support prioritaire</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à gagner 5h par semaine ?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Fini les soirées paperasse. Essayez QuotiPro gratuitement.
          </p>
          <Link
            href="/inscription"
            className="bg-gradient-orange pulse-cta mt-8 inline-block rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/30"
          >
            Essai gratuit (5 devis offerts)
          </Link>
          <p className="mt-4 text-sm text-gray-400">Sans engagement. Sans carte bancaire.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-lg font-bold text-bleu">Quoti<span className="text-orange">Pro</span></span>
          <p className="mt-2 text-sm text-gray-400">L&apos;assistant IA des artisans du BTP</p>
          <p className="mt-4 text-xs text-gray-300">© 2024 QuotiPro. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
