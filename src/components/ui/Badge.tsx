const couleurs: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-600',
  envoye: 'bg-blue-50 text-blue-600',
  vu: 'bg-purple-50 text-purple-600',
  accepte: 'bg-green-50 text-green-600',
  refuse: 'bg-red-50 text-red-600',
  emise: 'bg-gray-100 text-gray-600',
  envoyee: 'bg-blue-50 text-blue-600',
  payee: 'bg-green-50 text-green-600',
  impayee: 'bg-red-50 text-red-600',
  en_cours: 'bg-blue-50 text-blue-600',
  termine: 'bg-green-50 text-green-600',
  en_pause: 'bg-amber-50 text-amber-600',
}

const labels: Record<string, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  vu: 'Vu',
  accepte: 'Accepté',
  refuse: 'Refusé',
  emise: 'Émise',
  envoyee: 'Envoyée',
  payee: 'Payée',
  impayee: 'Impayée',
  en_cours: 'En cours',
  termine: 'Terminé',
  en_pause: 'En pause',
}

export default function Badge({ statut }: { statut: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${couleurs[statut] || 'bg-gray-100 text-gray-600'}`}>
      {labels[statut] || statut}
    </span>
  )
}
