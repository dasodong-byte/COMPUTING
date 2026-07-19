import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { POSTS, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Actualités & Blog",
  description:
    "Conseils, analyses et actualités de Computing Services SARL sur le digital, les solutions métier, la cybersécurité et l'import-export.",
};

export default function ActualitesPage() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <PageHeader
        title="Actualités"
        subtitle="Conseils, analyses et tendances pour piloter votre croissance."
        crumbs={[{ label: "Actualités" }]}
      />

      <section className="container-cs section">
        {/* Featured */}
        <Link href={`/actualites/${featured.slug}`} className="card-hover group mb-10 grid overflow-hidden lg:grid-cols-2">
          <div className="bg-gradient-to-br from-navy-800 to-brand-blue p-8 text-white sm:p-12">
            <span className="badge bg-brand-orange text-white">{featured.category}</span>
            <h2 className="mt-4 text-2xl font-extrabold">{featured.title}</h2>
            <p className="mt-3 text-sm text-navy-100/80">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
              Lire l&apos;article <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex flex-col justify-center gap-3 p-8 sm:p-12">
            <div className="flex items-center gap-4 text-xs text-navy-600">
              <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatDate(featured.date)}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {featured.readMinutes} min</span>
            </div>
            <p className="text-sm text-navy-600">
              À la une cette semaine — un dossier complet pour aller plus loin dans
              votre transformation.
            </p>
          </div>
        </Link>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <article key={p.slug} className="card-hover group flex flex-col p-6">
              <span className="badge w-fit bg-brand-blue/10 text-brand-blue">{p.category}</span>
              <h3 className="mt-3 text-lg font-bold text-navy-800 group-hover:text-brand-blue">
                <Link href={`/actualites/${p.slug}`}>{p.title}</Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-navy-600">{p.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-navy-600">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(p.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.readMinutes} min</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
