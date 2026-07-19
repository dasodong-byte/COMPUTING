import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SERVICES } from "@/lib/services";
import { SERVICE_DETAILS } from "@/lib/serviceDetails";
import { Icon } from "@/components/Icon";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) return { title: "Service introuvable" };
  return { title: service.title, description: service.short };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  const detail = SERVICE_DETAILS[params.slug];
  if (!service || !detail) notFound();

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.short}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
      />

      <section className="container-cs section grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${
              service.accent === "orange" ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-blue/10 text-brand-blue"
            }`}
          >
            <Icon name={service.icon} className="h-7 w-7" />
          </span>
          <p className="text-base leading-relaxed text-navy-600">{detail.intro}</p>

          <h2 className="section-title mt-10 text-xl">Nos prestations</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {detail.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy-800">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <h3 className="text-lg font-bold text-navy-800">Nos atouts</h3>
            <ul className="mt-4 space-y-3">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-navy-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              <Link href="/contact#devis" className="btn-primary w-full">
                Demander un devis <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${SITE.phone}`} className="btn-ghost w-full">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-navy-100 bg-navy-50/40 py-12">
        <div className="container-cs">
          <h2 className="section-title text-center text-xl">Autres domaines d&apos;expertise</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {SERVICES.filter((s) => s.slug !== service.slug).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card-hover flex flex-col items-center p-4 text-center">
                <Icon name={s.icon} className="h-7 w-7 text-brand-blue" />
                <span className="mt-2 text-xs font-semibold text-navy-800">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
