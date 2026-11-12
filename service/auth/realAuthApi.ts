import { signIn } from "next-auth/react";

import {
  checkEmailAction,
  checkLoginIdAction,
  checkNicknameAction,
  signupAction,
} from "@/actions/authActions";

import type { AuthApi } from "./authApi";

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

  checkEmail: checkEmailAction,
  checkNickname: checkNicknameAction,
  checkLoginId: checkLoginIdAction,

  async signup(input) {
    const result = await signupAction(input);
    if (!result.ok || result.data.needsApproval) return result;
    await signIn("credentials", { email: input.email, password: input.password, redirect: false });
    return result;
  },
};
