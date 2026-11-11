import { prisma } from "@/lib/prisma";

// TODO: 로그인 붙으면 세션 기반으로 교체
export async function getCurrentUser() {
  return prisma.user.findFirstOrThrow();
}

// MongoDB ObjectId 형식(24자리 16진수)인지 확인. Prisma는 잘못된 형식이면 에러를 던지므로 미리 검사.
export function isObjectId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{24}$/i.test(value);
}
