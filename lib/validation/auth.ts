export const NICKNAME_RULE = "2~12자";

export function validateEmail(value: string) {
  if (!value.trim()) return "이메일을 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "이메일 형식이 아니에요.";
  return "";
}

export function getPasswordChecks(value: string) {
  return [
    { label: "8자 이상", ok: value.length >= 8 },
    { label: "영문+숫자", ok: /[A-Za-z]/.test(value) && /\d/.test(value) },
    { label: "특수문자", ok: /[^A-Za-z0-9]/.test(value) },
  ];
}

export function getPasswordLevel(value: string) {
  if (!value) return 0;
  return getPasswordChecks(value).filter((check) => check.ok).length;
}

export function validatePassword(value: string) {
  if (!value) return "비밀번호를 입력해 주세요.";
  if (value.length > 72) return "비밀번호는 72자까지 쓸 수 있어요.";
  if (value.length < 8) return "비밀번호는 8자 이상이에요.";
  if (getPasswordLevel(value) < 2) return "영문+숫자 또는 특수문자를 넣어 주세요.";
  return "";
}

export function validatePasswordConfirm(password: string, confirm: string) {
  if (!confirm) return "비밀번호를 한 번 더 입력해 주세요.";
  if (password !== confirm) return "비밀번호가 일치하지 않아요.";
  return "";
}

export function validateNickname(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "닉네임을 입력해 주세요.";
  if (trimmed.length < 2 || trimmed.length > 12) return "닉네임은 2~12자예요.";
  return "";
}

export const LOGIN_ID_RULE = "영문 소문자·숫자·_ 1~20자 · 로그인할 때 써요";

export function validateLoginId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "아이디를 입력해 주세요.";
  if (!/^[a-z0-9_]{1,20}$/.test(trimmed)) {
    return "아이디는 영문 소문자, 숫자, _만 써서 20자까지 만들어 주세요.";
  }
  return "";
}
