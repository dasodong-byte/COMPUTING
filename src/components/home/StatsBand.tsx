import { FileText, Users, ShoppingCart, Globe, Clock, LayoutGrid } from "lucide-react";
import { SITE } from "@/lib/site";

const stats = [
  { icon: FileText, value: SITE.stats.projects, label: "Projets réalisés" },
  { icon: Users, value: SITE.stats.clients, label: "Clients satisfaits" },
  { icon: ShoppingCart, value: SITE.stats.orders, label: "Commandes livrées" },
  { icon: Globe, value: SITE.stats.countries, label: "Pays couverts" },
  { icon: Clock, value: SITE.stats.support, label: "Support disponible" },
  { icon: LayoutGrid, value: SITE.stats.domains, label: "Domaines d'expertise" },
];

export function StatsBand() {
  return (
    <section className="bg-navy-800 py-10 text-white">
      <div className="container-cs grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xl font-extrabold text-brand-orange">{s.value}</div>
              <div className="text-xs text-navy-100/70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
