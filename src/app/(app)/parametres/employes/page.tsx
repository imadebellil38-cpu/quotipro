import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listerEmployes } from '@/lib/db/employes'
import PageHeader from '@/components/ui/PageHeader'
import ListeVide from '@/components/ui/ListeVide'
import Link from 'next/link'

export default async function PageEmployes() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const employes = await listerEmployes(supabase, user.id)

  const roleLabels: Record<string, string> = {
    ouvrier: 'Ouvrier',
    etam: 'ETAM',
    cadre: 'Cadre',
  }

  const contratLabels: Record<string, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    interim: 'Intérim',
  }

  return (
    <div className="flex flex-col">
      <Link href="/parametres" className="px-4 pt-4 text-sm text-gray-500">&larr; Retour</Link>
      <PageHeader titre="Mes employés" actionLabel="+ Ajouter" actionHref="/parametres/employes/nouveau" />

      {employes.length === 0 ? (
        <ListeVide
          message="Aucun employé enregistré"
          actionLabel="Ajouter un employé"
          actionHref="/parametres/employes/nouveau"
        />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {employes.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-bleu">{e.first_name} {e.last_name}</span>
                <span className="text-xs text-gray-500">
                  {roleLabels[e.role] || e.role} — {contratLabels[e.contract_type] || e.contract_type}
                </span>
                {e.email && <span className="text-xs text-gray-400">{e.email}</span>}
              </div>
              <div className="flex flex-col items-end gap-1">
                {e.hourly_rate && (
                  <span className="text-sm font-medium text-bleu">{e.hourly_rate}€/h</span>
                )}
                {e.start_date && (
                  <span className="text-xs text-gray-400">
                    Depuis {new Date(e.start_date).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
