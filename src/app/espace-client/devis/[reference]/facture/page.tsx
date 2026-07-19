import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { PAYMENT_STATUS_LABELS } from "@/lib/commerce";
import { InvoiceDocument } from "@/components/dashboard/InvoiceDocument";

export const metadata: Metadata = { title: "Facture de service" };
export const dynamic = "force-dynamic";

export default async function QuoteInvoicePage({ params }: { params: { reference: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/espace-client/devis/${params.reference}/facture`);

  const isStaff = hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN]);
  const quote = await prisma.quote.findFirst({
    where: { reference: params.reference, deletedAt: null, ...(isStaff ? {} : { userId: user.id }) },
    include: { items: true, user: true },
  });
  if (!quote) notFound();
  if (quote.paymentStatus !== "PAID" && !isStaff) notFound();

  const lines = quote.items
    .filter((i) => i.unitPrice)
    .map((i) => ({ label: i.label, quantity: i.quantity, unitPrice: Number(i.unitPrice) }));
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  return (
    <InvoiceDocument
      data={{
        number: quote.invoiceNumber ?? quote.reference,
        reference: quote.reference,
        date: quote.paidAt ?? quote.createdAt,
        status: PAYMENT_STATUS_LABELS[quote.paymentStatus] ?? "En attente",
        currency: quote.currency,
        customerName: quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : "Client",
        customerEmail: quote.user?.email ?? "",
        lines: lines.length > 0 ? lines : [{ label: quote.service ?? "Service", quantity: 1, unitPrice: subtotal }],
        subtotal,
        total: subtotal,
        kind: "Service",
      }}
    />
  );
}
