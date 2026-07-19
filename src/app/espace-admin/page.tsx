import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Package, ShoppingCart, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardShell, StatGrid } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Espace administration",
  description: "Tableau de bord d'administration Computing Services SARL.",
};

export const dynamic = "force-dynamic";

export default async function EspaceAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-admin");
  if (!hasRole(user.roles, ROLES.ADMIN)) redirect("/espace-client?denied=1");

  const [users, products, orders, quotes, revenueAgg, taxAgg, pendingPayments, lowStock, openDeliveries, settings, paidQuotes] =
    await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.order.count({ where: { deletedAt: null } }),
      prisma.quote.count({ where: { deletedAt: null } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
      prisma.order.aggregate({ _sum: { tax: true }, where: { payment: { status: "PAID" } } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { deletedAt: null, stock: { lte: 5 } } }),
      prisma.delivery.count({ where: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } } }),
      getSettings(),
      prisma.quote.findMany({ where: { paymentStatus: "PAID" }, include: { items: true } }),
    ]);

  const revenue = revenueAgg._sum.amount ? Number(revenueAgg._sum.amount) : 0;
  const taxCollected = taxAgg._sum.tax ? Number(taxAgg._sum.tax) : 0;
  const serviceRevenue = paidQuotes.reduce(
    (sum, q) => sum + q.items.reduce((s, i) => s + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0),
    0
  );
  const commission = Math.round(serviceRevenue * (settings.commissionRate / 100) * 100) / 100;

  return (
    <>
      <PageHeader title="Administration" crumbs={[{ label: "Administration" }]} />
      <DashboardShell user={user} accent="blue">
        <StatGrid
          items={[
            { label: "Revenu produits encaissé", value: `${revenue.toLocaleString("fr-FR")} ${settings.currency}` },
            { label: "Revenu services encaissé", value: `${serviceRevenue.toLocaleString("fr-FR")} ${settings.currency}` },
            { label: `TVA collectée (${settings.taxRate}%)`, value: `${taxCollected.toLocaleString("fr-FR")} ${settings.currency}` },
            { label: `Commission services (${settings.commissionRate}%)`, value: `${commission.toLocaleString("fr-FR")} ${settings.currency}` },
          ]}
        />
        <div className="mt-4">
          <StatGrid
            items={[
              { label: "Utilisateurs", value: users },
              { label: "Produits", value: products },
              { label: "Commandes", value: orders },
              { label: "Devis / services", value: quotes },
            ]}
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">À traiter</p>
            <p className="mt-2 text-2xl font-extrabold text-navy-800">{pendingPayments}</p>
            <p className="text-sm text-navy-600">paiements en attente de validation</p>
          </div>
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Livraisons</p>
            <p className="mt-2 text-2xl font-extrabold text-navy-800">{openDeliveries}</p>
            <p className="text-sm text-navy-600">livraisons produits en cours</p>
          </div>
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Stock</p>
            <p className="mt-2 text-2xl font-extrabold text-navy-800">{lowStock}</p>
            <p className="text-sm text-navy-600">produits à réapprovisionner (≤ 5)</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Utilisateurs & rôles", desc: `${users} comptes`, href: "/espace-staff" },
            { icon: Package, label: "Catalogue", desc: `${products} produits`, href: "/espace-staff/commandes" },
            { icon: ShoppingCart, label: "Commandes & devis", desc: `${orders + quotes} dossiers`, href: "/espace-staff/devis" },
            { icon: Settings, label: "Paramètres", desc: "Paiements, taxes, livraisons", href: "/espace-admin/parametres" },
          ].map((c) => (
            <Link key={c.label} href={c.href} className="card p-6 transition hover:border-brand-blue">
              <c.icon className="h-7 w-7 text-brand-blue" />
              <h3 className="mt-3 font-bold text-navy-800">{c.label}</h3>
              <p className="mt-1 text-sm text-navy-600">{c.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 card p-6">
          <h3 className="font-bold text-navy-800">Configuration active</h3>
          <p className="mt-1 text-sm text-navy-600">
            Mode paiement : <strong>{settings.autoPaymentsEnabled ? "automatique" : "manuel"}</strong> · Devise :{" "}
            <strong>{settings.currency}</strong> · Moyens actifs :{" "}
            {[
              settings.cashEnabled && "Espèces",
              settings.bankTransferEnabled && "Virement",
              settings.stripeEnabled && "Stripe",
              settings.mpesaEnabled && "M-Pesa",
              settings.orangeEnabled && "Orange Money",
              settings.airtelEnabled && "Airtel Money",
            ]
              .filter(Boolean)
              .join(", ") || "aucun"}
            .
          </p>
          <Link href="/espace-admin/parametres" className="btn-blue mt-4 w-fit">
            Ouvrir les paramètres
          </Link>
        </div>
      </DashboardShell>
    </>
  );
}
