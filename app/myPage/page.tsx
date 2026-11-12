import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import MyPageTemplate from "@/components/mypage/templates/MyPageTemplate";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

async function MyPageContent() {
  await connection(); // 프리렌더 때 고정되지 않고 요청마다 DB를 조회하게 한다
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { profileImageUrl } = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { profileImageUrl: true },
  });
  return (
    <MyPageTemplate
      user={{
        nickname: user.name,
        loginId: user.loginId ?? "",
        email: user.email,
        recoveryEmail: user.recoveryEmail ?? "",
        profileImageUrl,
        bio: user.bio ?? "",
        interests: user.interests,
        isProfilePublic: user.isProfilePublic ?? true,
        showEmail: user.showEmail ?? false, // 이메일은 본인이 켜기 전까지 비공개
        showInterests: user.showInterests ?? true,
      }}
    />
  );
}

export default function myPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense>
        <MyPageContent />
      </Suspense>
      {/*section 내 프로필 기본 정보 (미구현)
    외부 프로필 링크 URL 입력 추가 버튼 추가되면 direction할 수 있도록
    */}
      {/* section
    연결 계정 (미구현)
    연결된 소셜 계정 관리
    카카오, 구글 뭘로 연결되어있는지 확인만
    */}
    </main>
  );
}
