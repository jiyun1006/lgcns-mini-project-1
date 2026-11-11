import { categories, type BoardPost } from "@/types/board";
import { validatePost, type PostInput } from "./logic";

export class BoardError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function objectId(value: unknown): string {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/i.test(value)) {
    throw new BoardError("올바른 ID가 아닙니다.");
  }

  return value;
}

export function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.length > 2000) {
    throw new BoardError("댓글은 1~2,000자로 입력해 주세요.");
  }

  return value.trim();
}

export function postInput(value: unknown): PostInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BoardError("게시글 입력값을 확인해 주세요.");
  }

  const p = value as Record<string, unknown>;

  if (
    ![p.title, p.content, p.prompt, p.result].every((v) => typeof v === "string") ||
    typeof p.category !== "string" ||
    !categories.includes(p.category as BoardPost["category"]) ||
    !Array.isArray(p.tags) ||
    !p.tags.every((t) => typeof t === "string")
  ) {
    throw new BoardError("게시글 입력 형식이 올바르지 않습니다.");
  }

  const result: PostInput = {
    title: (p.title as string).trim(),
    content: (p.content as string).trim(),
    prompt: p.prompt as string,
    result: p.result as string,
    category: p.category as BoardPost["category"],
    tags: [...new Set((p.tags as string[]).map((tag) => tag.trim()))],
  };

  try {
    validatePost(result);
  } catch (error) {
    throw new BoardError(error instanceof Error ? error.message : "입력값을 확인해 주세요.");
  }

  return result;
}

export function requireOwner(authorId: string, userId: string) {
  if (authorId !== userId) {
    throw new BoardError("본인이 작성한 항목만 변경할 수 있습니다.", 403);
  }
}
