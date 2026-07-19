import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata: Metadata = {
  title: "Espace staff",
  description: "Accédez à l'espace staff Computing Services SARL.",
};

export default function EspaceStaffPage() {
  return (
    <>
      <PageHeader title="Espace staff" crumbs={[{ label: "Espace staff" }]} />
      <section className="container-cs section">
        <LoginPanel title="Espace Staff" accent="orange" />
      </section>
    </>
  );
}
