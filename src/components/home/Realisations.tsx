import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REALISATIONS } from "@/lib/services";
import { Testimonials } from "@/components/home/Testimonials";

export function Realisations() {
  return (
    <section className="section bg-navy-50/40">
      <div className="container-cs grid gap-10 lg:grid-cols-12">
        {/* Réalisations */}
        <div className="lg:col-span-7">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-extrabold uppercase text-navy-800">
              Nos <span className="text-brand-orange">réalisations</span>
            </h3>
            <Link href="/realisations" className="text-xs font-semibold text-brand-blue hover:underline">
              Voir plus →
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {REALISATIONS.map((r) => (
                <article key={r.title} className="card-hover overflow-hidden">
                  <div className="relative aspect-[4/3] w-full bg-navy-100">
                    <Image src={r.image} alt={r.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-navy-800">{r.title}</h4>
                    <p className="mt-0.5 text-[11px] text-navy-600">{r.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
            <button aria-label="Précédent" className="absolute -left-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-600 shadow-md hover:text-brand-blue sm:flex">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button aria-label="Suivant" className="absolute -right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-600 shadow-md hover:text-brand-blue sm:flex">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Témoignages */}
        <div className="lg:col-span-5">
          <Testimonials />
        </div>
      </div>
    </section>
  );
}
