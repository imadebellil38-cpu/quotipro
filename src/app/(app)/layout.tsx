import { creerClientServeur } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NavMobile from "@/components/layout/NavMobile"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  return (
    <div className="flex min-h-screen flex-col pb-16">
      <main className="flex-1">{children}</main>
      <NavMobile />
    </div>
  )
}
