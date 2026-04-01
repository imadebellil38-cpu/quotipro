import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuotiPro — L'assistant IA des artisans BTP",
  description: "Devis, factures, chantiers — tout par conversation. L'IA qui gère ton administratif.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
