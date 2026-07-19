export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string; // category slug
  price: number; // USD
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  promo?: boolean;
  short: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const CATEGORIES: Category[] = [
  { slug: "ordinateurs", name: "Ordinateurs & Laptops", icon: "Laptop" },
  { slug: "peripheriques", name: "Périphériques", icon: "Mouse" },
  { slug: "reseau", name: "Réseau & Serveurs", icon: "Server" },
  { slug: "impression", name: "Impression", icon: "Printer" },
  { slug: "mobilier", name: "Mobilier de Bureau", icon: "Armchair" },
  { slug: "papeterie", name: "Papeterie", icon: "NotebookPen" },
  { slug: "logiciels", name: "Logiciels & Licences", icon: "AppWindow" },
];

const P = (p: Product): Product => p;

export const PRODUCTS: Product[] = [
  P({
    id: "1",
    slug: "dell-latitude-7440",
    name: "Dell Latitude 7440 - i7 16Go 512Go SSD",
    brand: "Dell",
    category: "ordinateurs",
    price: 1250,
    oldPrice: 1450,
    rating: 4.8,
    reviews: 42,
    stock: 12,
    featured: true,
    promo: true,
    short: "Ultrabook professionnel 14\" léger et performant.",
    description:
      "Le Dell Latitude 7440 combine puissance et mobilité pour les professionnels exigeants. Processeur Intel Core i7 de 13e génération, 16 Go de RAM et SSD NVMe 512 Go pour une réactivité optimale.",
    specs: [
      { label: "Processeur", value: "Intel Core i7-1355U" },
      { label: "Mémoire", value: "16 Go DDR5" },
      { label: "Stockage", value: "512 Go SSD NVMe" },
      { label: "Écran", value: "14\" Full HD IPS" },
      { label: "OS", value: "Windows 11 Pro" },
    ],
  }),
  P({
    id: "2",
    slug: "hp-elitebook-840",
    name: "HP EliteBook 840 G10",
    brand: "HP",
    category: "ordinateurs",
    price: 1180,
    rating: 4.7,
    reviews: 28,
    stock: 8,
    featured: true,
    isNew: true,
    short: "Laptop business sécurisé avec puce HP Wolf Security.",
    description:
      "Conçu pour l'entreprise moderne, l'EliteBook 840 G10 offre sécurité renforcée, autonomie longue durée et un design premium en aluminium.",
    specs: [
      { label: "Processeur", value: "Intel Core i5-1335U" },
      { label: "Mémoire", value: "16 Go DDR5" },
      { label: "Stockage", value: "512 Go SSD" },
      { label: "Écran", value: "14\" WUXGA" },
      { label: "OS", value: "Windows 11 Pro" },
    ],
  }),
  P({
    id: "3",
    slug: "lenovo-thinkpad-x1",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    category: "ordinateurs",
    price: 1650,
    rating: 4.9,
    reviews: 55,
    stock: 5,
    featured: true,
    short: "L'ultrabook business ultra-léger de référence.",
    description:
      "Châssis en fibre de carbone, moins de 1,1 kg, écran 2.8K OLED en option. Le ThinkPad X1 Carbon est la référence des cadres dirigeants.",
    specs: [
      { label: "Processeur", value: "Intel Core i7-1360P" },
      { label: "Mémoire", value: "32 Go LPDDR5" },
      { label: "Stockage", value: "1 To SSD" },
      { label: "Écran", value: "14\" 2.8K OLED" },
      { label: "Poids", value: "1,09 kg" },
    ],
  }),
  P({
    id: "4",
    slug: "poste-bureau-i5",
    name: "PC de Bureau Pro i5 - 16Go 1To",
    brand: "CS Assembly",
    category: "ordinateurs",
    price: 720,
    oldPrice: 820,
    rating: 4.5,
    reviews: 18,
    stock: 20,
    promo: true,
    short: "Tour bureautique assemblée pour PME.",
    description:
      "Configuration bureautique fiable assemblée par nos techniciens : idéale pour la comptabilité, la gestion et le travail quotidien.",
    specs: [
      { label: "Processeur", value: "Intel Core i5-12400" },
      { label: "Mémoire", value: "16 Go DDR4" },
      { label: "Stockage", value: "1 To SSD" },
      { label: "Garantie", value: "24 mois" },
    ],
  }),
  P({
    id: "5",
    slug: "ecran-dell-27",
    name: "Écran Dell UltraSharp 27\" U2723QE 4K",
    brand: "Dell",
    category: "peripheriques",
    price: 480,
    rating: 4.8,
    reviews: 33,
    stock: 15,
    featured: true,
    short: "Moniteur 4K USB-C avec hub intégré.",
    description:
      "Dalle IPS Black 4K, couverture colorimétrique étendue et connectique USB-C avec charge 90W. Idéal pour la création et le multitâche.",
    specs: [
      { label: "Taille", value: "27 pouces" },
      { label: "Résolution", value: "3840 x 2160 (4K)" },
      { label: "Dalle", value: "IPS Black" },
      { label: "Connectique", value: "USB-C, HDMI, DP" },
    ],
  }),
  P({
    id: "6",
    slug: "clavier-souris-logitech",
    name: "Pack Clavier + Souris Logitech MK540",
    brand: "Logitech",
    category: "peripheriques",
    price: 55,
    rating: 4.6,
    reviews: 61,
    stock: 40,
    short: "Ensemble sans fil confortable et durable.",
    description:
      "Pack sans fil silencieux avec récepteur unifiant, autonomie jusqu'à 36 mois pour le clavier. Parfait pour le bureau.",
    specs: [
      { label: "Connexion", value: "Sans fil 2.4 GHz" },
      { label: "Autonomie", value: "Jusqu'à 36 mois" },
      { label: "Compatibilité", value: "Windows / macOS" },
    ],
  }),
  P({
    id: "7",
    slug: "webcam-logitech-brio",
    name: "Webcam Logitech Brio 4K",
    brand: "Logitech",
    category: "peripheriques",
    price: 165,
    oldPrice: 199,
    rating: 4.7,
    reviews: 24,
    stock: 18,
    promo: true,
    short: "Webcam Ultra HD pour visioconférence.",
    description:
      "Capteur 4K Ultra HD, HDR et correction automatique de la lumière. Idéale pour les réunions à distance et le streaming professionnel.",
    specs: [
      { label: "Résolution", value: "4K / 1080p 60fps" },
      { label: "Champ de vision", value: "90°" },
      { label: "Micro", value: "Double micro omni" },
    ],
  }),
  P({
    id: "8",
    slug: "switch-cisco-24",
    name: "Switch Cisco Catalyst 1000 24 ports",
    brand: "Cisco",
    category: "reseau",
    price: 640,
    rating: 4.8,
    reviews: 12,
    stock: 6,
    featured: true,
    short: "Commutateur managé Gigabit pour PME.",
    description:
      "Switch managé 24 ports Gigabit avec 4 liaisons SFP, sécurité avancée et gestion simplifiée pour les réseaux d'entreprise.",
    specs: [
      { label: "Ports", value: "24 x Gigabit + 4 SFP" },
      { label: "Type", value: "Managé Layer 2" },
      { label: "Rackable", value: "1U 19 pouces" },
    ],
  }),
  P({
    id: "9",
    slug: "firewall-fortinet-40f",
    name: "Fortinet FortiGate 40F",
    brand: "Fortinet",
    category: "reseau",
    price: 590,
    rating: 4.9,
    reviews: 9,
    stock: 7,
    isNew: true,
    short: "Pare-feu nouvelle génération pour petites structures.",
    description:
      "Sécurité réseau NGFW avec inspection SSL, protection contre les menaces et VPN intégré. Idéal pour sécuriser les PME.",
    specs: [
      { label: "Débit Firewall", value: "5 Gbps" },
      { label: "Ports", value: "5 x GE RJ45" },
      { label: "VPN", value: "IPsec / SSL" },
    ],
  }),
  P({
    id: "10",
    slug: "serveur-dell-r250",
    name: "Serveur Dell PowerEdge R250",
    brand: "Dell",
    category: "reseau",
    price: 1980,
    rating: 4.7,
    reviews: 5,
    stock: 4,
    featured: true,
    short: "Serveur rack 1U pour applications d'entreprise.",
    description:
      "Serveur 1U évolutif, idéal pour la virtualisation légère, les serveurs de fichiers et applications métier des PME.",
    specs: [
      { label: "Processeur", value: "Intel Xeon E-2314" },
      { label: "Mémoire", value: "16 Go ECC (extensible)" },
      { label: "Stockage", value: "2 x 2 To SATA" },
      { label: "Format", value: "Rack 1U" },
    ],
  }),
  P({
    id: "11",
    slug: "imprimante-hp-laserjet",
    name: "Imprimante HP LaserJet Pro M404dn",
    brand: "HP",
    category: "impression",
    price: 320,
    oldPrice: 380,
    rating: 4.6,
    reviews: 37,
    stock: 14,
    promo: true,
    short: "Imprimante laser monochrome rapide.",
    description:
      "Impression laser monochrome jusqu'à 38 ppm, recto-verso automatique et connexion réseau Ethernet pour les équipes.",
    specs: [
      { label: "Vitesse", value: "38 ppm" },
      { label: "Recto-verso", value: "Automatique" },
      { label: "Connectique", value: "USB, Ethernet" },
    ],
  }),
  P({
    id: "12",
    slug: "traceur-canon-tm300",
    name: "Traceur Canon imagePROGRAF TM-300",
    brand: "Canon",
    category: "impression",
    price: 2450,
    rating: 4.8,
    reviews: 6,
    stock: 3,
    short: "Traceur grand format 36\" pour plans et affiches.",
    description:
      "Traceur professionnel 36 pouces pour l'impression de plans techniques, affiches et posters haute qualité.",
    specs: [
      { label: "Largeur", value: "36 pouces (914 mm)" },
      { label: "Encres", value: "5 couleurs pigmentées" },
      { label: "Usage", value: "CAO / Affichage" },
    ],
  }),
  P({
    id: "13",
    slug: "fauteuil-ergonomique",
    name: "Fauteuil de Bureau Ergonomique Pro",
    brand: "CS Office",
    category: "mobilier",
    price: 240,
    oldPrice: 290,
    rating: 4.5,
    reviews: 48,
    stock: 22,
    promo: true,
    featured: true,
    short: "Assise ergonomique avec soutien lombaire.",
    description:
      "Fauteuil ergonomique avec dossier en maille respirante, soutien lombaire réglable et accoudoirs 3D pour un confort toute la journée.",
    specs: [
      { label: "Dossier", value: "Maille respirante" },
      { label: "Réglages", value: "Hauteur, inclinaison, lombaire" },
      { label: "Charge max", value: "130 kg" },
    ],
  }),
  P({
    id: "14",
    slug: "bureau-direction",
    name: "Bureau de Direction 180cm",
    brand: "CS Office",
    category: "mobilier",
    price: 460,
    rating: 4.4,
    reviews: 15,
    stock: 9,
    short: "Bureau exécutif avec caisson intégré.",
    description:
      "Bureau de direction élégant avec plateau mélaminé résistant, caisson de rangement et passe-câbles intégré.",
    specs: [
      { label: "Dimensions", value: "180 x 90 cm" },
      { label: "Matériau", value: "Mélaminé haute densité" },
      { label: "Rangement", value: "Caisson 3 tiroirs" },
    ],
  }),
  P({
    id: "15",
    slug: "armoire-metallique",
    name: "Armoire Métallique de Bureau",
    brand: "CS Office",
    category: "mobilier",
    price: 195,
    rating: 4.3,
    reviews: 11,
    stock: 16,
    short: "Armoire de rangement sécurisée à portes battantes.",
    description:
      "Armoire métallique robuste avec étagères réglables et serrure à clé, idéale pour archiver documents et fournitures.",
    specs: [
      { label: "Dimensions", value: "195 x 90 x 40 cm" },
      { label: "Étagères", value: "4 réglables" },
      { label: "Sécurité", value: "Serrure à clé" },
    ],
  }),
  P({
    id: "16",
    slug: "ramette-papier-a4",
    name: "Ramette Papier A4 80g (Carton de 5)",
    brand: "Double A",
    category: "papeterie",
    price: 28,
    rating: 4.7,
    reviews: 90,
    stock: 120,
    short: "Papier blanc premium pour impression quotidienne.",
    description:
      "Carton de 5 ramettes (2500 feuilles) de papier A4 80g blanc éclatant, compatible toutes imprimantes laser et jet d'encre.",
    specs: [
      { label: "Format", value: "A4 (210 x 297 mm)" },
      { label: "Grammage", value: "80 g/m²" },
      { label: "Quantité", value: "5 x 500 feuilles" },
    ],
  }),
  P({
    id: "17",
    slug: "kit-fournitures-bureau",
    name: "Kit Fournitures de Bureau Complet",
    brand: "CS Papeterie",
    category: "papeterie",
    price: 45,
    oldPrice: 59,
    rating: 4.5,
    reviews: 34,
    stock: 60,
    promo: true,
    short: "L'essentiel de la papeterie pour un poste de travail.",
    description:
      "Kit complet : stylos, surligneurs, agrafeuse, ciseaux, notes adhésives, classeurs et accessoires de bureau.",
    specs: [
      { label: "Contenu", value: "25+ articles" },
      { label: "Idéal pour", value: "Nouveau poste / bureau" },
    ],
  }),
  P({
    id: "18",
    slug: "tableau-blanc-magnetique",
    name: "Tableau Blanc Magnétique 120x90cm",
    brand: "CS Office",
    category: "papeterie",
    price: 75,
    rating: 4.6,
    reviews: 21,
    stock: 25,
    short: "Surface magnétique effaçable à sec.",
    description:
      "Tableau blanc magnétique avec cadre aluminium et porte-marqueurs. Parfait pour les réunions et le brainstorming.",
    specs: [
      { label: "Dimensions", value: "120 x 90 cm" },
      { label: "Surface", value: "Magnétique laquée" },
      { label: "Fixation", value: "Murale (kit inclus)" },
    ],
  }),
  P({
    id: "19",
    slug: "microsoft-365-business",
    name: "Microsoft 365 Business Standard (1 an)",
    brand: "Microsoft",
    category: "logiciels",
    price: 150,
    rating: 4.8,
    reviews: 72,
    stock: 999,
    featured: true,
    isNew: true,
    short: "Suite bureautique cloud complète par utilisateur.",
    description:
      "Licence annuelle Microsoft 365 Business Standard : applications Office, Exchange, Teams, SharePoint et 1 To OneDrive par utilisateur.",
    specs: [
      { label: "Durée", value: "12 mois" },
      { label: "Utilisateurs", value: "1 utilisateur" },
      { label: "Inclus", value: "Office, Teams, 1 To OneDrive" },
    ],
  }),
  P({
    id: "20",
    slug: "windows-11-pro",
    name: "Windows 11 Pro - Licence OEM",
    brand: "Microsoft",
    category: "logiciels",
    price: 145,
    rating: 4.6,
    reviews: 40,
    stock: 999,
    short: "Système d'exploitation professionnel.",
    description:
      "Licence Windows 11 Pro complète avec activation en ligne, sécurité BitLocker et fonctionnalités professionnelles.",
    specs: [
      { label: "Type", value: "OEM 64 bits" },
      { label: "Activation", value: "Clé numérique" },
    ],
  }),
  P({
    id: "21",
    slug: "antivirus-eset-pro",
    name: "ESET Protect Entry - 10 postes (1 an)",
    brand: "ESET",
    category: "logiciels",
    price: 320,
    oldPrice: 380,
    rating: 4.7,
    reviews: 19,
    stock: 999,
    promo: true,
    short: "Protection endpoint centralisée pour entreprise.",
    description:
      "Solution de cybersécurité pour 10 postes avec console d'administration centralisée, antivirus, antimalware et protection réseau.",
    specs: [
      { label: "Postes", value: "10" },
      { label: "Durée", value: "12 mois" },
      { label: "Gestion", value: "Console cloud" },
    ],
  }),
  P({
    id: "22",
    slug: "onduleur-apc-1500",
    name: "Onduleur APC Back-UPS Pro 1500VA",
    brand: "APC",
    category: "reseau",
    price: 280,
    rating: 4.7,
    reviews: 27,
    stock: 13,
    short: "Protection électrique pour postes et serveurs.",
    description:
      "Onduleur line-interactive 1500VA / 900W avec régulation automatique de tension et écran LCD pour protéger vos équipements.",
    specs: [
      { label: "Puissance", value: "1500 VA / 900 W" },
      { label: "Prises", value: "6 protégées" },
      { label: "Écran", value: "LCD état/charge" },
    ],
  }),
  P({
    id: "23",
    slug: "nas-synology-ds224",
    name: "NAS Synology DiskStation DS224+",
    brand: "Synology",
    category: "reseau",
    price: 410,
    rating: 4.8,
    reviews: 16,
    stock: 8,
    isNew: true,
    short: "Serveur de stockage réseau 2 baies.",
    description:
      "Solution de stockage et sauvegarde centralisée 2 baies pour les petites équipes, avec partage de fichiers et sauvegarde automatisée.",
    specs: [
      { label: "Baies", value: "2 x 3.5\"" },
      { label: "Mémoire", value: "2 Go (extensible)" },
      { label: "Réseau", value: "2 x Gigabit" },
    ],
  }),
  P({
    id: "24",
    slug: "videoprojecteur-epson",
    name: "Vidéoprojecteur Epson EB-FH52 Full HD",
    brand: "Epson",
    category: "peripheriques",
    price: 690,
    rating: 4.6,
    reviews: 14,
    stock: 10,
    short: "Projecteur Full HD lumineux pour salles de réunion.",
    description:
      "Vidéoprojecteur 3LCD Full HD 4000 lumens, idéal pour présentations en salle de réunion et formations.",
    specs: [
      { label: "Résolution", value: "1920 x 1080" },
      { label: "Luminosité", value: "4000 lumens" },
      { label: "Connectique", value: "HDMI, VGA, USB" },
    ],
  }),
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
