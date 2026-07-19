import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser, route } from "@/lib/api";
import {
  DEFAULT_CURRENCY,
  computeShipping,
  invoiceNumber,
  orderReference,
} from "@/lib/commerce";

const schema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().positive().max(999),
      })
    )
    .min(1, "Le panier est vide."),
  fullName: z.string().trim().min(1, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().min(1, "Téléphone requis").max(40),
  address: z.string().trim().min(1, "Adresse requise").max(240),
  city: z.string().trim().min(1, "Ville requise").max(120),
  paymentMethod: z.string().trim().min(1).max(60),
});

export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  const data = parsed.data;

  const slugs = data.lines.map((l) => l.slug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, deletedAt: null, published: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  // Validate availability and recompute prices from the DB (never trust client).
  const items: { productId: string; name: string; unitPrice: number; quantity: number }[] = [];
  for (const line of data.lines) {
    const product = bySlug.get(line.slug);
    if (!product) {
      return jsonError(`Produit introuvable : ${line.slug}`, 400);
    }
    if (product.stock < line.qty) {
      return jsonError(`Stock insuffisant pour « ${product.name} » (disponible : ${product.stock}).`, 409);
    }
    items.push({
      productId: product.id,
      name: product.name,
      unitPrice: Number(product.price),
      quantity: line.qty,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  const customer = await prisma.customer.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const reference = orderReference();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        reference,
        userId: user.id,
        customerId: customer.id,
        status: "PENDING",
        subtotal,
        shipping,
        total,
        currency: DEFAULT_CURRENCY,
        items: { create: items },
        invoice: {
          create: { number: invoiceNumber(), amount: total, status: "PENDING" },
        },
        payment: {
          create: { method: data.paymentMethod, amount: total, status: "PENDING" },
        },
        delivery: {
          create: { address: data.address, city: data.city, status: "PENDING" },
        },
      },
    });

    // Decrement stock atomically.
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.notification.create({
      data: {
        userId: user.id,
        title: `Commande ${reference} reçue`,
        body: "Votre commande est en attente de validation par notre équipe.",
      },
    });

    await tx.auditLog.create({
      data: { userId: user.id, action: "order.create", entity: "Order", entityId: created.id },
    });

    return created;
  });

  return NextResponse.json({ reference: order.reference, id: order.id });
});
