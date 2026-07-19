"use client";

import { useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import type { AppSettings } from "@/lib/settings";

const TOGGLES: { key: keyof AppSettings; label: string; hint?: string }[] = [
  { key: "autoPaymentsEnabled", label: "Paiements automatiques", hint: "Si désactivé, chaque paiement est validé manuellement par un administrateur." },
  { key: "autoDeliveryEnabled", label: "Livraisons automatiques" },
  { key: "cashEnabled", label: "Paiement à la livraison" },
  { key: "bankTransferEnabled", label: "Virement bancaire" },
  { key: "stripeEnabled", label: "Carte bancaire (Stripe)" },
  { key: "mpesaEnabled", label: "M-Pesa" },
  { key: "orangeEnabled", label: "Orange Money" },
  { key: "airtelEnabled", label: "Airtel Money" },
  { key: "notifyEmailEnabled", label: "Notifications par email" },
];

const NUMBERS: { key: keyof AppSettings; label: string; suffix?: string }[] = [
  { key: "taxRate", label: "Taux de TVA", suffix: "%" },
  { key: "commissionRate", label: "Commission plateforme (services)", suffix: "%" },
  { key: "deliveryFlatFee", label: "Frais de livraison forfaitaires" },
  { key: "deliveryFreeThreshold", label: "Seuil de livraison offerte" },
];

export function SettingsForm({ initial }: { initial: AppSettings }) {
  const [values, setValues] = useState<AppSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Enregistrement impossible.");
        setSaving(false);
        return;
      }
      setValues(data);
      setSaved(true);
      setSaving(false);
    } catch {
      setError("Erreur réseau.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-800">Devise</h2>
        <div className="mt-4 max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-navy-800">Devise par défaut</label>
          <select
            value={values.currency}
            onChange={(e) => set("currency", e.target.value)}
            className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          >
            {["USD", "EUR", "CDF", "XAF"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-800">Taxes, commissions & livraison</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {NUMBERS.map((n) => (
            <div key={n.key}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">
                {n.label} {n.suffix ? `(${n.suffix})` : `(${values.currency})`}
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={Number(values[n.key])}
                onChange={(e) => set(n.key, Number(e.target.value) as never)}
                className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-800">Paiements, moyens & notifications</h2>
        <div className="mt-4 space-y-1">
          {TOGGLES.map((t) => (
            <label key={t.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-lg p-3 hover:bg-navy-50">
              <span>
                <span className="text-sm font-medium text-navy-800">{t.label}</span>
                {t.hint && <span className="block text-xs text-navy-600">{t.hint}</span>}
              </span>
              <input
                type="checkbox"
                checked={Boolean(values[t.key])}
                onChange={(e) => set(t.key, e.target.checked as never)}
                className="mt-0.5 h-5 w-5 accent-brand-blue"
              />
            </label>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className={`btn-primary ${saving ? "opacity-70" : ""}`}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Enregistré
          </span>
        )}
      </div>
    </div>
  );
}
