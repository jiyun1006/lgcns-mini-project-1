export const SAVED_EMAIL_COOKIE = "savedEmail";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function rememberEmail(email: string) {
  document.cookie = `${SAVED_EMAIL_COOKIE}=${encodeURIComponent(email)}; Max-Age=${THIRTY_DAYS}; Path=/; SameSite=Lax`;
}

export function forgetEmail() {
  document.cookie = `${SAVED_EMAIL_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
