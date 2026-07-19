import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { PAYMENT_STATUS_LABELS } from "@/lib/commerce";
import { InvoiceDocument } from "@/components/dashboard/InvoiceDocument";

export const metadata: Metadata = { title: "Facture" };
export const dynamic = "force-dynamic";

export default async function OrderInvoicePage({ params }: { params: { reference: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/espace-client/commandes/${params.reference}/facture`);

  const isStaff = hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN]);
  const order = await prisma.order.findFirst({
    where: { reference: params.reference, deletedAt: null, ...(isStaff ? {} : { userId: user.id }) },
    include: { items: true, invoice: true, payment: true, user: true },
  });
  if (!order) notFound();

  return (
    <InvoiceDocument
      data={{
        number: order.invoice?.number ?? order.reference,
        reference: order.reference,
        date: order.invoice?.issuedAt ?? order.createdAt,
        status: PAYMENT_STATUS_LABELS[order.payment?.status ?? "PENDING"] ?? "En attente",
        currency: order.currency,
        customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : "Client",
        customerEmail: order.user?.email ?? "",
        lines: order.items.map((i) => ({ label: i.name, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        total: Number(order.total),
        kind: "Produits",
      }}
    />
  );
}
