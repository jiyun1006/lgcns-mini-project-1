import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

type TokenRequest = Parameters<typeof getToken>[0]["req"];

// 서버(서버 액션·route)에서만 써요 : 팔찌 쿠키 안쪽에 넣어 둔 강사님 Spring 토큰 꺼내기
export async function getSpringAccessToken() {
  const req = { cookies: await cookies(), headers: await headers() } as unknown as TokenRequest;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.springAccessToken ?? null;
}
