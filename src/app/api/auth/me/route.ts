import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { route } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      roles: user.roles,
    },
  });
});
