import PostDetail from "@/components/board/PostDetail";
export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  return <PostDetail postId={postId} />;
}
