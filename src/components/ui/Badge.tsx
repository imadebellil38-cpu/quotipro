const couleurs: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-700',
  envoye: 'bg-blue-100 text-blue-700',
  vu: 'bg-purple-100 text-purple-700',
  accepte: 'bg-green-100 text-green-700',
  refuse: 'bg-red-100 text-red-700',
  emise: 'bg-gray-100 text-gray-700',
  envoyee: 'bg-blue-100 text-blue-700',
  payee: 'bg-green-100 text-green-700',
  impayee: 'bg-red-100 text-red-700',
  en_cours: 'bg-blue-100 text-blue-700',
  termine: 'bg-green-100 text-green-700',
  en_pause: 'bg-yellow-100 text-yellow-700',
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
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${couleurs[statut] || 'bg-gray-100 text-gray-700'}`}>
      {labels[statut] || statut}
    </span>
  )
}
