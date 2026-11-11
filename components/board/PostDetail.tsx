"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBoard } from "./BoardProvider";
import { USER } from "@/lib/board/logic";
import Comments from "./Comments";
export default function PostDetail({ postId }: { postId: string }) {
  const { posts, commit, notify } = useBoard();
  const post = posts.find((p) => p.id === postId);
  const router = useRouter();
  const viewed = useRef("");
  useEffect(() => {
    if (post && viewed.current !== postId) {
      viewed.current = postId;
      commit((list) =>
        list.map((p) => (p.id === postId ? { ...p, viewCount: p.viewCount + 1 } : p)),
      );
    }
  }, [postId, post, commit]);
  if (!post)
    return (
      <main className="board-main narrow">
        <h1>게시글을 찾을 수 없어요</h1>
        <p>삭제되었거나 이 브라우저에 저장되지 않은 글이에요.</p>
        <Link href="/posts">목록으로 돌아가기</Link>
      </main>
    );
  async function copy() {
    try {
      await navigator.clipboard.writeText(post!.prompt);
      notify("프롬프트를 복사했어요.");
    } catch {
      notify("복사할 수 없어요. 텍스트를 선택해 직접 복사해 주세요.");
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
            {post.author} · {post.createdAt.slice(0, 10)} · 조회 {post.viewCount.toLocaleString()}
          </p>
          {post.author === USER && (
            <div className="actions">
              <Link className="button" href={`/posts/${post.id}/edit`}>
                수정
              </Link>
              <button
                className="danger"
                onClick={() => {
                  if (
                    confirm("게시글과 댓글을 삭제할까요?") &&
                    commit((list) => {
                      const target = list.find((p) => p.id === postId);
                      if (target?.author !== USER) throw new Error("본인 글만 삭제할 수 있어요.");
                      return list.filter((p) => p.id !== postId);
                    })
                  )
                    router.replace("/posts");
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <section className="detail-section markdown">
          <h2>AI 활용 목적·과정</h2>
          <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </section>
        {post.prompt && (
          <section className="prompt-panel">
            <div className="section-heading">
              <h2>공유된 프롬프트</h2>
              <div className="actions">
                <button onClick={copy}>복사</button>
              </div>
            </div>
            <pre>{post.prompt}</pre>
          </section>
        )}
        {post.result && (
          <section className="detail-section markdown">
            <h2>AI 답변 예시·활용 후기</h2>
            <Markdown remarkPlugins={[remarkGfm]}>{post.result}</Markdown>
          </section>
        )}
        <div className="tags">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <div className="like-area">
          <button
            aria-pressed={post.liked}
            onClick={() =>
              commit((list) =>
                list.map((p) =>
                  p.id === postId
                    ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) }
                    : p,
                ),
              )
            }
          >
            {post.liked ? "♥" : "♡"} 좋아요 {post.likeCount}
          </button>
        </div>
      </article>
      <Comments post={post} />
    </main>
  );
}
