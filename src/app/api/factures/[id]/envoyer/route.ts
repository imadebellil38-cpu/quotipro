import { creerClientServeur } from '@/lib/supabase/server'
import { getFacture, modifierStatutFacture } from '@/lib/db/factures'
import { getProfile } from '@/lib/db/profile'
import { renderToBuffer } from '@react-pdf/renderer'
import { FactureDocument } from '@/lib/pdf/facture-template'
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
    const [facture, profile] = await Promise.all([
      getFacture(supabase, id),
      getProfile(supabase, user.id),
    ])

    if (!facture.clients?.email) {
      return Response.json({ error: 'Le client n\'a pas d\'adresse email' }, { status: 400 })
    }

    // Générer le PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(FactureDocument, { facture, profile }) as any
    )

    // Envoyer l'email
    const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    await envoyerEmail({
      to: facture.clients.email,
      subject: `Facture ${facture.reference} — ${profile.company_name}`,
      html: `
        <h2>Facture ${facture.reference}</h2>
        <p>Bonjour ${facture.clients.name},</p>
        <p>Veuillez trouver ci-joint la facture <strong>${facture.reference}</strong> pour un montant de <strong>${fmt.format(facture.total_ttc)} TTC</strong>.</p>
        ${facture.due_date ? `<p>Échéance : ${new Date(facture.due_date).toLocaleDateString('fr-FR')}</p>` : ''}
        <br>
        <p>Cordialement,<br>${profile.company_name}<br>${profile.phone || ''}</p>
      `,
      pdfBuffer: Buffer.from(buffer),
      pdfFilename: `${facture.reference}.pdf`,
    })

    // Mettre à jour le statut
    await modifierStatutFacture(supabase, id, 'envoyee')

    return Response.json({ success: true })
  } catch (error) {
    console.error('Erreur envoi facture:', error)
    return Response.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
  }
}
