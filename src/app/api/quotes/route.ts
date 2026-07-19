import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser, route } from "@/lib/api";
import { quoteReference } from "@/lib/commerce";

const schema = z.object({
  service: z.string().trim().min(1, "Service requis").max(120),
  message: z.string().trim().min(1, "Merci de décrire votre besoin").max(4000),
  items: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(200),
        quantity: z.number().int().positive().max(999).default(1),
      })
    )
    .optional(),
});

export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  const { service, message, items } = parsed.data;

  const customer = await prisma.customer.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const reference = quoteReference();

  const quote = await prisma.quote.create({
    data: {
      reference,
      userId: user.id,
      customerId: customer.id,
      service,
      message,
      status: "NEW",
      items: items?.length
        ? { create: items.map((i) => ({ label: i.label, quantity: i.quantity })) }
        : undefined,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: `Demande de devis ${reference} enregistrée`,
      body: "Notre équipe vous transmettra un devis dans les meilleurs délais.",
    },
  });

  return NextResponse.json({ reference: quote.reference, id: quote.id });
});
