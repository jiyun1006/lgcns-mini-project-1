import type { InputHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";

export type FieldTone = "default" | "error" | "success";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  message?: string;
  tone?: FieldTone;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
  onClear?: () => void;
};

const borderClass: Record<FieldTone, string> = {
  default:
    "border-(--ds-line-2) focus-within:border-(--ds-primary) focus-within:shadow-[0_0_0_4px_var(--ds-primary-soft)]",
  error: "border-(--ds-danger)",
  success: "border-[#16A34A]",
};

const messageClass: Record<FieldTone, string> = {
  default: "text-(--ds-ink-2)",
  error: "font-semibold text-(--ds-danger)",
  success: "font-semibold text-(--ds-ok)",
};

export default function TextField({
  id,
  label,
  message,
  tone = "default",
  rightSlot,
  bottomSlot,
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
          className="h-11.5 min-w-0 flex-1 rounded-[10px] px-3.5 text-[15px] outline-none max-sm:h-12.5"
          {...rest}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={`${label} 지우기`}
            className="flex h-11 w-11 items-center justify-center text-[18px] text-(--ds-ink-3)"
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
        {rightSlot}
      </div>
      {bottomSlot}
      <span
        id={messageId}
        aria-live="polite"
        className={`min-h-5 text-[13px] leading-5 ${messageClass[tone]}`}
      >
        {message}
      </span>
    </div>
  );
}
