import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requirePermission, route } from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/rbac";

const schema = z.object({
  action: z.enum([
    "validate_payment",
    "refuse_payment",
    "confirm",
    "process",
    "ship",
    "deliver",
    "cancel",
  ]),
  carrier: z.string().trim().max(80).optional(),
  tracking: z.string().trim().max(120).optional(),
});

export const PATCH = route(async (req: NextRequest, ctx: { params: { id: string } }) => {
  const staff = await requirePermission(PERMISSIONS.ORDER_MANAGE);
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Action invalide", 400);
  }
  const { action, carrier, tracking } = parsed.data;

  const order = await prisma.order.findFirst({
    where: { id: ctx.params.id, deletedAt: null },
    include: { items: true, payment: true, delivery: true, invoice: true },
  });
  if (!order) return jsonError("Commande introuvable.", 404);

  await prisma.$transaction(async (tx) => {
    switch (action) {
      case "validate_payment": {
        await tx.payment.update({
          where: { orderId: order.id },
          data: { status: "PAID", paidAt: new Date() },
        });
        if (order.invoice) {
          await tx.invoice.update({ where: { orderId: order.id }, data: { status: "PAID" } });
        }
        if (order.status === "PENDING") {
          await tx.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });
        }
        break;
      }
      case "refuse_payment": {
        await tx.payment.update({
          where: { orderId: order.id },
          data: { status: "FAILED" },
        });
        break;
      }
      case "confirm":
        await tx.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });
        break;
      case "process":
        await tx.order.update({ where: { id: order.id }, data: { status: "PROCESSING" } });
        break;
      case "ship":
        await tx.order.update({ where: { id: order.id }, data: { status: "SHIPPED" } });
        await tx.delivery.update({
          where: { orderId: order.id },
          data: { status: "SHIPPED", shippedAt: new Date(), carrier, tracking },
        });
        break;
      case "deliver":
        await tx.order.update({ where: { id: order.id }, data: { status: "DELIVERED" } });
        await tx.delivery.update({
          where: { orderId: order.id },
          data: { status: "DELIVERED", deliveredAt: new Date() },
        });
        break;
      case "cancel": {
        if (order.status !== "CANCELLED") {
          // Restock cancelled items.
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
        break;
      }
    }

    await tx.auditLog.create({
      data: {
        userId: staff.id,
        action: `order.${action}`,
        entity: "Order",
        entityId: order.id,
      },
    });

    if (order.userId) {
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: `Commande ${order.reference} mise à jour`,
          body: `Action: ${action}.`,
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
});
