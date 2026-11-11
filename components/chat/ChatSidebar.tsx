import type { Conversation } from "@/types/chat";

type ChatSidebarProps = {
  conversations: Conversation[];
  activeId: string | null;
  onCreate: () => Promise<string>;
  onSelect: (id: string) => Promise<void>;
  onRename: (id: string, currentTitle: string) => void;
  onDelete: (id: string) => void;
};

export default function ChatSidebar({
  conversations,
  activeId,
  onCreate,
  onSelect,
  onRename,
  onDelete,
}: ChatSidebarProps) {
  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100%",
        boxSizing: "border-box",
        background: "#f3f4f6",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2 style={{ fontSize: "22px", marginTop: 0 }}>EXAONE Chat</h2>

      <button
        type="button"
        onClick={() => void onCreate()}
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

      <div style={{ overflowY: "auto", flex: 1 }}>
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
            <button
              type="button"
              onClick={() => void onSelect(item.id)}
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
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.title}
              </div>
              <small style={{ color: "#777" }}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </small>
            </button>

            <button
              type="button"
              onClick={() => onRename(item.id, item.title)}
              title="대화 이름 수정"
              aria-label="대화 이름 수정"
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

            <button
              type="button"
              onClick={() => onDelete(item.id)}
              title="대화 삭제"
              aria-label="대화 삭제"
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
  );
}
