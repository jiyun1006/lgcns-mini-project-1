// 기존 User에 loginId를 채운다. 이메일 앞부분 기반, 겹치면 숫자를 붙임. 한 번만 실행.
// 실행: node --env-file=.env scripts/backfill-login-id.mjs  (--dry-run 을 붙이면 DB에 쓰지 않고 결과만 출력)
import { PrismaClient } from "@prisma/client";

const dryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

const toBase = (email) =>
  email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20) || "user";

const users = await prisma.user.findMany({
  where: { OR: [{ loginId: { isSet: false } }, { loginId: null }] },
  select: { id: true, email: true },
});
const taken = new Set(
  (
    await prisma.user.findMany({ where: { loginId: { not: null } }, select: { loginId: true } })
  ).map((u) => u.loginId),
);

for (const user of users) {
  const base = toBase(user.email);
  let loginId = base;
  for (let n = 2; taken.has(loginId); n++) loginId = `${base}${n}`;
  taken.add(loginId);
  if (!dryRun) await prisma.user.update({ where: { id: user.id }, data: { loginId } });
  console.log(`${user.email} -> ${loginId}`);
}

console.log(`${dryRun ? "[dry-run] " : ""}완료: ${users.length}명`);
await prisma.$disconnect();
