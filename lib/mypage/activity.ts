import { USER, filterPosts } from "../board/logic";
import type { BoardComment, BoardPost } from "../../types/board";

export function selectActivity(posts: BoardPost[], user = USER) {
  const mine = filterPosts(
    posts.filter((p) => p.author === user),
    "전체",
    "",
    "최신순",
    0,
  );
  const flatten = (items: BoardComment[]): BoardComment[] =>
    items.flatMap((c) => [c, ...flatten(c.replies)]);
  return {
    posts: mine,
    comments: posts.flatMap((post) =>
      flatten(post.comments ?? [])
        .filter((c) => c.author === user && !c.deleted)
        .map((comment) => ({ post, comment })),
    ),
    liked: posts.filter((p) => p.liked),
    popular: filterPosts(mine, "전체", "", "좋아요순", 0).slice(0, 3),
  };
}
