"use client";

import { useState, type ComponentProps, type KeyboardEvent } from "react";

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
          className="flex h-11 w-11 items-center justify-center text-[#52525B]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      }
    />
  );
}
