"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import Alert from "@/components/auth/atoms/Alert";
import Button from "@/components/auth/atoms/Button";
import TextField from "@/components/auth/molecules/TextField";
import { findIdAction, type FindIdState } from "@/actions/findIdActions";
import "@/components/design/skins/auth.css";

const initialState: FindIdState = {};

export default function FindIdForm() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(findIdAction, initialState);

  return (
    <form action={formAction} noValidate className="ds-auth-card">
      <header className="ds-auth-head">
        <h1 className="text-[26px] font-extrabold">아이디 찾기</h1>
        <p className="text-[14px] text-(--ds-ink-2)">가입 이메일이나 복구용 이메일을 넣어 주세요</p>
      </header>

      <TextField
        id="find-email"
        name="email"
        type="email"
        label="이메일"
        autoComplete="email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onClear={() => setEmail("")}
        tone={state.error ? "error" : "default"}
        message={state.error}
      />

      <Button type="submit" fullWidth isLoading={isPending} loadingText="찾는 중…">
        아이디 찾기
      </Button>

      <div aria-live="polite" className="ds-auth-result-slot">
        {state.searched && state.results?.length ? (
          <ul className="flex flex-col gap-3 rounded-[10px] bg-(--ds-bg) p-4 text-[14px] max-sm:bg-white">
            {state.results.map((result) => (
              <li key={`${result.loginId}-${result.email}`} className="flex flex-col gap-0.5">
                <span>
                  아이디 <b>{result.loginId}</b>
                </span>
                <span className="text-(--ds-ink-2)">가입 이메일 {result.email}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {state.searched && !state.results?.length ? (
          <Alert>일치하는 계정이 없어요. 이메일을 다시 확인해 주세요.</Alert>
        ) : null}
      </div>

      <p className="ds-auth-foot flex justify-center gap-1.5 text-[14px] text-(--ds-ink-2)">
        <Link href="/login">로그인</Link>
        <span aria-hidden="true">|</span>
        <Link href="/find-password">비밀번호 찾기</Link>
      </p>
    </form>
  );
}
