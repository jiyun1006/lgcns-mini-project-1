"use client";
import Link from "next/link";
import { useState } from "react";
import { categories, type BoardPost } from "@/types/board";
export default function BoardList({ posts }: { posts: BoardPost[] }) {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("좋아요순");
  const filtered = posts
    .filter(
      (p) =>
        (category === "전체" || p.category === category) &&
        [p.title, p.content, ...p.tags].join(" ").toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "좋아요순"
        ? b.likeCount - a.likeCount
        : sort === "조회순"
          ? b.viewCount - a.viewCount
          : b.createdAt.localeCompare(a.createdAt),
    );
  const trending = [...posts].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
  return (
    <main className="board-main">
      <div className="section-heading">
        <div>
          <h1>트렌딩</h1>
          <p className="muted">커뮤니티에서 반응이 좋은 프롬프트와 AI 활용기를 모아 봐요.</p>
        </div>
        <span className="muted">전체 기간 · 샘플 데이터</span>
      </div>
      <h2 className="small-heading">↗ 인기글</h2>
      <div className="trending-grid">
        {trending.map((p, i) => (
          <Link href={`/posts/${p.id}`} className="trending-card" key={p.id}>
            <div className="section-heading">
              <strong className="rank">{i + 1}</strong>
              <span className="badge">{p.category}</span>
            </div>
            <h3>{p.title}</h3>
            <span className="muted">
              ♡ 좋아요 {p.likeCount} · {p.author}
            </span>
          </Link>
        ))}
      </div>
      <div className="category-tabs">
        {["전체", ...categories].map((c) => (
          <button
            aria-pressed={category === c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="search-row">
        <input
          aria-label="게시글 검색"
          placeholder="제목, 본문, 태그로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="sort-tabs">
          {["최신순", "조회순", "좋아요순"].map((s) => (
            <button
              aria-pressed={sort === s}
              className={sort === s ? "selected" : ""}
              onClick={() => setSort(s)}
              key={s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <section className="post-list" aria-label="게시글 목록">
        <div className="list-summary">
          {category} · {sort} · 게시글 {filtered.length}개
        </div>
        {filtered.map((p, i) => (
          <Link className="post-row" href={`/posts/${p.id}`} key={p.id}>
            <span className="row-number">{i + 1}</span>
            <div>
              <div className="post-meta">
                <span className="badge">{p.category}</span>
                <span>
                  {p.author} · {p.createdAt.replaceAll("-", ".")}
                </span>
              </div>
              <h3>{p.title}</h3>
              <p className="muted excerpt">{p.content}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </div>
            <span className="post-stats">
              조회 {p.viewCount.toLocaleString()} · ♡ {p.likeCount} · 댓글 {p.commentCount}
            </span>
          </Link>
        ))}
        {!filtered.length && <p className="empty">검색 결과가 없습니다.</p>}
      </section>
    </main>
  );
}
