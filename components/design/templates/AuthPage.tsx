import type { ReactNode } from "react";
import "@/components/design/skins/auth.css";

/**
 * 헤더 없는 화면의 바탕 (template): 위에서 아래로 옅어지는 연보라 배경 + 상자 가운데 정렬
 * - 로그인 · 아이디 찾기 · 비밀번호 찾기: <AuthPage>
 * - 회원가입: <AuthPage variant="signup"> (휴대폰에서 화면 전체 높이를 쓴다)
 */
export default function AuthPage({
  variant = "card",
  children,
}: {
  variant?: "card" | "signup";
  children: ReactNode;
}) {
  return (
    <main className="ds-auth-page" data-variant={variant}>
      {children}
    </main>
  );
}
