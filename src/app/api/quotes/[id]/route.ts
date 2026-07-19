import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requirePermission, route } from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/rbac";

const schema = z.object({
  action: z.enum(["quote", "accept", "reject", "close"]),
  amount: z.number().nonnegative().max(1_000_000).optional(),
});

export const PATCH = route(async (req: NextRequest, ctx: { params: { id: string } }) => {
  const staff = await requirePermission(PERMISSIONS.QUOTE_MANAGE);
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Action invalide", 400);
  }
  const { action, amount } = parsed.data;

  if (action === "quote" && amount === undefined) {
    return jsonError("Montant requis pour proposer un devis.", 400);
  }

  const quote = await prisma.quote.findFirst({
    where: { id: ctx.params.id, deletedAt: null },
    include: { items: true },
  });
  if (!quote) return jsonError("Devis introuvable.", 404);

  const statusByAction: Record<typeof action, string> = {
    quote: "QUOTED",
    accept: "ACCEPTED",
    reject: "REJECTED",
    close: "CLOSED",
  };

  await prisma.$transaction(async (tx) => {
    if (action === "quote" && amount !== undefined) {
      const existing = quote.items.find((i) => i.label === "Montant du devis");
      if (existing) {
        await tx.quoteItem.update({ where: { id: existing.id }, data: { unitPrice: amount } });
      } else {
        await tx.quoteItem.create({
          data: { quoteId: quote.id, label: "Montant du devis", quantity: 1, unitPrice: amount },
        });
      }
    }

    await tx.quote.update({ where: { id: quote.id }, data: { status: statusByAction[action] } });

    await tx.auditLog.create({
      data: { userId: staff.id, action: `quote.${action}`, entity: "Quote", entityId: quote.id },
    });

    if (quote.userId) {
      await tx.notification.create({
        data: {
          userId: quote.userId,
          title: `Devis ${quote.reference} mis à jour`,
          body: `Statut: ${statusByAction[action]}.`,
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
});
