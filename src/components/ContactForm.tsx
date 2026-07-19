"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/services";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-lg font-bold text-navy-800">Demande envoyée !</h3>
        <p className="mt-1 text-sm text-navy-600">
          Merci, notre équipe vous recontactera sous 24h.
        </p>
        <button onClick={() => setSent(false)} className="btn-ghost mt-6">
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <Field label="Nom complet" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Téléphone" name="phone" type="tel" />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-800">Service concerné</label>
        <select
          name="service"
          className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
        >
          <option value="">Sélectionner…</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
          <option value="autre">Autre</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-navy-800">Votre message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          placeholder="Décrivez votre projet ou votre besoin…"
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Envoyer ma demande <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
      />
    </div>
  );
}
