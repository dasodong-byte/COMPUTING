import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, route } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1, "Message requis").max(4000),
});

export const POST = route(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  const { name, email, phone, service, message } = parsed.data;
  const user = await getCurrentUser();

  await prisma.contactMessage.create({
    data: { name, email, phone, service, message, userId: user?.id ?? null },
  });

  return NextResponse.json({ ok: true });
});
