import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getChantier } from '@/lib/db/chantiers'
import Badge from '@/components/ui/Badge'
import Montant from '@/components/ui/Montant'
import Link from 'next/link'

export default async function PageDetailChantier({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  let chantier
  try {
    chantier = await getChantier(supabase, id)
  } catch {
    redirect('/chantiers')
  }

  const progression = chantier.estimated_hours
    ? Math.min(100, Math.round((chantier.actual_hours / chantier.estimated_hours) * 100))
    : null

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/chantiers" className="text-sm text-gray-500">&larr; Retour aux chantiers</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-bleu">{chantier.name}</h1>
        <Badge statut={chantier.status} />
      </div>

      {chantier.clients && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Client</h2>
          <p className="font-medium text-bleu">{chantier.clients.name}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase text-gray-400">Suivi</h2>
        <div className="flex flex-col gap-2 text-sm">
          {chantier.address && (
            <div className="flex justify-between">
              <span className="text-gray-500">Adresse</span>
              <span>{chantier.address}</span>
            </div>
          )}
          {chantier.start_date && (
            <div className="flex justify-between">
              <span className="text-gray-500">Début</span>
              <span>{new Date(chantier.start_date).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
          {chantier.end_date && (
            <div className="flex justify-between">
              <span className="text-gray-500">Fin prévue</span>
              <span>{new Date(chantier.end_date).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Heures</span>
            <span>{chantier.actual_hours}h{chantier.estimated_hours ? ` / ${chantier.estimated_hours}h` : ''}</span>
          </div>
          {progression !== null && (
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-400">Progression</span>
                <span className="font-medium">{progression}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-orange"
                  style={{ width: `${progression}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase text-gray-400">Budget</h2>
        <div className="flex flex-col gap-1 text-sm">
          {chantier.estimated_amount && (
            <div className="flex justify-between">
              <span className="text-gray-500">Estimé</span>
              <Montant valeur={chantier.estimated_amount} />
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span className="text-gray-500">Réalisé</span>
            <Montant valeur={chantier.actual_amount} className="text-orange" />
          </div>
        </div>
      </div>

      {chantier.notes && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{chantier.notes}</p>
        </div>
      )}
    </div>
  )
}
