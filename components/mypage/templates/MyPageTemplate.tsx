import { House } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/mypage/atoms/MyPageButton";
import AccountCard from "@/components/mypage/organisms/AccountCard";
import PasswordChangeCard from "@/components/mypage/organisms/PasswordChangeCard";
import ProfileInfoCard from "@/components/mypage/organisms/ProfileInfoCard";
import type { MyPageUser } from "@/types/mypage";

export default function MyPageTemplate({ user }: { user: MyPageUser }) {
  return (
    <div className="flex-1 bg-[#f3f4f6] px-4 py-8 text-[#222]">
      <div className="mx-auto grid max-w-2xl gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">마이페이지</h1>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            <House aria-hidden />
            홈으로
          </Link>
        </div>
        <ProfileInfoCard user={user} />
        <PasswordChangeCard />
        <AccountCard />
      </div>
    </div>
  );
}
