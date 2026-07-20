import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InvoiceDownload } from "@/components/dashboard/InvoiceDownload";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatMoney,
  type OrderStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Détail de la commande" };
export const dynamic = "force-dynamic";

export default async function ClientOrderDetailPage({ params }: { params: { reference: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/espace-client/commandes/${params.reference}`);

  const order = await prisma.order.findFirst({
    where: { reference: params.reference, userId: user.id, deletedAt: null },
    include: { items: true, payment: true, invoice: true, delivery: true },
  });
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={`Commande ${order.reference}`}
        crumbs={[{ label: "Espace clients", href: "/espace-client" }, { label: "Commandes", href: "/espace-client/commandes" }, { label: order.reference }]}
      />
      <section className="container-cs section grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-800">Articles</h2>
              <StatusBadge label={ORDER_STATUS_LABELS[order.status as OrderStatusName]} status={order.status} />
            </div>
            <ul className="mt-4 divide-y divide-navy-100 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3">
                  <span className="text-navy-800">{i.name} <span className="text-navy-600">× {i.quantity}</span></span>
                  <span className="font-semibold text-navy-800">{formatMoney(Number(i.unitPrice) * i.quantity, order.currency)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-navy-600">Sous-total</dt><dd>{formatMoney(Number(order.subtotal), order.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy-600">Livraison</dt><dd>{Number(order.shipping) === 0 ? "Offerte" : formatMoney(Number(order.shipping), order.currency)}</dd></div>
              {Number(order.tax) > 0 && <div className="flex justify-between"><dt className="text-navy-600">TVA</dt><dd>{formatMoney(Number(order.tax), order.currency)}</dd></div>}
              <div className="flex justify-between border-t border-navy-100 pt-2 text-base font-bold text-navy-800"><dt>Total</dt><dd>{formatMoney(Number(order.total), order.currency)}</dd></div>
            </dl>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Paiement</h3>
            <p className="mt-2 text-sm text-navy-600">Méthode : {order.payment?.method ?? "—"}</p>
            <div className="mt-2">
              {order.payment && (
                <StatusBadge label={PAYMENT_STATUS_LABELS[order.payment.status] ?? order.payment.status} status={order.payment.status} />
              )}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Livraison</h3>
            <p className="mt-2 text-sm text-navy-600">{order.delivery?.address}, {order.delivery?.city}</p>
            {order.delivery?.tracking && (
              <p className="mt-1 text-sm text-navy-600">Suivi : {order.delivery.tracking}</p>
            )}
          </div>
          {order.invoice && (
            <div className="card p-6">
              <h3 className="font-bold text-navy-800">Facture</h3>
              <p className="mt-2 text-sm text-navy-600">N° {order.invoice.number}</p>
              <p className="text-sm text-navy-600">Montant : {formatMoney(Number(order.invoice.amount), order.currency)}</p>
              <div className="mt-3">
                <InvoiceDownload href={`/espace-client/commandes/${order.reference}/facture`} />
              </div>
            </div>
          )}
          <Link href="/espace-client/commandes" className="btn-ghost w-full">Retour à mes commandes</Link>
        </aside>
      </section>
    </>
  );
}
