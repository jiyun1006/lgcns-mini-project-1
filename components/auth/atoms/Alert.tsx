import type { ReactNode } from "react";
import { CircleAlert, Info } from "lucide-react";

type AlertTone = "error" | "info";

const toneClass: Record<AlertTone, string> = {
  error: "border-transparent bg-[#FDECEE] text-[#9B1C2E]",
  info: "border-(--ds-primary-line) bg-(--ds-primary-soft) text-(--ds-primary-ink)",
};

export default function Alert({
  tone = "error",
  children,
}: {
  tone?: AlertTone;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-[10px] border px-3.5 py-3 text-[14px] leading-[1.6] ${toneClass[tone]}`}
    >
      {tone === "error" ? (
        <CircleAlert size={16} className="mt-0.75 shrink-0" aria-hidden="true" />
      ) : (
        <Info size={16} className="mt-0.75 shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}
