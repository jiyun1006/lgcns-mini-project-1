import { prisma } from "@/lib/prisma";
import { getCurrentUser, isObjectId } from "@/lib/current-user";
import { streamText, createTextStreamResponse, toTextStream } from "ai";
import { exaoneModel, exaoneOptions, SYSTEM_PROMPT } from "@/lib/ai";

const HISTORY_LIMIT = 10; // 몇개의 채팅을 불러올지

export const maxDuration = 300; // Vercel 배포 시 300초까지 허용

const TITLE_MAX = 40;

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
    if (!user) {
      return Response.json({ error: "로그인이 필요해요." }, { status: 401 });
    }

    // 2. 대화방 찾기 (없으면 새로 만들기)
    const conv = conversationId
      ? await prisma.conversation.findFirst({ where: { id: conversationId, userId: user.id } })
      : await prisma.conversation.create({
          data: { userId: user.id, title: content.slice(0, TITLE_MAX) },
        });

    if (!conv) {
      return Response.json({ error: "대화를 찾을 수 없어요." }, { status: 404 });
    }

    const recent = await prisma.message.findMany({
      where: { conversationId: conv.id },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    });
    const history = recent.reverse();

    const isFirst = history.length === 0;
    await prisma.$transaction([
      prisma.message.create({ data: { role: "USER", content, conversationId: conv.id } }),
      prisma.conversation.update({
        where: { id: conv.id },
        data: { updatedAt: new Date(), ...(isFirst ? { title: content.slice(0, TITLE_MAX) } : {}) },
      }),
    ]);

    // (3) 스트리밍 시작
    const result = streamText({
      model: exaoneModel,
      instructions: SYSTEM_PROMPT,
      messages: [
        ...history.map((m) => ({
          role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user" as const, content },
      ],
      providerOptions: exaoneOptions,
      maxRetries: 2, // EXAONE 일시 장애 시 자동 재시도
      timeout: { firstChunkMs: 30_000, chunkMs: 15_000 },

      // (4) 다 끝나면 답변 저장
      onEnd: async ({ text, finalStep }) => {
        if (!text.trim()) return;
        await prisma.message.create({
          data: {
            role: "ASSISTANT",
            content: text,
            reasoning: finalStep.reasoningText ?? null,
            conversationId: conv.id,
          },
        });
      },
      onError: ({ error }) => console.error("EXAONE stream error:", error),
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "답변을 받지 못했어요. 다시 시도해주세요." }, { status: 500 });
  }
}
