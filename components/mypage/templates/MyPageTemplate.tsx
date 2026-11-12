import { Search } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/mypage/atoms/MyPageButton";
import AccountCard from "@/components/mypage/organisms/AccountCard";
import ActivityCard from "@/components/mypage/organisms/ActivityCard";
import IntroCard from "@/components/mypage/organisms/IntroCard";
import PasswordChangeCard from "@/components/mypage/organisms/PasswordChangeCard";
import PrivacyCard from "@/components/mypage/organisms/PrivacyCard";
import ProfileInfoCard from "@/components/mypage/organisms/ProfileInfoCard";
import WithdrawCard from "@/components/mypage/organisms/WithdrawCard";
import type { MyPageUser } from "@/types/mypage";

export default function MyPageTemplate({ user }: { user: MyPageUser }) {
  return (
    <div className="flex-1 bg-(--ds-bg) px-4 py-8 text-(--ds-ink)">
      <div className="mx-auto grid max-w-2xl gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">마이페이지</h1>
          <Link href="/users" className={buttonVariants({ variant: "outline" })}>
            <Search aria-hidden />
            유저 검색
          </Link>
        </div>
        <ProfileInfoCard user={user} />
        <IntroCard bio={user.bio} interests={user.interests} />
        <PrivacyCard
          isProfilePublic={user.isProfilePublic}
          showEmail={user.showEmail}
          showInterests={user.showInterests}
        />
        <ActivityCard />
        <PasswordChangeCard />
        <AccountCard />
        <WithdrawCard />
      </div>
    </div>
  );
}
