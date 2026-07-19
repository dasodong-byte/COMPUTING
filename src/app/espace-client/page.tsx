import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, FileText, Bell, Heart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardShell, StatGrid } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Espace clients",
  description: "Accédez à votre espace client Computing Services SARL.",
};

export const dynamic = "force-dynamic";

export default async function EspaceClientPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-client");

  const [orders, quotes, notifications] = await Promise.all([
    prisma.order.count({ where: { user: { id: user.id }, deletedAt: null } }),
    prisma.quote.count({ where: { user: { id: user.id }, deletedAt: null } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);

  return (
    <>
      <PageHeader title="Espace clients" crumbs={[{ label: "Espace clients" }]} />
      <DashboardShell user={user} accent="blue">
        <StatGrid
          items={[
            { label: "Mes commandes", value: orders },
            { label: "Mes devis", value: quotes },
            { label: "Notifications", value: notifications },
            { label: "Favoris", value: 0 },
          ]}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/boutique" className="card group p-6 transition hover:border-brand-blue">
            <ShoppingBag className="h-7 w-7 text-brand-blue" />
            <h3 className="mt-3 font-bold text-navy-800">Commander du matériel</h3>
            <p className="mt-1 text-sm text-navy-600">Parcourez le catalogue et passez commande en ligne.</p>
          </Link>
          <Link href="/contact#devis" className="card group p-6 transition hover:border-brand-orange">
            <FileText className="h-7 w-7 text-brand-orange" />
            <h3 className="mt-3 font-bold text-navy-800">Demander un devis</h3>
            <p className="mt-1 text-sm text-navy-600">Sollicitez un devis pour l&apos;un de nos services.</p>
          </Link>
          <div className="card p-6">
            <Bell className="h-7 w-7 text-brand-blue" />
            <h3 className="mt-3 font-bold text-navy-800">Suivi de vos dossiers</h3>
            <p className="mt-1 text-sm text-navy-600">
              Le suivi détaillé des commandes et devis arrive dans la prochaine étape (Phase 2 — cœur commerce).
            </p>
          </div>
          <div className="card p-6">
            <Heart className="h-7 w-7 text-brand-orange" />
            <h3 className="mt-3 font-bold text-navy-800">Vos favoris</h3>
            <p className="mt-1 text-sm text-navy-600">Retrouvez ici les produits que vous suivez.</p>
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
