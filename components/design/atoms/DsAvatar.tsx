"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./DsAvatar.css";

// 사진이 없을 때 쓰는 팀 색 세 가지 (tokens.css의 --ds-avatar-1~3)
const TONES = ["ds-avatar-tone1", "ds-avatar-tone2", "ds-avatar-tone3"];

// 같은 이름은 어디서나 같은 색이 나오도록 글자 코드를 더해 고른다
function toneOf(name: string) {
  let sum = 0;
  for (const char of name) sum += char.codePointAt(0) ?? 0;
  return TONES[sum % TONES.length];
}

type DsAvatarProps = {
  name: string | null;
  imageUrl?: string | null;
  className?: string;
};

/**
 * 사진 동그라미 (atom)
 * - 크기는 부모에서 --ds-avatar-size 로 정한다 (기본 40px).
 * - 사진을 못 불러오면 이름 첫 글자를 팀 색 위에 보여 준다.
 */
export default function DsAvatar({ name, imageUrl, className }: DsAvatarProps) {
  const label = name ?? "나";

  return (
    <Avatar className={["ds-avatar", className].filter(Boolean).join(" ")}>
      {imageUrl && <AvatarImage src={imageUrl} alt="" />}
      <AvatarFallback className={`ds-avatar-fallback ${toneOf(label)}`}>
        {label.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}
