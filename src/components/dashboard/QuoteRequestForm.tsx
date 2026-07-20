"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { SERVICES } from "@/lib/services";

export function QuoteRequestForm({ defaultService }: { defaultService?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      service: String(form.get("service") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      router.push("/espace-client/devis");
      router.refresh();
    } catch {
      setError("Impossible d'envoyer la demande. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <form className="card space-y-4 p-6" onSubmit={onSubmit}>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-800">Service concerné *</label>
        <select
          name="service"
          required
          defaultValue={defaultService ?? ""}
          className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
        >
          <option value="" disabled>Sélectionner…</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-800">Votre besoin *</label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Décrivez votre projet, vos délais et votre budget éventuel…"
          className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className={`btn-primary ${loading ? "opacity-70" : ""}`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Envoyer ma demande de devis
      </button>
    </form>
  );
}
