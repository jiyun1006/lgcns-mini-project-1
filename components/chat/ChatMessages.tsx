import type { ChatMessage } from "@/types/chat";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessagesProps = {
  messages: ChatMessage[];
  initializing: boolean;
  loading: boolean;
  error: string;
  editingMessageId: string | null;
  editingContent: string;
  onEditClick: (message: ChatMessage) => void;
  onEditingContentChange: (value: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
};

function ScrollToBottomButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToBottom()}
      aria-label="맨 아래로 이동"
      style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid #e5e7eb",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      ↓
    </button>
  );
}

export default function ChatMessages({
  messages,
  initializing,
  loading,
  error,
  editingMessageId,
  editingContent,
  onEditClick,
  onEditingContentChange,
  onEditCancel,
  onEditSubmit,
}: ChatMessagesProps) {
  return (
    <StickToBottom
      style={{ flex: 1, minHeight: 0, position: "relative" }}
      initial="instant"
      resize="smooth"
    >
      <StickToBottom.Content
        style={{
          minHeight: "100%",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {initializing ? (
          <p>대화를 불러오는 중...</p>
        ) : messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#333",
            }}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "28px" }}>무엇을 도와드릴까요?</h2>
            <p style={{ margin: 0, color: "#777" }}>EXAONE 2.5와 대화를 시작해 보세요.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
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
                  whiteSpace: msg.role === "USER" ? "pre-wrap" : "normal",
                  lineHeight: "1.6",
                  overflowWrap: "anywhere",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    marginBottom: "6px",
                  }}
                >
                  <strong>{msg.role === "USER" ? "나" : "EXAONE"}</strong>
                  {msg.role === "USER" && (
                    <button
                      type="button"
                      onClick={() => onEditClick(msg)}
                      disabled={loading || editingMessageId !== null}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#2563eb",
                        cursor: loading || editingMessageId !== null ? "not-allowed" : "pointer",
                        opacity: loading || editingMessageId !== null ? 0.5 : 1,
                        fontSize: "13px",
                      }}
                    >
                      수정
                    </button>
                  )}
                </div>
                {editingMessageId === msg.id ? (
                  <div style={{ minWidth: "min(420px, 65vw)" }}>
                    <textarea
                      value={editingContent}
                      onChange={(event) => onEditingContentChange(event.target.value)}
                      rows={Math.max(3, Math.min(8, editingContent.split("\n").length + 1))}
                      autoFocus
                      style={{
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid #93c5fd",
                        borderRadius: "8px",
                        resize: "vertical",
                        font: "inherit",
                        lineHeight: 1.5,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={onEditCancel}
                        style={{
                          padding: "7px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "7px",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={onEditSubmit}
                        disabled={!editingContent.trim() || loading}
                        style={{
                          padding: "7px 12px",
                          border: "none",
                          borderRadius: "7px",
                          background: "#2563eb",
                          color: "#fff",
                          cursor: "pointer",
                          opacity: !editingContent.trim() || loading ? 0.5 : 1,
                        }}
                      >
                        수정 후 재생성
                      </button>
                    </div>
                  </div>
                ) : msg.role === "ASSISTANT" ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p style={{ marginBottom: 0 }}>{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && <p>EXAONE이 답변을 생성하고 있습니다...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </StickToBottom.Content>
      <ScrollToBottomButton />
    </StickToBottom>
  );
}
