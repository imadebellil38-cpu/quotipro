import { creerClientServeur } from '@/lib/supabase/server'
import { getDevis } from '@/lib/db/devis'
import { getProfile } from '@/lib/db/profile'
import { renderToBuffer } from '@react-pdf/renderer'
import { DevisDocument } from '@/lib/pdf/devis-template'
import React from 'react'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(DevisDocument, { devis, profile }) as any
    )

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${devis.reference}.pdf"`,
      },
    })
  } catch {
    return Response.json({ error: 'Devis introuvable' }, { status: 404 })
  }
}
