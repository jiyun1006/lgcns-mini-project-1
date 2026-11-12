"use client";

import { useState, useTransition, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/mypage/molecules/FormField";
import { validatePasswordChange, type PasswordChangeInput } from "@/lib/mypage/validatePassword";
import { changePassword } from "@/app/myPage/actions";

const emptyForm: PasswordChangeInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const fields = [
  { key: "currentPassword", label: "현재 비밀번호", autoComplete: "current-password" },
  { key: "newPassword", label: "새 비밀번호", autoComplete: "new-password" },
  { key: "confirmPassword", label: "새 비밀번호 확인", autoComplete: "new-password" },
] as const;

export default function PasswordChangeCard() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validatePasswordChange(form);
    if (error) {
      setMessage({ text: error, isError: true });
      return;
    }
    startTransition(async () => {
      const result = await changePassword(form);
      setMessage({ text: result.message, isError: !result.ok });
      if (result.ok) setForm(emptyForm);
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
            <KeyRound className="size-4" />
          </span>
          회원정보 수정
        </CardTitle>
        <CardDescription>현재 비밀번호를 확인하고 새 비밀번호로 바꿔요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          {fields.map(({ key, label, autoComplete }) => (
            <FormField
              key={key}
              id={key}
              label={label}
              type="password"
              autoComplete={autoComplete}
              aria-invalid={message?.isError || undefined}
              aria-describedby={message?.isError ? "password-message" : undefined}
              value={form[key]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            />
          ))}
          {message && (
            <p
              id="password-message"
              role={message.isError ? "alert" : "status"}
              className={message.isError ? "text-sm text-destructive" : "text-sm text-green-700"}
            >
              {message.text}
            </p>
          )}
          <MyPageButton type="submit" className="justify-self-end" disabled={isPending}>
            비밀번호 변경
          </MyPageButton>
        </form>
      </CardContent>
    </Card>
  );
}
