import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/db/profile'
import FormulaireProfile from '@/components/parametres/FormulaireProfile'
import Link from 'next/link'

export default async function PageParametres() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const profile = await getProfile(supabase, user.id)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold text-bleu">Mon profil</h1>

      <div className="flex gap-3">
        <Link
          href="/parametres/employes"
          className="flex-1 rounded-xl border border-gray-100 bg-white p-4 text-center text-sm font-medium text-bleu shadow-sm"
        >
          Mes employés
        </Link>
        <Link
          href="/abonnement"
          className="flex-1 rounded-xl border border-orange bg-orange/5 p-4 text-center text-sm font-medium text-orange shadow-sm"
        >
          Mon abonnement
        </Link>
      </div>

      <FormulaireProfile profile={profile} />
    </div>
  )
}
