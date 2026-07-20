import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string; // user id
  email: string;
  name: string;
  roles: string[];
};

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a strong value in the environment."
    );
  }
  return encoder.encode(secret);
}

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      Array.isArray(payload.roles)
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : "",
        roles: payload.roles as string[],
      };
    }
    return null;
  } catch {
    return null;
  }
}
