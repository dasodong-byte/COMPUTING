import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & demande de devis",
  description:
    "Contactez Computing Services SARL à Kinshasa. Demandez un devis gratuit et personnalisé sous 24h.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contactez-nous"
        subtitle="Une question, un projet ? Demandez votre devis gratuit — réponse sous 24h."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-cs section grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: MapPin, title: "Adresse", value: `${SITE.address.street}, ${SITE.address.city}` },
            { icon: Phone, title: "Téléphone", value: SITE.phone, href: `tel:${SITE.phone}` },
            { icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: Clock, title: "Disponibilité", value: "Support 24h/7j" },
          ].map((c) => (
            <div key={c.title} className="card flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-navy-800">{c.title}</div>
                {c.href ? (
                  <a href={c.href} className="text-sm text-navy-600 hover:text-brand-blue">{c.value}</a>
                ) : (
                  <div className="text-sm text-navy-600">{c.value}</div>
                )}
              </div>
            </div>
          ))}
          <div className="overflow-hidden rounded-xl border border-navy-100">
            <iframe
              title="Localisation Computing Services SARL"
              src="https://www.openstreetmap.org/export/embed.html?bbox=15.28%2C-4.32%2C15.33%2C-4.29&layer=mapnik"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>

        <div id="devis" className="lg:col-span-2">
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-800">Demander un devis</h2>
            <p className="mt-1 text-sm text-navy-600">
              Remplissez le formulaire ci-dessous, un conseiller vous répondra rapidement.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
