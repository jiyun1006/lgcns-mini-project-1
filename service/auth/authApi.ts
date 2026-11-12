import { realAuthApi } from "./realAuthApi";

export type ApiResult<T = null> = { ok: true; data: T } | { ok: false; message: string };

export type LoginInput = { email: string; password: string };

export type SignupInput = {
  email: string;
  password: string;
  nickname: string;
  interests: string[];
  marketingAgreed: boolean;
  loginId: string;
};

export type AuthApi = {
  login(input: LoginInput): Promise<ApiResult>;
  checkEmail(email: string): Promise<ApiResult<{ available: boolean }>>;
  checkNickname(nickname: string): Promise<ApiResult<{ available: boolean }>>;
  checkLoginId(loginId: string): Promise<ApiResult<{ available: boolean }>>;
  signup(input: SignupInput): Promise<ApiResult<{ needsApproval: boolean }>>;
};

export const authApi: AuthApi = realAuthApi;
