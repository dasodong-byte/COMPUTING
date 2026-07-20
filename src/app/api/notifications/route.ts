import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser, route } from "@/lib/api";

export const GET = route(async () => {
  const user = await requireUser();
  const [items, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);
  return NextResponse.json({ items, unread });
});

const schema = z.object({ id: z.string().optional(), all: z.boolean().optional() });

export const PATCH = route(async (req: NextRequest) => {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Requête invalide", 400);
  const { id, all } = parsed.data;
  if (all) {
    await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  } else if (id) {
    await prisma.notification.updateMany({ where: { id, userId: user.id }, data: { read: true } });
  }
  const unread = await prisma.notification.count({ where: { userId: user.id, read: false } });
  return NextResponse.json({ ok: true, unread });
});
