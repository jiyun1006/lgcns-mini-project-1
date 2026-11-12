import { prisma } from "@/lib/prisma";
import { getCurrentUser, isObjectId } from "@/lib/current-user";
import { streamText, createTextStreamResponse, toTextStream } from "ai";
import { exaoneModel, exaoneOptions, SYSTEM_PROMPT } from "@/lib/ai";

const HISTORY_LIMIT = 10;
export const maxDuration = 300;
const TITLE_MAX = 40;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const raw = body?.question ?? body?.content;
    const conversationId = body?.conversationId;
    const editMessageId = body?.editMessageId;

    if (typeof raw !== "string" || !raw.trim()) {
      return Response.json({ error: "메시지를 입력해주세요." }, { status: 400 });
    }
    if (conversationId != null && !isObjectId(conversationId)) {
      return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
    }
    if (editMessageId != null && (!isObjectId(editMessageId) || !isObjectId(conversationId))) {
      return Response.json({ error: "잘못된 수정 요청입니다." }, { status: 400 });
    }

    const content = raw.trim();
    const user = await getCurrentUser();

    const conv = conversationId
      ? await prisma.conversation.findFirst({ where: { id: conversationId, userId: user.id } })
      : editMessageId
        ? null
        : await prisma.conversation.create({
            data: { userId: user.id, title: content.slice(0, TITLE_MAX) },
          });

    if (!conv) {
      return Response.json({ error: "대화를 찾을 수 없어요." }, { status: 404 });
    }

    let history: { role: "USER" | "ASSISTANT"; content: string }[];

    if (editMessageId) {
      // 수정 대상 메시지와 그 이후의 메시지를 DB에서 제거하고,
      // 수정 대상 이전의 대화만 새 답변 생성에 사용한다.
      const allMessages = await prisma.message.findMany({
        where: { conversationId: conv.id },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true, role: true, content: true },
      });

      const editIndex = allMessages.findIndex((message) => message.id === editMessageId);
      if (editIndex < 0 || allMessages[editIndex].role !== "USER") {
        return Response.json({ error: "수정할 질문을 찾을 수 없습니다." }, { status: 404 });
      }

      const previousMessages = allMessages.slice(0, editIndex);
      history = previousMessages.slice(-HISTORY_LIMIT).map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const messagesToDelete = allMessages.slice(editIndex).map((message) => message.id);
      await prisma.$transaction([
        prisma.message.deleteMany({
          where: { conversationId: conv.id, id: { in: messagesToDelete } },
        }),
        prisma.message.create({
          data: { role: "USER", content, conversationId: conv.id },
        }),
        prisma.conversation.update({
          where: { id: conv.id },
          data: {
            updatedAt: new Date(),
            ...(previousMessages.length === 0 ? { title: content.slice(0, TITLE_MAX) } : {}),
          },
        }),
      ]);
    } else {
      const recent = await prisma.message.findMany({
        where: { conversationId: conv.id },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: HISTORY_LIMIT,
        select: { role: true, content: true },
      });
      history = recent.reverse();

      const isFirst = history.length === 0;
      await prisma.$transaction([
        prisma.message.create({ data: { role: "USER", content, conversationId: conv.id } }),
        prisma.conversation.update({
          where: { id: conv.id },
          data: {
            updatedAt: new Date(),
            ...(isFirst ? { title: content.slice(0, TITLE_MAX) } : {}),
          },
        }),
      ]);
    }

    const result = streamText({
      model: exaoneModel,
      instructions: SYSTEM_PROMPT,
      messages: [
        ...history.map((message) => ({
          role: message.role === "USER" ? ("user" as const) : ("assistant" as const),
          content: message.content,
        })),
        { role: "user" as const, content },
      ],
      providerOptions: exaoneOptions,
      maxRetries: 2,
      timeout: { firstChunkMs: 30_000, chunkMs: 15_000 },
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
    result.consumeStream();

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "답변을 받지 못했어요. 다시 시도해주세요." }, { status: 500 });
  }
}
