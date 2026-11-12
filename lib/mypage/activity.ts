import { USER, filterPosts } from "../board/logic";
import type { BoardComment, BoardPost } from "../../types/board";

// userId를 주면 번호로, 안 주면 이름으로 내 것인지 봐요 (이름이 같은 다른 사람이 섞이지 않게)
export function selectActivity(posts: BoardPost[], user = USER, userId?: string) {
  const isMine = (item: { author: string; authorId?: string }) =>
    userId ? item.authorId === userId : item.author === user;
  const mine = filterPosts(posts.filter(isMine), "전체", "", "최신순", 0);

  const flatten = (items: BoardComment[]): BoardComment[] =>
    items.flatMap((c) => [c, ...flatten(c.replies)]);
  return {
    posts: mine,
    comments: posts.flatMap((post) =>
      flatten(post.comments ?? [])
        .filter((c) => isMine(c) && !c.deleted)
        .map((comment) => ({ post, comment })),
    ),
    liked: posts.filter((p) => p.liked),
    popular: filterPosts(mine, "전체", "", "좋아요순", 0).slice(0, 3),
  };
}
