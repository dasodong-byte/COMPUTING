// Stripe configuration surface. Structured so that switching from Test to
// Production keys (or wiring the official `stripe` SDK) requires no change to
// call sites — only environment variables.
//
// Env vars expected when going live:
//   STRIPE_SECRET_KEY               (sk_test_... then sk_live_...)
//   STRIPE_WEBHOOK_SECRET           (whsec_...)
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_... then pk_live_...)

export const STRIPE_ACCOUNT_ID = "acct_1RvDcXFWCfDo3OVr";

export type StripeConfig = {
  accountId: string;
  secretKey: string | null;
  webhookSecret: string | null;
  publishableKey: string | null;
};

export function getStripeConfig(): StripeConfig {
  return {
    accountId: STRIPE_ACCOUNT_ID,
    secretKey: process.env.STRIPE_SECRET_KEY ?? null,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? null,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
  };
}

export function isStripeReady(): boolean {
  return !!getStripeConfig().secretKey;
}
