import BoardHeader from "@/components/board/BoardHeader";
import "./board.css";
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="board-shell">
      <BoardHeader />
      {children}
    </div>
  );
}
