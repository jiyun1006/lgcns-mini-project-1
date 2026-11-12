import { getPasswordChecks, getPasswordLevel } from "@/lib/validation/auth";

const LEVELS = [
  { text: "", bar: "bg-[#E4E4E7]", color: "text-[#52525B]" },
  { text: "위험", bar: "bg-[#DC2626]", color: "text-[#B91C1C]" },
  { text: "보통", bar: "bg-[#F59E0B]", color: "text-[#B45309]" },
  { text: "안전", bar: "bg-[#16A34A]", color: "text-[#15803D]" },
];

export default function PasswordStrength({ password }: { password: string }) {
  const level = getPasswordLevel(password);
  const info = LEVELS[level];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div aria-hidden="true" className="grid w-16.5 grid-cols-3 gap-0.75">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1 rounded-sm ${n <= level ? info.bar : "bg-[#E4E4E7]"}`} />
        ))}
      </div>
      <span aria-live="polite" className={`w-7 text-[12px] font-bold ${info.color}`}>
        {info.text}
      </span>
      <ul aria-label="비밀번호 안전 조건" className="flex flex-wrap items-center gap-2.5">
        {getPasswordChecks(password).map((check) => (
          <li
            key={check.label}
            className={`text-[12px] ${check.ok ? "font-semibold text-[#15803D]" : "text-[#52525B]"}`}
          >
            {check.ok ? "✓" : "·"} {check.label}
            <span className="sr-only">{check.ok ? " (충족)" : " (미충족)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
