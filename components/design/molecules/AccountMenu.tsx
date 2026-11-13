"use client";

import { useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";
import DsAvatar from "@/components/design/atoms/DsAvatar";
import "./AccountMenu.css";

type AccountMenuProps = {
  name: string | null;
  imageUrl: string | null;
  isMyPage: boolean;
};

/**
 * 헤더 오른쪽 사진 버튼 + 설명 있는 메뉴 (molecule)
 * - 웹: 사진 아래로 작은 메뉴가 열린다.
 * - 휴대폰(640px 이하): 화면 아래에서 시트로 올라온다 (CSS만으로 바뀜).
 * - 바깥을 누르거나 Esc를 누르면 닫힌다.
 */
export default function AccountMenu({ name, imageUrl, isMyPage }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const displayName = name ?? "나";

  const close = () => setOpen(false);

  // 로그아웃: components/auth/atoms/LoginStatus.tsx와 같은 방식
  const handleLogout = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: "/" });
    });
  };

  return (
    <div
      className="ds-account"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="ds-account-trigger"
        aria-label={`${displayName} 계정 메뉴`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <DsAvatar name={name} imageUrl={imageUrl} />
      </button>

      {open && (
        <>
          <div className="ds-account-scrim" onClick={close} aria-hidden="true" />
          <div id={panelId} className="ds-account-panel">
            <span className="ds-account-grab" aria-hidden="true" />
            <div className="ds-account-head">
              <DsAvatar name={name} imageUrl={imageUrl} />
              <div>
                <b>{displayName}</b>
                <small>내 계정</small>
              </div>
            </div>
            <hr className="ds-account-divider" />
            <Link
              href="/myPage"
              className="ds-account-item"
              aria-current={isMyPage ? "page" : undefined}
              onClick={close}
            >
              <UserRound className="ds-account-item-icon" aria-hidden="true" />
              <span>
                <b>마이페이지</b>
                <small>프로필 · 비밀번호 · 내 활동</small>
              </span>
            </Link>
            <button
              type="button"
              className="ds-account-item"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut className="ds-account-item-icon" aria-hidden="true" />
              <span>
                <b>{isPending ? "로그아웃 중..." : "로그아웃"}</b>
                <small>이 기기에서 나가기</small>
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
