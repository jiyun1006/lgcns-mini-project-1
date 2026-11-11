import { prisma } from "@/lib/prisma";
import { getCurrentUser, isObjectId } from "@/lib/current-user";

const TITLE_MAX = 80;

const conversationSelect = { id: true, title: true, createdAt: true, updatedAt: true } as const;

// 대화 목록 조회 (?id= 있으면 특정 대화 + 메시지)
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const id = new URL(req.url).searchParams.get("id");

    if (id !== null) {
      if (!isObjectId(id)) {
        return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
      }

      const conversation = await prisma.conversation.findFirst({
        where: { id, userId: user.id },
        select: {
          ...conversationSelect,
          messages: {
            orderBy: { createdAt: "asc" },
            select: { id: true, role: true, content: true, createdAt: true },
          },
        },
      });

      if (!conversation) {
        return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
      }
      return Response.json(conversation);
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: conversationSelect,
    });
    return Response.json(conversations);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "대화 목록 조회 실패" }, { status: 500 });
  }
}

// 새 대화 생성
export async function POST() {
  try {
    const user = await getCurrentUser();
    const conversation = await prisma.conversation.create({
      data: { userId: user.id },
      select: conversationSelect,
    });
    return Response.json({ ...conversation, messages: [] });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "새 대화 생성 실패" }, { status: 500 });
  }
}

// 대화 이름 수정
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const id = body?.id;
    const title = typeof body?.title === "string" ? body.title.trim() : "";

    if (!isObjectId(id) || !title || title.length > TITLE_MAX) {
      return Response.json({ error: "올바른 대화 이름을 입력해주세요." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const result = await prisma.conversation.updateMany({
      where: { id, userId: user.id },
      data: { title },
    });

    if (result.count === 0) {
      return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
    }
    return Response.json({ success: true, title });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "대화 이름 수정 실패" }, { status: 500 });
  }
}

// 대화 삭제 (메시지 포함)
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!isObjectId(id)) {
      return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!conversation) {
      return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.message.deleteMany({ where: { conversationId: id } }),
      prisma.conversation.delete({ where: { id } }),
    ]);

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "대화 삭제 실패" }, { status: 500 });
  }
}
