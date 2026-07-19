import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatMoney,
  type OrderStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Gestion des commandes" };
export const dynamic = "force-dynamic";

export default async function StaffOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-staff/commandes");
  if (!hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN])) redirect("/espace-client?denied=1");

  const orders = await prisma.order.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true, user: true },
  });

  return (
    <>
      <PageHeader title="Gestion des commandes" crumbs={[{ label: "Espace staff", href: "/espace-staff" }, { label: "Commandes" }]} />
      <section className="container-cs section">
        {orders.length === 0 ? (
          <p className="text-navy-600">Aucune commande pour le moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-navy-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase text-navy-600">
                <tr>
                  <th className="px-4 py-3">Référence</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3 font-semibold text-navy-800">{o.reference}</td>
                    <td className="px-4 py-3 text-navy-600">{o.user ? `${o.user.firstName} ${o.user.lastName}` : "—"}</td>
                    <td className="px-4 py-3 text-navy-600">{o.createdAt.toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{formatMoney(Number(o.total), o.currency)}</td>
                    <td className="px-4 py-3">
                      {o.payment && <StatusBadge label={PAYMENT_STATUS_LABELS[o.payment.status] ?? o.payment.status} status={o.payment.status} />}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={ORDER_STATUS_LABELS[o.status as OrderStatusName]} status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/espace-staff/commandes/${o.reference}`} className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                        Gérer <ArrowRight className="h-3.5 w-3.5" />
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
