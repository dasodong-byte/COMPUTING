import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { homeForRoles } from "@/lib/auth/rbac";
import { jsonError, route } from "@/lib/api";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const POST = route(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    include: { roles: { include: { role: true } } },
  });

  // Constant-ish response to avoid leaking which emails exist.
  if (!user) {
    return jsonError("Email ou mot de passe incorrect.", 401);
  }
  if (user.status === "SUSPENDED") {
    return jsonError("Ce compte est suspendu. Contactez l'administrateur.", 403);
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return jsonError("Email ou mot de passe incorrect.", 401);
  }

  const roles = user.roles.map((r) => r.role.name);
  await createSession({
    sub: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    roles,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
    },
    redirectTo: homeForRoles(roles),
  });
});
