"use server";

import { maskEmail, maskLoginId } from "@/lib/mask";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/validation/auth";

export type FindIdState = {
  error?: string;
  searched?: boolean;
  results?: { loginId: string; email: string }[];
};

export async function findIdAction(_prev: FindIdState, formData: FormData): Promise<FindIdState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  const error = validateEmail(email);
  if (error) return { error };

  const users = await prisma.user.findMany({
    where: { OR: [{ email }, { recoveryEmail: email }] },
    select: { loginId: true, email: true },
    take: 5,
  });

  return {
    searched: true,
    results: users.map((user) => ({
      loginId: user.loginId ? maskLoginId(user.loginId) : "(아이디 없음 · 이메일로 로그인해요)",
      email: maskEmail(user.email),
    })),
  };
}
