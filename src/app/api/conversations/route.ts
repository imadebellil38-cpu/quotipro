import { creerClientServeur } from '@/lib/supabase/server'
import { getOuCreerConversation, listerMessages } from '@/lib/db/conversations'

export async function GET() {
  try {
    const supabase = await creerClientServeur()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const conversation = await getOuCreerConversation(supabase, user.id)
    const messages = await listerMessages(supabase, conversation.id)

    return Response.json({
      conversationId: conversation.id,
      messages,
    })
  } catch (error) {
    console.error('Erreur conversations:', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
