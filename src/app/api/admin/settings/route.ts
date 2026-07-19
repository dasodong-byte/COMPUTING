import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requirePermission, route } from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { getSettings, updateSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const GET = route(async () => {
  await requirePermission(PERMISSIONS.SETTING_MANAGE);
  return NextResponse.json(await getSettings());
});

const schema = z.object({
  currency: z.string().trim().min(1).max(8).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  deliveryFlatFee: z.number().min(0).max(100000).optional(),
  deliveryFreeThreshold: z.number().min(0).max(1000000).optional(),
  autoPaymentsEnabled: z.boolean().optional(),
  autoDeliveryEnabled: z.boolean().optional(),
  cashEnabled: z.boolean().optional(),
  bankTransferEnabled: z.boolean().optional(),
  stripeEnabled: z.boolean().optional(),
  mpesaEnabled: z.boolean().optional(),
  orangeEnabled: z.boolean().optional(),
  airtelEnabled: z.boolean().optional(),
  notifyEmailEnabled: z.boolean().optional(),
});

export const PATCH = route(async (req: NextRequest) => {
  const admin = await requirePermission(PERMISSIONS.SETTING_MANAGE);
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }
  await updateSettings(parsed.data);
  await prisma.auditLog.create({
    data: { userId: admin.id, action: "settings.update", entity: "Setting" },
  });
  return NextResponse.json(await getSettings());
});
