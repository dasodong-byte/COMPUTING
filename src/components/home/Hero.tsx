import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, FileText, Info, Headphones, MoreHorizontal, FolderKanban, UsersRound, Globe, Clock } from "lucide-react";
import { SITE } from "@/lib/site";

const heroStats = [
  { icon: FolderKanban, value: SITE.stats.projects, label: "Projets réalisés" },
  { icon: UsersRound, value: SITE.stats.clients, label: "Clients satisfaits" },
  { icon: Globe, value: SITE.stats.countries, label: "Pays couverts" },
  { icon: Clock, value: SITE.stats.support, label: "Support disponible" },
];

const chatOptions = [
  { icon: FileText, label: "Demander un devis" },
  { icon: Info, label: "Informations sur nos services" },
  { icon: Headphones, label: "Assistance technique" },
  { icon: MoreHorizontal, label: "Autres demandes" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700" />
        <div className="absolute -right-10 top-0 h-full w-2/3 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.35),transparent_55%)]" />
        </div>
      </div>

      <div className="container-cs relative grid gap-10 py-16 lg:grid-cols-12 lg:py-20">
        {/* Left content */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-extrabold uppercase leading-[1.1] sm:text-5xl">
            Votre partenaire de confiance pour la transformation{" "}
            <span className="text-brand-orange">digitale</span> et bien plus
          </h1>
          <p className="mt-5 max-w-xl text-base text-navy-100/80">
            Des solutions innovantes et intégrées pour accompagner les entreprises,
            organisations et particuliers vers le succès.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn-primary">
              Découvrir nos services <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-outline">
              Nous contacter <Phone className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <s.icon className="h-5 w-5 text-brand-orange" />
                <dt className="text-2xl font-extrabold text-white">{s.value}</dt>
                <dd className="text-xs text-navy-100/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: building + chatbot */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto h-full min-h-[320px] w-full">
            <div className="absolute bottom-0 left-0 hidden h-[300px] w-[210px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 lg:block">
              <Image src="/images/hero-building.png" alt="Siège Computing Services" fill className="object-cover" sizes="210px" priority />
            </div>

            {/* Chatbot widget */}
            <div className="relative ml-auto w-full max-w-[320px] rounded-2xl bg-white p-4 text-navy-800 shadow-2xl">
              <div className="flex items-start justify-between">
                <p className="text-sm font-bold">Bonjour ! 👋</p>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-50 text-navy-600">–</span>
              </div>
              <p className="mt-1 text-xs text-navy-600">
                Comment pouvons-nous vous aider aujourd&apos;hui ?
              </p>
              <div className="mt-3 space-y-2">
                {chatOptions.map((o) => (
                  <button
                    key={o.label}
                    className="flex w-full items-center gap-2 rounded-lg border border-navy-100 px-3 py-2 text-left text-xs font-medium text-navy-800 transition hover:border-brand-blue hover:bg-navy-50"
                  >
                    <o.icon className="h-4 w-4 text-brand-blue" />
                    {o.label}
                  </button>
                ))}
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 py-2.5 text-xs font-semibold text-white">
                Discuter maintenant
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulseDot" />
              </button>
              <p className="mt-2 text-center text-[10px] text-navy-600/70">
                Chatbot propulsé par <span className="font-semibold text-brand-blue">CS AI</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
