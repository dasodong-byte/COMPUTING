"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, CreditCard } from "lucide-react";

type PaymentMethod = { id: string; label: string };

export function QuoteClientActions({
  quoteId,
  status,
  paymentStatus,
  amount,
}: {
  quoteId: string;
  status: string;
  paymentStatus: string;
  amount: number;
}) {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [provider, setProvider] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => {
        setMethods(d.paymentMethods ?? []);
        if (d.paymentMethods?.[0]) setProvider(d.paymentMethods[0].id);
      })
      .catch(() => {});
  }, []);

  async function call(action: "accept" | "reject" | "pay") {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "pay" ? { action, provider } : { action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Action impossible.");
        setBusy(false);
        return;
      }
      if (data.message) setMessage(data.message);
      router.refresh();
      setBusy(false);
    } catch {
      setError("Erreur réseau.");
      setBusy(false);
    }
  }

  if (status === "QUOTED") {
    return (
      <div className="card p-6">
        <h3 className="font-bold text-navy-800">Validation du devis</h3>
        <p className="mt-1 text-sm text-navy-600">Acceptez le devis pour pouvoir procéder au paiement.</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => call("accept")} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Accepter le devis
          </button>
          <button onClick={() => call("reject")} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">
            <X className="h-4 w-4" /> Refuser
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  if (status === "ACCEPTED" && paymentStatus !== "PAID") {
    return (
      <div className="card p-6">
        <h3 className="font-bold text-navy-800">Paiement du service</h3>
        <p className="mt-1 text-sm text-navy-600">Montant à régler : <strong>{amount.toLocaleString("fr-FR")}</strong></p>
        <div className="mt-4 space-y-2">
          {methods.map((m, i) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-navy-100 p-3 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-navy-50">
              <input type="radio" name="qprovider" value={m.id} checked={provider === m.id} onChange={() => setProvider(m.id)} defaultChecked={i === 0} className="h-4 w-4 accent-brand-blue" />
              {m.label}
            </label>
          ))}
        </div>
        <button onClick={() => call("pay")} disabled={busy || !provider} className="btn-primary mt-4">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} Payer
        </button>
        {message && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">{message}</p>}
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return null;
}
