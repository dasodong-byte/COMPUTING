import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteRequestForm } from "@/components/dashboard/QuoteRequestForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nouvelle demande de devis" };
export const dynamic = "force-dynamic";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-client/devis/nouveau");

  return (
    <>
      <PageHeader
        title="Demander un devis"
        crumbs={[{ label: "Espace clients", href: "/espace-client" }, { label: "Devis", href: "/espace-client/devis" }, { label: "Nouvelle demande" }]}
      />
      <section className="container-cs section">
        <div className="mx-auto max-w-2xl">
          <QuoteRequestForm defaultService={searchParams.service} />
        </div>
      </section>
    </>
  );
}
