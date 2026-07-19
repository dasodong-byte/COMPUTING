export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const MAIN_NAV: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Informatique & IT", href: "/services/informatique" },
      { label: "Agence de Voyages", href: "/services/voyages" },
      { label: "Import-Export", href: "/services/import-export" },
      { label: "Imprimerie", href: "/services/imprimerie" },
      { label: "Immobilier", href: "/services/immobilier" },
      { label: "Papeterie & Mobilier", href: "/services/papeterie" },
      { label: "Conseil & Accompagnement", href: "/services/conseil" },
      { label: "Solutions Digitales", href: "/services/solutions-digitales" },
    ],
  },
  { label: "Catalogue", href: "/boutique" },
  { label: "Nos Réalisations", href: "/realisations" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  quick: [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Services", href: "/services" },
    { label: "Catalogue", href: "/boutique" },
    { label: "Nos Réalisations", href: "/realisations" },
    { label: "Actualités", href: "/actualites" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Informatique & IT", href: "/services/informatique" },
    { label: "Agence de Voyages", href: "/services/voyages" },
    { label: "Import-Export", href: "/services/import-export" },
    { label: "Imprimerie", href: "/services/imprimerie" },
    { label: "Immobilier", href: "/services/immobilier" },
    { label: "Papeterie & Mobilier", href: "/services/papeterie" },
    { label: "Conseil & Accompagnement", href: "/services/conseil" },
    { label: "Solutions Digitales", href: "/services/solutions-digitales" },
  ],
};
