"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import { signOut } from "next-auth/react";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountCard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
            <ShieldCheck className="size-4" />
          </span>
          로그인 관리
        </CardTitle>
        <CardDescription>현재 기기에서 로그아웃합니다</CardDescription>
        <CardAction>
          <MyPageButton type="button" variant="outline" onClick={handleLogout}>
            <LogOut />
            로그아웃
          </MyPageButton>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
