"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Action = "validate_payment" | "refuse_payment" | "confirm" | "process" | "ship" | "deliver" | "cancel";

const ACTION_LABELS: Record<Action, string> = {
  validate_payment: "Valider le paiement",
  refuse_payment: "Refuser le paiement",
  confirm: "Confirmer",
  process: "Mettre en préparation",
  ship: "Marquer expédiée",
  deliver: "Marquer livrée",
  cancel: "Annuler",
};

export function OrderActions({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState("");

  async function run(action: Action, carrier?: string, tracking?: string) {
    setError("");
    setBusy(action);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, carrier, tracking }),
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

  const available: Action[] = [];
  if (paymentStatus === "PENDING") available.push("validate_payment", "refuse_payment");
  if (status === "PENDING") available.push("confirm");
  if (status === "CONFIRMED") available.push("process");
  if (status === "PROCESSING") available.push("ship");
  if (status === "SHIPPED") available.push("deliver");
  if (status !== "CANCELLED" && status !== "DELIVERED") available.push("cancel");

  if (available.length === 0) {
    return <p className="text-sm text-navy-600">Aucune action disponible.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {available.map((a) => (
          <button
            key={a}
            onClick={() => run(a)}
            disabled={busy !== null}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
              a === "cancel" || a === "refuse_payment"
                ? "border border-rose-200 text-rose-700 hover:bg-rose-50"
                : a === "validate_payment"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-navy-100 text-navy-800 hover:border-brand-blue hover:text-brand-blue"
            }`}
          >
            {busy === a && <Loader2 className="h-4 w-4 animate-spin" />}
            {ACTION_LABELS[a]}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
