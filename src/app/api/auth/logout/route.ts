import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { route } from "@/lib/api";

export const POST = route(async () => {
  destroySession();
  return NextResponse.json({ ok: true });
});
