import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { ROLE_LABELS, type RoleName } from "@/lib/auth/rbac";
import { LogoutButton } from "./LogoutButton";

export type StatItem = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-600">{s.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-navy-800">{s.value}</p>
          {s.hint && <p className="mt-1 text-xs text-navy-600">{s.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export function DashboardShell({
  user,
  accent,
  children,
}: {
  user: { name: string; email: string; roles: string[] };
  accent: "blue" | "orange";
  children: React.ReactNode;
}) {
  const badge =
    accent === "orange"
      ? "bg-brand-orange/10 text-brand-orange"
      : "bg-brand-blue/10 text-brand-blue";

  return (
    <section className="container-cs section">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge}`}>
            <LayoutDashboard className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-navy-800">Bonjour, {user.name}</h2>
            <p className="text-sm text-navy-600">
              {user.email} ·{" "}
              {user.roles.map((r) => ROLE_LABELS[r as RoleName] ?? r).join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-navy-100 px-4 py-2 text-sm font-medium text-navy-800 hover:border-brand-blue hover:text-brand-blue"
          >
            Retour au site
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </section>
  );
}
