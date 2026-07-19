import { prisma } from "@/lib/prisma";

// Platform-wide configuration, editable from the Admin space and persisted in
// the `Setting` key/value table. Everything has a safe default so the app works
// before any row exists. Payment automation defaults to OFF (manual validation)
// as required for launch.

export type AppSettings = {
  currency: string;
  taxRate: number; // percent, e.g. 16 => 16%
  commissionRate: number; // percent, platform commission on services
  deliveryFlatFee: number;
  deliveryFreeThreshold: number;
  autoPaymentsEnabled: boolean;
  autoDeliveryEnabled: boolean;
  cashEnabled: boolean;
  bankTransferEnabled: boolean;
  stripeEnabled: boolean;
  mpesaEnabled: boolean;
  orangeEnabled: boolean;
  airtelEnabled: boolean;
  notifyEmailEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: "USD",
  taxRate: 16,
  commissionRate: 5,
  deliveryFlatFee: 25,
  deliveryFreeThreshold: 500,
  autoPaymentsEnabled: false,
  autoDeliveryEnabled: false,
  cashEnabled: true,
  bankTransferEnabled: true,
  stripeEnabled: false,
  mpesaEnabled: false,
  orangeEnabled: false,
  airtelEnabled: false,
  notifyEmailEnabled: false,
};

const NUMERIC_KEYS: (keyof AppSettings)[] = [
  "taxRate",
  "commissionRate",
  "deliveryFlatFee",
  "deliveryFreeThreshold",
];
const BOOLEAN_KEYS: (keyof AppSettings)[] = [
  "autoPaymentsEnabled",
  "autoDeliveryEnabled",
  "cashEnabled",
  "bankTransferEnabled",
  "stripeEnabled",
  "mpesaEnabled",
  "orangeEnabled",
  "airtelEnabled",
  "notifyEmailEnabled",
];

function coerce(key: keyof AppSettings, raw: string): AppSettings[keyof AppSettings] {
  if (NUMERIC_KEYS.includes(key)) return Number(raw);
  if (BOOLEAN_KEYS.includes(key)) return raw === "true";
  return raw;
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await prisma.setting.findMany();
  const result: AppSettings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in result) {
      // @ts-expect-error narrowed by runtime key check above
      result[row.key as keyof AppSettings] = coerce(row.key as keyof AppSettings, row.value);
    }
  }
  return result;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<void> {
  const entries = Object.entries(patch).filter(([k]) => k in DEFAULT_SETTINGS);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
}
