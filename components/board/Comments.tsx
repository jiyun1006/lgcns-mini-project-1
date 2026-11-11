"use client";

import { useState, type FormEvent } from "react";
import type { BoardPost, BoardComment } from "@/types/board";
import { useBoard } from "./BoardProvider";

export default function Comments({ post }: { post: BoardPost }) {
  const { mutate, user, busy } = useBoard();

  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [edit, setEdit] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  async function add(e: FormEvent, parentId?: string) {
    e.preventDefault();

    const content = (parentId ? reply : text).trim();

    const saved = await mutate({
      action: "addComment",
      postId: post.id,
      content,
      parentId,
    });

    if (!saved) return;

    if (parentId) {
      setReply("");
      setReplyTo(null);
    } else {
      setText("");
    }
  }

  function render(comment: BoardComment, isReply = false) {
    return (
      <div className={isReply ? "reply" : "comment"} key={comment.id}>
        <div className="section-heading">
          <strong>
            {isReply ? "↳ " : ""}
            {comment.author}
          </strong>

          {comment.authorId === user?.id && !comment.deleted && (
            <div className="actions">
              <button
                onClick={() => {
                  setEdit(comment.id);
                  setEditText(comment.content);
                }}
              >
                수정
              </button>

              <button
                disabled={busy}
                onClick={async () => {
                  if (!confirm("댓글을 삭제할까요?")) return;

                  await mutate({
                    action: "deleteComment",
                    postId: post.id,
                    commentId: comment.id,
                  });
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {edit === comment.id ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const saved = await mutate({
                action: "editComment",
                postId: post.id,
                commentId: comment.id,
                content: editText,
              });

              if (saved) {
                setEdit(null);
              }
            }}
          >
            <textarea
              aria-label="댓글 수정"
              required
              maxLength={2000}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <button type="button" onClick={() => setEdit(null)}>
              취소
            </button>

            <button className="primary" disabled={busy}>
              저장
            </button>
          </form>
        ) : (
          <p className="preserve-lines">
            {comment.deleted ? "삭제된 댓글이에요." : comment.content}
          </p>
        )}

        {!isReply && (
          <>
            <button
              onClick={() => {
                setReplyTo(replyTo === comment.id ? null : comment.id);
                setReply("");
              }}
            >
              답글 달기
            </button>

            {replyTo === comment.id && (
              <form onSubmit={(e) => add(e, comment.id)}>
                <textarea
                  aria-label="답글 쓰기"
                  required
                  maxLength={2000}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <button className="primary" disabled={busy}>
                  답글 등록
                </button>
              </form>
            )}

            {comment.replies.map((child) => render(child, true))}
          </>
        )}
      </div>
    );
  }

  return (
    <section className="comments">
      <h2>댓글 {post.commentCount}</h2>

      <form onSubmit={(e) => add(e)}>
        <label htmlFor="comment">댓글 쓰기</label>

        <textarea
          id="comment"
          required
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글을 남겨 보세요"
        />

        <div className="form-actions">
          <button className="primary" disabled={busy}>
            댓글 등록
          </button>
        </div>
      </form>

      {(post.comments || []).map((comment) => render(comment))}
    </section>
  );
}
