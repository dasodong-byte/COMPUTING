import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site Computing Services SARL.",
};

export default function Page() {
  return (
    <>
      <PageHeader title="Conditions générales d'utilisation" crumbs={[{ label: "Conditions générales d'utilisation" }]} />
      <LegalContent
        sections={[
          { heading: 'Objet', body: "Les présentes conditions générales régissent l'utilisation du site et des services proposés par COMPUTING SERVICES SARL." },
          { heading: 'Accès au site', body: "Le site est accessible gratuitement. Les frais d'accès et d'utilisation du réseau restent à la charge de l'utilisateur." },
          { heading: 'Commandes', body: "Les prix affichés dans la boutique sont indicatifs et exprimés en dollars américains (USD). Toute commande fait l'objet d'une confirmation par nos équipes." },
          { heading: 'Livraison', body: "Les délais et frais de livraison sont communiqués lors de la confirmation de commande. La livraison est offerte dès 500 $ d'achat." },
          { heading: 'Modification', body: 'COMPUTING SERVICES SARL se réserve le droit de modifier les présentes conditions à tout moment.' },
        ]}
      />
    </>
  );
}
