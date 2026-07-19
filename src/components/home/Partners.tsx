import { PARTNERS } from "@/lib/services";

export function Partners() {
  return (
    <section className="border-y border-navy-100 bg-white py-12">
      <div className="container-cs">
        <h2 className="text-center text-sm font-extrabold uppercase tracking-wider text-brand-orange">
          Nos partenaires technologiques
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="text-xl font-bold text-navy-800/60 grayscale transition hover:text-navy-800 hover:grayscale-0"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
