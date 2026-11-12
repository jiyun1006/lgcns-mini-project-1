"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import Alert from "@/components/auth/atoms/Alert";
import Button from "@/components/auth/atoms/Button";
import PasswordField from "@/components/auth/molecules/PasswordField";
// import SocialLoginButtons from "@/components/auth/molecules/SocialLoginButtons";
import TextField from "@/components/auth/molecules/TextField";
import { forgetEmail, rememberEmail } from "@/lib/savedEmail";
import { authApi } from "@/service/auth/authApi";
import { CONTINUE_PATH } from "@/lib/returnTo";

const AFTER_LOGIN_PATH = CONTINUE_PATH;

type LoginValues = { email: string; password: string };
type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export default function LoginForm({ initialEmail }: { initialEmail: string }) {
  const [values, setValues] = useState<LoginValues>({ email: initialEmail, password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemembered, setIsRemembered] = useState(Boolean(initialEmail));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: LoginErrors = {
      email: values.email.trim() ? "" : "아이디 또는 이메일을 입력해 주세요.",
      password: values.password ? "" : "비밀번호를 입력해 주세요.",
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    const email = values.email.trim().toLowerCase();
    setIsSubmitting(true);
    setFormError("");
    try {
      const result = await authApi.login({ email, password: values.password });
      if (!result.ok) {
        setFormError(result.message);
        setIsSubmitting(false);
        return;
      }
      if (isRemembered) rememberEmail(email);
      else forgetEmail();
      window.location.assign(AFTER_LOGIN_PATH);
    } catch {
      setFormError("서버와 연결되지 않았어요. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-105 flex-col gap-4.5 rounded-2xl border border-[#E4E4E7] bg-white px-8 py-9"
    >
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="text-[26px] font-extrabold">로그인</h1>
        <p className="text-[14px] text-[#52525B]">로그인하면 보던 페이지로 돌아가요</p>
      </header>

      {formError ? <Alert>{formError}</Alert> : null}

      <TextField
        id="email"
        name="email"
        type="text"
        label="아이디 또는 이메일"
        autoComplete="username"
        placeholder="아이디 또는 example@email.com"
        value={values.email}
        onChange={handleChange}
        onClear={() => setValues((prev) => ({ ...prev, email: "" }))}
        tone={errors.email || formError ? "error" : "default"}
        message={errors.email}
      />

      <PasswordField
        id="password"
        name="password"
        label="비밀번호"
        autoComplete="current-password"
        onClear={() => setValues((prev) => ({ ...prev, password: "" }))}
        value={values.password}
        onChange={handleChange}
        tone={errors.password || formError ? "error" : "default"}
        message={errors.password}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-[14px]">
        <label className="flex min-h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isRemembered}
            onChange={(e) => setIsRemembered(e.target.checked)}
            className="h-4.5 w-4.5 accent-[#4338CA]"
          />
          아이디 기억하기
        </label>
        <span className="flex gap-1.5 text-[#52525B]">
          <Link href="/find-id">아이디 찾기</Link>
          <span aria-hidden="true">|</span>
          <Link href="/find-password">비밀번호 찾기</Link>
        </span>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} loadingText="로그인 중…">
        로그인
      </Button>

      {/* <SocialLoginButtons /> */}

      <p className="text-center text-[14px] text-[#52525B]">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-bold text-[#4338CA]">
          회원가입
        </Link>
      </p>
    </form>
  );
}
