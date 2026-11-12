const STEP_LABELS = ["약관 동의", "계정 정보", "프로필", "가입 완료"];

export default function SignupProgress({ current }: { current: number }) {
  return (
    <ol aria-label="가입 단계" className="grid grid-cols-4 gap-2">
      {STEP_LABELS.map((label, index) => {
        const num = index + 1;
        const isCurrent = num === current;
        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={`h-1 w-full rounded-sm ${num <= current ? "bg-(--ds-primary)" : "bg-(--ds-line)"}`}
            />
            <span
              className={`text-[13px] max-sm:text-[11px] ${isCurrent ? "font-bold text-(--ds-ink)" : "text-(--ds-ink-2)"}`}
            >
              {num}. {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
