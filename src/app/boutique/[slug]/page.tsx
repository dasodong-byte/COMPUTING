import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react";
import {
  PRODUCTS,
  getProduct,
  categoryName,
  formatPrice,
} from "@/lib/products";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductImage } from "@/components/shop/ProductImage";
import { ProductBuyBox } from "@/components/shop/ProductBuyBox";
import { ProductCard } from "@/components/shop/ProductCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.short,
    openGraph: { title: product.name, description: product.short },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <>
      <PageHeader
        title={product.name}
        crumbs={[
          { label: "Boutique", href: "/boutique" },
          { label: categoryName(product.category), href: `/boutique?categorie=${product.category}` },
        ]}
      />

      <section className="container-cs section grid gap-10 lg:grid-cols-2">
        <ProductImage
          category={product.category}
          brand={product.brand}
          className="aspect-square w-full rounded-2xl"
        />

        <div>
          <Link
            href={`/boutique?categorie=${product.category}`}
            className="badge bg-navy-50 text-brand-blue"
          >
            {categoryName(product.category)}
          </Link>
          <h1 className="mt-3 text-2xl font-extrabold text-navy-800 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-brand-orange text-brand-orange" : "text-navy-100"}`}
                />
              ))}
            </span>
            <span className="font-semibold text-navy-800">{product.rating}</span>
            <span className="text-navy-600">({product.reviews} avis)</span>
            <span className="mx-2 text-navy-100">|</span>
            <span className="font-medium uppercase text-navy-600">{product.brand}</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-navy-600">{product.description}</p>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-navy-800">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="mb-1 text-lg text-navy-600/60 line-through">{formatPrice(product.oldPrice)}</span>
            )}
            {product.oldPrice && (
              <span className="badge mb-1 bg-brand-orange text-white">
                Économisez {formatPrice(product.oldPrice - product.price)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="h-4 w-4" /> En stock — {product.stock} disponible(s)
              </span>
            ) : (
              <span className="text-rose-600">Rupture de stock</span>
            )}
          </p>

          <div className="mt-6">
            <ProductBuyBox product={product} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Livraison rapide en RDC" },
              { icon: ShieldCheck, label: "Garantie constructeur" },
              { icon: RotateCcw, label: "Retour sous 14 jours" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 rounded-lg bg-navy-50 p-3 text-xs text-navy-800">
                <f.icon className="h-5 w-5 text-brand-blue" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="container-cs pb-8">
        <h2 className="section-title text-xl">Caractéristiques techniques</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-navy-100">
          <table className="w-full text-sm">
            <tbody>
              {product.specs.map((s, i) => (
                <tr key={s.label} className={i % 2 === 0 ? "bg-white" : "bg-navy-50/50"}>
                  <th className="w-1/3 px-4 py-3 text-left font-semibold text-navy-800">{s.label}</th>
                  <td className="px-4 py-3 text-navy-600">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-cs section pt-0">
          <h2 className="section-title text-xl">Produits associés</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
