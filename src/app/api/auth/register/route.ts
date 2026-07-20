import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/auth/rbac";
import { jsonError, route } from "@/lib/api";

const schema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
});

export const POST = route(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  const { firstName, lastName, email, password, phone, company } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return jsonError("Un compte existe déjà avec cet email.", 409);
  }

  const clientRole = await prisma.role.findUnique({ where: { name: ROLES.CLIENT } });
  if (!clientRole) {
    return jsonError("Configuration des rôles manquante. Exécutez le seed.", 500);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      roles: { create: { roleId: clientRole.id } },
      customer: { create: { company: company || null } },
    },
    include: { roles: { include: { role: true } } },
  });

  const roles = user.roles.map((r) => r.role.name);
  await createSession({
    sub: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    roles,
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
    },
  });
});
