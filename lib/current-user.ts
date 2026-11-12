import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const sessionId = session?.user?.id;
  const demoId = process.env.NODE_ENV !== "production" ? process.env.BOARD_DEMO_USER_ID : null;
  const id = sessionId || demoId;
  if (!isObjectId(id)) throw new Error("로그인이 필요합니다.");

  // 프로필 사진은 수 MB의 data URL이라 매 요청 읽지 않는다. 필요한 곳에서 따로 조회.
  return prisma.user.findUniqueOrThrow({ where: { id }, omit: { profileImageUrl: true } });
}

// MongoDB ObjectId 형식(24자리 16진수)인지 확인. Prisma는 잘못된 형식이면 에러를 던지므로 미리 검사.
export function isObjectId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{24}$/i.test(value);
}
