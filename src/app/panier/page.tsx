"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CartPage() {
  const { lines, setQty, remove, clear, total, count } = useCart();
  const shipping = total > 500 || total === 0 ? 0 : 25;

  return (
    <>
      <PageHeader title="Mon panier" crumbs={[{ label: "Panier" }]} />

      <section className="container-cs section">
        {lines.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-navy-100 p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-navy-100" />
            <h2 className="mt-4 text-lg font-bold text-navy-800">Votre panier est vide</h2>
            <p className="mt-1 text-sm text-navy-600">
              Parcourez notre boutique et ajoutez des produits à votre panier.
            </p>
            <Link href="/boutique" className="btn-blue mt-6">
              Aller à la boutique <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-xl border border-navy-100">
                {lines.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 border-b border-navy-100 p-4 last:border-0">
                    <div className="min-w-0 flex-1">
                      <Link href={`/boutique/${l.slug}`} className="text-sm font-bold text-navy-800 hover:text-brand-blue">
                        {l.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-navy-600">{formatPrice(l.price)} / unité</p>
                    </div>
                    <div className="flex items-center rounded-lg border border-navy-100">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="flex h-9 w-9 items-center justify-center text-navy-800 hover:text-brand-blue" aria-label="Diminuer">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} className="flex h-9 w-9 items-center justify-center text-navy-800 hover:text-brand-blue" aria-label="Augmenter">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-24 text-right text-sm font-bold text-navy-800">{formatPrice(l.price * l.qty)}</div>
                    <button onClick={() => remove(l.id)} className="text-navy-600 hover:text-rose-600" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={clear} className="text-sm text-navy-600 hover:text-rose-600">Vider le panier</button>
                <Link href="/boutique" className="text-sm font-semibold text-brand-blue hover:underline">
                  Continuer mes achats
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="card sticky top-24 p-6">
                <h2 className="text-lg font-bold text-navy-800">Récapitulatif</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-600">Sous-total ({count} art.)</dt>
                    <dd className="font-semibold text-navy-800">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-600">Livraison</dt>
                    <dd className="font-semibold text-navy-800">
                      {shipping === 0 ? "Offerte" : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-navy-100 pt-3 text-base">
                    <dt className="font-bold text-navy-800">Total</dt>
                    <dd className="font-extrabold text-navy-800">{formatPrice(total + shipping)}</dd>
                  </div>
                </dl>
                <Link href="/commande" className="btn-primary mt-6 w-full">
                  Passer commande <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-navy-600">
                  Livraison offerte dès 500 $ d&apos;achat
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
