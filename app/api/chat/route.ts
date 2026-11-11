import { prisma } from "@/lib/prisma";
import { askExaone } from "@/lib/ai";
import { getCurrentUser, isObjectId } from "@/lib/current-user";

export const maxDuration = 60; // Vercel 배포 시 60초까지 허용

const TITLE_MAX = 40;

const messageSelect = { id: true, role: true, content: true, createdAt: true } as const;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    // 화면은 question으로 보내고, 예전 코드는 content로 보냄 → 둘 다 받기
    const raw = body?.question ?? body?.content;
    const conversationId = body?.conversationId;

    // 1. 입력 검사
    if (typeof raw !== "string" || !raw.trim()) {
      return Response.json({ error: "메시지를 입력해주세요." }, { status: 400 });
    }
    if (conversationId != null && !isObjectId(conversationId)) {
      return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
    }
    const content = raw.trim();

    const user = await getCurrentUser();

    // 2. 대화방 찾기 (없으면 새로 만들기)
    const conv = conversationId
      ? await prisma.conversation.findFirst({ where: { id: conversationId, userId: user.id } })
      : await prisma.conversation.create({
          data: { userId: user.id, title: content.slice(0, TITLE_MAX) },
        });

    if (!conv) {
      return Response.json({ error: "대화를 찾을 수 없어요." }, { status: 404 });
    }

    // 3. 이전 대화 + 새 질문으로 AI 호출 (아직 DB에 저장 안 함)
    const history = await prisma.message.findMany({
      where: { conversationId: conv.id },
      orderBy: { createdAt: "asc" },
    });

    const answer = await askExaone([
      ...history.map((m) => ({
        role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
      { role: "user", content },
    ]);

    if (!answer.content) {
      return Response.json({ error: "EXAONE 답변이 비어 있어요." }, { status: 502 });
    }

    // 4. AI 성공 → 질문 + 답변 같이 저장, 대화방 시간 갱신 (첫 질문이면 제목도 설정)
    const [userMsg, aiMsg] = await prisma.$transaction([
      prisma.message.create({
        data: { role: "USER", content, conversationId: conv.id },
        select: messageSelect,
      }),
      prisma.message.create({
        data: {
          role: "ASSISTANT",
          content: answer.content,
          reasoning: answer.reasoning,
          conversationId: conv.id,
        },
        select: messageSelect,
      }),
      prisma.conversation.update({
        where: { id: conv.id },
        data: {
          updatedAt: new Date(),
          ...(history.length === 0 ? { title: content.slice(0, TITLE_MAX) } : {}),
        },
      }),
    ]);

    return Response.json({
      conversationId: conv.id,
      answer: answer.content,
      messages: [userMsg, aiMsg],
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "답변을 받지 못했어요. 다시 시도해주세요." }, { status: 500 });
  }
}
