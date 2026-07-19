import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata: Metadata = {
  title: "Espace clients",
  description: "Accédez à votre espace client Computing Services SARL.",
};

export default function EspaceClientPage() {
  return (
    <>
      <PageHeader title="Espace clients" crumbs={[{ label: "Espace clients" }]} />
      <section className="container-cs section">
        <LoginPanel title="Espace Clients" accent="blue" />
      </section>
    </>
  );
}
