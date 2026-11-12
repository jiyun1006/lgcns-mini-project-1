"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";

const POPULAR_TAGS = [
  "프롬프트",
  "업무자동화",
  "코딩",
  "글쓰기",
  "공부",
  "디자인",
  "모델비교",
  "데이터분석",
];

function cleanTag(raw: string) {
  return raw.replace(/^#+/, "").replace(/\s+/g, "").slice(0, 20);
}

type TagInputProps = { id: string; tags: string[]; onChange: (tags: string[]) => void };

export default function TagInput({ id, tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTags = (names: string[]) => {
    const next = [...tags];
    names
      .map(cleanTag)
      .filter(Boolean)
      .forEach((name) => {
        if (!next.includes(name)) next.push(name);
      });
    onChange(next);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.includes(",")) {
      setDraft(value);
      return;
    }
    const parts = value.split(",");
    const rest = parts.pop() ?? "";
    addTags(parts);
    setDraft(rest);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (draft.trim()) {
        addTags([draft]);
        setDraft("");
      }
    } else if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] font-bold">
        관심사{" "}
        <span className="font-normal text-[#52525B]">
          (선택) · 쉼표(,)나 Enter로 태그를 만들어요
        </span>
      </label>
      <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-[10px] border border-[#D4D4D8] bg-white px-2.5 py-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full bg-[#EEF2FF] py-1 pr-1 pl-3 text-[14px] font-semibold text-[#3730A3]"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              aria-label={`${tag} 태그 삭제`}
              className="flex h-6 w-6 items-center justify-center rounded-full"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? "" : "예: 프롬프트, 코딩, 공부"}
          className="h-7.5 min-w-35 flex-1 bg-transparent text-[15px] outline-none"
        />
      </div>
      {tags.length === 0 ? (
        <span className="text-[12px] text-[#52525B]">
          아직 고른 관심사가 없어요. 아래에서 골라도 돼요 (선택)
        </span>
      ) : (
        <span className="text-[12px] text-[#52525B]">태그 {tags.length}개</span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {POPULAR_TAGS.map((tag) => {
          const isAdded = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={isAdded}
              onClick={() => addTags([tag])}
              className="min-h-9 rounded-full border border-dashed border-[#A1A1AA] bg-white px-3 text-[13px] font-semibold text-[#3F3F46] disabled:border-solid disabled:border-[#E4E4E7] disabled:bg-[#F4F4F5] disabled:text-[#52525B]"
            >
              {isAdded ? `✓ #${tag}` : `#${tag}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
