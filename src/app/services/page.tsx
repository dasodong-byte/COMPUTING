import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SERVICES } from "@/lib/services";
import { Icon } from "@/components/Icon";
import { CTABand } from "@/components/home/CTABand";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Découvrez les 8 domaines d'expertise de Computing Services SARL : informatique, voyages, import-export, imprimerie, immobilier, papeterie, conseil et solutions digitales.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Nos services"
        subtitle="Huit domaines d'expertise intégrés pour accompagner votre croissance."
        crumbs={[{ label: "Services" }]}
      />
      <section className="container-cs section">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="card-hover group flex flex-col p-6">
              <span
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  s.accent === "orange" ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-blue/10 text-brand-blue"
                }`}
              >
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h2 className="text-lg font-bold text-navy-800 group-hover:text-brand-blue">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm text-navy-600">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                En savoir plus <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
