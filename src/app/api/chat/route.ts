import Anthropic from '@anthropic-ai/sdk'
import { creerClientServeur } from '@/lib/supabase/server'
import { getProfile } from '@/lib/db/profile'
import { construirePromptSysteme } from '@/lib/ai/prompt-systeme'
import { outils } from '@/lib/ai/tools'
import { executerTool } from '@/lib/ai/handlers'
import { getOuCreerConversation, listerMessages, ajouterMessage } from '@/lib/db/conversations'

const MAX_TOOL_ITERATIONS = 8

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(request: Request) {
  try {
    const { message, conversationId: clientConvId } = await request.json()

    // Auth côté serveur — on ne fait plus confiance au profileId du client
    const supabase = await creerClientServeur()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ reponse: 'Non authentifié.' }, { status: 401 })
    }

    const profileId = user.id
    const profile = await getProfile(supabase, profileId)
    const promptSysteme = construirePromptSysteme(profile)

    // Persistance : récupérer ou créer la conversation
    let conversation
    if (clientConvId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', clientConvId)
        .eq('profile_id', profileId)
        .single()
      conversation = data
    }
    if (!conversation) {
      conversation = await getOuCreerConversation(supabase, profileId)
    }

    // Sauvegarder le message utilisateur
    await ajouterMessage(supabase, conversation.id, 'user', message)

    // Charger l'historique depuis la BDD
    const historiqueBDD = await listerMessages(supabase, conversation.id, 20)

    // Construire les messages pour Claude (sans le message de bienvenue hardcodé)
    const messagesApi: Anthropic.MessageParam[] = historiqueBDD
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // Appel Claude avec tool use
    const anthropic = getAnthropicClient()
    let toolMetadata: Record<string, unknown> = {}
    let iterations = 0

    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: promptSysteme,
      tools: outils,
      messages: messagesApi,
    })

    // Boucle tool use : exécuter les tools et renvoyer les résultats à Claude
    while (response.stop_reason === 'tool_use' && iterations < MAX_TOOL_ITERATIONS) {
      iterations++

      const assistantContent = response.content
      const toolUseBlocks = assistantContent.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      )

      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const toolUse of toolUseBlocks) {
        try {
          const { result, metadata } = await executerTool(
            supabase,
            profileId,
            toolUse.name,
            toolUse.input as Record<string, unknown>
          )
          if (metadata) toolMetadata = { ...toolMetadata, ...metadata }
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          })
        } catch (err) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: `Erreur : ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
            is_error: true,
          })
        }
      }

      // Continuer la conversation avec les résultats des tools
      messagesApi.push({ role: 'assistant', content: assistantContent })
      messagesApi.push({ role: 'user', content: toolResults })

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: promptSysteme,
        tools: outils,
        messages: messagesApi,
      })
    }

    // Extraire la réponse texte finale
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    )
    const reponse = textBlocks.map(b => b.text).join('\n') || "Désolé, je n'ai pas compris."

    // Sauvegarder la réponse de l'assistant
    await ajouterMessage(supabase, conversation.id, 'assistant', reponse, toolMetadata)

    return Response.json({
      reponse,
      conversationId: conversation.id,
      metadata: Object.keys(toolMetadata).length > 0 ? toolMetadata : undefined,
    })
  } catch (error) {
    console.error('Erreur agent:', error)
    return Response.json(
      { reponse: "Désolé, j'ai un souci technique. Réessaie dans un instant." },
      { status: 500 }
    )
  }
}
