import { createClient } from '@supabase/supabase-js'
import { envoyerEmail } from '@/lib/email/resend'

// Client admin pour le cron (pas de session utilisateur)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: Request) {
  // Vérifier le token secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const now = new Date().toISOString()
  const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

  // Récupérer les relances à envoyer
  const { data: relances, error } = await supabase
    .from('relances')
    .select('*, devis(reference, total_ttc, clients(name, email)), factures(reference, total_ttc, clients(name, email)), profiles(company_name, phone, email)')
    .is('sent_at', null)
    .lte('scheduled_at', now)
    .limit(50)

  if (error) {
    console.error('Erreur récupération relances:', error)
    return Response.json({ error: 'Erreur BDD' }, { status: 500 })
  }

  let envoyees = 0
  let erreurs = 0

  for (const relance of relances || []) {
    try {
      let to: string | null = null
      let subject = ''
      let html = ''
      const profile = relance.profiles as { company_name: string; phone: string | null; email: string | null } | null

      if (relance.type === 'devis' && relance.devis) {
        const devis = relance.devis as { reference: string; total_ttc: number; clients: { name: string; email: string | null } | null }
        to = devis.clients?.email || null
        subject = `Relance — Devis ${devis.reference}`
        html = `
          <p>Bonjour ${devis.clients?.name || ''},</p>
          <p>Je me permets de revenir vers vous concernant le devis <strong>${devis.reference}</strong> d'un montant de <strong>${fmt.format(devis.total_ttc)} TTC</strong>.</p>
          <p>Ce devis est toujours valable. N'hésitez pas à me contacter pour en discuter.</p>
          <br>
          <p>Cordialement,<br>${profile?.company_name || ''}<br>${profile?.phone || ''}</p>
        `
      } else if (relance.type === 'impaye' && relance.factures) {
        const facture = relance.factures as { reference: string; total_ttc: number; clients: { name: string; email: string | null } | null }
        to = facture.clients?.email || null
        subject = `Relance — Facture ${facture.reference} en attente de paiement`
        html = `
          <p>Bonjour ${facture.clients?.name || ''},</p>
          <p>Sauf erreur de notre part, la facture <strong>${facture.reference}</strong> d'un montant de <strong>${fmt.format(facture.total_ttc)} TTC</strong> reste impayée.</p>
          <p>Merci de procéder au règlement dans les meilleurs délais.</p>
          <br>
          <p>Cordialement,<br>${profile?.company_name || ''}<br>${profile?.phone || ''}</p>
        `
      }

      if (to) {
        await envoyerEmail({ to, subject, html })
        await supabase
          .from('relances')
          .update({ sent_at: now })
          .eq('id', relance.id)
        envoyees++
      }
    } catch (err) {
      console.error(`Erreur relance ${relance.id}:`, err)
      erreurs++
    }
  }

  return Response.json({
    total: relances?.length || 0,
    envoyees,
    erreurs,
  })
}
