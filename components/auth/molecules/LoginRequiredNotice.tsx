"use client";

import { useTransition } from "react";
import { rememberReturnPath } from "@/actions/returnToActions";

export default function LoginRequiredNotice({ message }: { message: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    const formData = new FormData();
    formData.set("returnTo", `${window.location.pathname}${window.location.search}`);
    startTransition(() => {
      void rememberReturnPath(formData);
    });
  };

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "14px 18px",
        border: "1px solid var(--ds-line)",
        borderRadius: "16px",
        background: "var(--ds-bg)",
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 600 }}>로그인이 필요해요</p>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--ds-ink-2)" }}>{message}</p>
      </div>
      <button
        type="button"
        onClick={handleLogin}
        disabled={isPending}
        style={{
          flexShrink: 0,
          padding: "12px 18px",
          background: "var(--ds-primary)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "이동 중..." : "로그인하러 가기"}
      </button>
    </div>
  );
}
