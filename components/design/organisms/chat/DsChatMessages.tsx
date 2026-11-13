import type { ChatMessage } from "@/types/chat";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowDown, PenLine } from "lucide-react";
import "./chat.css";

// components/chat/ChatMessages.tsx와 같은 props
type DsChatMessagesProps = {
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
      className="ds-chat-to-bottom"
      onClick={() => scrollToBottom()}
      aria-label="맨 아래로 이동"
    >
      <ArrowDown aria-hidden="true" />
    </button>
  );
}

/** 채팅 말풍선 목록 (organism) — ChatMessages.tsx의 디자인 버전. 하는 일은 같다 */
export default function DsChatMessages({
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
}: DsChatMessagesProps) {
  return (
    <StickToBottom className="ds-chat-messages" initial="instant" resize="smooth">
      <StickToBottom.Content className="ds-chat-messages-inner">
        {initializing ? (
          <p className="ds-chat-status">대화를 불러오는 중...</p>
        ) : messages.length === 0 ? (
          <div className="ds-chat-empty-chat">
            <h2>무엇을 도와드릴까요?</h2>
            <p>EXAONE 2.5와 대화를 시작해 보세요.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="ds-chat-bubble"
              data-role={msg.role === "USER" ? "user" : "assistant"}
            >
              <div className="ds-chat-bubble-head">
                <strong>{msg.role === "USER" ? "나" : "EXAONE"}</strong>
                {msg.role === "USER" && (
                  <button
                    type="button"
                    className="ds-chat-edit-button"
                    onClick={() => onEditClick(msg)}
                    disabled={loading || editingMessageId !== null}
                  >
                    <PenLine aria-hidden="true" />
                    수정
                  </button>
                )}
              </div>
              {editingMessageId === msg.id ? (
                <div className="ds-chat-edit-box">
                  <textarea
                    value={editingContent}
                    onChange={(event) => onEditingContentChange(event.target.value)}
                    rows={Math.max(3, Math.min(8, editingContent.split("\n").length + 1))}
                    autoFocus
                  />
                  <div className="ds-chat-edit-actions">
                    <button type="button" className="ds-chat-edit-cancel" onClick={onEditCancel}>
                      취소
                    </button>
                    <button
                      type="button"
                      className="ds-chat-edit-submit"
                      onClick={onEditSubmit}
                      disabled={!editingContent.trim() || loading}
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
                <p>{msg.content}</p>
              )}
            </div>
          ))
        )}

        {loading && <p className="ds-chat-status">EXAONE이 답변을 생성하고 있습니다...</p>}
        {error && <p className="ds-chat-error">{error}</p>}
      </StickToBottom.Content>
      <ScrollToBottomButton />
    </StickToBottom>
  );
}
