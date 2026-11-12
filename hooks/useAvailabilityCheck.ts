"use client";

import { useEffect, useState } from "react";

import type { FieldTone } from "@/components/molecules/TextField";
import type { ApiResult } from "@/service/auth/authApi";

export type CheckStatus = "idle" | "typing" | "invalid" | "checking" | "ok" | "taken" | "error";

export type AvailabilityCheck = { status: CheckStatus; message: string };

type CheckedResult = AvailabilityCheck & { value: string };

export function useAvailabilityCheck(
  value: string,
  validate: (value: string) => string,
  check: (value: string) => Promise<ApiResult<{ available: boolean }>>,
): AvailabilityCheck {
  const [checked, setChecked] = useState<CheckedResult | null>(null);

  useEffect(() => {
    if (!value) return;
    let isCancelled = false;

    const timer = setTimeout(async () => {
      const error = validate(value);
      if (error) {
        setChecked({ value, status: "invalid", message: error });
        return;
      }
      setChecked({ value, status: "checking", message: "" });
      try {
        const result = await check(value);
        if (isCancelled) return;
        if (!result.ok) {
          setChecked({ value, status: "error", message: result.message });
          return;
        }
        setChecked({ value, status: result.data.available ? "ok" : "taken", message: "" });
      } catch {
        if (!isCancelled) {
          setChecked({
            value,
            status: "error",
            message: "확인하지 못했어요. 잠시 후 다시 시도해 주세요.",
          });
        }
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [value, validate, check]);

  if (!value) return { status: "idle", message: "" };
  if (!checked || checked.value !== value) return { status: "typing", message: "" };
  return { status: checked.status, message: checked.message };
}

export function describeCheck(
  check: AvailabilityCheck,
  text: { idle: string; ok: string; taken: string },
): { tone: FieldTone; message: string } {
  switch (check.status) {
    case "typing":
      return { tone: "default", message: "입력을 멈추면 자동으로 확인해요" };
    case "checking":
      return { tone: "default", message: "사용할 수 있는지 확인하는 중…" };
    case "ok":
      return { tone: "success", message: text.ok };
    case "taken":
      return { tone: "error", message: text.taken };
    case "invalid":
    case "error":
      return { tone: "error", message: check.message };
    default:
      return { tone: "default", message: text.idle };
  }
}
