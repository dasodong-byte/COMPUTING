import Link from "next/link";
import { Download } from "lucide-react";

export function InvoiceDownload({ href, label = "Télécharger la facture" }: { href: string; label?: string }) {
  return (
    <Link href={href} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50">
      <Download className="h-4 w-4" /> {label}
    </Link>
  );
}
