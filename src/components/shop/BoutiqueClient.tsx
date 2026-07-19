"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Icon } from "@/components/Icon";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "new";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "En vedette" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
  { value: "new", label: "Nouveautés" },
];

export function BoutiqueClient({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list: Product[] = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (onlyPromo && !p.promo) return false;
      if (p.price > maxPrice) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q))
          return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "new":
          return Number(b.isNew) - Number(a.isNew);
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
    return list;
  }, [category, sort, maxPrice, onlyPromo, query]);

  const filtersPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy-800">Catégories</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCategory("all")}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
                category === "all" ? "bg-brand-blue text-white" : "text-navy-800 hover:bg-navy-50"
              }`}
            >
              Tous les produits
              <span className="ml-auto text-xs opacity-70">{PRODUCTS.length}</span>
            </button>
          </li>
          {CATEGORIES.map((c) => {
            const n = PRODUCTS.filter((p) => p.category === c.slug).length;
            return (
              <li key={c.slug}>
                <button
                  onClick={() => setCategory(c.slug)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    category === c.slug ? "bg-brand-blue text-white" : "text-navy-800 hover:bg-navy-50"
                  }`}
                >
                  <Icon name={c.icon} className="h-4 w-4" />
                  {c.name}
                  <span className="ml-auto text-xs opacity-70">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-navy-800">Prix maximum</h3>
        <input
          type="range"
          min={50}
          max={2500}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-orange"
        />
        <div className="mt-1 flex justify-between text-xs text-navy-600">
          <span>50 $</span>
          <span className="font-semibold text-navy-800">{maxPrice} $</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-800">
        <input
          type="checkbox"
          checked={onlyPromo}
          onChange={(e) => setOnlyPromo(e.target.checked)}
          className="h-4 w-4 accent-brand-orange"
        />
        Uniquement les promotions
      </label>
    </div>
  );

  return (
    <div className="container-cs section grid gap-8 lg:grid-cols-12">
      {/* Sidebar filters (desktop) */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="card sticky top-24 p-5">{filtersPanel}</div>
      </aside>

      {/* Main */}
      <div className="lg:col-span-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, une marque…"
              className="w-full rounded-lg border border-navy-100 py-2.5 pl-10 pr-4 text-sm focus:border-brand-blue focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-navy-100 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(true)}
            className="btn-ghost lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtres
          </button>
        </div>

        <p className="mt-4 text-sm text-navy-600">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-navy-100 p-12 text-center text-navy-600">
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filters drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-800">Filtres</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filtersPanel}
            <button onClick={() => setShowFilters(false)} className="btn-blue mt-6 w-full">
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
