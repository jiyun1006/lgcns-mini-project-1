import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-(--ds-primary) text-white hover:bg-(--ds-primary-strong) disabled:opacity-60",
  secondary:
    "border border-(--ds-line-2) bg-white text-(--ds-ink) hover:bg-(--ds-surface-2) disabled:text-(--ds-ink-3)",
  ghost: "bg-transparent text-(--ds-ink-2) hover:bg-(--ds-surface-2) disabled:text-(--ds-ink-3)",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-[14px]",
  lg: "h-12.5 px-5 text-[16px] max-sm:h-13.5",
};

export default function Button({
  variant = "primary",
  size = "lg",
  isLoading = false,
  loadingText,
  fullWidth = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] font-bold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
