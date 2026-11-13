"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { rememberReturnPath } from "@/actions/returnToActions";
import { useAuth } from "@/components/auth/providers/AuthProvider";

const buttonClassName = "shrink-0 text-sm font-semibold text-(--ds-ink-2) disabled:opacity-50";

export default function LoginStatus() {
  const { isLoggedIn } = useAuth();
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    const handleLogin = () => {
      const formData = new FormData();
      formData.set("returnTo", `${window.location.pathname}${window.location.search}`);
      startTransition(() => {
        void rememberReturnPath(formData);
      });
    };

    return (
      <button type="button" onClick={handleLogin} className={buttonClassName}>
        로그인
      </button>
    );
  }

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: "/" });
    });
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isPending} className={buttonClassName}>
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
