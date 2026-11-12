import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

type TokenRequest = Parameters<typeof getToken>[0]["req"];

export async function getSpringAccessToken() {
  const req = { cookies: await cookies(), headers: await headers() } as unknown as TokenRequest;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.springAccessToken ?? null;
}
