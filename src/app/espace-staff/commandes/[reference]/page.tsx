import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderActions } from "@/components/dashboard/OrderActions";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatMoney,
  type OrderStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Traitement de la commande" };
export const dynamic = "force-dynamic";

export default async function StaffOrderDetailPage({ params }: { params: { reference: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/espace-staff/commandes/${params.reference}`);
  if (!hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN])) redirect("/espace-client?denied=1");

  const order = await prisma.order.findFirst({
    where: { reference: params.reference, deletedAt: null },
    include: { items: true, payment: true, invoice: true, delivery: true, user: true },
  });
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={`Commande ${order.reference}`}
        crumbs={[{ label: "Espace staff", href: "/espace-staff" }, { label: "Commandes", href: "/espace-staff/commandes" }, { label: order.reference }]}
      />
      <section className="container-cs section grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-navy-800">Actions</h2>
            <div className="mt-4">
              <OrderActions orderId={order.id} status={order.status} paymentStatus={order.payment?.status ?? "PENDING"} />
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-navy-800">Articles</h2>
            <ul className="mt-4 divide-y divide-navy-100 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3">
                  <span className="text-navy-800">{i.name} <span className="text-navy-600">× {i.quantity}</span></span>
                  <span className="font-semibold text-navy-800">{formatMoney(Number(i.unitPrice) * i.quantity, order.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-navy-100 pt-3 text-right text-base font-bold text-navy-800">
              Total : {formatMoney(Number(order.total), order.currency)}
            </p>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Statuts</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge label={ORDER_STATUS_LABELS[order.status as OrderStatusName]} status={order.status} />
              {order.payment && <StatusBadge label={PAYMENT_STATUS_LABELS[order.payment.status] ?? order.payment.status} status={order.payment.status} />}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Client</h3>
            <p className="mt-2 text-sm text-navy-600">{order.user ? `${order.user.firstName} ${order.user.lastName}` : "—"}</p>
            <p className="text-sm text-navy-600">{order.user?.email}</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Livraison</h3>
            <p className="mt-2 text-sm text-navy-600">{order.delivery?.address}, {order.delivery?.city}</p>
            <p className="text-sm text-navy-600">Méthode paiement : {order.payment?.method}</p>
          </div>
          <Link href="/espace-staff/commandes" className="btn-ghost w-full">Retour à la liste</Link>
        </aside>
      </section>
    </>
  );
}
