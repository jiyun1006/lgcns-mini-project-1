import { connection } from "next/server";
import { AuthProvider } from "@/components/auth/providers/AuthProvider";
import { getServerSession } from "next-auth";
import { verifyAccessToken } from "@/lib/accessJwt";
import { authOptions } from "@/lib/authOptions";
import { getCurrentUser } from "@/lib/current-user";

// 서버 컴포넌트는 요청마다 한 번 그려져요. 그 요청 시각을 사진 주소의 버전(?v=)으로 써요
function requestVersion() {
  return Date.now();
}

export default async function AuthShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? "";
  const verified = accessToken ? await verifyAccessToken(accessToken) : null;
  // 헤더 동그라미에 보일 이름 : 마이페이지에서 바꾼 닉네임이 바로 보이게 Mongo에서 읽어요
  const user = verified ? await getCurrentUser() : null;

  return (
    <AuthProvider
      accessToken={verified ? accessToken : null}
      name={user?.name ?? null}
      // 헤더 사진 : 주소 끝 ?v= 를 매번 바꿔서 마이페이지에서 바꾼 사진을 새로 받게 해요
      imageUrl={user ? `/api/users/${user.id}/profile-image?v=${requestVersion()}` : null}
    >
      {children}
    </AuthProvider>
  );
}
