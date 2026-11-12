import { connection } from "next/server";
import { boardUser } from "@/lib/board/server-user";
import { BoardError } from "@/lib/board/validation";
import { readBoard, changeBoard, boardFailure } from "@/service/boardService";

export async function GET() {
  await connection();

  try {
    // 글 읽기는 비회원도 가능. 로그인 안 했으면(401) user를 null로 두고, 다른 에러는 그대로 던진다
    const user = await boardUser().catch((error: unknown) => {
      if (error instanceof BoardError && error.status === 401) return null;
      throw error;
    });

    return Response.json(
      {
        posts: await readBoard(user?.id ?? ""),
        user,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return boardFailure(error);
  }
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");

    if (origin && origin !== new URL(req.url).origin) {
      throw new BoardError("허용되지 않은 요청입니다.", 403);
    }

    if (!req.headers.get("content-type")?.includes("application/json")) {
      throw new BoardError("JSON 요청이 필요합니다.");
    }

    const user = await boardUser();

    const body: unknown = await req.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BoardError("요청 형식이 올바르지 않습니다.");
    }

    const postId = await changeBoard(body as Record<string, unknown>, user.id);

    return Response.json({ postId });
  } catch (error) {
    return boardFailure(error);
  }
}
