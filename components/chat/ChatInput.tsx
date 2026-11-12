type ChatInputProps = {
  question: string;
  loading: boolean;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ChatInput({
  question,
  loading,
  onQuestionChange,
  onSubmit,
}: ChatInputProps) {
  return (
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
        onChange={(event) => onQuestionChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder="EXAONE에게 질문하기..."
        disabled={loading}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "14px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "15px",
        }}
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !question.trim()}
        style={{
          padding: "12px 22px",
          background: "#222",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading || !question.trim() ? "not-allowed" : "pointer",
          opacity: loading || !question.trim() ? 0.6 : 1,
        }}
      >
        전송
      </button>
    </div>
  );
}
