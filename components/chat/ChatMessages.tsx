import type { ChatMessage } from "@/types/chat";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessagesProps = {
  messages: ChatMessage[];
  initializing: boolean;
  loading: boolean;
  error: string;
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
                <strong>{msg.role === "USER" ? "나" : "EXAONE"}</strong>
                {msg.role === "ASSISTANT" ? (
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
