import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
        <div className="mt-8 card p-6">
          <h3 className="font-bold text-navy-800">Opérations</h3>
          <p className="mt-1 text-sm text-navy-600">
            La gestion des commandes, devis, stocks et livraisons sera activée à l&apos;étape suivante (Phase 2 — cœur
            commerce &amp; workflows). Les fondations (authentification, rôles, base de données) sont en place.
          </p>
        </div>
      </DashboardShell>
    </>
  );
}
