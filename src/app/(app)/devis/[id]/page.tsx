import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDevis } from '@/lib/db/devis'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageDetailDevis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  let devis
  try {
    devis = await getDevis(supabase, id)
  } catch {
    redirect('/devis')
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/devis" className="text-sm text-gray-500">&larr; Retour aux devis</Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-bleu">{devis.reference}</h1>
          {devis.objet && <p className="text-sm text-gray-500">{devis.objet}</p>}
        </div>
        <Badge statut={devis.status} />
      </div>

      {devis.clients && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Client</h2>
          <p className="font-medium text-bleu">{devis.clients.name}</p>
          {devis.clients.email && <p className="text-sm text-gray-500">{devis.clients.email}</p>}
          {devis.clients.phone && <p className="text-sm text-gray-500">{devis.clients.phone}</p>}
          {devis.clients.address && (
            <p className="text-sm text-gray-500">
              {devis.clients.address}{devis.clients.postal_code ? `, ${devis.clients.postal_code}` : ''} {devis.clients.city || ''}
            </p>
          )}
        </div>
      )}

      {devis.devis_lignes.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase text-gray-400">Prestations</h2>
          <div className="flex flex-col gap-2">
            {devis.devis_lignes
              .sort((a, b) => a.order_index - b.order_index)
              .map((l) => (
                <div key={l.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm text-bleu">{l.description}</span>
                    <span className="text-xs text-gray-400">
                      {l.quantity} {l.unit} x <Montant valeur={l.unit_price} className="text-xs" />
                    </span>
                  </div>
                  <Montant valeur={l.total} className="text-sm font-medium text-bleu" />
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total HT</span>
            <Montant valeur={devis.total_ht} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA</span>
            <Montant valeur={devis.tva_amount} />
          </div>
          <div className="flex justify-between border-t pt-1 text-base font-bold">
            <span className="text-bleu">Total TTC</span>
            <Montant valeur={devis.total_ttc} className="text-orange" />
          </div>
        </div>
      </div>

      {devis.valid_until && (
        <p className="text-center text-xs text-gray-400">
          Valide jusqu&apos;au {new Date(devis.valid_until).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  )
}
