"use client";

import { useRef } from "react";

export default function AvatarCoreIdentity() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <span>{"signup Data"}</span>
      <span>{"id, email"}</span>
      <div className="flex items-center gap-2 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          //onChange={handleAvatarFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto justify-center px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          {/*<Upload className="w-3.5 h-3.5 text-[#A50034]" />*/}
          <span>사진 변경</span>
        </button>
      </div>
    </div>
  );
}
