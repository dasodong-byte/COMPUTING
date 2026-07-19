"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  product,
  qty = 1,
  full = false,
}: {
  product: Product;
  qty?: number;
  full?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handle}
      disabled={product.stock === 0}
      className={`btn-blue ${full ? "w-full" : ""} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Ajouté
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </>
      )}
    </button>
  );
}
