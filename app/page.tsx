"use client";

import { useEffect, useState } from "react";
import type { ChatMessage, Conversation } from "@/types/chat";

const questions = [
  "인공지능이란 무엇인지 쉽게 설명해줘.",
  "양자 컴퓨터와 일반 컴퓨터의 차이점을 설명해줘.",
  "운영체제에서 프로세스와 스레드의 차이는 무엇인가?",
  "머신러닝과 딥러닝의 차이점을 예시와 함께 설명해줘.",
];

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 최근 대화 목록 조회
  const loadConversations = async () => {
    const response = await fetch("/api/conversations");
    if (!response.ok) throw new Error("대화 목록 조회 실패");

    const data = await response.json();
    setConversations(data);
    return data as Conversation[];
  };

  // 특정 대화 불러오기
  const selectConversation = async (id: string) => {
    setError("");

    const response = await fetch(`/api/conversations?id=${id}`);

    if (!response.ok) {
      setError("대화를 불러오지 못했습니다.");
      return;
    }

    const data = await response.json();

    setActiveId(data.id);
    setMessages(data.messages || []);
  };

  // 새로운 대화 생성
  const createConversation = async () => {
    const response = await fetch("/api/conversations", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("새 대화 생성 실패");
    }

    const data = await response.json();

    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    setMessages([]);
    setError("");

    return data.id as string;
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: newTitle.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "이름 수정 실패");
      }

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
      const response = await fetch(`/api/conversations?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "대화 삭제 실패");
      }

      // 대화 목록에서 제거
      const remaining = conversations.filter((item) => item.id !== id);

      setConversations(remaining);

      // 현재 보고 있는 대화를 삭제한 경우
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);

        // 남아 있는 대화가 있다면 첫 번째 대화 선택
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

    try {
      let conversationId = activeId;

      // 선택된 대화가 없으면 새로 생성
      if (!conversationId) {
        conversationId = await createConversation();
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text.trim(),
          conversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "답변 생성 실패");
      }

      // 서버가 저장한 질문 + 답변을 그대로 붙임
      setMessages((prev) => [...prev, ...(data.messages as ChatMessage[])]);

      setQuestion("");

      await loadConversations();
    } catch (err) {
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

        if (data.length > 0) {
          await selectConversation(data[0].id);
        }
      } catch {
        setError("서버에 연결할 수 없습니다.");
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, []);

  return (
    <main
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      {/* 왼쪽 사이드바 */}
      <aside
        style={{
          width: "260px",
          minWidth: "260px",
          background: "#f3f4f6",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>EXAONE Chat</h2>

        <button
          onClick={createConversation}
          style={{
            padding: "12px",
            background: "#222",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          + 새 대화
        </button>

        <h4>최근 대화</h4>

        <div
          style={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          {conversations.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                borderRadius: "7px",
                background: activeId === item.id ? "#dce3ec" : "transparent",
              }}
            >
              {/* 대화 선택 버튼 */}
              <button
                onClick={() => selectConversation(item.id)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "12px",
                  textAlign: "left",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#222",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </div>

                <small style={{ color: "#777" }}>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </small>
              </button>

              {/* 이름 수정 버튼 */}
              <button
                onClick={() => renameConversation(item.id, item.title)}
                title="대화 이름 수정"
                style={{
                  padding: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                ✏️
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteConversation(item.id)}
                title="대화 삭제"
                style={{
                  padding: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                🗑️
              </button>
            </div>
          ))}

          {conversations.length === 0 && (
            <p style={{ color: "#888", fontSize: "14px" }}>아직 대화가 없습니다.</p>
          )}
        </div>
      </aside>

      {/* 오른쪽 채팅 영역 */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <header
          style={{
            padding: "18px 25px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h3 style={{ margin: 0 }}>
            {conversations.find((c) => c.id === activeId)?.title || "새 대화"}
          </h3>
        </header>

        {/* 메시지 영역 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "25px",
          }}
        >
          {initializing ? (
            <p>대화를 불러오는 중...</p>
          ) : messages.length === 0 ? (
            <div>
              <h2>무엇이든 질문해 보세요!</h2>
              <p>EXAONE 2.5에게 질문할 수 있습니다.</p>

              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(q)}
                  disabled={loading}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "15px",
                    margin: "10px 0",
                    textAlign: "left",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "USER" ? "flex-end" : "flex-start",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "15px",
                    borderRadius: "12px",
                    background: msg.role === "USER" ? "#dce8ff" : "#f1f1f1",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6",
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong>{msg.role === "USER" ? "나" : "EXAONE"}</strong>
                  <p style={{ marginBottom: 0 }}>{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && <p>EXAONE이 답변을 생성하고 있습니다...</p>}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        {/* 질문 입력 영역 */}
        <div
          style={{
            padding: "20px 25px",
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askQuestion(question);
              }
            }}
            placeholder="EXAONE에게 질문하기..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          <button
            onClick={() => askQuestion(question)}
            disabled={loading || !question.trim()}
            style={{
              padding: "12px 22px",
              background: "#222",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            전송
          </button>
        </div>
      </section>
    </main>
  );
}
