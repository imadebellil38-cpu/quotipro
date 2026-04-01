import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listerDevis } from '@/lib/db/devis'
import PageHeader from '@/components/ui/PageHeader'
import ListeVide from '@/components/ui/ListeVide'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageDevis() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const devis = await listerDevis(supabase, user.id)

  return (
    <div className="flex flex-col">
      <PageHeader titre="Mes devis" actionLabel="+ Nouveau" actionHref="/devis/nouveau" />

      {devis.length === 0 ? (
        <ListeVide
          message="Aucun devis pour le moment"
          actionLabel="Créer mon premier devis"
          actionHref="/devis/nouveau"
        />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {devis.map((d) => (
            <Link
              key={d.id}
              href={`/devis/${d.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-bleu">{d.reference}</span>
                <span className="text-xs text-gray-500">
                  {d.clients?.name || 'Sans client'} {d.objet ? `— ${d.objet}` : ''}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Montant valeur={d.total_ttc} className="text-sm font-bold text-bleu" />
                <Badge statut={d.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
