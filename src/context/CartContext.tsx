"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "cs-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add: CartState["add"] = (product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          qty,
        },
      ];
    });
  };

  const remove: CartState["remove"] = (id) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const setQty: CartState["setQty"] = (id, qty) =>
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l))
    );

  const clear = () => setLines([]);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, add, remove, setQty, clear, count, total };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
