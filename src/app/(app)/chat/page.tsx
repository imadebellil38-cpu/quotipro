import { creerClientServeur } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ChatInterface from "@/components/chat/ChatInterface"

export default async function PageChat() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/connexion")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile && !profile.onboarding_done) {
    redirect("/onboarding")
  }

  return <ChatInterface profileId={user.id} />
}
