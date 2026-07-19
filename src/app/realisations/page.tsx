import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTABand } from "@/components/home/CTABand";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Découvrez une sélection de projets réalisés par Computing Services SARL : plateformes web, applications mobiles, ERP et solutions sur mesure.",
};

const PROJECTS = [
  { title: "Plateforme E-commerce", cat: "E-commerce", desc: "Boutique en ligne complète avec paiement et gestion des stocks.", image: "/images/real-1.png" },
  { title: "Application Mobile", cat: "Développement mobile", desc: "Application de gestion des interventions terrain en temps réel.", image: "/images/real-2.png" },
  { title: "ERP sur mesure", cat: "Solutions métier", desc: "Système de gestion intégré : ventes, achats, stock et comptabilité.", image: "/images/real-3.png" },
  { title: "Site Web Institutionnel", cat: "Web", desc: "Portail institutionnel multilingue pour une organisation internationale.", image: "/images/real-4.png" },
  { title: "CRM Commercial", cat: "Solutions métier", desc: "Suivi des prospects, pipeline et automatisation des relances.", image: "/images/real-1.png" },
  { title: "Marketplace B2B", cat: "E-commerce", desc: "Place de marché reliant fournisseurs et acheteurs professionnels.", image: "/images/real-3.png" },
];

export default function RealisationsPage() {
  return (
    <>
      <PageHeader
        title="Nos réalisations"
        subtitle="Des projets concrets qui témoignent de notre savoir-faire."
        crumbs={[{ label: "Nos Réalisations" }]}
      />
      <section className="container-cs section">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <article key={i} className="card-hover group overflow-hidden">
              <div className="relative aspect-[16/10] w-full bg-navy-100">
                <Image src={p.image} alt={p.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <span className="badge bg-brand-blue/10 text-brand-blue">{p.cat}</span>
                <h2 className="mt-2 text-base font-bold text-navy-800">{p.title}</h2>
                <p className="mt-1 text-sm text-navy-600">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
