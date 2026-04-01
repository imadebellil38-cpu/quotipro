import { creerClientServeur } from '@/lib/supabase/server'
import { getStripeClient, plans } from '@/lib/stripe/stripe'
import type { Plan } from '@/types'

export async function POST(request: Request) {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { plan } = await request.json() as { plan: Plan }
  const planConfig = plans[plan]

  if (!planConfig?.priceId) {
    return Response.json({ error: 'Plan invalide' }, { status: 400 })
  }

  const stripe = getStripeClient()

  // Vérifier si l'utilisateur a déjà un customer Stripe
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email || user.email,
      metadata: { profile_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/parametres?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/abonnement`,
    metadata: { profile_id: user.id, plan },
  })

  return Response.json({ url: session.url })
}
