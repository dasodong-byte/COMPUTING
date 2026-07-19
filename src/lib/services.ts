export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  accent: "blue" | "orange";
};

export const SERVICES: Service[] = [
  {
    slug: "informatique",
    title: "Informatique & IT",
    short:
      "Développement web, ERP, CRM, cybersécurité, réseaux, cloud & infogérance.",
    icon: "Laptop",
    accent: "blue",
  },
  {
    slug: "voyages",
    title: "Agence de Voyages",
    short: "Billets, visas, séjours, assistance voyage et accompagnement.",
    icon: "Plane",
    accent: "blue",
  },
  {
    slug: "import-export",
    title: "Import-Export",
    short: "Sourcing, achats internationaux, logistique et dédouanement.",
    icon: "Ship",
    accent: "orange",
  },
  {
    slug: "imprimerie",
    title: "Imprimerie",
    short: "Impressions professionnelles tous formats et supports.",
    icon: "Printer",
    accent: "orange",
  },
  {
    slug: "immobilier",
    title: "Immobilier",
    short:
      "Terrains, maisons, appartements, bureaux, vente, achat et investissements.",
    icon: "Home",
    accent: "blue",
  },
  {
    slug: "papeterie",
    title: "Papeterie & Mobilier",
    short: "Fournitures de bureau, mobilier et équipements professionnels.",
    icon: "Armchair",
    accent: "blue",
  },
  {
    slug: "conseil",
    title: "Conseil & Accompagnement",
    short: "Stratégie, formation, finance, business plan et accompagnement.",
    icon: "Users",
    accent: "orange",
  },
  {
    slug: "solutions-digitales",
    title: "Solutions Digitales",
    short:
      "Applications mobiles, e-commerce, marketing digital & intelligence artificielle.",
    icon: "Cpu",
    accent: "blue",
  },
];

export const WHY_US = [
  {
    title: "Expertise reconnue",
    text: "Une équipe d'experts qualifiés et expérimentés.",
    icon: "Award",
  },
  {
    title: "Qualité garantie",
    text: "Des services de haute qualité et conformes aux standards.",
    icon: "ShieldCheck",
  },
  {
    title: "Réactivité & Disponibilité",
    text: "Une équipe disponible 24h/7j pour vous accompagner.",
    icon: "Clock",
  },
  {
    title: "Solutions innovantes",
    text: "Des technologies modernes pour des résultats performants.",
    icon: "Lightbulb",
  },
  {
    title: "Transparence & Confiance",
    text: "Des relations basées sur l'éthique, la transparence et la confiance.",
    icon: "Handshake",
  },
];

export const PARTNERS = [
  "Microsoft",
  "AWS",
  "DELL",
  "Cisco",
  "Google Cloud",
  "Fortinet",
  "VMware",
  "Lenovo",
];

export const REALISATIONS = [
  {
    title: "Plateforme E-commerce",
    subtitle: "Solution complète",
    image: "/images/real-1.png",
  },
  {
    title: "Application Mobile",
    subtitle: "Gestion des interventions",
    image: "/images/real-2.png",
  },
  {
    title: "ERP sur mesure",
    subtitle: "Solution de gestion intégrée",
    image: "/images/real-3.png",
  },
  {
    title: "Site Web Institutionnel",
    subtitle: "Organisation internationale",
    image: "/images/real-4.png",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Grâce à COMPUTING SERVICES SARL, nous avons digitalisé l'ensemble de nos processus et gagné en efficacité. Une équipe professionnelle, réactive et à l'écoute.",
    name: "Jean-Pierre M.",
    role: "Directeur Général, Groupe Excellence",
    rating: 5,
  },
  {
    quote:
      "Un accompagnement de bout en bout sur notre projet ERP. Les délais ont été respectés et le résultat dépasse nos attentes.",
    name: "Aline K.",
    role: "Responsable Opérations, LogiTrade",
    rating: 5,
  },
  {
    quote:
      "Leur pôle import-export nous a fait gagner un temps précieux sur le sourcing et le dédouanement. Un vrai partenaire stratégique.",
    name: "Serge B.",
    role: "Gérant, Distrib Plus",
    rating: 5,
  },
];
