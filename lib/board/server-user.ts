import { getCurrentUser } from "@/lib/current-user";
import { BoardError } from "./validation";

export async function boardUser() {
  try {
    const user = await getCurrentUser();
    return { id: user.id, name: user.name };
  } catch (error) {
    if (error instanceof Error && error.message === "로그인이 필요합니다.") {
      throw new BoardError(
        "로그인이 필요합니다. 개발 환경에서는 BOARD_DEMO_USER_ID를 확인해 주세요.",
        401,
      );
    }
    throw error;
  }
}
