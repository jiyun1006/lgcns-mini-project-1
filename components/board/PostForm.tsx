"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBoard } from "./BoardProvider";
import { validatePost, type PostInput } from "@/lib/board/logic";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { categories, type BoardPost } from "@/types/board";
export default function PostForm({ postId }: { postId?: string }) {
  const { posts, user, mutate, busy } = useBoard();
  const post = posts.find((p) => p.id === postId);
  if (postId && !post)
    return (
      <main className="board-main">
        <h1>게시글을 찾을 수 없어요</h1>
        <Link href="/posts">목록으로</Link>
      </main>
    );
  if (post && post.authorId !== user?.id)
    return (
      <main className="board-main">
        <h1>본인의 게시글만 수정할 수 있어요</h1>
        <Link href={`/posts/${post.id}`}>게시글로 돌아가기</Link>
      </main>
    );
  return <Editor key={postId || "new"} post={post} mutate={mutate} busy={busy} />;
}
function Editor({
  post,
  mutate,
  busy,
}: {
  post?: BoardPost;
  mutate: ReturnType<typeof useBoard>["mutate"];
  busy: boolean;
}) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [notice, setNotice] = useState("");
  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    const value = tagInput.trim().replace(/^#/, "");
    if (value && value.length <= 20 && !tags.includes(value) && tags.length < 5) {
      setTags([...tags, value]);
      setDirty(true);
      setTagInput("");
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const pending = tagInput.trim().replace(/^#+/, "");

    const values: PostInput = {
      category: data.get("category") as BoardPost["category"],
      title: String(data.get("title") || "").trim(),
      content: String(data.get("content") || "").trim(),
      prompt: String(data.get("prompt") || ""),
      result: String(data.get("result") || ""),
      tags: [...new Set([...tags, ...(pending ? [pending] : [])])],
    };

    try {
      validatePost(values);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "입력값을 확인해 주세요.");

      return;
    }

    const id = await mutate(
      post
        ? {
            action: "updatePost",
            postId: post.id,
            values,
          }
        : {
            action: "createPost",
            values,
          },
    );

    if (id) {
      setDirty(false);
      router.push(`/posts/${id}`);
    }
  }
  const formCategories = post
    ? categories
    : categories.filter((category) => category !== "모델 비교");

  return (
    <main className="board-main narrow">
      <h1>{post ? "게시글 수정" : "새 게시글 작성"}</h1>
      <form onSubmit={submit} onChange={() => setDirty(true)}>
        <div className="form-top">
          <label>
            카테고리
            <select name="category" defaultValue={post?.category ?? categories[0]}>
              {formCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            제목
            <input
              name="title"
              required
              maxLength={120}
              defaultValue={post?.title}
              placeholder="어떤 프롬프트나 활용기인지 한 줄로 적어 주세요"
            />
          </label>
        </div>
        <div className="form-field">
          <label htmlFor="content">AI 활용 목적·과정</label>
          <p className="muted">무엇을 하려고 AI를 썼는지, 어떤 순서로 시도했는지 적어 주세요.</p>
          <textarea
            maxLength={20000}
            id="content"
            name="content"
            required
            defaultValue={post?.content}
            placeholder="예: 매주 회의록에서 할 일을 뽑는 데 시간이 오래 걸려서…"
          />
        </div>
        <div className="prompt-panel form-field">
          <label htmlFor="prompt">공유할 프롬프트</label>
          <p className="muted">다른 사람이 바꿔 쓸 부분은 [대괄호]로 표시하면 좋아요.</p>
          <textarea
            maxLength={20000}
            id="prompt"
            name="prompt"
            defaultValue={post?.prompt}
            placeholder="아래 [회의록]에서 할 일을 뽑아 표로 정리해 줘…"
          />
        </div>
        <div className="form-field">
          <label htmlFor="result">AI 답변 예시·활용 후기</label>
          <p className="muted">
            실제로 받은 답변 일부와 써 보니 어땠는지 적어 주세요. 마크다운과 표를 쓸 수 있어요.
          </p>
          <textarea
            maxLength={20000}
            id="result"
            name="result"
            defaultValue={post?.result}
            placeholder="AI 답변 예시와 활용 후기를 적어 주세요"
          />
        </div>
        <div className="form-field">
          <label htmlFor="tag">태그</label>
          <div className="tag-input">
            {tags.map((t) => (
              <button
                type="button"
                key={t}
                aria-label={`${t} 태그 삭제`}
                onClick={() => {
                  setTags(tags.filter((tag) => tag !== t));
                  setDirty(true);
                }}
              >
                #{t} ×
              </button>
            ))}
            <input
              id="tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="태그 입력 후 Enter (최대 5개)"
              maxLength={20}
            />
          </div>
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        </div>
        <p role="status">{notice}</p>
        <div className="form-actions">
          <Link
            className="button"
            href={post ? `/posts/${post.id}` : "/posts"}
            onClick={(e) => {
              if (dirty && !confirm("작성 중인 내용을 버리고 나갈까요?")) e.preventDefault();
            }}
          >
            취소
          </Link>
          <button className="primary" type="submit" disabled={busy}>
            {post ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
