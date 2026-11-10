import clientPromise from "@/lib/mongodb";
import { DEFAULT_USER_ID } from "@/lib/constants";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { question, conversationId } = await req.json();

    if (
      !question ||
      typeof question !== "string" ||
      !question.trim() ||
      !conversationId ||
      !ObjectId.isValid(conversationId)
    ) {
      return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "exaone_chat");
    const collection = db.collection("conversations");

    const conversation = await collection.findOne({
      _id: new ObjectId(conversationId),
      userId: DEFAULT_USER_ID,
    });

    if (!conversation) {
      return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
    }

    // EXAONE API 호출
    const response = await fetch("https://api.exaone.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXAONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "k-exaone_v2.5",
        messages: [
          {
            role: "user",
            content: question.trim(),
          },
        ],
        max_tokens: 1024,
        temperature: 1.0,
        top_p: 0.95,
        reasoning_effort: "high",
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "EXAONE API 호출 실패" },
        { status: response.status },
      );
    }

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return Response.json({ error: "EXAONE 답변이 비어 있습니다." }, { status: 502 });
    }

    const now = new Date();

    // 질문과 답변 저장
    await collection.updateOne(
      {
        _id: new ObjectId(conversationId),
        userId: DEFAULT_USER_ID,
      },
      {
        $push: {
          messages: {
            $each: [
              {
                role: "USER",
                content: question.trim(),
              },
              {
                role: "ASSISTANT",
                content: answer,
              },
            ],
          },
        },
        $set: {
          updatedAt: now,
          ...(conversation.messages.length === 0 ? { title: question.trim().slice(0, 40) } : {}),
        },
      },
    );

    return Response.json({
      answer,
      usage: data.usage,
    });
  } catch (error) {
    console.error("EXAONE API Error:", error);

    return Response.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
