"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { rememberReturnPath } from "@/actions/returnToActions";
import { useAuth } from "@/components/auth/providers/AuthProvider";

const buttonClassName =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border px-2.5 text-sm font-medium disabled:opacity-50";

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
      <button
        type="button"
        onClick={handleLogin}
        className={`${buttonClassName} border-transparent bg-[#111827] text-white`}
      >
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
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={`${buttonClassName} border-[#d1d5db] bg-white`}
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
