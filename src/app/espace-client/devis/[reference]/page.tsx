import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { QuoteClientActions } from "@/components/dashboard/QuoteClientActions";
import { InvoiceDownload } from "@/components/dashboard/InvoiceDownload";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  QUOTE_STATUS_LABELS,
  EXEC_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatMoney,
  type QuoteStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Détail du devis" };
export const dynamic = "force-dynamic";

export default async function ClientQuoteDetailPage({ params }: { params: { reference: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/espace-client/devis/${params.reference}`);

  const quote = await prisma.quote.findFirst({
    where: { reference: params.reference, userId: user.id, deletedAt: null },
    include: { items: true },
  });
  if (!quote) notFound();

  const amount = quote.items.reduce((s, i) => s + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0);

  return (
    <>
      <PageHeader
        title={`Devis ${quote.reference}`}
        crumbs={[{ label: "Espace clients", href: "/espace-client" }, { label: "Devis", href: "/espace-client/devis" }, { label: quote.reference }]}
      />
      <section className="container-cs section">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-800">{quote.service}</h2>
              <StatusBadge label={QUOTE_STATUS_LABELS[quote.status as QuoteStatusName] ?? quote.status} status={quote.status} />
            </div>
            <p className="mt-4 whitespace-pre-line text-sm text-navy-600">{quote.message}</p>
          </div>

          {quote.items.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold text-navy-800">Détail chiffré</h3>
              <ul className="mt-3 divide-y divide-navy-100 text-sm">
                {quote.items.map((i) => (
                  <li key={i.id} className="flex justify-between py-2">
                    <span className="text-navy-800">{i.label} <span className="text-navy-600">× {i.quantity}</span></span>
                    <span className="font-semibold text-navy-800">{i.unitPrice ? formatMoney(Number(i.unitPrice) * i.quantity) : "—"}</span>
                  </li>
                ))}
              </ul>
              {amount > 0 && (
                <p className="mt-3 border-t border-navy-100 pt-3 text-right text-base font-bold text-navy-800">
                  Total : {formatMoney(amount)}
                </p>
              )}
            </div>
          )}

          <div className="card p-6">
            <h3 className="font-bold text-navy-800">Suivi du service</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-600">Paiement</dt>
                <dd><StatusBadge label={PAYMENT_STATUS_LABELS[quote.paymentStatus] ?? quote.paymentStatus} status={quote.paymentStatus} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-600">Exécution</dt>
                <dd><StatusBadge label={EXEC_STATUS_LABELS[quote.execStatus] ?? quote.execStatus} status={quote.execStatus} /></dd>
              </div>
              {quote.invoiceNumber && (
                <div className="flex justify-between">
                  <dt className="text-navy-600">Facture</dt>
                  <dd className="font-semibold text-navy-800">{quote.invoiceNumber}</dd>
                </div>
              )}
            </dl>
            {quote.paymentStatus === "PAID" && (
              <div className="mt-4">
                <InvoiceDownload href={`/espace-client/devis/${quote.reference}/facture`} />
              </div>
            )}
          </div>

          <QuoteClientActions
            quoteId={quote.id}
            status={quote.status}
            paymentStatus={quote.paymentStatus}
            amount={amount}
          />

          <Link href="/espace-client/devis" className="btn-ghost">Retour à mes devis</Link>
        </div>
      </section>
    </>
  );
}
