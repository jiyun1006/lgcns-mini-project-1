import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { categories, type BoardPost, type BoardComment } from "@/types/board";
import { BoardError, objectId, postInput, text, requireOwner } from "@/lib/board/validation";

export async function readBoard(userId: string, db = prisma): Promise<BoardPost[]> {
  const rows = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: { name: true, isProfilePublic: true },
      },
      likes: {
        select: { userId: true },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });

  return rows.map((post) => {
    const byId = new Map<string, BoardComment>();

    for (const comment of post.comments) {
      byId.set(comment.id, {
        id: comment.id,
        author: comment.author.name,
        authorId: comment.authorId,
        content: comment.deleted ? "" : comment.content,
        deleted: comment.deleted,
        replies: [],
      });
    }

    const comments: BoardComment[] = [];

    for (const comment of post.comments) {
      const item = byId.get(comment.id)!;

      const parent = comment.parentId ? byId.get(comment.parentId) : undefined;

      if (parent) {
        parent.replies.push(item);
      } else {
        comments.push(item);
      }
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      category: categories.includes(post.category as BoardPost["category"])
        ? (post.category as BoardPost["category"])
        : "질문",
      prompt: post.prompt,
      result: post.result,
      tags: post.tags,
      author: post.author.name,
      authorId: post.authorId,
      authorProfileImageUrl:
        (post.author.isProfilePublic ?? true) ? `/api/users/${post.authorId}/profile-image` : null,
      createdAt: post.createdAt.toISOString(),
      viewCount: post.viewCount,
      likeCount: post.likes.length,
      liked: post.likes.some((like) => like.userId === userId),
      commentCount: post.comments.filter((comment) => !comment.deleted).length,
      comments,
    };
  });
}

export async function changeBoard(body: Record<string, unknown>, userId: string, db = prisma) {
  // 게시글 등록
  if (body.action === "createPost") {
    const values = postInput(body.values);

    const post = await db.post.create({
      data: {
        ...values,
        authorId: userId,
      },
    });

    return post.id;
  }

  const id = objectId(body.postId);

  return db.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) {
      throw new BoardError("게시글을 찾을 수 없습니다.", 404);
    }

    switch (body.action) {
      // 게시글 수정
      case "updatePost": {
        requireOwner(post.authorId, userId);

        await tx.post.update({
          where: { id },
          data: postInput(body.values),
        });

        break;
      }

      // 게시글과 관련 댓글·좋아요 삭제
      case "deletePost": {
        requireOwner(post.authorId, userId);

        await tx.comment.deleteMany({
          where: { postId: id },
        });

        await tx.postLike.deleteMany({
          where: { postId: id },
        });

        await tx.post.delete({
          where: { id },
        });

        break;
      }

      // 조회수 증가
      case "viewPost": {
        await tx.post.update({
          where: { id },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });

        break;
      }

      // 좋아요 설정·취소
      case "setLike": {
        if (typeof body.liked !== "boolean") {
          throw new BoardError("좋아요 상태를 확인해 주세요.");
        }

        if (body.liked) {
          await tx.postLike.upsert({
            where: {
              userId_postId: {
                userId,
                postId: id,
              },
            },
            create: {
              userId,
              postId: id,
            },
            update: {},
          });
        } else {
          await tx.postLike.deleteMany({
            where: {
              userId,
              postId: id,
            },
          });
        }

        break;
      }

      // 댓글·답글 등록
      case "addComment": {
        const parentId = body.parentId == null ? null : objectId(body.parentId);

        if (parentId) {
          const parent = await tx.comment.findFirst({
            where: {
              id: parentId,
              postId: id,
            },
          });

          if (!parent || parent.parentId) {
            throw new BoardError("답글을 달 원래 댓글을 찾을 수 없습니다.", 404);
          }
        }

        await tx.comment.create({
          data: {
            postId: id,
            authorId: userId,
            content: text(body.content),
            parentId,
          },
        });

        break;
      }

      // 댓글 수정·삭제
      case "editComment":
      case "deleteComment": {
        const commentId = objectId(body.commentId);

        const comment = await tx.comment.findFirst({
          where: {
            id: commentId,
            postId: id,
          },
        });

        if (!comment || comment.deleted) {
          throw new BoardError("댓글을 찾을 수 없습니다.", 404);
        }

        requireOwner(comment.authorId, userId);

        if (body.action === "editComment") {
          await tx.comment.update({
            where: { id: commentId },
            data: {
              content: text(body.content),
            },
          });
        } else {
          // 답글 관계를 유지하기 위해 삭제 상태로 변경
          await tx.comment.update({
            where: { id: commentId },
            data: {
              content: "",
              deleted: true,
            },
          });
        }

        break;
      }

      default:
        throw new BoardError("지원하지 않는 요청입니다.");
    }

    return id;
  });
}

export function boardFailure(error: unknown) {
  if (error instanceof BoardError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2034", "P2002"].includes(error.code)
  ) {
    return Response.json(
      {
        error: "동시 요청이 발생했습니다. 다시 시도해 주세요.",
      },
      { status: 409 },
    );
  }

  console.error("[board]", error instanceof Error ? error.name : "Unknown error");

  return Response.json(
    {
      error: "DB 요청에 실패했습니다. 연결 설정과 Prisma 스키마 적용 여부를 확인해 주세요.",
    },
    { status: 500 },
  );
}
