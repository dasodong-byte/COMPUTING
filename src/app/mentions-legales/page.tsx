import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de Computing Services SARL.',
};

export default function Page() {
  return (
    <>
      <PageHeader title='Mentions légales' crumbs={[{ label: 'Mentions légales' }]} />
      <LegalContent
        sections={[
          { heading: 'Éditeur du site', body: 'Le présent site est édité par COMPUTING SERVICES SARL, société à responsabilité limitée dont le siège social est situé au 57 Boulevard du 30 Juin, Gombe, Kinshasa, République Démocratique du Congo.' },
          { heading: 'Contact', body: 'Téléphone : +243 814 863 000 — Email : contact@computing-services.fr — Site : www.computing-services.fr' },
          { heading: 'Hébergement', body: 'Le site est hébergé sur une infrastructure cloud sécurisée garantissant la disponibilité et la protection des données.' },
          { heading: 'Propriété intellectuelle', body: "L'ensemble des contenus (textes, images, logos, marques) présents sur ce site sont la propriété exclusive de COMPUTING SERVICES SARL, sauf mention contraire. Toute reproduction sans autorisation est interdite." },
          { heading: 'Responsabilité', body: "COMPUTING SERVICES SARL s'efforce d'assurer l'exactitude des informations diffusées mais ne saurait être tenue responsable des erreurs ou omissions." },
        ]}
      />
    </>
  );
}
