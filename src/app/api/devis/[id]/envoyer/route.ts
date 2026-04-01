import { creerClientServeur } from '@/lib/supabase/server'
import { getDevis, modifierStatutDevis } from '@/lib/db/devis'
import { getProfile } from '@/lib/db/profile'
import { renderToBuffer } from '@react-pdf/renderer'
import { DevisDocument } from '@/lib/pdf/devis-template'
import { envoyerEmail } from '@/lib/email/resend'
import React from 'react'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const [devis, profile] = await Promise.all([
      getDevis(supabase, id),
      getProfile(supabase, user.id),
    ])

    if (!devis.clients?.email) {
      return Response.json({ error: 'Le client n\'a pas d\'adresse email' }, { status: 400 })
    }

    // Générer le PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(DevisDocument, { devis, profile }) as any
    )

    // Envoyer l'email
    const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    await envoyerEmail({
      to: devis.clients.email,
      subject: `Devis ${devis.reference} — ${profile.company_name}`,
      html: `
        <h2>Devis ${devis.reference}</h2>
        <p>Bonjour ${devis.clients.name},</p>
        <p>Veuillez trouver ci-joint le devis <strong>${devis.reference}</strong> pour un montant de <strong>${fmt.format(devis.total_ttc)} TTC</strong>.</p>
        ${devis.objet ? `<p>Objet : ${devis.objet}</p>` : ''}
        <p>Ce devis est valable 30 jours.</p>
        <br>
        <p>Cordialement,<br>${profile.company_name}<br>${profile.phone || ''}</p>
      `,
      pdfBuffer: Buffer.from(buffer),
      pdfFilename: `${devis.reference}.pdf`,
    })

    // Mettre à jour le statut
    await modifierStatutDevis(supabase, id, 'envoye')

    return Response.json({ success: true })
  } catch (error) {
    console.error('Erreur envoi devis:', error)
    return Response.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
  }
}
