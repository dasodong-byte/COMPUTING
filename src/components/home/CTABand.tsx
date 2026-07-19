import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Zap, FileCheck, LifeBuoy } from "lucide-react";
import { SITE } from "@/lib/site";

const features = [
  { icon: Zap, title: "Réponse rapide", sub: "sous 24h" },
  { icon: FileCheck, title: "Devis gratuit", sub: "et personnalisé" },
  { icon: LifeBuoy, title: "Accompagnement", sub: "de A à Z" },
];

export function CTABand() {
  return (
    <section className="bg-navy-800 text-white">
      <div className="container-cs flex flex-col items-center gap-8 py-8 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/10 md:block">
            <Image src="/images/cta-man.png" alt="Conseiller Computing Services" fill className="object-cover" sizes="96px" />
          </div>
          <h2 className="text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
            Vous avez un projet ?<br />
            Parlons-en <span className="text-brand-orange">dès maintenant !</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-2 text-sm">
              <f.icon className="h-6 w-6 text-brand-orange" />
              <span>
                <span className="block font-semibold">{f.title}</span>
                <span className="block text-xs text-navy-100/70">{f.sub}</span>
              </span>
            </div>
          ))}
        </div>

        <Link
          href={`tel:${SITE.phone}`}
          className="flex items-center gap-3 rounded-xl bg-brand-orange px-6 py-4 font-bold text-white shadow-lg transition hover:bg-brand-orangeDark"
        >
          <Phone className="h-6 w-6" />
          <span className="leading-tight">
            <span className="block text-lg">{SITE.phone}</span>
            <span className="block text-xs font-medium">CONTACTEZ-NOUS</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
