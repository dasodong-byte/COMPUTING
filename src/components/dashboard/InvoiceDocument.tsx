import { PrintButton } from "@/components/dashboard/PrintButton";
import { formatMoney } from "@/lib/commerce";

export type InvoiceLine = { label: string; quantity: number; unitPrice: number };

export type InvoiceData = {
  number: string;
  reference: string;
  date: Date;
  status: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  lines: InvoiceLine[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  total: number;
  kind: "Produits" | "Service";
};

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  return (
    <section className="container-cs section">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <a href="#" className="text-sm text-navy-600" />
          <PrintButton />
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-10 shadow-sm print:border-0 print:shadow-none">
          <div className="flex items-start justify-between border-b border-navy-100 pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-800">COMPUTING SERVICES SARL</h1>
              <p className="mt-1 text-sm text-navy-600">www.computing-services.fr</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-brand-blue">FACTURE</h2>
              <p className="mt-1 text-sm text-navy-800">{data.number}</p>
              <p className="text-xs text-navy-600">{data.date.toLocaleDateString("fr-FR")}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-navy-800">Facturé à</p>
              <p className="text-navy-600">{data.customerName}</p>
              <p className="text-navy-600">{data.customerEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-navy-600">Référence : <span className="font-medium text-navy-800">{data.reference}</span></p>
              <p className="text-navy-600">Type : <span className="font-medium text-navy-800">{data.kind}</span></p>
              <p className="text-navy-600">Statut : <span className="font-medium text-navy-800">{data.status}</span></p>
            </div>
          </div>

          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-left text-navy-600">
                <th className="py-2">Désignation</th>
                <th className="py-2 text-center">Qté</th>
                <th className="py-2 text-right">P.U.</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((l, i) => (
                <tr key={i} className="border-b border-navy-50">
                  <td className="py-2 text-navy-800">{l.label}</td>
                  <td className="py-2 text-center text-navy-800">{l.quantity}</td>
                  <td className="py-2 text-right text-navy-800">{formatMoney(l.unitPrice, data.currency)}</td>
                  <td className="py-2 text-right text-navy-800">{formatMoney(l.unitPrice * l.quantity, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 ml-auto w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-navy-600">Sous-total</span><span className="text-navy-800">{formatMoney(data.subtotal, data.currency)}</span></div>
            {data.shipping !== undefined && data.shipping > 0 && (
              <div className="flex justify-between"><span className="text-navy-600">Livraison</span><span className="text-navy-800">{formatMoney(data.shipping, data.currency)}</span></div>
            )}
            {data.tax !== undefined && data.tax > 0 && (
              <div className="flex justify-between"><span className="text-navy-600">TVA</span><span className="text-navy-800">{formatMoney(data.tax, data.currency)}</span></div>
            )}
            <div className="flex justify-between border-t border-navy-200 pt-2 text-base font-bold">
              <span className="text-navy-800">Total</span><span className="text-navy-800">{formatMoney(data.total, data.currency)}</span>
            </div>
          </div>

          <p className="mt-10 border-t border-navy-100 pt-4 text-center text-xs text-navy-500">
            Merci de votre confiance — COMPUTING SERVICES SARL
          </p>
        </div>
      </div>
    </section>
  );
}
