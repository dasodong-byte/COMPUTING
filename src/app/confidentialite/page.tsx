import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données de Computing Services SARL.',
};

export default function Page() {
  return (
    <>
      <PageHeader title='Politique de confidentialité' crumbs={[{ label: 'Politique de confidentialité' }]} />
      <LegalContent
        sections={[
          { heading: 'Collecte des données', body: 'Nous collectons uniquement les données nécessaires au traitement de vos demandes (nom, email, téléphone, message) via nos formulaires de contact et de devis.' },
          { heading: 'Utilisation des données', body: 'Vos données sont utilisées pour vous recontacter, traiter vos commandes et améliorer nos services. Elles ne sont jamais revendues à des tiers.' },
          { heading: 'Conservation', body: 'Les données sont conservées pendant la durée nécessaire au traitement de votre demande et conformément aux obligations légales.' },
          { heading: 'Sécurité', body: 'Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.' },
          { heading: 'Vos droits', body: "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous à contact@computing-services.fr." },
        ]}
      />
    </>
  );
}
