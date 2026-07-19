import type { Metadata } from "next";
import { Target, Eye, Gem, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsBand } from "@/components/home/StatsBand";
import { WhyUs } from "@/components/home/WhyUs";
import { CTABand } from "@/components/home/CTABand";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Computing Services SARL, votre partenaire de confiance pour la transformation digitale et bien plus, basé à Kinshasa, RDC.",
};

const values = [
  "Excellence & qualité de service",
  "Intégrité et transparence",
  "Innovation permanente",
  "Orientation client",
  "Engagement et réactivité",
  "Respect des délais",
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        title="À propos de nous"
        subtitle="La technologie au service de votre croissance."
        crumbs={[{ label: "À propos" }]}
      />

      <section className="container-cs section">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">
            Qui <span className="text-brand-orange">sommes-nous</span> ?
          </h2>
          <p className="mt-4 text-navy-600">
            COMPUTING SERVICES SARL est une entreprise multiservices basée à Kinshasa
            (RDC) qui accompagne les entreprises, organisations et particuliers dans
            leur transformation digitale et le développement de leurs activités. À
            travers huit domaines d&apos;expertise complémentaires, nous offrons des
            solutions innovantes, fiables et intégrées pour répondre aux besoins
            présents et futurs de nos clients.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Notre mission", text: "Fournir des solutions technologiques et de services de haute qualité qui créent de la valeur durable pour nos clients." },
            { icon: Eye, title: "Notre vision", text: "Devenir le partenaire de référence de la transformation digitale et du développement des entreprises en Afrique centrale." },
            { icon: Gem, title: "Nos valeurs", text: "Excellence, intégrité, innovation et engagement guident chacune de nos actions au quotidien." },
          ].map((c) => (
            <div key={c.title} className="card p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-navy-800">{c.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-navy-800 p-8 text-white">
            <h3 className="text-xl font-extrabold">Nos engagements</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-navy-100/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-navy-100 p-8">
            <h3 className="text-xl font-extrabold text-navy-800">Une équipe pluridisciplinaire</h3>
            <p className="mt-3 text-sm text-navy-600">
              Nos experts en informatique, logistique, finance, communication et
              conseil travaillent main dans la main pour vous offrir un
              accompagnement complet, de la stratégie à l&apos;exécution. Nous
              mettons un point d&apos;honneur à comprendre vos enjeux pour vous
              proposer des solutions réellement adaptées.
            </p>
          </div>
        </div>
      </section>

      <StatsBand />
      <WhyUs />
      <CTABand />
    </>
  );
}
