import Link from "next/link";
export default function PostNotFound() {
  return (
    <main className="board-main narrow">
      <h1>게시글을 찾을 수 없어요.</h1>
      <Link href="/posts">게시판 목록으로 돌아가기</Link>
    </main>
  );
}
