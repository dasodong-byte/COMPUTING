export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readMinutes: number;
  content: string[];
};

export const POSTS: Post[] = [
  {
    slug: "transformation-digitale-pme-rdc",
    title: "5 leviers de la transformation digitale pour les PME en RDC",
    excerpt:
      "La digitalisation n'est plus une option. Découvrez les cinq priorités pour moderniser votre entreprise et gagner en compétitivité.",
    category: "Digital",
    date: "2026-06-15",
    author: "Équipe CS",
    readMinutes: 5,
    content: [
      "La transformation digitale transforme en profondeur la manière dont les entreprises créent de la valeur. En RDC, les PME qui adoptent le numérique gagnent en efficacité et en compétitivité.",
      "Premier levier : la dématérialisation des processus. En remplaçant les tâches manuelles par des outils numériques, vous réduisez les erreurs et gagnez du temps.",
      "Deuxième levier : la présence en ligne. Un site web professionnel et une boutique e-commerce ouvrent de nouveaux canaux de vente.",
      "Troisième levier : les données. Centraliser et analyser vos données permet de prendre de meilleures décisions.",
      "Quatrième levier : la cybersécurité. Protéger vos systèmes est indispensable pour préserver la confiance de vos clients.",
      "Cinquième levier : la formation des équipes. La technologie ne vaut que par ceux qui l'utilisent.",
    ],
  },
  {
    slug: "choisir-erp-entreprise",
    title: "Comment choisir le bon ERP pour votre entreprise",
    excerpt:
      "Un ERP bien choisi structure votre croissance. Voici les critères clés pour faire le bon investissement.",
    category: "Solutions métier",
    date: "2026-05-28",
    author: "Équipe CS",
    readMinutes: 6,
    content: [
      "Un ERP (Enterprise Resource Planning) centralise la gestion de votre entreprise : ventes, achats, stock, finance et ressources humaines.",
      "Avant de choisir, identifiez vos besoins réels et vos processus critiques. Un bon ERP doit s'adapter à votre métier, pas l'inverse.",
      "Privilégiez une solution modulaire et évolutive, capable de grandir avec vous.",
      "Enfin, l'accompagnement est déterminant : formation, support et maintenance garantissent le succès du projet.",
    ],
  },
  {
    slug: "securiser-donnees-entreprise",
    title: "Cybersécurité : 7 réflexes pour protéger votre entreprise",
    excerpt:
      "Les cyberattaques visent aussi les petites structures. Adoptez ces bonnes pratiques pour réduire les risques.",
    category: "Cybersécurité",
    date: "2026-05-10",
    author: "Équipe CS",
    readMinutes: 4,
    content: [
      "La cybersécurité concerne toutes les entreprises, quelle que soit leur taille.",
      "1. Utilisez des mots de passe forts et l'authentification à deux facteurs.",
      "2. Effectuez des sauvegardes régulières et testez leur restauration.",
      "3. Maintenez vos systèmes et logiciels à jour.",
      "4. Sensibilisez vos collaborateurs au phishing.",
      "5. Segmentez votre réseau et limitez les accès.",
      "6. Déployez un pare-feu et un antivirus professionnel.",
      "7. Établissez un plan de réponse aux incidents.",
    ],
  },
  {
    slug: "import-export-reussir-sourcing",
    title: "Import-Export : réussir son sourcing à l'international",
    excerpt:
      "Bien choisir ses fournisseurs et maîtriser la logistique sont la clé d'un import-export rentable.",
    category: "Import-Export",
    date: "2026-04-22",
    author: "Équipe CS",
    readMinutes: 5,
    content: [
      "Le sourcing international ouvre de belles opportunités, à condition d'être bien préparé.",
      "Sélectionnez des fournisseurs fiables et vérifiez leurs références et certifications.",
      "Anticipez la logistique : fret, assurance, transit et dédouanement.",
      "Maîtrisez la documentation pour éviter les blocages en douane.",
      "Notre pôle import-export vous accompagne à chaque étape.",
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
