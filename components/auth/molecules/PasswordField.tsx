"use client";

import { useState, type ComponentProps, type KeyboardEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import TextField from "./TextField";

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, "type" | "rightSlot">;

export default function PasswordField({ message, onKeyUp, ...rest }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"));
    onKeyUp?.(e);
  };

  return (
    <TextField
      {...rest}
      type={isVisible ? "text" : "password"}
      onKeyUp={handleKeyUp}
      message={message || (isCapsLockOn ? "Caps Lock이 켜져 있어요" : "")}
      rightSlot={
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={isVisible}
          className="flex h-11 w-11 items-center justify-center text-(--ds-ink-2)"
        >
          {isVisible ? (
            <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
