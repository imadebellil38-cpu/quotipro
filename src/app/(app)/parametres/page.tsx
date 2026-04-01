import { creerClientServeur } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/db/profile'
import FormulaireProfile from '@/components/parametres/FormulaireProfile'

export default async function PageParametres() {
  const supabase = await creerClientServeur()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const profile = await getProfile(supabase, user.id)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold text-bleu">Mon profil</h1>
      <FormulaireProfile profile={profile} />
    </div>
  )
}
