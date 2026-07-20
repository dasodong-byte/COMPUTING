import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser, route } from "@/lib/api";
import { invoiceNumber } from "@/lib/commerce";
import { getSettings } from "@/lib/settings";
import { charge, isProviderId, PAYMENT_METHODS, type PaymentProviderId } from "@/lib/payments/providers";

const schema = z.object({
  action: z.enum(["accept", "reject", "pay"]),
  provider: z.string().trim().optional(),
});

// Client-facing actions on their own quote: validate (accept/reject the devis)
// then pay. Kept separate from products by design (services use Quote fields).
export const POST = route(async (req: NextRequest, ctx: { params: { id: string } }) => {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Action invalide", 400);
  }
  const { action, provider } = parsed.data;

  const quote = await prisma.quote.findFirst({
    where: { id: ctx.params.id, userId: user.id, deletedAt: null },
    include: { items: true },
  });
  if (!quote) return jsonError("Devis introuvable.", 404);

  if (action === "accept" || action === "reject") {
    if (quote.status !== "QUOTED") {
      return jsonError("Ce devis n'est pas en attente de votre validation.", 409);
    }
    const status = action === "accept" ? "ACCEPTED" : "REJECTED";
    await prisma.quote.update({ where: { id: quote.id }, data: { status } });
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Devis ${quote.reference} ${action === "accept" ? "accepté" : "refusé"}`,
        body: action === "accept" ? "Vous pouvez procéder au paiement." : "Le devis a été refusé.",
      },
    });
    return NextResponse.json({ ok: true, status });
  }

  // action === "pay"
  if (quote.status !== "ACCEPTED") {
    return jsonError("Le devis doit être accepté avant paiement.", 409);
  }
  if (quote.paymentStatus === "PAID") {
    return jsonError("Ce devis est déjà réglé.", 409);
  }
  if (!provider || !isProviderId(provider)) {
    return jsonError("Moyen de paiement invalide.", 400);
  }
  const amount = quote.items.reduce((s, i) => s + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0);
  if (amount <= 0) return jsonError("Montant du devis non défini.", 409);

  const settings = await getSettings();
  const providerId = provider as PaymentProviderId;
  const result = await charge(
    { providerId, amount, currency: quote.currency, reference: quote.reference },
    settings
  );
  const paid = result.status === "PAID";

  await prisma.quote.update({
    where: { id: quote.id },
    data: {
      paymentStatus: result.status,
      paymentMethod: PAYMENT_METHODS[providerId].label,
      paymentRef: result.providerRef,
      paidAt: paid ? new Date() : null,
      invoiceNumber: quote.invoiceNumber ?? invoiceNumber(),
      execStatus: paid ? "PENDING" : quote.execStatus,
    },
  });
  await prisma.notification.create({
    data: { userId: user.id, title: `Paiement du devis ${quote.reference}`, body: result.message },
  });

  return NextResponse.json({ ok: true, paymentStatus: result.status, message: result.message });
});
