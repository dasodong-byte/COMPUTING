import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requirePermission, route } from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/rbac";

const schema = z.object({
  action: z.enum([
    "quote",
    "accept",
    "reject",
    "close",
    "validate_payment",
    "refuse_payment",
    "assign",
    "start",
    "deliver",
  ]),
  amount: z.number().nonnegative().max(1_000_000).optional(),
  employeeId: z.string().trim().optional(),
});

// Lifecycle statuses (NEW→QUOTED→ACCEPTED/REJECTED/CLOSED).
const LIFECYCLE: Record<string, string> = {
  quote: "QUOTED",
  accept: "ACCEPTED",
  reject: "REJECTED",
  close: "CLOSED",
};

export const PATCH = route(async (req: NextRequest, ctx: { params: { id: string } }) => {
  const staff = await requirePermission(PERMISSIONS.QUOTE_MANAGE);
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Action invalide", 400);
  }
  const { action, amount, employeeId } = parsed.data;

  if (action === "quote" && amount === undefined) {
    return jsonError("Montant requis pour proposer un devis.", 400);
  }
  if (action === "assign" && !employeeId) {
    return jsonError("Collaborateur requis pour l'affectation.", 400);
  }

  const quote = await prisma.quote.findFirst({
    where: { id: ctx.params.id, deletedAt: null },
    include: { items: true },
  });
  if (!quote) return jsonError("Devis introuvable.", 404);

  await prisma.$transaction(async (tx) => {
    switch (action) {
      case "quote":
        if (amount !== undefined) {
          const existing = quote.items.find((i) => i.label === "Montant du devis");
          if (existing) {
            await tx.quoteItem.update({ where: { id: existing.id }, data: { unitPrice: amount } });
          } else {
            await tx.quoteItem.create({
              data: { quoteId: quote.id, label: "Montant du devis", quantity: 1, unitPrice: amount },
            });
          }
        }
        await tx.quote.update({ where: { id: quote.id }, data: { status: LIFECYCLE.quote } });
        break;
      case "accept":
      case "reject":
      case "close":
        await tx.quote.update({ where: { id: quote.id }, data: { status: LIFECYCLE[action] } });
        break;
      case "validate_payment":
        await tx.quote.update({ where: { id: quote.id }, data: { paymentStatus: "PAID", paidAt: new Date() } });
        break;
      case "refuse_payment":
        await tx.quote.update({ where: { id: quote.id }, data: { paymentStatus: "FAILED" } });
        break;
      case "assign":
        await tx.quote.update({
          where: { id: quote.id },
          data: { assignedToId: employeeId, execStatus: "ASSIGNED" },
        });
        break;
      case "start":
        await tx.quote.update({
          where: { id: quote.id },
          data: { execStatus: "IN_PROGRESS", startedAt: new Date() },
        });
        break;
      case "deliver":
        await tx.quote.update({
          where: { id: quote.id },
          data: { execStatus: "DELIVERED", deliveredAt: new Date() },
        });
        break;
    }

    await tx.auditLog.create({
      data: { userId: staff.id, action: `quote.${action}`, entity: "Quote", entityId: quote.id },
    });
    if (quote.userId) {
      await tx.notification.create({
        data: {
          userId: quote.userId,
          title: `Devis ${quote.reference} mis à jour`,
          body: `Action: ${action}.`,
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
});
