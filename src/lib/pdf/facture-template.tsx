import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles } from './styles'
import type { Profile } from '@/types'
import type { FactureAvecClient } from '@/lib/db/factures'

const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
const dateFR = (d: string) => new Date(d).toLocaleDateString('fr-FR')

const typeLabels: Record<string, string> = {
  acompte: 'Acompte',
  situation: 'Situation',
  solde: 'Solde',
  finale: 'Finale',
}

export function FactureDocument({ facture, profile }: { facture: FactureAvecClient; profile: Profile }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.entreprise}>
            <Text style={styles.entrepriseNom}>{profile.company_name}</Text>
            <Text style={styles.entrepriseInfo}>{profile.trade}</Text>
            {profile.address && <Text style={styles.entrepriseInfo}>{profile.address}</Text>}
            {profile.city && <Text style={styles.entrepriseInfo}>{profile.postal_code} {profile.city}</Text>}
            {profile.phone && <Text style={styles.entrepriseInfo}>Tél : {profile.phone}</Text>}
            {profile.email && <Text style={styles.entrepriseInfo}>{profile.email}</Text>}
            {profile.siret && <Text style={styles.entrepriseInfo}>SIRET : {profile.siret}</Text>}
            {profile.tva_number && <Text style={styles.entrepriseInfo}>TVA : {profile.tva_number}</Text>}
          </View>
          <View>
            <Text style={styles.documentTitre}>FACTURE</Text>
            <Text style={styles.documentRef}>N° {facture.reference}</Text>
            <Text style={styles.documentRef}>Type : {typeLabels[facture.type] || facture.type}</Text>
            <Text style={styles.documentRef}>Date : {dateFR(facture.issued_at)}</Text>
            {facture.due_date && <Text style={styles.documentRef}>Échéance : {dateFR(facture.due_date)}</Text>}
          </View>
        </View>

        {/* Client */}
        {facture.clients && (
          <>
            <Text style={styles.sectionTitre}>Client</Text>
            <View style={styles.clientBox}>
              <Text style={styles.clientNom}>{facture.clients.name}</Text>
              {facture.clients.email && <Text style={styles.clientInfo}>{facture.clients.email}</Text>}
            </View>
          </>
        )}

        {/* Montants */}
        <Text style={styles.sectionTitre}>Détail</Text>
        <View style={styles.totaux}>
          <View style={styles.totauxLigne}>
            <Text>Total HT</Text>
            <Text>{fmt(facture.total_ht)}</Text>
          </View>
          <View style={styles.totauxLigne}>
            <Text>TVA</Text>
            <Text>{fmt(facture.tva_amount)}</Text>
          </View>
          <View style={styles.totauxTTC}>
            <Text>Total TTC</Text>
            <Text>{fmt(facture.total_ttc)}</Text>
          </View>
        </View>

        {/* Conditions de paiement */}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitre}>Conditions de paiement</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>
            Paiement à {profile.payment_terms} jours à compter de la date de facture.
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>
            Mode de paiement : virement bancaire, chèque ou espèces.
          </Text>
        </View>

        {/* Mentions légales */}
        <View style={styles.mentions}>
          <Text>En cas de retard de paiement, une pénalité de retard sera appliquée au taux de la BCE majoré de 10 points.</Text>
          <Text>Indemnité forfaitaire pour frais de recouvrement : 40,00 €</Text>
          <Text>Pas d&apos;escompte pour paiement anticipé.</Text>
          {profile.decennale_number && (
            <Text>Assurance décennale n° {profile.decennale_number}</Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {profile.company_name} — SIRET {profile.siret || 'N/A'} — {profile.address ? `${profile.address}, ` : ''}{profile.postal_code} {profile.city}
        </Text>
      </Page>
    </Document>
  )
}
