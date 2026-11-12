"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

// 출입증은 유효한데 몽고에 회원이 없으면(옛 로그인 쿠키, DB 변경) 자동으로 로그아웃해요
export default function StaleSessionSignOut() {
  useEffect(() => {
    void signOut({ callbackUrl: `${window.location.pathname}${window.location.search}` });
  }, []);

  return null;
}
