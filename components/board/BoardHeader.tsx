"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function BoardHeader() {
  const path = usePathname();
  return (
    <header className="board-header">
      <Link href="/posts" className="brand">
        [서비스명]
      </Link>
      <nav aria-label="주 메뉴">
        <Link href="/posts" aria-current={path.startsWith("/posts") ? "page" : undefined}>
          커뮤니티
        </Link>
      </nav>
      <Link className="button primary" href="/posts/new">
        글쓰기
      </Link>
      <span className="avatar" aria-label="데모 사용자 지혜">
        지
      </span>
    </header>
  );
}
