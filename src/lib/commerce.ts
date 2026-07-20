// Shared commerce helpers: references, shipping, currency, status labels.
// Business rules here are intentionally centralised so Phase 2C/2D (payments
// gateways, admin-configurable fees/taxes) can override them without touching
// the call sites.

export const DEFAULT_CURRENCY = "USD";
export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING = 25;

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

function randomSuffix(len = 4): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function datePart(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function orderReference(): string {
  return `CMD-${datePart()}-${randomSuffix()}`;
}

export function quoteReference(): string {
  return `DVS-${datePart()}-${randomSuffix()}`;
}

export function invoiceNumber(): string {
  return `FAC-${datePart()}-${randomSuffix()}`;
}

export function formatMoney(value: number, currency = DEFAULT_CURRENCY): string {
  return `${value.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

// ── Products / orders ──────────────────────────────────────────────
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatusName = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatusName, string> = {
  PENDING: "En attente de validation",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de validation",
  PAID: "Payé",
  FAILED: "Refusé",
  REFUNDED: "Remboursé",
};

// ── Services / quotes ──────────────────────────────────────────────
export const QUOTE_STATUSES = [
  "NEW",
  "QUOTED",
  "ACCEPTED",
  "REJECTED",
  "CLOSED",
] as const;
export type QuoteStatusName = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatusName, string> = {
  NEW: "Nouvelle demande",
  QUOTED: "Devis proposé",
  ACCEPTED: "Accepté",
  REJECTED: "Refusé",
  CLOSED: "Clôturé",
};

export const EXEC_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Affecté",
  IN_PROGRESS: "En cours",
  DELIVERED: "Livré",
  CLOSED: "Clôturé",
};

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
};

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "DELIVERED":
    case "PAID":
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700";
    case "CANCELLED":
    case "FAILED":
    case "REJECTED":
      return "bg-rose-50 text-rose-700";
    case "SHIPPED":
    case "PROCESSING":
    case "CONFIRMED":
    case "QUOTED":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}
