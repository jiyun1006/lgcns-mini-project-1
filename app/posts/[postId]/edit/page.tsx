import { notFound } from "next/navigation";
import { findMockPost } from "@/lib/board/mock-data";
import PostForm from "@/components/board/PostForm";
export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = findMockPost(postId);
  if (!post) notFound();
  return <PostForm post={post} />;
}
