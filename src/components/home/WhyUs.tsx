import { WHY_US } from "@/lib/services";
import { Icon } from "@/components/Icon";

export function WhyUs() {
  return (
    <section className="section">
      <div className="container-cs">
        <h2 className="section-title text-center">
          Pourquoi <span className="text-brand-orange">nous choisir</span> ?
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_US.map((w) => (
            <div key={w.title} className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-800 text-brand-orange">
                <Icon name={w.icon} className="h-6 w-6" />
              </span>
              <h3 className="text-sm font-bold text-navy-800">{w.title}</h3>
              <p className="mt-1 text-xs text-navy-600">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
