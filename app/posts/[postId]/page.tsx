import { notFound } from "next/navigation";
import { findMockPost } from "@/lib/board/mock-data";
import PostDetail from "@/components/board/PostDetail";
export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = findMockPost(postId);
  if (!post) notFound();
  return <PostDetail post={post} />;
}
