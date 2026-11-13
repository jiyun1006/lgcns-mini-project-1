"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import "./CopyButton.css";

type CopyButtonProps = {
  // 복사를 실제로 하는 함수. 성공하면 true를 돌려준다.
  onCopy: () => Promise<boolean>;
};

/**
 * 복사 버튼 (molecule)
 * - 누르면 체크 + '복사됨'으로 1.6초 바뀌었다가 돌아온다. 실패하면 바뀌지 않는다.
 */
export default function CopyButton({ onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = async () => {
    const ok = await onCopy();
    if (!ok) return;

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      className="ds-copy"
      data-copied={copied || undefined}
      onClick={handleClick}
    >
      {copied ? (
        <Check className="ds-copy-check" aria-hidden="true" />
      ) : (
        <Copy className="ds-copy-icon" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "복사됨" : "복사"}</span>
    </button>
  );
}
