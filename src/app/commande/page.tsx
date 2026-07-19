"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CommandePage() {
  const { lines, total, count, clear } = useCart();
  const [done, setDone] = useState(false);
  const shipping = total > 500 || total === 0 ? 0 : 25;

  if (done) {
    return (
      <>
        <PageHeader title="Commande confirmée" crumbs={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />
        <section className="container-cs section">
          <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-4 text-xl font-bold text-navy-800">Merci pour votre commande !</h2>
            <p className="mt-2 text-sm text-navy-600">
              Un conseiller vous contactera pour confirmer la livraison et le paiement.
            </p>
            <Link href="/boutique" className="btn-blue mt-6">
              Retour à la boutique <ArrowRight className="h-4 w-4" />
            </Link>
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
        ) : (
          <form
            className="grid gap-8 lg:grid-cols-12"
            onSubmit={(e) => {
              e.preventDefault();
              clear();
              setDone(true);
            }}
          >
            <div className="space-y-6 lg:col-span-7">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-navy-800">Coordonnées de livraison</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="Nom complet" required />
                  <Input label="Email" type="email" required />
                  <Input label="Téléphone" type="tel" required />
                  <Input label="Ville" required />
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-navy-800">Adresse *</label>
                    <input required className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-bold text-navy-800">Mode de paiement</h2>
                <div className="mt-4 space-y-2">
                  {["Paiement à la livraison", "Mobile Money", "Virement bancaire"].map((m, i) => (
                    <label key={m} className="flex cursor-pointer items-center gap-3 rounded-lg border border-navy-100 p-3 text-sm text-navy-800 has-[:checked]:border-brand-blue has-[:checked]:bg-navy-50">
                      <input type="radio" name="payment" defaultChecked={i === 0} className="h-4 w-4 accent-brand-blue" />
                      {m}
                    </label>
                  ))}
                </div>
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
                <button type="submit" className="btn-primary mt-6 w-full">
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

function Input({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>
      <input type={type} required={required} className="w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none" />
    </div>
  );
}
