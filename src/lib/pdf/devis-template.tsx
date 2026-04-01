import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles } from './styles'
import type { Profile } from '@/types'
import type { DevisComplet } from '@/lib/db/devis'

const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
const dateFR = (d: string) => new Date(d).toLocaleDateString('fr-FR')

export function DevisDocument({ devis, profile }: { devis: DevisComplet; profile: Profile }) {
  const lignes = devis.devis_lignes.sort((a, b) => a.order_index - b.order_index)

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
            <Text style={styles.documentTitre}>DEVIS</Text>
            <Text style={styles.documentRef}>N° {devis.reference}</Text>
            <Text style={styles.documentRef}>Date : {dateFR(devis.created_at)}</Text>
            {devis.valid_until && <Text style={styles.documentRef}>Valide jusqu&apos;au : {dateFR(devis.valid_until)}</Text>}
          </View>
        </View>

        {/* Client */}
        {devis.clients && (
          <>
            <Text style={styles.sectionTitre}>Client</Text>
            <View style={styles.clientBox}>
              <Text style={styles.clientNom}>{devis.clients.name}</Text>
              {devis.clients.address && <Text style={styles.clientInfo}>{devis.clients.address}</Text>}
              {devis.clients.city && <Text style={styles.clientInfo}>{devis.clients.postal_code} {devis.clients.city}</Text>}
              {devis.clients.phone && <Text style={styles.clientInfo}>Tél : {devis.clients.phone}</Text>}
              {devis.clients.email && <Text style={styles.clientInfo}>{devis.clients.email}</Text>}
            </View>
          </>
        )}

        {/* Objet */}
        {devis.objet && (
          <>
            <Text style={styles.sectionTitre}>Objet</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>{devis.objet}</Text>
          </>
        )}
        {devis.lieu_chantier && (
          <Text style={{ fontSize: 9, color: '#666', marginBottom: 12 }}>Lieu : {devis.lieu_chantier}</Text>
        )}

        {/* Tableau prestations */}
        <Text style={styles.sectionTitre}>Prestations</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQte}>Qté</Text>
            <Text style={styles.colUnite}>Unité</Text>
            <Text style={styles.colPU}>PU HT</Text>
            <Text style={styles.colTVA}>TVA</Text>
            <Text style={styles.colTotal}>Total HT</Text>
          </View>
          {lignes.map((l, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{l.description}</Text>
              <Text style={styles.colQte}>{l.quantity}</Text>
              <Text style={styles.colUnite}>{l.unit}</Text>
              <Text style={styles.colPU}>{fmt(l.unit_price)}</Text>
              <Text style={styles.colTVA}>{l.tva_rate}%</Text>
              <Text style={styles.colTotal}>{fmt(l.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totaux}>
          <View style={styles.totauxLigne}>
            <Text>Total HT</Text>
            <Text>{fmt(devis.total_ht)}</Text>
          </View>
          <View style={styles.totauxLigne}>
            <Text>TVA</Text>
            <Text>{fmt(devis.tva_amount)}</Text>
          </View>
          <View style={styles.totauxTTC}>
            <Text>Total TTC</Text>
            <Text>{fmt(devis.total_ttc)}</Text>
          </View>
        </View>

        {/* Mentions légales */}
        <View style={styles.mentions}>
          <Text>Devis reçu avant l&apos;exécution des travaux. Durée de validité : 30 jours.</Text>
          <Text>Conditions de paiement : {profile.payment_terms} jours à compter de la date de facture.</Text>
          {profile.decennale_number && (
            <Text>Assurance décennale n° {profile.decennale_number}</Text>
          )}
          <Text style={{ marginTop: 4 }}>En cas de litige, le tribunal compétent sera celui du lieu de domicile du client particulier.</Text>
          <Text>Le client particulier dispose d&apos;un délai de rétractation de 14 jours à compter de la signature du devis.</Text>
        </View>

        {/* Signature */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
          <View>
            <Text style={{ fontSize: 8, color: '#666' }}>Bon pour accord,</Text>
            <Text style={{ fontSize: 8, color: '#666' }}>Date et signature du client :</Text>
            <View style={{ marginTop: 40, borderBottomWidth: 0.5, borderBottomColor: '#999', width: 200 }} />
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {profile.company_name} — SIRET {profile.siret || 'N/A'} — {profile.address ? `${profile.address}, ` : ''}{profile.postal_code} {profile.city}
        </Text>
      </Page>
    </Document>
  )
}
