import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getFacture } from '@/lib/db/factures'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageDetailFacture({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  let facture
  try {
    facture = await getFacture(supabase, id)
  } catch {
    redirect('/factures')
  }

  const typeLabels: Record<string, string> = {
    acompte: 'Acompte',
    situation: 'Situation',
    solde: 'Solde',
    finale: 'Finale',
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/factures" className="text-sm text-gray-500">&larr; Retour aux factures</Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-bleu">{facture.reference}</h1>
          <p className="text-sm text-gray-500">{typeLabels[facture.type] || facture.type}</p>
        </div>
        <Badge statut={facture.status} />
      </div>

      {facture.clients && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Client</h2>
          <p className="font-medium text-bleu">{facture.clients.name}</p>
          {facture.clients.email && <p className="text-sm text-gray-500">{facture.clients.email}</p>}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total HT</span>
            <Montant valeur={facture.total_ht} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA</span>
            <Montant valeur={facture.tva_amount} />
          </div>
          <div className="flex justify-between border-t pt-1 text-base font-bold">
            <span className="text-bleu">Total TTC</span>
            <Montant valeur={facture.total_ttc} className="text-orange" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Émise le</span>
          <span>{new Date(facture.issued_at).toLocaleDateString('fr-FR')}</span>
        </div>
        {facture.due_date && (
          <div className="flex justify-between mt-1">
            <span className="text-gray-500">Échéance</span>
            <span>{new Date(facture.due_date).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
        {facture.paid_at && (
          <div className="flex justify-between mt-1">
            <span className="text-gray-500">Payée le</span>
            <span className="text-green-600 font-medium">{new Date(facture.paid_at).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
