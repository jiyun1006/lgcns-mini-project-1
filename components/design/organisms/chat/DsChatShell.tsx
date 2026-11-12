"use client";

import { useState, type ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import DsChatSidebar, { type DsChatSidebarProps } from "./DsChatSidebar";
import "./chat.css";

type DsChatShellProps = {
  showSidebar: boolean;
  sidebar: Omit<DsChatSidebarProps, "onToggle">;
  title: string;
  footer: ReactNode;
  children: ReactNode;
};

/**
 * 채팅 화면의 틀 (organism): 왼쪽 대화 목록 + 오른쪽 대화(제목 줄 · 말풍선 · 아래 입력창)
 * - 사이드바 열고 닫기는 이 틀이 맡는다 (ChatPage.tsx의 sidebarOpen 상태를 옮겨 옴).
 * - 웹: 사이드바가 처음부터 열려 있고, 닫으면 제목 줄에 여는 버튼이 생긴다.
 * - 휴대폰(640px 이하): 사이드바는 처음엔 닫혀 있고, 열면 화면을 밀지 않고 위에 덮이는 서랍이 된다.
 *   대화를 고르거나 새 대화를 만들면 서랍이 저절로 닫힌다.
 */
export default function DsChatShell({
  showSidebar,
  sidebar,
  title,
  footer,
  children,
}: DsChatShellProps) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 웹 · 휴대폰 상태를 함께 바꾼다. 화면 폭에 맞는 쪽만 CSS가 보여 준다.
  const openSidebar = () => {
    setDesktopOpen(true);
    setMobileOpen(true);
  };
  const closeSidebar = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };
  const closeDrawer = () => setMobileOpen(false);

  return (
    <main className="ds-chat" data-desktop-open={desktopOpen} data-mobile-open={mobileOpen}>
      {showSidebar && (
        <>
          <DsChatSidebar
            {...sidebar}
            onSelect={async (id) => {
              closeDrawer();
              await sidebar.onSelect(id);
            }}
            onCreate={async () => {
              closeDrawer();
              return sidebar.onCreate();
            }}
            onToggle={closeSidebar}
          />
          <div className="ds-chat-scrim" onClick={closeDrawer} aria-hidden="true" />
        </>
      )}

      <section className="ds-chat-conversation" aria-label="대화">
        <header className="ds-chat-conversation-head">
          {showSidebar && (
            <button
              type="button"
              className="ds-chat-icon-button ds-chat-open-button"
              onClick={openSidebar}
              aria-label="사이드바 열기"
              title="사이드바 열기"
            >
              <PanelLeft aria-hidden="true" />
            </button>
          )}
          <h3>{title}</h3>
        </header>

        {children}

        <div className="ds-chat-footer">{footer}</div>
      </section>
    </main>
  );
}
