import test from "node:test";
import assert from "node:assert/strict";
import {
  filterPosts,
  validatePost,
  editComments,
  commentCount,
  parsePosts,
  USER,
} from "../lib/board/logic";
import { mockPosts, mockComments } from "../lib/board/mock-data";

test("검색과 카테고리를 함께 적용하고 원본을 보존함", () => {
  const before = structuredClone(mockPosts);
  assert.equal(filterPosts(mockPosts, "활용 후기", "SQL", "좋아요순", 0)[0].id, "2");
  assert.equal(filterPosts(mockPosts, "전체", "없는검색", "좋아요순", 0).length, 0);
  assert.equal(filterPosts(mockPosts, "전체", "", "조회순", 0)[0].id, "4");
  assert.deepEqual(mockPosts, before);
});
test("최근 기간 밖의 게시글을 제외함", () => {
  assert.equal(filterPosts(mockPosts, "전체", "", "최신순", 7, Date.parse("2027-01-01")).length, 0);
  assert.equal(filterPosts(mockPosts, "전체", "", "최신순", 0)[0].id, "8");
});
test("빈 제목, 빈 프롬프트, 태그 제한 검증", () => {
  assert.doesNotThrow(() => validatePost(mockPosts[0]));
  assert.throws(() => validatePost({ ...mockPosts[0], title: " " }));
  assert.throws(() => validatePost({ ...mockPosts[0], prompt: "" }));
  assert.throws(() => validatePost({ ...mockPosts[0], tags: Array(6).fill("태그") }));
});
test("남의 댓글 변경 불가, 본인 댓글 수정 가능", () => {
  assert.throws(() => editComments(mockComments, "c1", "수정"));
  const comments = [{ id: "mine", author: USER, content: "기존", replies: [] }];
  assert.equal(editComments(comments, "mine", "수정")[0].content, "수정");
  assert.throws(() => editComments(comments, "mine", " "));
});
test("부모 댓글 삭제 후에도 답글을 보존함", () => {
  const comments = [
    {
      id: "mine",
      author: USER,
      content: "원문",
      replies: [{ id: "reply", author: "다른사람", content: "답글", replies: [] }],
    },
  ];
  const next = editComments(comments, "mine", null);
  assert.equal(next[0].deleted, true);
  assert.equal(next[0].replies.length, 1);
  assert.equal(commentCount(next), 1);
});
test("저장 데이터 왕복과 손상 감지", () => {
  const posts = mockPosts.map((p) => ({ ...p, comments: [], liked: false }));
  assert.deepEqual(parsePosts(JSON.stringify(posts)), posts);
  assert.throws(() => parsePosts("{invalid"));
  assert.throws(() => parsePosts("{}"));
  assert.throws(() => parsePosts(JSON.stringify([{ ...posts[0], comments: [{}] }])));
});
