import type { InputHTMLAttributes, ReactNode } from "react";

export type FieldTone = "default" | "error" | "success";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  message?: string;
  tone?: FieldTone;
  rightSlot?: ReactNode;
  onClear?: () => void;
};

const borderClass: Record<FieldTone, string> = {
  default: "border-[#D4D4D8] focus-within:border-[#4338CA]",
  error: "border-[#DC2626]",
  success: "border-[#16A34A]",
};

const messageClass: Record<FieldTone, string> = {
  default: "text-[#52525B]",
  error: "font-semibold text-[#B91C1C]",
  success: "font-semibold text-[#15803D]",
};

export default function TextField({
  id,
  label,
  message,
  tone = "default",
  rightSlot,
  onClear,
  value,
  className = "",
  ...rest
}: TextFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[14px] font-bold">
        {label}
      </label>
      <div className={`flex items-center rounded-[10px] border bg-white pr-1 ${borderClass[tone]}`}>
        <input
          id={id}
          value={value}
          aria-invalid={tone === "error" || undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-[46px] min-w-0 flex-1 rounded-[10px] px-[14px] text-[15px] outline-none"
          {...rest}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={`${label} 지우기`}
            className="flex h-11 w-11 items-center justify-center text-[18px] text-[#71717A]"
          >
            ×
          </button>
        ) : null}
        {rightSlot}
      </div>
      {message ? (
        <span id={messageId} aria-live="polite" className={`text-[13px] ${messageClass[tone]}`}>
          {message}
        </span>
      ) : null}
    </div>
  );
}
