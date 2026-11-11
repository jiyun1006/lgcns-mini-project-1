"use client";

import { useActionState, useState } from "react";
import { Pencil, Save, User, X } from "lucide-react";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvatarUploader from "@/components/mypage/molecules/AvatarUploader";
import FormField from "@/components/mypage/molecules/FormField";
import { updateProfile } from "@/app/myPage/actions";
import type { MyPageUser, ProfileFormState } from "@/types/mypage";

const fields = [
  { key: "nickname", label: "닉네임", type: "text" },
  { key: "loginId", label: "아이디", type: "text" },
  { key: "email", label: "이메일", type: "email" },
] as const;

export default function ProfileInfoCard({ user }: { user: MyPageUser }) {
  const [draft, setDraft] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  // 저장할 때마다 사진 선택 상태를 서버 값으로 되돌린다(React가 제출 후 파일 입력을 비우므로)
  const [avatarKey, setAvatarKey] = useState(0);
  const [errors, setErrors] = useState<ProfileFormState["errors"]>();
  const [, formAction, pending] = useActionState(
    async (prevState: ProfileFormState, formData: FormData) => {
      const result = await updateProfile(prevState, formData);
      if (result.ok) setIsEditing(false);
      setErrors(result.errors);
      setAvatarKey((key) => key + 1);
      return result;
    },
    {},
  );

  const startEditing = () => {
    setDraft(user);
    setErrors(undefined);
    setIsEditing(true);
  };

  return (
    <Card>
      <form action={formAction} noValidate className="contents">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
            <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
              <User className="size-4" />
            </span>
            내 프로필 및 기본 정보
          </CardTitle>
          <CardDescription>프로필 사진, 닉네임, 아이디, 이메일을 관리합니다</CardDescription>
          <CardAction className="flex gap-2">
            {isEditing ? (
              <>
                <MyPageButton
                  key="cancel"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors(undefined);
                    setAvatarKey((key) => key + 1);
                  }}
                >
                  <X />
                  취소
                </MyPageButton>
                <MyPageButton key="save" type="submit" disabled={pending}>
                  <Save />
                  저장
                </MyPageButton>
              </>
            ) : (
              <MyPageButton key="edit" type="button" onClick={startEditing}>
                <Pencil />
                정보수정
              </MyPageButton>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <AvatarUploader
            key={avatarKey}
            initialSrc={user.profileImageUrl}
            name={user.nickname}
            error={errors?.profileImage}
            onSelect={() => !isEditing && startEditing()}
          />
          {fields.map(({ key, label, type }) =>
            isEditing ? (
              <div key={key} className="grid gap-1.5">
                <FormField
                  id={key}
                  label={label}
                  type={type}
                  required
                  aria-invalid={!!errors?.[key] || undefined}
                  aria-describedby={errors?.[key] ? `${key}-error` : undefined}
                  value={draft[key]}
                  onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                />
                {errors?.[key] && (
                  <p id={`${key}-error`} role="alert" className="text-sm text-destructive">
                    {errors[key]}
                  </p>
                )}
              </div>
            ) : (
              <div key={key} className="grid gap-1.5">
                <span className="text-xs font-medium text-stone-500">{label}</span>
                <span className="text-sm text-stone-900">{user[key]}</span>
              </div>
            ),
          )}
        </CardContent>
      </form>
    </Card>
  );
}
