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
      <h1 className="text-2xl font-extrabold text-bleu">Mon profil</h1>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/parametres/employes"
          className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">👷</div>
          <span className="text-sm font-bold text-bleu">Mes employés</span>
        </Link>
        <Link
          href="/abonnement"
          className="card-hover flex flex-col items-center gap-2 rounded-2xl border-2 border-orange bg-orange-light p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-xl">⭐</div>
          <span className="text-sm font-bold text-orange">Mon abonnement</span>
        </Link>
      </div>

      <FormulaireProfile profile={profile} />
    </div>
  )
}
