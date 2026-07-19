import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  UserCircle2,
  Users2,
  ListChecks,
  FileText,
  ReceiptText,
  MessageSquare,
  LayoutDashboard,
  FolderKanban,
  UserCog,
  BarChart3,
  Lock,
} from "lucide-react";
import { SERVICES } from "@/lib/services";
import { Icon } from "@/components/Icon";

const clientFeatures = [
  { icon: ListChecks, label: "Suivi de commandes" },
  { icon: FileText, label: "Demandes de devis" },
  { icon: ReceiptText, label: "Historique & factures" },
  { icon: MessageSquare, label: "Messagerie" },
];

const staffFeatures = [
  { icon: LayoutDashboard, label: "Tableau de bord" },
  { icon: FolderKanban, label: "Gestion des projets" },
  { icon: UserCog, label: "Utilisateurs & rôles" },
  { icon: BarChart3, label: "Rapports & analyses" },
];

export function ExpertiseAdmin() {
  return (
    <section className="section bg-navy-50/40">
      <div className="container-cs grid gap-10 lg:grid-cols-12">
        {/* Domaines d'expertise */}
        <div className="lg:col-span-7">
          <h2 className="section-title">
            Nos domaines <span className="text-brand-orange">d&apos;expertise</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card-hover group flex flex-col p-5"
              >
                <span
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg ${
                    s.accent === "orange"
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "bg-brand-blue/10 text-brand-blue"
                  }`}
                >
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-base font-bold text-navy-800 group-hover:text-brand-blue">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-navy-600">{s.short}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/services" className="btn-blue">
              Voir tous nos services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Accès espace administration */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-navy-800 p-6 text-white shadow-xl">
            <h2 className="text-xl font-extrabold uppercase">
              Accès espace <span className="text-brand-orange">d&apos;administration</span>
            </h2>
            <p className="mt-1 text-sm text-navy-100/70">
              Gérez efficacement vos activités en toute simplicité.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Espace clients */}
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="h-6 w-6 text-brand-blue" />
                  <h3 className="text-sm font-bold">ESPACE CLIENTS</h3>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-navy-100/80">
                  {clientFeatures.map((f) => (
                    <li key={f.label} className="flex items-center gap-2">
                      <f.icon className="h-3.5 w-3.5 text-brand-blue" />
                      {f.label}
                    </li>
                  ))}
                </ul>
                <Link href="/espace-client" className="btn-blue mt-4 w-full py-2 text-xs">
                  Se connecter
                </Link>
              </div>

              {/* Espace staff */}
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2">
                  <Users2 className="h-6 w-6 text-brand-orange" />
                  <h3 className="text-sm font-bold">ESPACE STAFF</h3>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-navy-100/80">
                  {staffFeatures.map((f) => (
                    <li key={f.label} className="flex items-center gap-2">
                      <f.icon className="h-3.5 w-3.5 text-brand-orange" />
                      {f.label}
                    </li>
                  ))}
                </ul>
                <Link href="/espace-staff" className="btn-primary mt-4 w-full py-2 text-xs">
                  Se connecter
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" /> Sécurisé & Confidentiel
                </h4>
                <p className="mt-0.5 text-xs text-navy-100/70">
                  Vos données sont protégées avec les plus hauts standards de sécurité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
