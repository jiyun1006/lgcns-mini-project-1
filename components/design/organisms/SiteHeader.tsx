"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, PenLine, Sparkles } from "lucide-react";
import LoginStatus from "@/components/auth/atoms/LoginStatus";
import { useAuth } from "@/components/auth/providers/AuthProvider";
import AccountMenu from "@/components/design/molecules/AccountMenu";
import "./SiteHeader.css";

/**
 * 모든 화면 위에 붙는 헤더 (organism) — components/board/BoardHeader.tsx를 대신한다.
 * - 로고 마크업과 클래스(.brand ...)는 BoardHeader.tsx 그대로다. 모양은 app/posts/board.css가 그린다.
 * - 오른쪽: [글쓰기(커뮤니티에서만)] [사진 → 계정 메뉴]. 로그인 전에는 사진 자리에 로그인 버튼.
 */
export default function SiteHeader() {
  const path = usePathname();
  const { isLoggedIn, name, imageUrl } = useAuth();

  const isCommunity = path === "/posts" || path.startsWith("/posts/");
  const isChatting = path === "/chatting" || path.startsWith("/chatting/");
  const isMyPage = path === "/myPage" || path.startsWith("/myPage/");

  return (
    <header className="ds-header">
      <div className="ds-header-brand-slot">
        <Link href="/posts" className="brand" aria-label="Chat EXAONE 홈">
          <span className="brand-icon" aria-hidden="true">
            <MessageCircle className="brand-bubble" />
            <Sparkles className="brand-sparkle" />
          </span>
          <span className="brand-title">
            Chat <strong>EXAONE</strong>
          </span>
        </Link>
      </div>

      <nav className="ds-header-nav" aria-label="주 메뉴">
        <Link href="/posts" aria-current={isCommunity ? "page" : undefined}>
          커뮤니티
        </Link>
        <Link href="/chatting" aria-current={isChatting ? "page" : undefined}>
          AI 채팅
        </Link>
      </nav>

      <div className="ds-header-account">
        {isCommunity && (
          <Link href="/posts/new" className="ds-header-write" aria-label="글쓰기">
            <PenLine aria-hidden="true" />
            <span className="ds-header-write-text">글쓰기</span>
          </Link>
        )}
        {isLoggedIn ? (
          <AccountMenu name={name} imageUrl={imageUrl} isMyPage={isMyPage} />
        ) : (
          <span className="ds-header-login">
            <LoginStatus />
          </span>
        )}
      </div>
    </header>
  );
}
