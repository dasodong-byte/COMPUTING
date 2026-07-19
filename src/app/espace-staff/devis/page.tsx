import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { QuoteActions } from "@/components/dashboard/QuoteActions";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import {
  QUOTE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  EXEC_STATUS_LABELS,
  formatMoney,
  type QuoteStatusName,
} from "@/lib/commerce";

export const metadata: Metadata = { title: "Gestion des devis" };
export const dynamic = "force-dynamic";

export default async function StaffQuotesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-staff/devis");
  if (!hasRole(user.roles, [ROLES.STAFF, ROLES.ADMIN])) redirect("/espace-client?denied=1");

  const [quotes, employees] = await Promise.all([
    prisma.quote.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { items: true, user: true, assignedTo: { include: { user: true } } },
    }),
    prisma.employee.findMany({ where: { deletedAt: null }, include: { user: true } }),
  ]);
  const employeeOptions = employees.map((e) => ({
    id: e.id,
    name: `${e.user.firstName} ${e.user.lastName}${e.jobTitle ? ` — ${e.jobTitle}` : ""}`,
  }));

  return (
    <>
      <PageHeader title="Gestion des devis" crumbs={[{ label: "Espace staff", href: "/espace-staff" }, { label: "Devis" }]} />
      <section className="container-cs section space-y-4">
        {quotes.length === 0 ? (
          <p className="text-navy-600">Aucune demande de devis pour le moment.</p>
        ) : (
          quotes.map((q) => {
            const amount = q.items.reduce((s, i) => s + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0);
            return (
              <div key={q.id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy-800">{q.reference} — {q.service}</p>
                    <p className="text-xs text-navy-600">
                      {q.user ? `${q.user.firstName} ${q.user.lastName} · ${q.user.email}` : "—"} ·{" "}
                      {q.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {amount > 0 && <span className="text-sm font-semibold text-navy-800">{formatMoney(amount)}</span>}
                    <StatusBadge label={QUOTE_STATUS_LABELS[q.status as QuoteStatusName] ?? q.status} status={q.status} />
                    <StatusBadge label={`Paiement : ${PAYMENT_STATUS_LABELS[q.paymentStatus] ?? q.paymentStatus}`} status={q.paymentStatus} />
                    <StatusBadge label={`Exéc. : ${EXEC_STATUS_LABELS[q.execStatus] ?? q.execStatus}`} status={q.execStatus} />
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-navy-600">{q.message}</p>
                {q.assignedTo && (
                  <p className="mt-2 text-xs text-navy-600">Affecté à : <span className="font-medium text-navy-800">{q.assignedTo.user.firstName} {q.assignedTo.user.lastName}</span></p>
                )}
                <QuoteActions
                  quoteId={q.id}
                  status={q.status}
                  paymentStatus={q.paymentStatus}
                  execStatus={q.execStatus}
                  employees={employeeOptions}
                />
              </div>
            );
          })
        )}
      </section>
    </>
  );
}
