export interface MyPageUser {
  nickname: string;
  loginId: string;
  email: string;
  profileImageUrl: string | null;
  bio: string;
  interests: string[];
  isProfilePublic: boolean;
  showEmail: boolean;
  showInterests: boolean;
}

export type ProfileField = "nickname" | "loginId" | "email" | "profileImage";

export interface ProfileFormState {
  ok?: boolean;
  errors?: Partial<Record<ProfileField, string>>;
}

export interface IntroFormState {
  ok?: boolean;
  errors?: { bio?: string; interests?: string };
}

export interface PrivacyFormState {
  ok?: boolean;
}
