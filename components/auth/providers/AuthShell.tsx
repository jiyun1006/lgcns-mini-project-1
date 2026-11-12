import { connection } from "next/server";
import { AuthProvider } from "@/components/auth/providers/AuthProvider";
import { getServerSession } from "next-auth";
import { verifyAccessToken } from "@/lib/accessJwt";
import { authOptions } from "@/lib/authOptions";
import { getCurrentUser } from "@/lib/current-user";

export default async function AuthShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? "";
  const verified = accessToken ? await verifyAccessToken(accessToken) : null;
  // 헤더 동그라미에 보일 이름 : 마이페이지에서 바꾼 닉네임이 바로 보이게 Mongo에서 읽어요
  const user = verified ? await getCurrentUser() : null;

  return (
    <AuthProvider accessToken={verified ? accessToken : null} name={user?.name ?? null}>
      {children}
    </AuthProvider>
  );
}
