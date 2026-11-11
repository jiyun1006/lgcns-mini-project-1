export interface MyPageUser {
  nickname: string;
  loginId: string;
  email: string;
  profileImageUrl: string | null;
}

export type ProfileField = "nickname" | "loginId" | "email" | "profileImage";

export interface ProfileFormState {
  ok?: boolean;
  errors?: Partial<Record<ProfileField, string>>;
}
