import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { QUOTE_STATUS_LABELS, formatMoney, type QuoteStatusName } from "@/lib/commerce";

export const metadata: Metadata = { title: "Mes devis" };
export const dynamic = "force-dynamic";

export default async function ClientQuotesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-client/devis");

  const quotes = await prisma.quote.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  function quoteAmount(items: { unitPrice: unknown; quantity: number }[]): number {
    return items.reduce((sum, i) => sum + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0);
  }

  return (
    <>
      <PageHeader title="Mes devis" crumbs={[{ label: "Espace clients", href: "/espace-client" }, { label: "Devis" }]} />
      <section className="container-cs section">
        <div className="mb-6 flex justify-end">
          <Link href="/espace-client/devis/nouveau" className="btn-primary">
            <Plus className="h-4 w-4" /> Nouvelle demande
          </Link>
        </div>
        {quotes.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-navy-100 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-navy-100" />
            <h2 className="mt-4 text-lg font-bold text-navy-800">Aucun devis</h2>
            <p className="mt-1 text-sm text-navy-600">Demandez un devis pour l&apos;un de nos services.</p>
            <Link href="/espace-client/devis/nouveau" className="btn-blue mt-6">Demander un devis</Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-navy-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase text-navy-600">
                <tr>
                  <th className="px-4 py-3">Référence</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {quotes.map((q) => {
                  const amount = quoteAmount(q.items);
                  return (
                    <tr key={q.id} className="hover:bg-navy-50/50">
                      <td className="px-4 py-3 font-semibold text-navy-800">{q.reference}</td>
                      <td className="px-4 py-3 text-navy-600">{q.service}</td>
                      <td className="px-4 py-3 text-navy-600">{q.createdAt.toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3 font-semibold text-navy-800">{amount > 0 ? formatMoney(amount) : "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={QUOTE_STATUS_LABELS[q.status as QuoteStatusName] ?? q.status} status={q.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/espace-client/devis/${q.reference}`} className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                          Détails <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
