import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./jwt";

export const SESSION_COOKIE = "cs_session";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  cookies().set(SESSION_COOKIE, token, cookieOptions());
}

export function destroySession(): void {
  cookies().set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}

// Lightweight session read from the signed cookie (no DB round-trip).
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  roles: string[];
  status: string;
};

// Full current user loaded from the database, with fresh roles.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findFirst({
    where: { id: session.sub, deletedAt: null },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status === "SUSPENDED") return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`.trim(),
    roles: user.roles.map((r) => r.role.name),
    status: user.status,
  };
}
