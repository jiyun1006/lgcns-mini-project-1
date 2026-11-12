import PostForm from "@/components/board/PostForm";
export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  return <PostForm postId={postId} />;
}
