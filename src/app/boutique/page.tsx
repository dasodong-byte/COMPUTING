import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BoutiqueClient } from "@/components/shop/BoutiqueClient";
import { CATEGORIES } from "@/lib/products";

export const metadata: Metadata = {
  title: "Boutique — Matériel informatique & bureautique",
  description:
    "Découvrez notre catalogue de matériel informatique, périphériques, réseau, impression, mobilier de bureau, papeterie et licences logicielles.",
};

export default function BoutiquePage({
  searchParams,
}: {
  searchParams: { categorie?: string };
}) {
  const cat = searchParams.categorie;
  const validCat = CATEGORIES.some((c) => c.slug === cat) ? cat : undefined;

  return (
    <>
      <PageHeader
        title="Boutique"
        subtitle="Matériel informatique, bureautique et solutions professionnelles livrés partout en RDC."
        crumbs={[{ label: "Boutique" }]}
      />
      <BoutiqueClient initialCategory={validCat} />
    </>
  );
}
