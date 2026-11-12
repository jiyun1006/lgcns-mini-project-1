import { Suspense } from "react";
import ChatPage from "@/components/chat/ChatPage";

async function ChatWithParams({
  searchParams,
}: {
  searchParams: PageProps<"/chatting">["searchParams"];
}) {
  const { id } = await searchParams;
  const initialId = typeof id === "string" ? id : null;
  return <ChatPage initialId={initialId} />;
}

export default function ChattingPage({ searchParams }: PageProps<"/chatting">) {
  return (
    <Suspense>
      <ChatWithParams searchParams={searchParams} />
    </Suspense>
  );
}
