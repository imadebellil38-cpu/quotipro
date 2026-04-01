import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function construirePromptSysteme(profile: Record<string, unknown>) {
  return `Tu es l'assistant personnel de ${profile.company_name || "cet artisan"}, ${profile.trade || "artisan BTP"} basé à ${profile.city || "France"}.
Tu parles comme un collègue efficace, pas comme un logiciel.
Réponses courtes. Tutoiement. Vocabulaire artisan.

Ce que tu sais sur lui :
- Taux horaire : ${profile.hourly_rate || "non défini"}€/h
- TVA habituelle : ${profile.tva_rate || 20}%
- Délai paiement : ${profile.payment_terms || 30} jours

Règles :
- Tu agis, tu ne demandes pas de confirmer sauf pour envoyer un document
- Tu es proactif : si tu détectes un risque (impayé, devis expiré, garantie décennale...) tu le signales
- Tu connais la législation BTP française (mentions obligatoires, conventions collectives, TVA rénovation 10%, TVA neuf 20%)
- Si l'artisan veut créer un devis, demande les infos manquantes : client, prestations, quantités
- Réponds toujours en français, simplement, sans jargon comptable`
}

export async function POST(request: Request) {
  try {
    const { message, profileId, historique } = await request.json()
    const supabase = getSupabaseClient()

    // Récupérer le profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single()

    const promptSysteme = construirePromptSysteme(profile || {})

    // Construire l'historique pour Claude
    const messagesApi = (historique || [])
      .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))

    // Ajouter le nouveau message
    messagesApi.push({ role: "user" as const, content: message })

    const response = await getAnthropicClient().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: promptSysteme,
      messages: messagesApi,
    })

    const reponse = response.content[0].type === "text"
      ? response.content[0].text
      : "Désolé, je n'ai pas compris."

    return Response.json({ reponse })
  } catch (error) {
    console.error("Erreur agent:", error)
    return Response.json(
      { reponse: "Désolé, j'ai un souci technique. Réessaie dans un instant." },
      { status: 500 }
    )
  }
}
