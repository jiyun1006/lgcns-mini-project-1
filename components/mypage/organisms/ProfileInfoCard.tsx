"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { MyPageUser } from "@/types/mypage";

const fields = [
  { key: "nickname", label: "닉네임", type: "text" },
  { key: "loginId", label: "아이디", type: "text" },
  { key: "email", label: "이메일", type: "email" },
] as const;

export default function ProfileInfoCard({ user }: { user: MyPageUser }) {
  const [profile, setProfile] = useState(user);
  const [draft, setDraft] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  // shortcut: 로컬 state에만 저장함, 프로필 수정 API가 생기면 여기서 호출
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile({
      ...draft,
      nickname: draft.nickname.trim(),
      loginId: draft.loginId.trim(),
      email: draft.email.trim(),
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <form onSubmit={handleSave} className="contents">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#A50034]">
              <User className="size-4" />
            </span>
            내 프로필 및 기본 정보
          </CardTitle>
          <CardDescription>프로필 사진, 닉네임, 아이디, 이메일을 관리합니다</CardDescription>
          <CardAction>
            {isEditing ? (
              <Button
                key="save"
                type="submit"
                className="bg-[#A50034] text-white hover:bg-[#87002A]"
              >
                <Save />
                저장
              </Button>
            ) : (
              <Button key="edit" type="button" onClick={startEditing}>
                <Pencil />
                정보수정
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <AvatarUploader initialSrc={profile.profileImageUrl} name={profile.nickname} />
          {fields.map(({ key, label, type }) =>
            isEditing ? (
              <FormField
                key={key}
                id={key}
                label={label}
                type={type}
                required
                value={draft[key]}
                onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
              />
            ) : (
              <div key={key} className="grid gap-1.5">
                <span className="text-xs font-medium text-stone-500">{label}</span>
                <span className="text-sm text-stone-900">{profile[key]}</span>
              </div>
            ),
          )}
        </CardContent>
      </form>
    </Card>
  );
}
