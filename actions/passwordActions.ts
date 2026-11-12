"use server";

import { matchApiUrl } from "@/config/apiuri";
import { springFetch } from "@/lib/fetchClients";
import { validateEmail, validatePassword } from "@/lib/validation/auth";
import type { ApiResult } from "@/service/auth/authApi";

type ResetInput = { email: string; token: string; newPassword: string };

export async function requestResetKeyAction(email: string): Promise<ApiResult> {
  const error = validateEmail(email);
  if (error) return { ok: false, message: error };
  const response = await springFetch.post<null>(matchApiUrl.auth.passwordForgot, {
    email: email.trim().toLowerCase(),
  });
  if (!response.success) {
    return {
      ok: false,
      message: response.message || "보안키를 보내지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }
  // 테스트 서버는 응답에 demoToken(보안키)이 같이 오지만, 화면으로 넘기지 않아요
  return { ok: true, data: null };
}

export async function resetPasswordAction(input: ResetInput): Promise<ApiResult> {
  const error = validateEmail(input.email) || validatePassword(input.newPassword);
  if (error) return { ok: false, message: error };
  const token = input.token.trim();
  if (!token) return { ok: false, message: "메일로 받은 보안키를 넣어 주세요." };
  const response = await springFetch.post<null>(matchApiUrl.auth.passwordReset, {
    email: input.email.trim().toLowerCase(),
    token,
    newPassword: input.newPassword,
  });
  if (!response.success) {
    return {
      ok: false,
      message: response.message || "비밀번호를 바꾸지 못했어요. 보안키를 다시 확인해 주세요.",
    };
  }
  return { ok: true, data: null };
}
