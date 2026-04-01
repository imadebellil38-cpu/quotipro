const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export default function Montant({ valeur, className }: { valeur: number; className?: string }) {
  return <span className={className}>{fmt.format(valeur)}</span>
}
