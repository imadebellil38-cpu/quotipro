import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listerFactures } from '@/lib/db/factures'
import PageHeader from '@/components/ui/PageHeader'
import ListeVide from '@/components/ui/ListeVide'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageFactures() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const factures = await listerFactures(supabase, user.id)

  return (
    <div className="flex flex-col">
      <PageHeader titre="Mes factures" />

      {factures.length === 0 ? (
        <ListeVide message="Aucune facture pour le moment" />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {factures.map((f) => (
            <Link
              key={f.id}
              href={`/factures/${f.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-bleu">{f.reference}</span>
                <span className="text-xs text-gray-500">{f.clients?.name || 'Sans client'}</span>
                {f.due_date && (
                  <span className="text-xs text-gray-400">
                    Echéance : {new Date(f.due_date).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Montant valeur={f.total_ttc} className="text-sm font-bold text-bleu" />
                <Badge statut={f.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
