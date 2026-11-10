import BoardList from "@/components/board/BoardList";
import { mockPosts } from "@/lib/board/mock-data";
export default function PostsPage() {
  return <BoardList posts={mockPosts} />;
}
