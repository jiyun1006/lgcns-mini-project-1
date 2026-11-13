import { PanelLeft, PenLine, Plus, Trash2 } from "lucide-react";
import type { Conversation } from "@/types/chat";
import "./chat.css";

// components/chat/ChatSidebar.tsx와 같은 props
export type DsChatSidebarProps = {
  conversations: Conversation[];
  activeId: string | null;
  onCreate: () => Promise<string>;
  onSelect: (id: string) => Promise<void>;
  onRename: (id: string, currentTitle: string) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
};

/**
 * 채팅 왼쪽 대화 목록 (organism) — ChatSidebar.tsx의 디자인 버전. 하는 일은 같다.
 * - 선택된 대화만 연필 · 휴지통이 늘 보이고, 나머지는 마우스를 올릴 때만 보인다 (터치 기기는 늘 보임).
 */
export default function DsChatSidebar({
  conversations,
  activeId,
  onCreate,
  onSelect,
  onRename,
  onDelete,
  onToggle,
}: DsChatSidebarProps) {
  return (
    <aside className="ds-chat-sidebar" aria-label="대화 목록">
      <div className="ds-chat-sidebar-head">
        <h2>Chat EXAONE</h2>
        <button
          type="button"
          className="ds-chat-icon-button"
          onClick={onToggle}
          aria-label="사이드바 닫기"
          title="사이드바 닫기"
        >
          <PanelLeft aria-hidden="true" />
        </button>
      </div>

      <button type="button" className="ds-chat-new-button" onClick={() => void onCreate()}>
        <Plus aria-hidden="true" />새 대화
      </button>

      <h4 className="ds-chat-list-label">최근 대화</h4>

      <ul className="ds-chat-list">
        {conversations.map((item) => (
          <li key={item.id} data-active={activeId === item.id || undefined}>
            <button
              type="button"
              className="ds-chat-list-main"
              onClick={() => void onSelect(item.id)}
              aria-current={activeId === item.id ? "true" : undefined}
            >
              <strong>{item.title}</strong>
              <small>{new Date(item.updatedAt).toLocaleDateString()}</small>
            </button>

            <button
              type="button"
              className="ds-chat-row-button"
              onClick={() => onRename(item.id, item.title)}
              title="대화 이름 수정"
              aria-label="대화 이름 수정"
            >
              <PenLine aria-hidden="true" />
            </button>

            <button
              type="button"
              className="ds-chat-row-button"
              onClick={() => onDelete(item.id)}
              title="대화 삭제"
              aria-label="대화 삭제"
            >
              <Trash2 aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {conversations.length === 0 && <p className="ds-chat-empty">아직 대화가 없습니다.</p>}
    </aside>
  );
}
