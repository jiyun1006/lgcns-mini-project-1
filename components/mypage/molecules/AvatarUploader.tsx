"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";

type AvatarUploaderProps = { initialSrc: string | null; name: string };

export default function AvatarUploader({ initialSrc, name }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(initialSrc);

  // 사진을 바꾸거나 페이지를 떠날 때 이전 미리보기 URL을 해제한다
  useEffect(
    () => () => {
      if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    },
    [src],
  );

  // shortcut: 미리보기만 함, 업로드 API가 생기면 file을 FormData로 전송
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }
    setSrc(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-20">
        {src && <AvatarImage src={src} alt={`${name} 프로필 사진`} />}
        <AvatarFallback className="text-2xl">{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="프로필 사진 파일 선택"
      />
      <MyPageButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="text-[#A50034]" />
        사진 변경
      </MyPageButton>
    </div>
  );
}
