import { categories, type BoardPost, type BoardComment } from "../../types/board";
export const USER = "지혜";
export const STORAGE_KEY = "lgcns-board.v1";
export type PostInput = Pick<
  BoardPost,
  "title" | "category" | "content" | "prompt" | "result" | "tags"
>;
export function validatePost(p: PostInput) {
  if (!categories.includes(p.category)) throw new Error("카테고리를 선택해 주세요.");
  if (!p.title.trim() || p.title.length > 120) throw new Error("제목은 1~120자로 입력해 주세요.");
  if (!p.content.trim() || p.content.length > 20000)
    throw new Error("본문은 1~20,000자로 입력해 주세요.");
  if (p.category === "프롬프트 공유" && !p.prompt.trim())
    throw new Error("공유할 프롬프트를 입력해 주세요.");
  if (p.prompt.length > 20000 || p.result.length > 20000)
    throw new Error("내용은 각각 20,000자 이내로 입력해 주세요.");
  if (p.tags.length > 5 || p.tags.some((t) => !t.trim() || t.length > 20))
    throw new Error("태그는 20자 이하로 최대 5개까지 입력할 수 있어요.");
}
export function commentCount(comments: BoardComment[]): number {
  return comments.reduce((sum, c) => sum + (c.deleted ? 0 : 1) + commentCount(c.replies), 0);
}
export function editComments(
  comments: BoardComment[],
  id: string,
  content: string | null,
): BoardComment[] {
  const target = comments.flatMap((c) => [c, ...c.replies]).find((c) => c.id === id);
  if (!target || target.author !== USER || target.deleted)
    throw new Error("본인의 댓글만 변경할 수 있어요.");
  if (content !== null && (!content.trim() || content.length > 2000))
    throw new Error("댓글은 1~2,000자로 입력해 주세요.");
  function walk(items: BoardComment[]): BoardComment[] {
    return items.flatMap((c) =>
      c.id === id
        ? content === null
          ? c.replies.length
            ? [{ ...c, content: "", deleted: true }]
            : []
          : [{ ...c, content: content.trim() }]
        : [{ ...c, replies: walk(c.replies) }],
    );
  }
  return walk(comments);
}
export function filterPosts(
  posts: BoardPost[],
  category: string,
  query: string,
  sort: string,
  days: number,
  now = Date.now(),
) {
  const keyword = query.trim().toLowerCase();
  return posts
    .filter(
      (p) =>
        (category === "전체" || p.category === category) &&
        (!days || new Date(p.createdAt).getTime() >= now - days * 86400000) &&
        [p.title, p.content, p.prompt, p.result, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(keyword),
    )
    .sort((a, b) =>
      sort === "최신순"
        ? b.createdAt.localeCompare(a.createdAt)
        : sort === "조회순"
          ? b.viewCount - a.viewCount
          : b.likeCount - a.likeCount,
    );
}
export function parsePosts(raw: string): BoardPost[] {
  const items: unknown = JSON.parse(raw);
  function validComment(value: unknown): value is BoardComment {
    if (!value || typeof value !== "object") return false;
    const c = value as BoardComment;
    return (
      typeof c.id === "string" &&
      typeof c.author === "string" &&
      typeof c.content === "string" &&
      Array.isArray(c.replies) &&
      c.replies.every(validComment)
    );
  }
  if (!Array.isArray(items)) throw new Error("저장 데이터 형식이 올바르지 않아요.");
  for (const p of items) {
    if (
      !p ||
      typeof p !== "object" ||
      ![p.id, p.author, p.createdAt, p.title, p.content, p.prompt, p.result].every(
        (v) => typeof v === "string",
      ) ||
      !Number.isFinite(Date.parse(p.createdAt)) ||
      !categories.includes(p.category) ||
      !Array.isArray(p.tags) ||
      !p.tags.every((t: unknown) => typeof t === "string") ||
      ![p.likeCount, p.viewCount, p.commentCount].every((v) => Number.isFinite(v) && v >= 0) ||
      !Array.isArray(p.comments) ||
      !p.comments.every(validComment) ||
      typeof p.liked !== "boolean"
    )
      throw new Error("저장 데이터가 손상되었어요. 기존 데이터는 보존했어요.");
  }
  return items;
}
