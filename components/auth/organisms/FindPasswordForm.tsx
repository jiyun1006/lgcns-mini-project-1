"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useTransition, type FormEvent } from "react";

import { requestResetKeyAction, resetPasswordAction } from "@/actions/passwordActions";
import Alert from "@/components/auth/atoms/Alert";
import Button from "@/components/auth/atoms/Button";
import PasswordField from "@/components/auth/molecules/PasswordField";
import PasswordStrength from "@/components/auth/molecules/PasswordStrength";
import TextField from "@/components/auth/molecules/TextField";
import { validatePassword, validatePasswordConfirm } from "@/lib/validation/auth";

type Step = "email" | "reset" | "done";

const SENT_MESSAGE =
  "가입된 이메일이라면 보안키를 보냈어요. 메일함을 확인해 주세요. (30분 안에 1번만 쓸 수 있어요)";

export default function FindPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isPending, startTransition] = useTransition();

  const requestKey = () => {
    setError("");
    startTransition(async () => {
      const result = await requestResetKeyAction(email);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setInfo(SENT_MESSAGE);
      setStep("reset");
    });
  };

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    requestKey();
  };

  const handleResetSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formError = validatePassword(password) || validatePasswordConfirm(password, confirm);
    if (formError) {
      setError(formError);
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await resetPasswordAction({ email, token, newPassword: password });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      // 강사님 서버가 이 사람의 로그인을 모두 끊었으니, 우리 팔찌도 지워요
      await signOut({ redirect: false });
      setStep("done");
    });
  };

  const cardClass =
    "flex w-full max-w-[420px] flex-col gap-[18px] rounded-2xl border border-[#E4E4E7] bg-white px-8 py-9";

  if (step === "done") {
    return (
      <div className={cardClass}>
        <h1 className="text-center text-[26px] font-extrabold">비밀번호를 바꿨어요</h1>
        <p className="text-center text-[14px] text-[#52525B]">
          새 비밀번호로 다시 로그인해 주세요.
        </p>
        <a
          href="/login"
          className="rounded-[10px] bg-[#4338CA] py-3.5 text-center text-[16px] font-bold text-white"
        >
          로그인하러 가기
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={step === "email" ? handleEmailSubmit : handleResetSubmit}
      noValidate
      className={cardClass}
    >
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="text-[26px] font-extrabold">비밀번호 찾기</h1>
        <p className="text-[14px] text-[#52525B]">
          {step === "email"
            ? "가입할 때 쓴 이메일로 보안키를 보내 드려요"
            : "메일로 받은 보안키와 새 비밀번호를 넣어 주세요"}
        </p>
      </header>

      {error ? <Alert>{error}</Alert> : null}
      {info && step === "reset" ? <Alert tone="info">{info}</Alert> : null}

      {step === "email" ? (
        <TextField
          id="reset-email"
          type="email"
          label="가입 이메일"
          autoComplete="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClear={() => setEmail("")}
        />
      ) : (
        <>
          <p className="text-[14px] text-[#52525B]">
            이메일 <b className="text-[#18181B]">{email}</b>
          </p>
          <TextField
            id="reset-token"
            label="보안키"
            autoComplete="one-time-code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onClear={() => setToken("")}
          />
          <PasswordField
            id="reset-password"
            label="새 비밀번호"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClear={() => setPassword("")}
            bottomSlot={<PasswordStrength password={password} />}
          />
          <PasswordField
            id="reset-confirm"
            label="새 비밀번호 확인"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onClear={() => setConfirm("")}
          />
        </>
      )}

      <Button
        type="submit"
        fullWidth
        isLoading={isPending}
        loadingText={step === "email" ? "보내는 중…" : "바꾸는 중…"}
      >
        {step === "email" ? "보안키 받기" : "비밀번호 바꾸기"}
      </Button>

      {step === "reset" ? (
        <button
          type="button"
          onClick={requestKey}
          disabled={isPending}
          className="text-[14px] text-[#4338CA] underline"
        >
          보안키 다시 받기
        </button>
      ) : null}

      <p className="flex justify-center gap-1.5 text-[14px] text-[#52525B]">
        <Link href="/login">로그인</Link>
        <span aria-hidden="true">|</span>
        <Link href="/find-id">아이디 찾기</Link>
      </p>
    </form>
  );
}
