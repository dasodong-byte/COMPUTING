import { Icon } from "@/components/Icon";
import { getCategory } from "@/lib/products";

const GRADIENTS: Record<string, string> = {
  ordinateurs: "from-blue-600 to-indigo-800",
  peripheriques: "from-sky-500 to-blue-700",
  reseau: "from-cyan-600 to-navy-800",
  impression: "from-orange-500 to-rose-600",
  mobilier: "from-amber-600 to-orange-700",
  papeterie: "from-emerald-500 to-teal-700",
  logiciels: "from-violet-600 to-indigo-800",
};

export function ProductImage({
  category,
  brand,
  className = "",
}: {
  category: string;
  brand: string;
  className?: string;
}) {
  const cat = getCategory(category);
  const gradient = GRADIENTS[category] ?? "from-navy-700 to-navy-900";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:16px_16px]" />
      <Icon name={cat?.icon ?? "Cpu"} className="h-16 w-16 text-white/90" />
      <span className="absolute bottom-2 right-3 text-xs font-bold uppercase tracking-wide text-white/70">
        {brand}
      </span>
    </div>
  );
}
