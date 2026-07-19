"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Action = "quote" | "accept" | "reject" | "close";

export function QuoteActions({ quoteId, status }: { quoteId: string; status: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState("");

  async function run(action: Action) {
    setError("");
    setBusy(action);
    const payload: { action: Action; amount?: number } = { action };
    if (action === "quote") {
      const value = Number(amount);
      if (!value || value <= 0) {
        setError("Saisissez un montant valide.");
        setBusy(null);
        return;
      }
      payload.amount = value;
    }
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Action impossible.");
        setBusy(null);
        return;
      }
      router.refresh();
      setBusy(null);
    } catch {
      setError("Erreur réseau.");
      setBusy(null);
    }
  }

  const closed = status === "CLOSED" || status === "REJECTED";

  return (
    <div className="mt-4 border-t border-navy-100 pt-4">
      {!closed && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-600">Montant du devis (USD)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <button
            onClick={() => run("quote")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {busy === "quote" && <Loader2 className="h-4 w-4 animate-spin" />}
            Proposer le devis
          </button>
          <button
            onClick={() => run("accept")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {busy === "accept" && <Loader2 className="h-4 w-4 animate-spin" />}
            Marquer accepté
          </button>
          <button
            onClick={() => run("reject")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            {busy === "reject" && <Loader2 className="h-4 w-4 animate-spin" />}
            Refuser
          </button>
          <button
            onClick={() => run("close")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-2 text-sm font-medium text-navy-800 hover:border-brand-blue"
          >
            {busy === "close" && <Loader2 className="h-4 w-4 animate-spin" />}
            Clôturer
          </button>
        </div>
      )}
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
