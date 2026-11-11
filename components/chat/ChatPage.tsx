"use client";

import { useEffect, useState } from "react";
import type { ChatMessage, Conversation } from "@/types/chat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 최근 대화 목록 조회
  const loadConversations = async () => {
    const response = await fetch("/api/conversations");
    if (!response.ok) throw new Error("대화 목록 조회 실패");

    const data = (await response.json()) as Conversation[];
    setConversations(data);
    return data;
  };

  // 특정 대화 불러오기
  const selectConversation = async (id: string) => {
    setError("");

    const response = await fetch(`/api/conversations?id=${id}`);
    if (!response.ok) {
      setError("대화를 불러오지 못했습니다.");
      return;
    }

    const data = (await response.json()) as Conversation;
    setActiveId(data.id);
    setMessages(data.messages ?? []);
  };

  // 새로운 대화 생성
  const createConversation = async () => {
    const response = await fetch("/api/conversations", { method: "POST" });
    if (!response.ok) throw new Error("새 대화 생성 실패");

    const data = (await response.json()) as Conversation;
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    setMessages([]);
    setQuestion("");
    setError("");

    return data.id;
  };

  // 대화 이름 수정
  const renameConversation = async (id: string, currentTitle: string) => {
    const newTitle = window.prompt("새로운 대화 이름을 입력하세요.", currentTitle);
    if (newTitle === null) return;

    if (!newTitle.trim()) {
      alert("대화 이름을 입력해주세요.");
      return;
    }
    if (newTitle.trim().length > 80) {
      alert("대화 이름은 80자 이하로 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: newTitle.trim() }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "이름 수정 실패");

      setConversations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: data.title } : item)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "이름 수정 실패");
    }
  };

  // 대화 삭제
  const deleteConversation = async (id: string) => {
    const confirmed = window.confirm(
      "이 대화를 정말 삭제하시겠습니까?\n삭제한 대화는 복구할 수 없습니다.",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/conversations?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "대화 삭제 실패");

      const remaining = conversations.filter((item) => item.id !== id);
      setConversations(remaining);

      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        if (remaining.length > 0) {
          await selectConversation(remaining[0].id);
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "대화 삭제 실패");
    }
  };

  // 질문 전송
  const askQuestion = async (text: string) => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setError("");

    // 화면에 먼저 보여줄 임시 메시지 2개
    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: "USER",
      content: text.trim(),
      createdAt: now,
    };
    const aiMsg: ChatMessage = {
      id: `temp-ai-${Date.now()}`,
      role: "ASSISTANT",
      content: "",
      createdAt: now,
    };

    try {
      let conversationId = activeId;
      if (!conversationId) conversationId = await createConversation();

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setQuestion("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text.trim(), conversationId }),
      });

      // 스트림 시작 전 에러는 JSON으로 옴
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "답변 생성 실패");
      }

      // 조각이 올 때마다 AI 메시지에 이어 붙이기
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, content: m.content + chunk } : m)),
        );
      }

      await loadConversations(); // 사이드바 제목, 순서 갱신
    } catch (err) {
      // 실패하면 빈 AI 말풍선 제거
      setMessages((prev) => prev.filter((m) => m.id !== aiMsg.id));
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 최초 페이지 로딩
  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await loadConversations();
        if (data.length > 0) await selectConversation(data[0].id);
      } catch {
        setError("서버에 연결할 수 없습니다.");
      } finally {
        setInitializing(false);
      }
    };

    void initialize();
  }, []);

  const activeTitle =
    conversations.find((conversation) => conversation.id === activeId)?.title ?? "새 대화";

  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100d%",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        background: "#fff",
      }}
    >
      {sidebarOpen && (
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onCreate={createConversation}
          onSelect={selectConversation}
          onRename={renameConversation}
          onDelete={deleteConversation}
          onToggle={() => setSidebarOpen(false)}
        />
      )}

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
        }}
      >
        <header
          style={{
            minHeight: "64px",
            padding: "12px 22px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="사이드바 열기"
              title="사이드바 열기"
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ☰
            </button>
          )}
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>{activeTitle}</h3>
        </header>

        <ChatMessages
          messages={messages}
          initializing={initializing}
          loading={loading}
          error={error}
        />

        <ChatInput
          question={question}
          loading={loading}
          onQuestionChange={setQuestion}
          onSubmit={() => askQuestion(question)}
        />
      </section>
    </main>
  );
}
