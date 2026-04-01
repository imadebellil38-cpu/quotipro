import { SupabaseClient } from '@supabase/supabase-js'
import type { Conversation, Message } from '@/types'

export async function getOuCreerConversation(supabase: SupabaseClient, profileId: string) {
  // Récupérer la dernière conversation active
  const { data: existante } = await supabase
    .from('conversations')
    .select('*')
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (existante) return existante as Conversation

  // Créer une nouvelle conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({ profile_id: profileId, title: 'Nouvelle conversation' })
    .select()
    .single()

  if (error) throw error
  return data as Conversation
}

export async function creerConversation(supabase: SupabaseClient, profileId: string, title?: string) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ profile_id: profileId, title: title || 'Nouvelle conversation' })
    .select()
    .single()

  if (error) throw error
  return data as Conversation
}

export async function listerMessages(supabase: SupabaseClient, conversationId: string, limite = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limite)

  if (error) throw error
  return data as Message[]
}

export async function ajouterMessage(
  supabase: SupabaseClient,
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata: Record<string, unknown> = {}
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content, metadata })
    .select()
    .single()

  if (error) throw error

  // Mettre à jour updated_at de la conversation
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as Message
}

export async function majTitreConversation(supabase: SupabaseClient, id: string, title: string) {
  await supabase.from('conversations').update({ title }).eq('id', id)
}
