import type { ReactNode } from "react";

type AlertTone = "error" | "info";

const toneClass: Record<AlertTone, string> = {
  error: "border-[#FCA5A5] bg-[#FEF2F2] text-[#7F1D1D]",
  info: "border-[#C7D2FE] bg-[#EEF2FF] text-[#312E81]",
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
      className={`rounded-[10px] border px-3.5 py-3 text-[14px] ${toneClass[tone]}`}
    >
      {children}
    </div>
  );
}
