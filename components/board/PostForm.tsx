"use client";
import Link from "next/link";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { categories, type BoardPost } from "@/types/board";
export default function PostForm({ post }: { post?: BoardPost }) {
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [notice, setNotice] = useState("");
  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    const value = tagInput.trim().replace(/^#/, "");
    if (value && !tags.includes(value) && tags.length < 5) {
      setTags([...tags, value]);
      setTagInput("");
    }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(
      "입력값을 확인했어요. 현재는 화면 뼈대이며 저장 API를 연결해야 실제 등록·수정됩니다.",
    );
  }
  return (
    <main className="board-main narrow">
      <h1>{post ? "게시글 수정" : "새 게시글 작성"}</h1>
      <form onSubmit={submit}>
        <div className="form-top">
          <label>
            카테고리
            <select name="category" defaultValue={post?.category ?? categories[0]}>
              {categories.map((c) => (
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
            id="prompt"
            name="prompt"
            defaultValue={post?.prompt}
            placeholder="아래 [회의록]에서 할 일을 뽑아 표로 정리해 줘…"
          />
        </div>
        <div className="form-field">
          <label htmlFor="result">AI 답변 예시·활용 후기</label>
          <p className="muted">
            실제로 받은 답변 일부와 써 보니 어땠는지 적어 주세요. 현재는 일반 텍스트로 표시해요.
          </p>
          <textarea
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
                onClick={() => setTags(tags.filter((tag) => tag !== t))}
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
              maxLength={30}
            />
          </div>
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        </div>
        <p role="status">{notice}</p>
        <div className="form-actions">
          <Link className="button" href={post ? `/posts/${post.id}` : "/posts"}>
            취소
          </Link>
          <button className="primary" type="submit">
            {post ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
