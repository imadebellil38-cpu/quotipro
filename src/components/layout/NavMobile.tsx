"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const liens = [
  { href: "/chat", label: "Chat", icone: "💬" },
  { href: "/devis", label: "Devis", icone: "📄" },
  { href: "/factures", label: "Factures", icone: "🧾" },
  { href: "/chantiers", label: "Chantiers", icone: "🏗" },
  { href: "/parametres", label: "Profil", icone: "⚙" },
]

export default function NavMobile() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="flex justify-around">
        {liens.map((lien) => {
          const actif = pathname.startsWith(lien.href)
          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs transition ${
                actif ? "text-orange" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{lien.icone}</span>
              <span className="mt-0.5">{lien.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
