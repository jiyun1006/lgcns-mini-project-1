import PasswordChangeCard from "@/components/mypage/organisms/PasswordChangeCard";
import ProfileInfoCard from "@/components/mypage/organisms/ProfileInfoCard";
import type { MyPageUser } from "@/types/mypage";

export default function MyPageTemplate({ user }: { user: MyPageUser }) {
  return (
    <div className="flex-1 bg-[#f3f4f6] px-4 py-8 text-[#222]">
      <div className="mx-auto grid max-w-2xl gap-6">
        <h1 className="text-xl font-bold">마이페이지</h1>
        <ProfileInfoCard user={user} />
        <PasswordChangeCard />
      </div>
    </div>
  );
}
