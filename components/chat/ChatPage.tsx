"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Conversation } from "@/types/chat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import LoginRequiredNotice from "@/components/auth/molecules/LoginRequiredNotice";
import { useAuth } from "@/components/auth/providers/AuthProvider";

export default function ChatPage({
  initialId,
  initialPrompt,
  initialPromptRequestId,
}: {
  initialId: string | null;
  initialPrompt: string | null;
  initialPromptRequestId: string | null;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  // 스트리밍 중인 대화의 메시지를 따로 보관 (다른 채팅에 갔다 와도 이어서 보이도록)
  const activeIdRef = useRef<string | null>(null);
  const streamRef = useRef<{ conversationId: string; messages: ChatMessage[] } | null>(null);
  const sendingRef = useRef(false);
  // 이미 재생성을 요청한 메시지 ID
  const retryingMessageIdsRef = useRef(new Set<string>());
  const initializationStartedRef = useRef(false);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // 최근 대화 목록 조회
  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/conversations");
    if (!response.ok) throw new Error("대화 목록 조회 실패");

    const data = (await response.json()) as Conversation[];
    setConversations(data);
    return data;
  }, []);

  const conversationUrl = useCallback(
    (id: string) => {
      const params = new URLSearchParams({ id });
      if (initialPromptRequestId) params.set("request", initialPromptRequestId);
      return `/chatting?${params.toString()}`;
    },
    [initialPromptRequestId],
  );

  // 특정 대화 불러오기
  const selectConversation = useCallback(
    async (id: string) => {
      setError("");

      const response = await fetch(`/api/conversations?id=${id}`);
      if (!response.ok) {
        setError("대화를 불러오지 못했습니다.");
        return;
      }

      const data = (await response.json()) as Conversation;
      setActiveId(data.id);
      window.history.replaceState(null, "", conversationUrl(data.id));
      setEditingMessageId(null);
      setEditingContent("");
      // 이 대화가 아직 답변 중이면 DB 대신 스트리밍 중인 메시지를 보여줌
      const stream = streamRef.current;
      setMessages(stream?.conversationId === data.id ? stream.messages : (data.messages ?? []));
    },
    [conversationUrl],
  );

  // 새로운 대화 생성
  const createConversation = async () => {
    const response = await fetch("/api/conversations", { method: "POST" });
    if (!response.ok) throw new Error("새 대화 생성 실패");

    const data = (await response.json()) as Conversation;
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    window.history.replaceState(null, "", conversationUrl(data.id));
    setMessages([]);
    setQuestion("");
    setEditingMessageId(null);
    setEditingContent("");
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

  // 질문 전송 및 기존 질문 수정 후 재생성
  const sendQuestion = async (text: string, editMessageId?: string) => {
    if (!text.trim() || loading || sendingRef.current) return;

    const trimmedText = text.trim();
    const conversationId = activeId;
    if (editMessageId && !conversationId) return;

    sendingRef.current = true;
    setLoading(true);
    setError("");

    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: "USER",
      content: trimmedText,
      createdAt: now,
    };
    const aiMsg: ChatMessage = {
      id: `temp-ai-${Date.now()}`,
      role: "ASSISTANT",
      content: "",
      createdAt: now,
    };

    let targetConversationId = conversationId;

    try {
      if (!targetConversationId) targetConversationId = await createConversation();

      const editIndex = editMessageId
        ? messages.findIndex((message) => message.id === editMessageId)
        : -1;
      if (editMessageId && editIndex < 0) {
        throw new Error("수정할 질문을 찾을 수 없습니다. 대화를 새로고침해주세요.");
      }
      const base = editMessageId ? messages.slice(0, editIndex) : conversationId ? messages : [];

      streamRef.current = {
        conversationId: targetConversationId,
        messages: [...base, userMsg, aiMsg],
      };
      activeIdRef.current = targetConversationId;
      setMessages(streamRef.current.messages);
      setQuestion("");
      setEditingMessageId(null);
      setEditingContent("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedText,
          conversationId: targetConversationId,
          ...(editMessageId ? { editMessageId } : {}),
        }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "답변 생성 실패");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const stream = streamRef.current;
        if (!stream) break;
        stream.messages = stream.messages.map((message) =>
          message.id === aiMsg.id ? { ...message, content: message.content + chunk } : message,
        );
        if (activeIdRef.current === stream.conversationId) setMessages(stream.messages);
      }

      // DB에 저장된 실제 메시지 ID와 답변 내용으로 화면 갱신
      const refresh = await fetch(`/api/conversations?id=${targetConversationId}`);

      if (refresh.ok) {
        const data = (await refresh.json()) as Conversation;

        if (activeIdRef.current === targetConversationId) {
          setMessages(data.messages ?? []);
        }
      }

      await loadConversations();
    } catch (err) {
      const stream = streamRef.current;
      if (stream) {
        stream.messages = stream.messages.filter((message) => message.id !== aiMsg.id);
        if (activeIdRef.current === stream.conversationId) setMessages(stream.messages);
      }

      if (editMessageId && targetConversationId) {
        const refresh = await fetch(`/api/conversations?id=${targetConversationId}`);
        if (refresh.ok) {
          const data = (await refresh.json()) as Conversation;
          if (activeIdRef.current === targetConversationId) {
            setMessages(data.messages ?? []);
          }
        }
      }
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      sendingRef.current = false;
      streamRef.current = null;
      setLoading(false);
    }
  };

  const askQuestion = (text: string) => sendQuestion(text);

  const beginEdit = (message: ChatMessage) => {
    if (loading) return;
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const submitEdit = () => {
    if (!editingMessageId || !editingContent.trim() || loading) return;
    void sendQuestion(editingContent, editingMessageId);
  };

  // 최초 페이지 로딩
  useEffect(() => {
    if (initializationStartedRef.current || !isLoggedIn) return;

    initializationStartedRef.current = true;

    const initialize = async () => {
      try {
        const data = await loadConversations();
        if (initialPrompt?.trim()) {
          setActiveId(null);
          setMessages([]);
          setQuestion(initialPrompt);
          setEditingMessageId(null);
          setEditingContent("");
          return;
        }

        // 바뀐 부분: 맨 위(data[0]) 대신 URL의 id를 먼저 찾는다
        const target = data.find((c) => c.id === initialId) ?? data[0];
        if (target) await selectConversation(target.id);
      } catch {
        setError("서버에 연결할 수 없습니다.");
      } finally {
        setInitializing(false);
      }
    };

    void initialize();
  }, [initialId, initialPrompt, isLoggedIn, loadConversations, selectConversation]);

  const activeTitle =
    conversations.find((conversation) => conversation.id === activeId)?.title ?? "새 대화";

  useEffect(() => {
    if (!activeId || loading) return;

    // content가 비어 있는 실제 ASSISTANT 메시지 찾기
    // temp-ai로 시작하는 임시 메시지는 제외
    const pendingMessage = messages.find(
      (message) =>
        message.role === "ASSISTANT" &&
        message.content.trim() === "" &&
        !message.id.startsWith("temp-"),
    );

    if (!pendingMessage) return;

    // 이미 요청한 메시지라면 중복 요청하지 않음
    if (retryingMessageIdsRef.current.has(pendingMessage.id)) {
      return;
    }

    const targetConversationId = activeId;
    const targetMessageId = pendingMessage.id;

    retryingMessageIdsRef.current.add(targetMessageId);

    setLoading(true);
    setError("");

    const regenerateAnswer = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: targetConversationId,
            assistantMessageId: targetMessageId,
          }),
        });

        if (!response.ok || !response.body) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "답변 재생성 실패");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let answer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          answer += decoder.decode(value, { stream: true });

          if (activeIdRef.current === targetConversationId) {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === targetMessageId ? { ...message, content: answer } : message,
              ),
            );
          }
        }

        answer += decoder.decode();

        // 스트리밍이 끝나면 DB 데이터로 최종 갱신
        const refresh = await fetch(`/api/conversations?id=${targetConversationId}`);

        if (refresh.ok) {
          const data = (await refresh.json()) as Conversation;

          if (activeIdRef.current === targetConversationId) {
            setMessages(data.messages ?? []);
          }
        }

        await loadConversations();
      } catch (err) {
        console.error("답변 재생성 실패:", err);
        setError(err instanceof Error ? err.message : "답변 재생성 실패");
      } finally {
        setLoading(false);
      }
    };

    void regenerateAnswer();
  }, [activeId, loadConversations, messages, loading]);
  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        background: "#fff",
      }}
    >
      {sidebarOpen && isLoggedIn && (
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
          {!sidebarOpen && isLoggedIn && (
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
          initializing={initializing && isLoggedIn}
          loading={loading}
          error={error}
          editingMessageId={editingMessageId}
          editingContent={editingContent}
          onEditClick={beginEdit}
          onEditingContentChange={setEditingContent}
          onEditCancel={cancelEdit}
          onEditSubmit={submitEdit}
        />

        {isLoggedIn ? (
          <ChatInput
            question={question}
            loading={loading || initializing}
            onQuestionChange={setQuestion}
            onSubmit={() => askQuestion(question)}
          />
        ) : (
          <div style={{ padding: "20px 25px", borderTop: "1px solid #ddd" }}>
            <LoginRequiredNotice message="로그인하고 EXAONE과 대화를 시작해 보세요." />
          </div>
        )}
      </section>
    </main>
  );
}
