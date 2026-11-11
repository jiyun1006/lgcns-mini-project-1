// 앞 1~2글자만 보여 주고 나머지는 *** (길이도 숨겨요)
function maskPart(value: string) {
  const shown = Math.min(2, Math.max(1, value.length - 1));
  return `${value.slice(0, shown)}***`;
}

export function maskLoginId(loginId: string) {
  return maskPart(loginId);
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${maskPart(local)}@${domain}`;
}
