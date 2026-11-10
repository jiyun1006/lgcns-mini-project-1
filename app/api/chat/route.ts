import { prisma } from "@/lib/prisma";
import { askExaone } from "@/lib/ai";

export const maxDuration = 60; // Vercel 배포 시 60초까지 허용

export async function POST(req: Request) {
  const { conversationId, content } = await req.json();

  // 1. 입력 검사
  if (typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "메시지를 입력해주세요." }, { status: 400 });
  }

  try {
    // TODO: 로그인 붙으면 getCurrentUser()로 교체
    const user = await prisma.user.findFirstOrThrow();

    // 2. 대화방 찾기 (없으면 새로 만들기)
    const conv = conversationId
      ? await prisma.conversation.findFirst({ where: { id: conversationId, userId: user.id } })
      : await prisma.conversation.create({
          data: { userId: user.id, title: content.slice(0, 30) },
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

    // 4. AI 성공 → 질문 + 답변 같이 저장, 대화방 시간 갱신
    const [userMsg, aiMsg] = await prisma.$transaction([
      prisma.message.create({ data: { role: "USER", content, conversationId: conv.id } }),
      prisma.message.create({
        data: {
          role: "ASSISTANT",
          content: answer.content,
          reasoning: answer.reasoning,
          conversationId: conv.id,
        },
      }),
      prisma.conversation.update({ where: { id: conv.id }, data: { updatedAt: new Date() } }),
    ]);

    return Response.json({ conversationId: conv.id, messages: [userMsg, aiMsg] });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "답변을 받지 못했어요. 다시 시도해주세요." }, { status: 500 });
  }
}
