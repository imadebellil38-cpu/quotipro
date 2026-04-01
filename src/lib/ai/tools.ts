import type Anthropic from '@anthropic-ai/sdk'

export const outils: Anthropic.Tool[] = [
  {
    name: 'creer_client',
    description: "Créer un nouveau client. Utilise cet outil quand l'artisan mentionne un nouveau client.",
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Nom du client' },
        email: { type: 'string', description: 'Email du client' },
        phone: { type: 'string', description: 'Téléphone du client' },
        address: { type: 'string', description: 'Adresse du client' },
        city: { type: 'string', description: 'Ville du client' },
        postal_code: { type: 'string', description: 'Code postal du client' },
        type: { type: 'string', enum: ['particulier', 'professionnel'], description: 'Type de client' },
      },
      required: ['name'],
    },
  },
  {
    name: 'lister_clients',
    description: "Lister les clients de l'artisan. Utilise quand il demande la liste de ses clients.",
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'creer_devis',
    description: "Créer un nouveau devis. Assure-toi d'avoir toutes les lignes de prestations avant d'appeler cet outil.",
    input_schema: {
      type: 'object' as const,
      properties: {
        client_id: { type: 'string', description: 'ID du client (optionnel)' },
        objet: { type: 'string', description: 'Objet du devis (ex: Rénovation salle de bain)' },
        lieu_chantier: { type: 'string', description: 'Adresse du chantier' },
        lignes: {
          type: 'array',
          description: 'Lignes de prestations du devis',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Description de la prestation' },
              quantity: { type: 'number', description: 'Quantité' },
              unit: { type: 'string', enum: ['h', 'forfait', 'm2', 'm', 'piece', 'kg', 'lot'], description: 'Unité' },
              unit_price: { type: 'number', description: 'Prix unitaire HT' },
              tva_rate: { type: 'number', description: 'Taux TVA (10 ou 20)', default: 20 },
            },
            required: ['description', 'quantity', 'unit_price'],
          },
        },
      },
      required: ['objet', 'lignes'],
    },
  },
  {
    name: 'lister_devis',
    description: "Lister les devis de l'artisan, optionnellement filtrés par statut.",
    input_schema: {
      type: 'object' as const,
      properties: {
        statut: { type: 'string', enum: ['brouillon', 'envoye', 'vu', 'accepte', 'refuse'], description: 'Filtrer par statut' },
      },
    },
  },
  {
    name: 'creer_facture',
    description: "Créer une facture à partir d'un devis accepté.",
    input_schema: {
      type: 'object' as const,
      properties: {
        devis_id: { type: 'string', description: 'ID du devis à facturer' },
        type: { type: 'string', enum: ['acompte', 'situation', 'solde', 'finale'], description: 'Type de facture' },
      },
      required: ['devis_id'],
    },
  },
  {
    name: 'lister_factures',
    description: "Lister les factures de l'artisan.",
    input_schema: {
      type: 'object' as const,
      properties: {
        statut: { type: 'string', enum: ['emise', 'envoyee', 'payee', 'impayee'], description: 'Filtrer par statut' },
      },
    },
  },
  {
    name: 'marquer_facture_payee',
    description: "Marquer une facture comme payée.",
    input_schema: {
      type: 'object' as const,
      properties: {
        facture_id: { type: 'string', description: 'ID de la facture' },
      },
      required: ['facture_id'],
    },
  },
  {
    name: 'creer_chantier',
    description: "Créer un nouveau chantier.",
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Nom du chantier' },
        client_id: { type: 'string', description: 'ID du client' },
        address: { type: 'string', description: 'Adresse du chantier' },
        start_date: { type: 'string', description: 'Date de début (YYYY-MM-DD)' },
        estimated_hours: { type: 'number', description: 'Heures estimées' },
        estimated_amount: { type: 'number', description: 'Montant estimé' },
      },
      required: ['name'],
    },
  },
  {
    name: 'lister_chantiers',
    description: "Lister les chantiers de l'artisan.",
    input_schema: {
      type: 'object' as const,
      properties: {
        statut: { type: 'string', enum: ['en_cours', 'termine', 'en_pause'], description: 'Filtrer par statut' },
      },
    },
  },
  {
    name: 'tableau_de_bord',
    description: "Afficher un résumé de l'activité : CA, devis en attente, factures impayées, chantiers en cours.",
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
]
