import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_LABELS,
  formatMoney,
  type OrderStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Mes commandes" };
export const dynamic = "force-dynamic";

export default async function ClientOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-client/commandes");

  const orders = await prisma.order.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true },
  });

  return (
    <>
      <PageHeader title="Mes commandes" crumbs={[{ label: "Espace clients", href: "/espace-client" }, { label: "Commandes" }]} />
      <section className="container-cs section">
        {orders.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-navy-100 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-navy-100" />
            <h2 className="mt-4 text-lg font-bold text-navy-800">Aucune commande</h2>
            <p className="mt-1 text-sm text-navy-600">Passez votre première commande depuis la boutique.</p>
            <Link href="/boutique" className="btn-blue mt-6">Aller à la boutique</Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-navy-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase text-navy-600">
                <tr>
                  <th className="px-4 py-3">Référence</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Articles</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3 font-semibold text-navy-800">{o.reference}</td>
                    <td className="px-4 py-3 text-navy-600">{o.createdAt.toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 text-navy-600">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{formatMoney(Number(o.total), o.currency)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={ORDER_STATUS_LABELS[o.status as OrderStatusName]} status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/espace-client/commandes/${o.reference}`} className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                        Détails <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
