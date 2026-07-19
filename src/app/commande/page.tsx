"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, LogIn, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";
import { computeShipping } from "@/lib/commerce";
import { PageHeader } from "@/components/layout/PageHeader";

const PAYMENT_METHODS = ["Paiement à la livraison", "Mobile Money", "Virement bancaire"];

export default function CommandePage() {
  const { lines, total, count, clear } = useCart();
  const { user, loading } = useAuth();
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const shipping = computeShipping(total);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
      paymentMethod: String(form.get("payment") ?? PAYMENT_METHODS[0]),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      clear();
      setReference(data.reference);
    } catch {
      setError("Impossible de finaliser la commande. Réessayez.");
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <>
        <PageHeader title="Commande confirmée" crumbs={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />
        <section className="container-cs section">
          <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-4 text-xl font-bold text-navy-800">Merci pour votre commande !</h2>
            <p className="mt-2 text-sm text-navy-600">
              Référence : <span className="font-bold text-navy-800">{reference}</span>
            </p>
            <p className="mt-2 text-sm text-navy-600">
              Votre commande est <strong>en attente de validation</strong>. Notre équipe confirmera le paiement et la
              livraison.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/espace-client/commandes" className="btn-blue">
                Suivre mes commandes <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/boutique" className="btn-ghost">
                Retour à la boutique
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Finaliser ma commande" crumbs={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />
      <section className="container-cs section">
        {count === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-navy-100 p-12 text-center">
            <p className="text-navy-600">Votre panier est vide.</p>
            <Link href="/boutique" className="btn-blue mt-6">Aller à la boutique</Link>
          </div>
        ) : !loading && !user ? (
          <div className="mx-auto max-w-md rounded-2xl border border-navy-100 bg-white p-10 text-center shadow-sm">
            <LogIn className="mx-auto h-12 w-12 text-brand-blue" />
            <h2 className="mt-4 text-lg font-bold text-navy-800">Connexion requise</h2>
            <p className="mt-2 text-sm text-navy-600">
              Connectez-vous ou créez un compte pour finaliser votre commande et la suivre depuis votre espace.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/connexion?next=/commande" className="btn-blue">Se connecter</Link>
              <Link href="/inscription?next=/commande" className="btn-ghost">Créer un compte</Link>
            </div>
          </div>
        ) : (
          <form className="grid gap-8 lg:grid-cols-12" onSubmit={onSubmit}>
            <div className="space-y-6 lg:col-span-7">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-navy-800">Coordonnées de livraison</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="Nom complet" name="fullName" required defaultValue={user?.name} />
                  <Input label="Email" name="email" type="email" required defaultValue={user?.email} />
                  <Input label="Téléphone" name="phone" type="tel" required />
                  <Input label="Ville" name="city" required />
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-navy-800">Adresse *</label>
                    <input name="address" required className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-bold text-navy-800">Mode de paiement</h2>
                <div className="mt-4 space-y-2">
                  {PAYMENT_METHODS.map((m, i) => (
                    <label key={m} className="flex cursor-pointer items-center gap-3 rounded-lg border border-navy-100 p-3 text-sm text-navy-800 has-[:checked]:border-brand-blue has-[:checked]:bg-navy-50">
                      <input type="radio" name="payment" value={m} defaultChecked={i === 0} className="h-4 w-4 accent-brand-blue" />
                      {m}
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-navy-600">
                  Le paiement est validé manuellement par notre équipe (paiement en ligne automatique à venir).
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="card sticky top-24 p-6">
                <h2 className="text-lg font-bold text-navy-800">Votre commande</h2>
                <ul className="mt-4 divide-y divide-navy-100 text-sm">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-4 py-2">
                      <span className="text-navy-600">{l.name} <span className="text-navy-800">× {l.qty}</span></span>
                      <span className="shrink-0 font-semibold text-navy-800">{formatPrice(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-navy-600">Sous-total</dt><dd className="font-semibold">{formatPrice(total)}</dd></div>
                  <div className="flex justify-between"><dt className="text-navy-600">Livraison</dt><dd className="font-semibold">{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd></div>
                  <div className="flex justify-between border-t border-navy-100 pt-2 text-base"><dt className="font-bold text-navy-800">Total</dt><dd className="font-extrabold text-navy-800">{formatPrice(total + shipping)}</dd></div>
                </dl>
                {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
                <button type="submit" disabled={submitting} className={`btn-primary mt-6 w-full ${submitting ? "opacity-70" : ""}`}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Confirmer la commande <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </aside>
          </form>
        )}
      </section>
    </>
  );
}

function Input({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
    </div>
  );
}
