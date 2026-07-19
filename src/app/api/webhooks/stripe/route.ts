import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getStripeConfig } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

// Verifies Stripe's `Stripe-Signature` header (t=timestamp, v1=HMAC-SHA256).
// Implemented with Node crypto so no SDK is required until go-live.
function verify(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { webhookSecret } = getStripeConfig();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook non configuré." }, { status: 501 });
  }

  const payload = await req.text();
  if (!verify(payload, req.headers.get("stripe-signature"), webhookSecret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    type: string;
    data: { object: { metadata?: { reference?: string; kind?: string }; id?: string } };
  };

  if (event.type === "payment_intent.succeeded" || event.type === "checkout.session.completed") {
    const reference = event.data.object.metadata?.reference;
    const kind = event.data.object.metadata?.kind;
    const providerRef = event.data.object.id;
    if (reference && kind === "quote") {
      await prisma.quote.updateMany({
        where: { reference },
        data: { paymentStatus: "PAID", paidAt: new Date(), paymentRef: providerRef },
      });
    } else if (reference) {
      const order = await prisma.order.findFirst({ where: { reference } });
      if (order) {
        await prisma.payment.updateMany({
          where: { orderId: order.id },
          data: { status: "PAID", paidAt: new Date(), reference: providerRef },
        });
        await prisma.invoice.updateMany({ where: { orderId: order.id }, data: { status: "PAID" } });
        if (order.status === "PENDING") {
          await prisma.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
