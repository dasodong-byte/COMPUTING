import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { ProductImage } from "@/components/shop/ProductImage";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card-hover group flex flex-col overflow-hidden">
      <Link href={`/boutique/${product.slug}`} className="relative block">
        <ProductImage category={product.category} brand={product.brand} className="aspect-[4/3] w-full" />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <span className="badge bg-brand-blue text-white">Nouveau</span>}
          {product.promo && product.oldPrice && (
            <span className="badge bg-brand-orange text-white">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-xs text-navy-600">
          <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
          <span className="font-semibold text-navy-800">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto text-[11px] font-medium uppercase text-navy-600/70">{product.brand}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-bold text-navy-800 group-hover:text-brand-blue">
          <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-navy-600">{product.short}</p>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-extrabold text-navy-800">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-navy-600/60 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium">
          {product.stock > 0 ? (
            <span className="text-emerald-600">En stock ({product.stock})</span>
          ) : (
            <span className="text-rose-600">Rupture de stock</span>
          )}
        </p>

        <div className="mt-4">
          <AddToCartButton product={product} full />
        </div>
      </div>
    </article>
  );
}
