import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-cs flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-7xl font-extrabold text-brand-blue">404</span>
      <h1 className="mt-4 text-2xl font-bold text-navy-800">Page introuvable</h1>
      <p className="mt-2 max-w-md text-sm text-navy-600">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Accueil
        </Link>
        <Link href="/boutique" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Boutique
        </Link>
      </div>
    </section>
  );
}
