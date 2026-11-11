import test from "node:test";
import assert from "node:assert/strict";
import { selectActivity } from "../lib/mypage/activity";
import { USER } from "../lib/board/logic";
import { mockPosts } from "../lib/board/mock-data";

test("내 글·답글 포함 댓글·좋아요·인기글을 골라냄", () => {
  const [a, b, c, d] = mockPosts;
  const posts = [
    { ...a, author: USER, likeCount: 1, createdAt: "2026-11-01" },
    { ...b, author: USER, likeCount: 9, createdAt: "2026-11-02", liked: true },
    {
      ...c,
      comments: [
        {
          id: "c1",
          author: "남",
          content: "x",
          replies: [{ id: "c2", author: USER, content: "답글", replies: [] }],
        },
        { id: "c3", author: USER, content: "", replies: [], deleted: true },
      ],
    },
    d,
  ];
  const r = selectActivity(posts);
  assert.deepEqual(
    r.posts.map((p) => p.id),
    [b.id, a.id],
  );
  assert.deepEqual(
    r.comments.map((x) => [x.post.id, x.comment.id]),
    [[c.id, "c2"]],
  );
  assert.deepEqual(
    r.liked.map((p) => p.id),
    [b.id],
  );
  assert.equal(r.popular[0].id, b.id);
});
