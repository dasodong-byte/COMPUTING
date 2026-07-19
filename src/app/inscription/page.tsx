import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte client Computing Services SARL.",
};

export default function InscriptionPage() {
  return (
    <>
      <PageHeader title="Créer un compte" crumbs={[{ label: "Inscription" }]} />
      <section className="container-cs section">
        <Suspense>
          <LoginPanel title="Créer un compte" accent="orange" mode="register" />
        </Suspense>
      </section>
    </>
  );
}
