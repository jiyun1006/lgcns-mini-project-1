import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 로그인한 사람의 Mongo User. 로그인 안 했으면 null
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!isObjectId(id)) return null;
  // 프로필 사진은 수 MB의 data URL이라 매 요청 읽지 않는다. 필요한 곳(마이페이지)에서 따로 조회.
  return prisma.user.findUnique({ where: { id }, omit: { profileImageUrl: true } });
}

// MongoDB ObjectId 형식(24자리 16진수)인지 확인. Prisma는 잘못된 형식이면 에러를 던지므로 미리 검사.
export function isObjectId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{24}$/i.test(value);
}
