"use client";
import { useState, type FormEvent } from "react";
import type { BoardPost, BoardComment } from "@/types/board";
import { USER, commentCount, editComments } from "@/lib/board/logic";
import { useBoard } from "./BoardProvider";
export default function Comments({ post }: { post: BoardPost }) {
  const { commit } = useBoard();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [edit, setEdit] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  function change(fn: (comments: BoardComment[]) => BoardComment[]) {
    return commit((posts) =>
      posts.map((p) => {
        if (p.id !== post.id) return p;
        const comments = fn(p.comments || []);
        return { ...p, comments, commentCount: commentCount(comments) };
      }),
    );
  }
  function add(e: FormEvent, parentId?: string) {
    e.preventDefault();
    const content = (parentId ? reply : text).trim();
    const ok = change((comments) => {
      if (!content || content.length > 2000) throw new Error("댓글은 1~2,000자로 입력해 주세요.");
      const item = { id: crypto.randomUUID(), author: USER, content, replies: [] };
      if (!parentId) return [...comments, item];
      if (!comments.some((c) => c.id === parentId)) throw new Error("원래 댓글을 찾지 못했어요.");
      return comments.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, item] } : c));
    });
    if (ok) {
      if (parentId) {
        setReply("");
        setReplyTo(null);
      } else setText("");
    }
  }
  function render(c: BoardComment, isReply = false) {
    return (
      <div className={isReply ? "reply" : "comment"} key={c.id}>
        <div className="section-heading">
          <strong>
            {isReply ? "↳ " : ""}
            {c.author}
          </strong>
          {c.author === USER && !c.deleted && (
            <div className="actions">
              <button
                onClick={() => {
                  setEdit(c.id);
                  setEditText(c.content);
                }}
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (confirm("댓글을 삭제할까요?"))
                    change((list) => editComments(list, c.id, null));
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {edit === c.id ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (change((list) => editComments(list, c.id, editText))) setEdit(null);
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
            <button className="primary">저장</button>
          </form>
        ) : (
          <p className="preserve-lines">{c.deleted ? "삭제된 댓글이에요." : c.content}</p>
        )}
        {!isReply && (
          <>
            <button
              onClick={() => {
                setReplyTo(replyTo === c.id ? null : c.id);
                setReply("");
              }}
            >
              답글 달기
            </button>
            {replyTo === c.id && (
              <form onSubmit={(e) => add(e, c.id)}>
                <textarea
                  aria-label="답글 쓰기"
                  required
                  maxLength={2000}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button className="primary">답글 등록</button>
              </form>
            )}
            {c.replies.map((child) => render(child, true))}
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
          <button className="primary">댓글 등록</button>
        </div>
      </form>
      {(post.comments || []).map((c) => render(c))}
    </section>
  );
}
