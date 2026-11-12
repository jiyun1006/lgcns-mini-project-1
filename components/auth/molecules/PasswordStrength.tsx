import { Check, Dot } from "lucide-react";

import { getPasswordChecks, getPasswordLevel } from "@/lib/validation/auth";

const LEVELS = [
  { text: "", bar: "bg-(--ds-line)", color: "text-(--ds-ink-2)" },
  { text: "위험", bar: "bg-(--ds-danger)", color: "text-(--ds-danger)" },
  { text: "보통", bar: "bg-[#F59E0B]", color: "text-[#B45309]" },
  { text: "안전", bar: "bg-[#16A34A]", color: "text-(--ds-ok)" },
];

export default function PasswordStrength({ password }: { password: string }) {
  const level = getPasswordLevel(password);
  const info = LEVELS[level];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div aria-hidden="true" className="grid w-16.5 grid-cols-3 gap-0.75">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1 rounded-sm ${n <= level ? info.bar : "bg-(--ds-line)"}`} />
        ))}
      </div>
      <span aria-live="polite" className={`w-7 text-[12px] font-bold ${info.color}`}>
        {info.text}
      </span>
      <ul aria-label="비밀번호 안전 조건" className="flex flex-wrap items-center gap-2.5">
        {getPasswordChecks(password).map((check) => (
          <li
            key={check.label}
            className={`inline-flex items-center gap-1 text-[12px] ${check.ok ? "font-semibold text-(--ds-ok)" : "text-(--ds-ink-2)"}`}
          >
            {check.ok ? (
              <Check size={13} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <Dot size={13} aria-hidden="true" />
            )}
            {check.label}
            <span className="sr-only">{check.ok ? " (충족)" : " (미충족)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
