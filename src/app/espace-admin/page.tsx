import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Package, ShoppingCart, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardShell, StatGrid } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Espace administration",
  description: "Tableau de bord d'administration Computing Services SARL.",
};

export const dynamic = "force-dynamic";

export default async function EspaceAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-admin");
  if (!hasRole(user.roles, ROLES.ADMIN)) redirect("/espace-client?denied=1");

  const [users, products, orders, quotes, revenueAgg] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.count({ where: { deletedAt: null } }),
    prisma.quote.count({ where: { deletedAt: null } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
  ]);

  const revenue = revenueAgg._sum.amount ? Number(revenueAgg._sum.amount) : 0;

  return (
    <>
      <PageHeader title="Administration" crumbs={[{ label: "Administration" }]} />
      <DashboardShell user={user} accent="blue">
        <StatGrid
          items={[
            { label: "Utilisateurs", value: users },
            { label: "Produits", value: products },
            { label: "Commandes", value: orders },
            { label: "Chiffre encaissé", value: `${revenue.toLocaleString("fr-FR")} USD` },
          ]}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Utilisateurs & rôles", desc: `${users} comptes` },
            { icon: Package, label: "Catalogue", desc: `${products} produits` },
            { icon: ShoppingCart, label: "Commandes & devis", desc: `${orders + quotes} dossiers` },
            { icon: Settings, label: "Configuration", desc: "Paiements, taxes, livraisons" },
          ].map((c) => (
            <div key={c.label} className="card p-6">
              <c.icon className="h-7 w-7 text-brand-blue" />
              <h3 className="mt-3 font-bold text-navy-800">{c.label}</h3>
              <p className="mt-1 text-sm text-navy-600">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 card p-6">
          <h3 className="font-bold text-navy-800">Prochaines étapes</h3>
          <p className="mt-1 text-sm text-navy-600">
            Le module de configuration (paiements manuels/automatiques, Stripe, Mobile Money, taxes, livraisons) et la
            gestion complète des commandes seront livrés dans les étapes suivantes de la Phase 2.
          </p>
          <Link href="/" className="btn-blue mt-4 w-fit">
            Retour au site
          </Link>
        </div>
      </DashboardShell>
    </>
  );
}
