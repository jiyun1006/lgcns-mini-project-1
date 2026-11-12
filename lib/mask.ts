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
