import Link from "next/link";
export default function BoardHeader() {
  return (
    <header className="board-header">
      <Link href="/posts" className="brand">
        [서비스명]
      </Link>
      <nav aria-label="주 메뉴">
        <Link href="/posts" aria-current="page">
          커뮤니티
        </Link>
        <span title="채팅 팀 구현 후 연결">AI 채팅 · 준비 중</span>
      </nav>
      <Link className="button primary" href="/posts/new">
        글쓰기
      </Link>
      <span className="avatar" aria-label="샘플 사용자 지혜">
        지
      </span>
    </header>
  );
}
