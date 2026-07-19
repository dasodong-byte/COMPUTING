"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handle = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const disabled = product.stock === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-navy-100">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-navy-800 hover:text-brand-blue disabled:opacity-40"
          aria-label="Diminuer"
          disabled={disabled}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-bold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-navy-800 hover:text-brand-blue disabled:opacity-40"
          aria-label="Augmenter"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={handle}
        disabled={disabled}
        className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Ajouté au panier
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {disabled ? "Rupture de stock" : "Ajouter au panier"}
          </>
        )}
      </button>
    </div>
  );
}
