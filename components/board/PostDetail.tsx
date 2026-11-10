"use client";
import Link from "next/link";
import { useState } from "react";
import type { BoardPost } from "@/types/board";
import { mockComments } from "@/lib/board/mock-data";
export default function PostDetail({ post }: { post: BoardPost }) {
  const [liked, setLiked] = useState(false);
  const [notice, setNotice] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setNotice("프롬프트를 복사했어요.");
    } catch {
      setNotice("복사하지 못했어요. 프롬프트를 직접 선택해서 복사해 주세요.");
    }
  }
  return (
    <main className="board-main narrow">
      <Link className="back-link" href="/posts">
        ← 목록으로 돌아가기
      </Link>
      <article>
        <span className="badge">{post.category}</span>
        <h1>{post.title}</h1>
        <div className="section-heading">
          <p className="muted">
            {post.author} · {post.createdAt.replaceAll("-", ".")} · 조회{" "}
            {post.viewCount.toLocaleString()}
          </p>
          <div className="actions">
            <Link className="button" href={`/posts/${post.id}/edit`}>
              수정 화면
            </Link>
            <button disabled title="인증 및 삭제 API 연결 필요">
              삭제
            </button>
          </div>
        </div>
        <section className="detail-section">
          <h2>AI 활용 목적·과정</h2>
          <p>{post.content}</p>
        </section>
        {post.prompt && (
          <section className="prompt-panel">
            <div className="section-heading">
              <h2>공유된 프롬프트</h2>
              <div className="actions">
                <button onClick={copy}>복사</button>
                <button
                  className="primary"
                  onClick={() =>
                    setNotice("AI 채팅 연결 예정: 채팅 팀과 입력값 전달 규약을 정한 뒤 연결하세요.")
                  }
                >
                  프롬프트 사용하기
                </button>
              </div>
            </div>
            <pre>{post.prompt}</pre>
            <p className="muted">채팅 연결 후 새 채팅 입력창에 프롬프트를 전달할 예정이에요.</p>
            <p role="status">{notice}</p>
          </section>
        )}
        <section className="detail-section">
          <h2>AI 답변 예시·활용 후기</h2>
          <p className="preserve-lines">{post.result}</p>
        </section>
        <div className="tags">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <div className="like-area">
          <button aria-pressed={liked} onClick={() => setLiked(!liked)}>
            {liked ? "♥" : "♡"} 좋아요 {post.likeCount + Number(liked)}
          </button>
          <p className="muted">화면 확인용 · 새로고침하면 초기화됩니다.</p>
        </div>
      </article>
      <section className="comments">
        <h2>댓글 · 샘플</h2>
        <label htmlFor="comment">댓글 쓰기</label>
        <textarea id="comment" placeholder="댓글을 남겨 보세요" />
        <div className="form-actions">
          <button disabled>댓글 등록 · API 연결 예정</button>
        </div>
        {mockComments.map((c) => (
          <div className="comment" key={c.id}>
            <strong>{c.author}</strong>
            <p>{c.content}</p>
            <button disabled>답글 달기</button>
            {c.replies.map((r) => (
              <div className="reply" key={r.id}>
                <strong>↳ {r.author}</strong>
                <p>{r.content}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
