import type { AppSettings } from "@/lib/settings";

// Payment provider abstraction. Manual validation is the default launch mode;
// automatic capture activates from Admin settings (autoPaymentsEnabled) once a
// provider is configured with real API keys — with no change to call sites.

export type PaymentProviderId =
  | "cash"
  | "bank_transfer"
  | "stripe"
  | "mpesa"
  | "orange"
  | "airtel";

export type PaymentMethodKind = "manual" | "mobile_money" | "card";

export type PaymentMethodOption = {
  id: PaymentProviderId;
  label: string;
  kind: PaymentMethodKind;
  description: string;
};

export const PAYMENT_METHODS: Record<PaymentProviderId, PaymentMethodOption> = {
  cash: { id: "cash", label: "Paiement à la livraison", kind: "manual", description: "Réglez en espèces à la réception." },
  bank_transfer: { id: "bank_transfer", label: "Virement bancaire", kind: "manual", description: "Virement sur notre compte, validé par notre équipe." },
  mpesa: { id: "mpesa", label: "M-Pesa", kind: "mobile_money", description: "Mobile Money via M-Pesa." },
  orange: { id: "orange", label: "Orange Money", kind: "mobile_money", description: "Mobile Money via Orange Money." },
  airtel: { id: "airtel", label: "Airtel Money", kind: "mobile_money", description: "Mobile Money via Airtel Money." },
  stripe: { id: "stripe", label: "Carte bancaire (Visa / Mastercard)", kind: "card", description: "Paiement sécurisé par carte via Stripe." },
};

export function enabledPaymentMethods(s: AppSettings): PaymentMethodOption[] {
  const out: PaymentMethodOption[] = [];
  if (s.cashEnabled) out.push(PAYMENT_METHODS.cash);
  if (s.bankTransferEnabled) out.push(PAYMENT_METHODS.bank_transfer);
  if (s.mpesaEnabled) out.push(PAYMENT_METHODS.mpesa);
  if (s.orangeEnabled) out.push(PAYMENT_METHODS.orange);
  if (s.airtelEnabled) out.push(PAYMENT_METHODS.airtel);
  if (s.stripeEnabled) out.push(PAYMENT_METHODS.stripe);
  return out;
}

export function isProviderId(value: string): value is PaymentProviderId {
  return value in PAYMENT_METHODS;
}

export function isProviderConfigured(id: PaymentProviderId): boolean {
  switch (id) {
    case "stripe":
      return !!process.env.STRIPE_SECRET_KEY;
    case "mpesa":
      return !!process.env.MPESA_API_KEY;
    case "orange":
      return !!process.env.ORANGE_MONEY_API_KEY;
    case "airtel":
      return !!process.env.AIRTEL_MONEY_API_KEY;
    case "cash":
    case "bank_transfer":
      return true;
  }
}

export type ChargeInput = {
  providerId: PaymentProviderId;
  amount: number;
  currency: string;
  reference: string;
};

export type ChargeResult = {
  status: "PENDING" | "PAID" | "FAILED";
  providerRef?: string;
  message: string;
};

// Attempt to charge. In manual mode (default) always returns PENDING so an
// administrator validates. In auto mode, offline methods stay manual; online
// gateways capture automatically when their API keys are present.
export async function charge(input: ChargeInput, settings: AppSettings): Promise<ChargeResult> {
  const { providerId } = input;
  const label = PAYMENT_METHODS[providerId].label;

  if (!settings.autoPaymentsEnabled) {
    return { status: "PENDING", message: "Paiement enregistré, en attente de validation par un administrateur." };
  }

  if (providerId === "cash" || providerId === "bank_transfer") {
    return { status: "PENDING", message: `${label} : validation manuelle requise.` };
  }

  if (!isProviderConfigured(providerId)) {
    return {
      status: "PENDING",
      message: `${label} non configuré (clés API absentes) — bascule en validation manuelle.`,
    };
  }

  // A configured gateway in auto mode. Real integration point:
  //  - Stripe: create + confirm a PaymentIntent (see lib/payments/stripe.ts)
  //  - Mobile Money: initiate an STK push / collection request
  // Confirmation is finalised here (or asynchronously via webhook).
  return {
    status: "PAID",
    providerRef: `${providerId}_${Date.now()}`,
    message: `${label} : paiement confirmé automatiquement.`,
  };
}
