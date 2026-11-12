"use server";

import { Prisma } from "@prisma/client";
import { refresh } from "next/cache";
import { matchApiUrl } from "@/config/apiuri";
import { getCurrentUser } from "@/lib/current-user";
import { springFetch } from "@/lib/fetchClients";
import { prisma } from "@/lib/prisma";
import {
  MAX_PROFILE_IMAGE_BYTES,
  PROFILE_IMAGE_SIZE_ERROR,
  toProfileImageDataUrl,
} from "@/lib/mypage/profileImage";
import { normalizeInterests, validateIntro } from "@/lib/mypage/validateIntro";
import { validatePasswordChange, type PasswordChangeInput } from "@/lib/mypage/validatePassword";
import { getSpringAccessToken } from "@/lib/springToken";
import { validateNickname } from "@/lib/validation/auth";
import type {
  IntroFormState,
  PrivacyFormState,
  ProfileField,
  ProfileFormState,
} from "@/types/mypage";

const LOGIN_ID_PATTERN = /^[a-z0-9_]{1,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

// 대상은 항상 현재 사용자 본인
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
  const recoveryEmail = read("recoveryEmail").toLowerCase();

  const errors: Partial<Record<ProfileField, string>> = {};
  const nicknameError = validateNickname(nickname);
  if (nicknameError) errors.nickname = nicknameError;
  if (!loginId) errors.loginId = "아이디는 공백만으로 저장할 수 없습니다.";
  else if (!LOGIN_ID_PATTERN.test(loginId))
    errors.loginId = "아이디는 영문 소문자, 숫자, _만 사용해 1~20자로 입력해주세요.";
  if (
    recoveryEmail &&
    (recoveryEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(recoveryEmail))
  )
    errors.recoveryEmail = "올바른 이메일 형식이 아닙니다.";

  // 파일이 없으면 사진은 그대로 둔다. 문자열(외부 URL 등)은 받지 않는다.
  let profileImageUrl: string | undefined;
  const image = formData.get("profileImage");
  if (image instanceof Blob && image.size > 0) {
    if (image.size > MAX_PROFILE_IMAGE_BYTES) errors.profileImage = PROFILE_IMAGE_SIZE_ERROR;
    else {
      const result = toProfileImageDataUrl(new Uint8Array(await image.arrayBuffer()));
      if ("error" in result) errors.profileImage = result.error;
      else profileImageUrl = result.dataUrl;
    }
  }
  if (Object.keys(errors).length) return { errors };

  const user = await getCurrentUser();
  if (!user) return { errors: { nickname: "로그인이 필요해요." } };

  // shortcut: loginId에 unique 인덱스가 없어 동시 저장 시 중복될 수 있음, 백필 후 @unique로 바꾸면 P2002로 처리
  const taken = await prisma.user.findFirst({
    where: { loginId, NOT: { id: user.id } },
    select: { id: true },
  });
  if (taken) return { errors: { loginId: "이미 사용 중인 아이디입니다." } };
  if (recoveryEmail && recoveryEmail === user.email)
    return { errors: { recoveryEmail: "가입 이메일과 다른 이메일을 넣어 주세요." } };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: nickname, loginId, recoveryEmail: recoveryEmail || null, profileImageUrl },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { errors: { email: "이미 사용 중인 이메일입니다." } };
    throw error;
  }

  refresh();
  return { ok: true };
}

export async function updateIntro(
  _prevState: IntroFormState,
  formData: FormData,
): Promise<IntroFormState> {
  const bioEntry = formData.get("bio");
  const bio = typeof bioEntry === "string" ? bioEntry.trim() : "";
  const interests = normalizeInterests(
    formData.getAll("interests").filter((tag): tag is string => typeof tag === "string"),
  );
  const errors = validateIntro(bio, interests);
  if (errors.bio || errors.interests) return { errors };

  const user = await getCurrentUser();
  if (!user) return { errors: { bio: "로그인이 필요해요." } };

  await prisma.user.update({
    where: { id: user.id },
    data: { bio: bio || null, interests },
  });

  refresh();
  return { ok: true };
}

// 체크하지 않은 체크박스는 FormData에 아예 없으므로 값이 "on"인지만 본다
export async function updatePrivacy(
  _prevState: PrivacyFormState,
  formData: FormData,
): Promise<PrivacyFormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isProfilePublic: formData.get("isProfilePublic") === "on",
      showEmail: formData.get("showEmail") === "on",
      showInterests: formData.get("showInterests") === "on",
    },
  });

  refresh();
  return { ok: true };
}

// 비밀번호 변경
export async function changePassword(
  input: PasswordChangeInput,
): Promise<{ ok: boolean; message: string }> {
  const error = validatePasswordChange(input);
  if (error) return { ok: false, message: error };

  const springToken = await getSpringAccessToken();
  if (!springToken) return { ok: false, message: "로그인이 필요해요. 다시 로그인해 주세요." };

  const response = await springFetch.post<null>(
    matchApiUrl.auth.changePassword,
    { currentPassword: input.currentPassword, newPassword: input.newPassword },
    { headers: { Authorization: `Bearer ${springToken}` } },
  );
  if (!response.success) {
    return {
      ok: false,
      message: response.message || "비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }
  return { ok: true, message: "비밀번호를 바꿨어요. 다음 로그인부터 새 비밀번호를 써요." };
}
