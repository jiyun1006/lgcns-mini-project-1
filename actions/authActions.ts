"use server";

import { matchApiUrl } from "@/config/apiuri";
import { springFetch } from "@/lib/fetchClients";
import { prisma } from "@/lib/prisma";
import {
  validateEmail,
  validateLoginId,
  validateNickname,
  validatePassword,
} from "@/lib/validation/auth";
import type { ApiResult, SignupInput } from "@/service/auth/authApi";
import type { SpringLoginData } from "@/types/response/springApiResponseType";

type CheckData = { available: boolean };

const MAX_INTERESTS = 20;

export async function checkEmailAction(email: string): Promise<ApiResult<CheckData>> {
  const error = validateEmail(email);
  if (error) return { ok: false, message: error };
  const response = await springFetch.post<CheckData>(matchApiUrl.auth.checkEmail, {
    email: email.trim().toLowerCase(),
  });
  if (!response.success || !response.data) {
    return { ok: false, message: response.message || "이메일을 확인하지 못했어요." };
  }
  return { ok: true, data: { available: response.data.available } };
}

export async function checkNicknameAction(nickname: string): Promise<ApiResult<CheckData>> {
  const error = validateNickname(nickname);
  if (error) return { ok: false, message: error };
  const found = await prisma.user.findFirst({
    where: { name: nickname.trim() },
    select: { id: true },
  });
  return { ok: true, data: { available: !found } };
}

export async function checkLoginIdAction(loginId: string): Promise<ApiResult<CheckData>> {
  const error = validateLoginId(loginId);
  if (error) return { ok: false, message: error };
  const found = await prisma.user.findFirst({
    where: { loginId: loginId.trim().toLowerCase() },
    select: { id: true },
  });
  return { ok: true, data: { available: !found } };
}

export async function signupAction(
  input: SignupInput,
): Promise<ApiResult<{ needsApproval: boolean }>> {
  const error =
    validateLoginId(input.loginId) ||
    validateEmail(input.email) ||
    validatePassword(input.password) ||
    validateNickname(input.nickname);
  if (error) return { ok: false, message: error };
  const loginId = input.loginId.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();
  const nickname = input.nickname.trim();
  const interests = input.interests.slice(0, MAX_INTERESTS).map((tag) => tag.slice(0, 20));

  const taken = await prisma.user.findFirst({
    where: { loginId, NOT: { email } },
    select: { id: true },
  });
  if (taken) return { ok: false, message: "이미 사용 중인 아이디예요. 다른 아이디를 골라 주세요." };

  const response = await springFetch.post<SpringLoginData>(matchApiUrl.auth.signup, {
    email,
    name: nickname,
    password: input.password,
  });
  if (!response.success) {
    return {
      ok: false,
      message: response.message || "가입하지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }

  await prisma.user.upsert({
    where: { email },
    update: { name: nickname, interests, loginId },
    create: { email, name: nickname, interests, loginId },
    select: { id: true },
  });

  const needsApproval = response.data?.accountStatus === "PENDING_APPROVAL";
  return { ok: true, data: { needsApproval } };
}
