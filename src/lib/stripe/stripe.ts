import Stripe from 'stripe'

export function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })
}

export const plans = {
  free: { name: 'Gratuit', price: 0, devisParMois: 5, priceId: null },
  pro: { name: 'Pro', price: 29, devisParMois: -1, priceId: process.env.STRIPE_PRICE_PRO },
  business: { name: 'Business', price: 59, devisParMois: -1, priceId: process.env.STRIPE_PRICE_BUSINESS },
  premium: { name: 'Premium', price: 99, devisParMois: -1, priceId: process.env.STRIPE_PRICE_PREMIUM },
} as const
