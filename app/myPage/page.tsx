import { Suspense } from "react";
import { connection } from "next/server";
import MyPageTemplate from "@/components/mypage/templates/MyPageTemplate";
import { getCurrentUser } from "@/lib/current-user";

async function MyPageContent() {
  await connection(); // 프리렌더 때 고정되지 않고 요청마다 DB를 조회하게 한다
  const user = await getCurrentUser();
  return (
    <MyPageTemplate
      user={{
        nickname: user.name,
        loginId: user.loginId ?? "",
        email: user.email,
        profileImageUrl: user.profileImageUrl,
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
    관심사 자기 한마디 내용 저장 왼쪽 칸
    관심사 작성 (텍스트 75자 미만)
    자기 한마디 작성 (텍스트 150자 미만)

    자기 정보 비공개 기능 오른쪽 칸
    토글로 껐다 키기
    이메일 및 외부 링크 공개 여부 체크박스
    관심사 및 자기 한마디 공개 여부 체크박스
    */}
      {/* section
    연결 계정 (미구현)
    연결된 소셜 계정 관리
    카카오, 구글 뭘로 연결되어있는지 확인만
    */}
      {/* 
    회원탈퇴 버튼 (미구현)
    */}
    </main>
  );
}
