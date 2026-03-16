import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production-please"
);

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function signJWT(payload: {
  userId: number;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(
  token: string
): Promise<{ userId: number; email: string }> {
  const { payload } = await jwtVerify(token, secret);
  return payload as { userId: number; email: string };
}
