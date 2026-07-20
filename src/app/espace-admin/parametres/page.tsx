import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole, ROLES } from "@/lib/auth/rbac";
import { getSettings } from "@/lib/settings";
import { isStripeReady } from "@/lib/payments/stripe";

export const metadata: Metadata = { title: "Paramètres de la plateforme" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-admin/parametres");
  if (!hasRole(user.roles, ROLES.ADMIN)) redirect("/espace-client?denied=1");

  const settings = await getSettings();

  return (
    <>
      <PageHeader title="Paramètres de la plateforme" crumbs={[{ label: "Espace admin", href: "/espace-admin" }, { label: "Paramètres" }]} />
      <section className="container-cs section">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 rounded-xl border border-navy-100 bg-navy-50 p-4 text-sm text-navy-700">
            <p>
              <strong>Mode paiement :</strong>{" "}
              {settings.autoPaymentsEnabled ? "Automatique" : "Manuel (validation par un administrateur)"}.{" "}
              <strong>Stripe :</strong> {isStripeReady() ? "clés configurées" : "clés absentes — validation manuelle en repli"}.
            </p>
          </div>
          <SettingsForm initial={settings} />
        </div>
      </section>
    </>
  );
}
