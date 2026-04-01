import { creerClientServeur } from '@/lib/supabase/server'
import { getFacture } from '@/lib/db/factures'
import { getProfile } from '@/lib/db/profile'
import { renderToBuffer } from '@react-pdf/renderer'
import { FactureDocument } from '@/lib/pdf/facture-template'
import React from 'react'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(FactureDocument, { facture, profile }) as any
    )

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${facture.reference}.pdf"`,
      },
    })
  } catch {
    return Response.json({ error: 'Facture introuvable' }, { status: 404 })
  }
}
