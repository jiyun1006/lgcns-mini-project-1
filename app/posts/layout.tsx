import SiteHeader from "@/components/design/organisms/SiteHeader";
import "./board.css";
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="board-shell">{children}</div>
    </>
  );
}
