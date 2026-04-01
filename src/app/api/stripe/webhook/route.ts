import { getStripeClient } from '@/lib/stripe/stripe'
import { createClient } from '@supabase/supabase-js'

// Utiliser le client admin pour le webhook (pas de session utilisateur)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return Response.json({ error: 'Signature manquante' }, { status: 400 })
  }

  const stripe = getStripeClient()
  const supabase = getSupabaseAdmin()

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return Response.json({ error: 'Signature invalide' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const profileId = session.metadata?.profile_id
      const plan = session.metadata?.plan

      if (profileId && plan) {
        await supabase
          .from('profiles')
          .update({
            plan,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', profileId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      // Retrouver le profil par stripe_customer_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('id', profile.id)
      }
      break
    }
  }

  return Response.json({ received: true })
}
