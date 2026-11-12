"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Sparkles } from "lucide-react";
import LoginStatus from "@/components/auth/atoms/LoginStatus";
import { useAuth } from "@/components/auth/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BoardHeader() {
  const path = usePathname();
  const { isLoggedIn, name, imageUrl } = useAuth();

  const isCommunity = path === "/posts" || path.startsWith("/posts/");
  const isChatting = path === "/chatting" || path.startsWith("/chatting/");
  const isMyPage = path === "/myPage" || path.startsWith("/myPage/");

  return (
    <div className="board-shell" style={{ minHeight: "auto" }}>
      <header className="board-header">
        <Link href="/posts" className="brand" aria-label="Chat EXAONE 홈">
          <span className="brand-icon" aria-hidden="true">
            <MessageCircle className="brand-bubble" />
            <Sparkles className="brand-sparkle" />
          </span>
          <span className="brand-title">
            Chat <strong>EXAONE</strong>
          </span>
        </Link>
        <nav aria-label="주 메뉴">
          <Link href="/posts" aria-current={isCommunity ? "page" : undefined}>
            커뮤니티
          </Link>
          <Link href="/chatting" aria-current={isChatting ? "page" : undefined}>
            AI 채팅
          </Link>
        </nav>
        {isCommunity && (
          <Link href="/posts/new" className="button primary">
            글쓰기
          </Link>
        )}
        <LoginStatus />
        {isLoggedIn && (
          <Link
            href="/myPage"
            aria-label={`${name ?? "내"} 마이페이지`}
            aria-current={isMyPage ? "page" : undefined}
          >
            <Avatar size="lg">
              {imageUrl && <AvatarImage src={imageUrl} alt="" />}
              <AvatarFallback className="bg-[#e3e6ff] font-bold text-(--accent)">
                {name?.slice(0, 1) ?? "나"}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </header>
    </div>
  );
}
