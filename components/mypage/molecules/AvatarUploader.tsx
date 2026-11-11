"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import {
  MAX_PROFILE_IMAGE_BYTES,
  PROFILE_IMAGE_SIZE_ERROR,
  PROFILE_IMAGE_TYPE_ERROR,
  PROFILE_IMAGE_TYPES,
} from "@/lib/mypage/profileImage";

type AvatarUploaderProps = {
  initialSrc: string | null;
  name: string;
  error?: string;
  onSelect?: () => void;
};

// 선택한 파일은 감싼 form 안에서 name="profileImage"로 함께 전송된다
export default function AvatarUploader({ initialSrc, name, error, onSelect }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(initialSrc);
  const [localError, setLocalError] = useState<string | null>(null);
  const shownError = localError ?? error;

  // 사진을 바꾸거나 페이지를 떠날 때 이전 미리보기 URL을 해제한다
  useEffect(
    () => () => {
      if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    },
    [src],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileError = !PROFILE_IMAGE_TYPES.includes(file.type)
      ? PROFILE_IMAGE_TYPE_ERROR
      : file.size > MAX_PROFILE_IMAGE_BYTES
        ? PROFILE_IMAGE_SIZE_ERROR
        : null;
    setLocalError(fileError);
    if (fileError) {
      event.target.value = "";
      setSrc(initialSrc);
      return;
    }
    setSrc(URL.createObjectURL(file));
    onSelect?.();
  };

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          {src && <AvatarImage src={src} alt={`${name} 프로필 사진`} />}
          <AvatarFallback className="text-2xl">{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          aria-label="프로필 사진 파일 선택"
        />
        <MyPageButton
          type="button"
          variant="outline"
          aria-invalid={!!shownError || undefined}
          aria-describedby={shownError ? "profileImage-error" : undefined}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="text-board-accent" />
          사진 변경
        </MyPageButton>
      </div>
      {shownError && (
        <p id="profileImage-error" role="alert" className="text-sm text-destructive">
          {shownError}
        </p>
      )}
    </div>
  );
}
