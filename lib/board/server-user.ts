import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isObjectId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { BoardError } from "./validation";

export async function boardUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId || !isObjectId(userId)) {
    throw new BoardError("로그인 후 게시판을 이용해 주세요.", 401);
  }

  // 게시판 작성자 정보는 DB의 사용자 정보로 확인
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!user) {
    throw new BoardError("로그인한 사용자를 DB에서 찾을 수 없습니다. 다시 로그인해 주세요.", 401);
  }

  return user;
}
