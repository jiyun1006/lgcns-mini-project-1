"use server";

import { Prisma } from "@prisma/client";
import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import type { ProfileField, ProfileFormState } from "@/types/mypage";

const LOGIN_ID_PATTERN = /^[a-z0-9_]{1,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NICKNAME_LENGTH = 20;
const MAX_EMAIL_LENGTH = 254;

// 대상은 항상 현재 사용자 본인. 클라이언트가 보낸 id는 받지 않는다.
export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const nickname = read("nickname");
  const loginId = read("loginId");
  const email = read("email");

  const errors: Partial<Record<ProfileField, string>> = {};
  if (!nickname) errors.nickname = "닉네임은 공백만으로 저장할 수 없습니다.";
  else if (nickname.length > MAX_NICKNAME_LENGTH)
    errors.nickname = `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`;
  if (!loginId) errors.loginId = "아이디는 공백만으로 저장할 수 없습니다.";
  else if (!LOGIN_ID_PATTERN.test(loginId))
    errors.loginId = "아이디는 영문 소문자, 숫자, _만 사용해 1~20자로 입력해주세요.";
  if (!email) errors.email = "이메일은 공백만으로 저장할 수 없습니다.";
  else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email))
    errors.email = "올바른 이메일 형식이 아닙니다.";
  if (Object.keys(errors).length) return { errors };

  const user = await getCurrentUser();

  // shortcut: loginId에 unique 인덱스가 없어 동시 저장 시 중복될 수 있음, 백필 후 @unique로 바꾸면 P2002로 처리
  const taken = await prisma.user.findFirst({
    where: { loginId, NOT: { id: user.id } },
    select: { id: true },
  });
  if (taken) return { errors: { loginId: "이미 사용 중인 아이디입니다." } };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: nickname, loginId, email },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { errors: { email: "이미 사용 중인 이메일입니다." } };
    throw error;
  }

  refresh();
  return { ok: true };
}
