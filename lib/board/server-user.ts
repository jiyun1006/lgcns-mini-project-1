import { prisma } from "@/lib/prisma";
import { BoardError } from "./validation";

export async function boardUser() {
  if (process.env.NODE_ENV === "production") {
    throw new BoardError("게시판 세션 인증을 연결한 후 배포해 주세요.", 401);
  }

  const id = process.env.BOARD_DEMO_USER_ID;

  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    throw new BoardError(".env.local에 BOARD_DEMO_USER_ID를 설정해 주세요.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  if (!user) {
    throw new BoardError("테스트 사용자가 DB에 없습니다. BOARD_DEMO_USER_ID를 확인해 주세요.", 401);
  }

  return user;
}
