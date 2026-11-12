"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBoard } from "./BoardProvider";
import Comments from "./Comments";
export default function PostDetail({ postId }: { postId: string }) {
  const { posts, user, mutate, notify, busy } = useBoard();
  const post = posts.find((p) => p.id === postId);
  const router = useRouter();
  const viewed = useRef("");

  useEffect(() => {
    if (post && viewed.current !== postId) {
      viewed.current = postId;

      void mutate({
        action: "viewPost",
        postId,
      });
    }
  }, [postId, post, mutate]);
  if (!post)
    return (
      <main className="board-main narrow">
        <h1>게시글을 찾을 수 없어요</h1>
        <p>삭제되었거나 이 브라우저에 저장되지 않은 글이에요.</p>
        <Link href="/posts">목록으로 돌아가기</Link>
      </main>
    );
  const authorHref = `/users/${encodeURIComponent(post.authorId || "")}`;
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
          <div className="post-detail-meta muted">
            <Link
              className="post-author"
              href={authorHref}
              aria-label={`${post.author} 프로필 보기`}
            >
              <Avatar className="post-author-avatar">
                {post.authorProfileImageUrl && (
                  <AvatarImage src={post.authorProfileImageUrl} alt="" />
                )}
                <AvatarFallback>{post.author.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <span>{post.author}</span>
            </Link>
            <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time>
            <span aria-hidden="true">·</span>
            <span>조회 {post.viewCount.toLocaleString()}</span>
          </div>
          {post.authorId === user?.id && (
            <div className="actions">
              <Link className="button" href={`/posts/${post.id}/edit`}>
                수정
              </Link>
              <button
                className="danger"
                disabled={busy}
                onClick={async () => {
                  if (!confirm("게시글과 댓글을 삭제할까요?")) return;

                  const deleted = await mutate({
                    action: "deletePost",
                    postId,
                  });

                  if (deleted) {
                    router.replace("/posts");
                  }
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
            disabled={busy}
            onClick={() =>
              void mutate({
                action: "setLike",
                postId,
                liked: !post.liked,
              })
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
