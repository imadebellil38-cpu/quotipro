import { creerClientServeur } from '@/lib/supabase/server'
import { getStripeClient } from '@/lib/stripe/stripe'

export async function POST() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return Response.json({ error: 'Pas de compte Stripe' }, { status: 400 })
  }

  const stripe = getStripeClient()
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/parametres`,
  })

  return Response.json({ url: session.url })
}
