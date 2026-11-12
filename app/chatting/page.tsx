import { Suspense } from "react";
import ChatPage from "@/components/chat/ChatPage";

async function ChatWithParams({
  searchParams,
}: {
  searchParams: PageProps<"/chatting">["searchParams"];
}) {
  const { id, prompt, request } = await searchParams;
  const initialId = typeof id === "string" ? id : null;
  const initialPrompt = typeof prompt === "string" ? prompt : null;
  const promptRequestId = typeof request === "string" ? request : null;
  return (
    <ChatPage
      key={`chat-${promptRequestId ?? "default"}`}
      initialId={initialId}
      initialPrompt={initialPrompt}
      initialPromptRequestId={promptRequestId}
    />
  );
}

export default function ChattingPage({ searchParams }: PageProps<"/chatting">) {
  return (
    <Suspense>
      <ChatWithParams searchParams={searchParams} />
    </Suspense>
  );
}
