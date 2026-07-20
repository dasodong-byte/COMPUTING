import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { enabledPaymentMethods } from "@/lib/payments/providers";

export const dynamic = "force-dynamic";

// Public, non-sensitive settings used by the storefront (checkout, service pay).
export async function GET() {
  const s = await getSettings();
  return NextResponse.json({
    currency: s.currency,
    taxRate: s.taxRate,
    deliveryFlatFee: s.deliveryFlatFee,
    deliveryFreeThreshold: s.deliveryFreeThreshold,
    paymentMethods: enabledPaymentMethods(s),
  });
}
