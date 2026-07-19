export type ServiceDetail = {
  intro: string;
  features: string[];
  benefits: string[];
};

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  informatique: {
    intro:
      "Nous concevons, déployons et maintenons vos systèmes d'information : développement d'applications sur mesure, ERP/CRM, cybersécurité, réseaux et infogérance pour garantir la performance et la sécurité de votre infrastructure.",
    features: [
      "Développement web & applications métier",
      "Déploiement d'ERP et CRM",
      "Cybersécurité & audit de sécurité",
      "Réseaux, câblage & administration système",
      "Cloud, hébergement & infogérance 24/7",
      "Maintenance préventive et curative",
    ],
    benefits: [
      "Systèmes fiables et évolutifs",
      "Support réactif 24h/7j",
      "Réduction des coûts d'exploitation",
    ],
  },
  voyages: {
    intro:
      "Notre agence de voyages agréée prend en charge l'ensemble de vos déplacements professionnels et personnels : billetterie, visas, réservations et assistance de bout en bout.",
    features: [
      "Billetterie nationale & internationale",
      "Assistance visa et formalités",
      "Réservation d'hôtels et séjours",
      "Voyages d'affaires & groupes",
      "Assurance voyage",
      "Assistance 24/7 pendant le voyage",
    ],
    benefits: [
      "Meilleurs tarifs négociés",
      "Accompagnement personnalisé",
      "Sérénité à chaque étape",
    ],
  },
  "import-export": {
    intro:
      "Nous facilitons vos échanges internationaux : sourcing de fournisseurs, achats groupés, logistique, transit et dédouanement pour importer et exporter en toute sérénité.",
    features: [
      "Sourcing de fournisseurs fiables",
      "Négociation & achats internationaux",
      "Fret aérien et maritime",
      "Transit et dédouanement",
      "Suivi de commande & traçabilité",
      "Gestion documentaire complète",
    ],
    benefits: [
      "Délais maîtrisés",
      "Coûts optimisés",
      "Conformité douanière garantie",
    ],
  },
  imprimerie: {
    intro:
      "Un pôle imprimerie et communication visuelle complet pour tous vos supports : impression numérique et offset, grand format, PLV et objets publicitaires.",
    features: [
      "Cartes de visite, flyers, brochures",
      "Impression grand format & bâches",
      "Signalétique & PLV",
      "Objets publicitaires personnalisés",
      "Reliure & finition",
      "Design graphique inclus",
    ],
    benefits: [
      "Qualité professionnelle",
      "Délais rapides",
      "Conseil créatif",
    ],
  },
  immobilier: {
    intro:
      "Nous vous accompagnons dans tous vos projets immobiliers : achat, vente, location et investissement de terrains, maisons, appartements et bureaux.",
    features: [
      "Vente de terrains et bâtis",
      "Location résidentielle & professionnelle",
      "Gestion locative",
      "Conseil en investissement",
      "Estimation & expertise",
      "Accompagnement juridique",
    ],
    benefits: [
      "Portefeuille de biens vérifiés",
      "Transactions sécurisées",
      "Conseil patrimonial",
    ],
  },
  papeterie: {
    intro:
      "Fournitures de bureau, mobilier et équipements professionnels : nous équipons vos espaces de travail avec un catalogue complet et un service de livraison rapide.",
    features: [
      "Fournitures et consommables de bureau",
      "Mobilier professionnel",
      "Équipements informatiques",
      "Commandes récurrentes pour entreprises",
      "Livraison rapide",
      "Devis en gros volume",
    ],
    benefits: [
      "Catalogue étendu",
      "Tarifs entreprises",
      "Réapprovisionnement simplifié",
    ],
  },
  conseil: {
    intro:
      "Notre pôle conseil accompagne la création, la structuration et la croissance de votre entreprise : stratégie, finance, formation et business plan.",
    features: [
      "Création & formalités d'entreprise",
      "Élaboration de business plan",
      "Conseil en gestion & finance",
      "Formation professionnelle",
      "Rédaction de contrats",
      "Accompagnement à la croissance",
    ],
    benefits: [
      "Expertise pluridisciplinaire",
      "Décisions éclairées",
      "Croissance durable",
    ],
  },
  "solutions-digitales": {
    intro:
      "Nous accélérons votre transformation digitale : applications mobiles, plateformes e-commerce, marketing digital et intelligence artificielle au service de votre croissance.",
    features: [
      "Applications mobiles iOS & Android",
      "Plateformes e-commerce",
      "Marketing digital & SEO",
      "Automatisation & IA",
      "Analyse de données & tableaux de bord",
      "Community management",
    ],
    benefits: [
      "Présence digitale renforcée",
      "Acquisition de clients",
      "Innovation continue",
    ],
  },
};
