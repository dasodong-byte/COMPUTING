"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Action =
  | "quote"
  | "accept"
  | "reject"
  | "close"
  | "validate_payment"
  | "refuse_payment"
  | "assign"
  | "start"
  | "deliver";

type Employee = { id: string; name: string };

export function QuoteActions({
  quoteId,
  status,
  paymentStatus,
  execStatus,
  employees,
}: {
  quoteId: string;
  status: string;
  paymentStatus: string;
  execStatus: string;
  employees: Employee[];
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState("");

  async function run(action: Action) {
    setError("");
    setBusy(action);
    const payload: { action: Action; amount?: number; employeeId?: string } = { action };
    if (action === "quote") {
      const value = Number(amount);
      if (!value || value <= 0) {
        setError("Saisissez un montant valide.");
        setBusy(null);
        return;
      }
      payload.amount = value;
    }
    if (action === "assign") {
      if (!employeeId) {
        setError("Choisissez un collaborateur.");
        setBusy(null);
        return;
      }
      payload.employeeId = employeeId;
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
  const btn = "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60";

  return (
    <div className="mt-4 space-y-4 border-t border-navy-100 pt-4">
      {!closed && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Devis</p>
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
            <button onClick={() => run("quote")} disabled={busy !== null} className={`${btn} bg-brand-blue text-white hover:opacity-90`}>
              {busy === "quote" && <Loader2 className="h-4 w-4 animate-spin" />} Proposer le devis
            </button>
            <button onClick={() => run("accept")} disabled={busy !== null} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
              {busy === "accept" && <Loader2 className="h-4 w-4 animate-spin" />} Marquer accepté
            </button>
            <button onClick={() => run("reject")} disabled={busy !== null} className={`${btn} border border-rose-200 text-rose-700 hover:bg-rose-50`}>
              {busy === "reject" && <Loader2 className="h-4 w-4 animate-spin" />} Refuser
            </button>
          </div>
        </div>
      )}

      {paymentStatus !== "PAID" && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Paiement</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => run("validate_payment")} disabled={busy !== null} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
              {busy === "validate_payment" && <Loader2 className="h-4 w-4 animate-spin" />} Valider le paiement
            </button>
            <button onClick={() => run("refuse_payment")} disabled={busy !== null} className={`${btn} border border-rose-200 text-rose-700 hover:bg-rose-50`}>
              {busy === "refuse_payment" && <Loader2 className="h-4 w-4 animate-spin" />} Refuser le paiement
            </button>
          </div>
        </div>
      )}

      {!closed && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Exécution du service</p>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-navy-600">Collaborateur</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              >
                {employees.length === 0 && <option value="">Aucun collaborateur</option>}
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => run("assign")} disabled={busy !== null} className={`${btn} bg-brand-blue text-white hover:opacity-90`}>
              {busy === "assign" && <Loader2 className="h-4 w-4 animate-spin" />} Affecter
            </button>
            {execStatus !== "IN_PROGRESS" && execStatus !== "DELIVERED" && (
              <button onClick={() => run("start")} disabled={busy !== null} className={`${btn} border border-navy-100 text-navy-800 hover:border-brand-blue`}>
                {busy === "start" && <Loader2 className="h-4 w-4 animate-spin" />} Démarrer
              </button>
            )}
            {execStatus !== "DELIVERED" && (
              <button onClick={() => run("deliver")} disabled={busy !== null} className={`${btn} border border-navy-100 text-navy-800 hover:border-brand-blue`}>
                {busy === "deliver" && <Loader2 className="h-4 w-4 animate-spin" />} Marquer livré
              </button>
            )}
            <button onClick={() => run("close")} disabled={busy !== null} className={`${btn} border border-navy-100 text-navy-800 hover:border-brand-blue`}>
              {busy === "close" && <Loader2 className="h-4 w-4 animate-spin" />} Clôturer
            </button>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
