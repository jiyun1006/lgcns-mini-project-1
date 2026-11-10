import clientPromise from "@/lib/mongodb";
import { DEFAULT_USER_ID } from "@/lib/constants";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "exaone_chat");

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("id");

    // 특정 대화 불러오기
    if (conversationId) {
      if (!ObjectId.isValid(conversationId)) {
        return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
      }

      const conversation = await db.collection("conversations").findOne({
        _id: new ObjectId(conversationId),
        userId: DEFAULT_USER_ID,
      });

      if (!conversation) {
        return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
      }

      return Response.json({
        ...conversation,
        _id: conversation._id.toString(),
      });
    }

    // 최근 대화 목록 조회
    const conversations = await db
      .collection("conversations")
      .find(
        { userId: DEFAULT_USER_ID },
        {
          projection: {
            title: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .sort({ updatedAt: -1 })
      .toArray();

    return Response.json(
      conversations.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "대화 목록 조회 실패" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "exaone_chat");

    const now = new Date();

    const conversation = {
      userId: DEFAULT_USER_ID,
      title: "새 대화",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("conversations").insertOne(conversation);

    return Response.json({
      ...conversation,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "새 대화 생성 실패" }, { status: 500 });
  }
}

// 대화 이름 수정
export async function PATCH(req) {
  try {
    const { id, title } = await req.json();

    if (
      !id ||
      !ObjectId.isValid(id) ||
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 80
    ) {
      return Response.json({ error: "올바른 대화 이름을 입력해주세요." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "exaone_chat");

    const result = await db.collection("conversations").updateOne(
      {
        _id: new ObjectId(id),
        userId: DEFAULT_USER_ID,
      },
      {
        $set: {
          title: title.trim(),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
    }

    return Response.json({
      success: true,
      title: title.trim(),
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "대화 이름 수정 실패" }, { status: 500 });
  }
}

// 대화 삭제
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: "잘못된 대화 ID입니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "exaone_chat");

    const result = await db.collection("conversations").deleteOne({
      _id: new ObjectId(id),
      userId: DEFAULT_USER_ID,
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "대화를 찾을 수 없습니다." }, { status: 404 });
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "대화 삭제 실패" }, { status: 500 });
  }
}
