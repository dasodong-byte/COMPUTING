import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Computing Services SARL.",
};

export default function ConnexionPage() {
  return (
    <>
      <PageHeader title="Connexion" crumbs={[{ label: "Connexion" }]} />
      <section className="container-cs section">
        <Suspense>
          <LoginPanel title="Connexion" accent="blue" mode="login" />
        </Suspense>
      </section>
    </>
  );
}
