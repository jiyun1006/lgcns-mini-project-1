import type { ChangeEvent } from "react";

type AvatarPickerProps = { initial: string; previewUrl: string; onChange: (url: string) => void };

export default function AvatarPicker({ initial, previewUrl, onChange }: AvatarPickerProps) {
  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onChange(URL.createObjectURL(file));
  };

  return (
    <label className="relative block h-22 w-22 shrink-0 cursor-pointer rounded-full">
      <input type="file" accept="image/png,image/jpeg" onChange={handlePick} className="sr-only" />
      <span className="sr-only">프로필 사진 올리기 (선택)</span>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="선택한 프로필 사진"
          className="h-22 w-22 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-22 w-22 items-center justify-center rounded-full border-2 border-dashed border-[#A5B4FC] bg-[#E0E7FF] text-[30px] font-extrabold text-[#3730A3]"
        >
          {initial || "?"}
        </span>
      )}
    </label>
  );
}
