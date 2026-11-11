import { prisma } from "@/lib/prisma";

// 마이페이지 아이디 규칙(영문 소문자·숫자·_ 1~20자)에 맞춰 이메일 앞부분으로 아이디를 만들어요.
// 겹치면 뒤에 숫자를 붙여요. 팀 scripts/backfill-login-id.mjs와 같은 방법이에요.
export async function makeLoginId(email: string) {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 17) || "user";

  for (let n = 1; ; n++) {
    const loginId = n === 1 ? base : `${base}${n}`;
    const taken = await prisma.user.findFirst({ where: { loginId }, select: { id: true } });
    if (!taken) return loginId;
  }
}

// 로그인 칸 글자 → Spring에 보낼 가입 이메일. @가 있으면 그대로, 없으면 아이디로 찾기
export async function toLoginEmail(input: string) {
  const value = input.trim().toLowerCase();
  if (value.includes("@")) return value;
  const user = await prisma.user.findFirst({
    where: { loginId: value },
    select: { email: true },
  });
  return user?.email ?? null;
}
