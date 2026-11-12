"use client";

import { useActionState } from "react";
import { Eye, Save } from "lucide-react";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePrivacy } from "@/app/myPage/actions";
import type { PrivacyFormState } from "@/types/mypage";

type PrivacyCardProps = { isProfilePublic: boolean; showEmail: boolean; showInterests: boolean };

const checkboxes = [
  { key: "showEmail", label: "이메일 공개" },
  { key: "showInterests", label: "자기소개·관심사 공개" },
] as const;

export default function PrivacyCard(props: PrivacyCardProps) {
  const [state, formAction, pending] = useActionState(updatePrivacy, {} as PrivacyFormState);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
            <Eye className="size-4" />
          </span>
          프로필 공개 설정
        </CardTitle>
        <CardDescription>다른 사람이 내 프로필에서 볼 수 있는 정보를 고릅니다</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <label className="flex items-center justify-between gap-4">
            <span className="grid gap-0.5">
              <span className="text-sm font-medium text-stone-900">프로필 공개</span>
              <span className="text-xs text-stone-500">
                끄면 닉네임·아이디 외에는 보이지 않습니다
              </span>
            </span>
            <input
              type="checkbox"
              role="switch"
              name="isProfilePublic"
              defaultChecked={props.isProfilePublic}
              className="relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-stone-300 transition-colors outline-none before:absolute before:top-0.5 before:left-0.5 before:size-4 before:rounded-full before:bg-white before:transition-transform checked:bg-board-accent checked:before:translate-x-4 focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-xs text-stone-500">공개할 항목</legend>
            {checkboxes.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-stone-900">
                <input
                  type="checkbox"
                  name={key}
                  defaultChecked={props[key]}
                  className="size-4 accent-board-accent"
                />
                {label}
              </label>
            ))}
          </fieldset>
          {state.ok && (
            <p role="status" className="text-sm text-green-700">
              저장되었습니다.
            </p>
          )}
          <MyPageButton type="submit" disabled={pending} className="justify-self-end">
            <Save />
            저장
          </MyPageButton>
        </form>
      </CardContent>
    </Card>
  );
}
