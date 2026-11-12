import { signIn } from "next-auth/react";

import type { AuthApi } from "./authApi";
import { mockAuthApi } from "./mockAuthApi";

const LOGIN_FAILED_MESSAGE = "이메일 또는 비밀번호가 틀렸어요. 다시 확인해 주세요.";

export const realAuthApi: AuthApi = {
  async login({ email, password }) {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result || result.error) {
      return {
        ok: false,
        message:
          result?.error && result.error !== "CredentialsSignin"
            ? result.error
            : LOGIN_FAILED_MESSAGE,
      };
    }
    return { ok: true, data: null };
  },

  // ⏸ 회원가입 쪽은 3장에서 바꿔요. 그때까지 가짜를 그대로 써요
  checkEmail: mockAuthApi.checkEmail,
  checkNickname: mockAuthApi.checkNickname,
  signup: mockAuthApi.signup,
};
