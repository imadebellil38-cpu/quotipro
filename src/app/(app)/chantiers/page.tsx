import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listerChantiers } from '@/lib/db/chantiers'
import PageHeader from '@/components/ui/PageHeader'
import ListeVide from '@/components/ui/ListeVide'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageChantiers() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const chantiers = await listerChantiers(supabase, user.id)

  return (
    <div className="flex flex-col">
      <PageHeader titre="Mes chantiers" actionLabel="+ Nouveau" actionHref="/chantiers/nouveau" />

      {chantiers.length === 0 ? (
        <ListeVide
          message="Aucun chantier pour le moment"
          actionLabel="Créer mon premier chantier"
          actionHref="/chantiers/nouveau"
        />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {chantiers.map((c) => (
            <Link
              key={c.id}
              href={`/chantiers/${c.id}`}
              className="card-hover flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-bleu">{c.name}</span>
                <span className="text-xs text-gray-400">{c.clients?.name || 'Sans client'}</span>
                {c.address && <span className="text-xs text-gray-300">{c.address}</span>}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {c.estimated_amount && (
                  <Montant valeur={c.estimated_amount} className="text-sm font-extrabold text-bleu" />
                )}
                <Badge statut={c.status} />
                {c.actual_hours > 0 && (
                  <span className="text-xs text-gray-300">{c.actual_hours}h</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
