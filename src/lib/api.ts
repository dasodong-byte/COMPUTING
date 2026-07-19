import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { hasPermission, hasRole, type PermissionKey, type RoleName } from "@/lib/auth/rbac";

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Ensures a user is authenticated. Throws ApiError(401) otherwise.
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError("Authentification requise.", 401);
  return user;
}

// Ensures the authenticated user holds one of the allowed roles.
export async function requireRole(allowed: RoleName | RoleName[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!hasRole(user.roles, allowed)) {
    throw new ApiError("Accès refusé.", 403);
  }
  return user;
}

// Ensures the authenticated user holds the given permission.
export async function requirePermission(permission: PermissionKey): Promise<CurrentUser> {
  const user = await requireUser();
  if (!hasPermission(user.roles, permission)) {
    throw new ApiError("Accès refusé.", 403);
  }
  return user;
}

// Wraps a route handler, converting thrown ApiErrors into JSON responses.
export function route<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return jsonError(err.message, err.status);
      }
      console.error("Unhandled route error:", err);
      return jsonError("Une erreur interne est survenue.", 500);
    }
  };
}
