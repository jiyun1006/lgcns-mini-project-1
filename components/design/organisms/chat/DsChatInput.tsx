import "./chat.css";

// components/chat/ChatInput.tsx와 같은 props
type DsChatInputProps = {
  question: string;
  loading: boolean;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
};

/** 채팅 아래 입력창 (organism) — ChatInput.tsx의 디자인 버전. Enter 보내기 · 한글 조합 검사는 그대로 */
export default function DsChatInput({
  question,
  loading,
  onQuestionChange,
  onSubmit,
}: DsChatInputProps) {
  return (
    <div className="ds-chat-input-row">
      <label className="ds-chat-input-box">
        <textarea
          aria-label="메시지 입력"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              onSubmit();
            }
          }}
          rows={Math.max(1, Math.min(5, question.split("\n").length))}
          placeholder="EXAONE에게 질문하기..."
          disabled={loading}
        />
      </label>

      <button
        type="button"
        className="ds-chat-send-button"
        onClick={onSubmit}
        disabled={loading || !question.trim()}
      >
        전송
      </button>
    </div>
  );
}
