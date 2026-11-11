export const MIN_PASSWORD_LENGTH = 8;

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 통과하면 null, 아니면 사용자에게 보여줄 오류 문구를 돌려준다
export function validatePasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
}: PasswordChangeInput): string | null {
  if (!currentPassword || !newPassword || !confirmPassword) return "모든 항목을 입력해주세요.";
  if (newPassword.length < MIN_PASSWORD_LENGTH)
    return `새 비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`;
  if (newPassword !== confirmPassword) return "새 비밀번호가 일치하지 않습니다.";
  if (newPassword === currentPassword) return "현재 비밀번호와 다른 비밀번호를 입력해주세요.";
  return null;
}
