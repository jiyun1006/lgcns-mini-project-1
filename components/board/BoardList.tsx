"use client";
import Link from "next/link";
import { useState } from "react";
import { categories } from "@/types/board";
import { useBoard } from "./BoardProvider";
import { filterPosts } from "@/lib/board/logic";
export default function BoardList() {
  const { posts } = useBoard();
  const [days, setDays] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("좋아요순");
  const filtered = filterPosts(posts, category, query, sort, days);
  const trending = filterPosts(posts, "전체", "", "좋아요순", days).slice(0, 3);
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const current = Math.min(page, pages);
  return (
    <main className="board-main">
      <div className="section-heading">
        <div>
          <h1>트렌딩</h1>
          <p className="muted">커뮤니티에서 반응이 좋은 프롬프트와 AI 활용기를 모아 봐요.</p>
        </div>
        <label className="period">
          기간
          <select
            value={days}
            onChange={(e) => {
              setDays(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={0}>전체 기간</option>
            <option value={7}>최근 7일</option>
            <option value={30}>최근 30일</option>
          </select>
        </label>
      </div>
      <h2 className="small-heading">
        ↗ 인기글 <small className="muted">선택 기간 작성글 · 누적 좋아요순</small>
      </h2>
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
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
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
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <div className="sort-tabs">
          {["최신순", "조회순", "좋아요순"].map((s) => (
            <button
              aria-pressed={sort === s}
              className={sort === s ? "selected" : ""}
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
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
        {filtered.slice((current - 1) * 8, current * 8).map((p, i) => (
          <Link className="post-row" href={`/posts/${p.id}`} key={p.id}>
            <span className="row-number">{(current - 1) * 8 + i + 1}</span>
            <div>
              <div className="post-meta">
                <span className="badge">{p.category}</span>
                <span>
                  {p.author} · {p.createdAt.slice(0, 10).replaceAll("-", ".")}
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
      <nav className="pagination" aria-label="페이지 이동">
        <button disabled={current === 1} onClick={() => setPage(current - 1)}>
          이전
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            aria-current={current === i + 1 ? "page" : undefined}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={current === pages} onClick={() => setPage(current + 1)}>
          다음
        </button>
      </nav>
    </main>
  );
}
