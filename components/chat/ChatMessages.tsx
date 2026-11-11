import type { ChatMessage } from "@/types/chat";
import { StickToBottom } from "use-stick-to-bottom";

type ChatMessagesProps = {
  messages: ChatMessage[];
  initializing: boolean;
  loading: boolean;
  error: string;
};

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
      </StickToBottom.Content>
    </StickToBottom>
  );
}
