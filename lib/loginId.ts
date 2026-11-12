import { prisma } from "@/lib/prisma";

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

export async function toLoginEmail(input: string) {
  const value = input.trim().toLowerCase();
  if (value.includes("@")) return value;
  const user = await prisma.user.findFirst({
    where: { loginId: value },
    select: { email: true },
  });
  return user?.email ?? null;
}
