import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-800 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.4),transparent_50%)]" />
      <div className="container-cs relative py-12">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-navy-100/70">
          <Link href="/" className="hover:text-brand-orange">Accueil</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {c.href ? (
                <Link href={c.href} className="hover:text-brand-orange">{c.label}</Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-3 text-3xl font-extrabold uppercase sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-navy-100/80">{subtitle}</p>}
      </div>
    </section>
  );
}
