import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardShell, StatGrid } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Espace staff",
  description: "Accédez à l'espace staff Computing Services SARL.",
};

export const dynamic = "force-dynamic";

export default async function EspaceStaffPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-staff");
  if (!hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN])) redirect("/espace-client?denied=1");

  const [pendingOrders, newQuotes, unhandledMessages, products] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.quote.count({ where: { status: "NEW", deletedAt: null } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.product.count({ where: { deletedAt: null } }),
  ]);

  return (
    <>
      <PageHeader title="Espace staff" crumbs={[{ label: "Espace staff" }]} />
      <DashboardShell user={user} accent="orange">
        <StatGrid
          items={[
            { label: "Commandes à traiter", value: pendingOrders },
            { label: "Nouveaux devis", value: newQuotes },
            { label: "Messages non traités", value: unhandledMessages },
            { label: "Produits au catalogue", value: products },
          ]}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/espace-staff/commandes" className="card group p-6 transition hover:border-brand-blue">
            <ShoppingCart className="h-7 w-7 text-brand-blue" />
            <h3 className="mt-3 font-bold text-navy-800">Gérer les commandes</h3>
            <p className="mt-1 text-sm text-navy-600">
              Valider les paiements, faire avancer les commandes (préparation, expédition, livraison) et gérer le stock.
            </p>
          </Link>
          <Link href="/espace-staff/devis" className="card group p-6 transition hover:border-brand-orange">
            <FileText className="h-7 w-7 text-brand-orange" />
            <h3 className="mt-3 font-bold text-navy-800">Gérer les devis</h3>
            <p className="mt-1 text-sm text-navy-600">
              Chiffrer les demandes de service, proposer un montant et suivre l&apos;acceptation.
            </p>
          </Link>
        </div>
      </DashboardShell>
    </>
  );
}
