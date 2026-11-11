"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { UserX } from "lucide-react";
import { MyPageButton, buttonVariants } from "@/components/mypage/atoms/MyPageButton";
import FormField from "@/components/mypage/molecules/FormField";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CONFIRM_TEXT = "탈퇴";

export default function WithdrawCard() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");

  const handleWithdraw = () => {
    // shortcut: 실제 탈퇴(유저 삭제·재가입 제한 기록)는 인증·정책 확정 후 구현
    router.replace("/login");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <UserX className="size-4" />
          </span>
          회원탈퇴
        </CardTitle>
        <CardDescription>계정과 활동 정보를 삭제합니다</CardDescription>
        <CardAction>
          <AlertDialog.Root onOpenChange={(open) => !open && setConfirmText("")}>
            <AlertDialog.Trigger className={buttonVariants({ variant: "destructive" })}>
              회원탈퇴
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Backdrop className="fixed inset-0 bg-black/40" />
              <AlertDialog.Popup className="fixed top-1/2 left-1/2 grid w-[min(24rem,calc(100vw-2rem))] -translate-1/2 gap-4 rounded-xl bg-background p-5 text-[#222] shadow-lg outline-none">
                <AlertDialog.Title className="text-base font-bold">
                  정말 탈퇴할까요?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-stone-600">
                  탈퇴 후 3개월간 같은 이메일로 재가입할 수 없어요. 계속하려면 아래에 &quot;
                  {CONFIRM_TEXT}&quot;를 입력해 주세요.
                </AlertDialog.Description>
                <FormField
                  id="withdrawConfirm"
                  label={`확인 문구 입력 (${CONFIRM_TEXT})`}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                />
                <div className="flex justify-end gap-2">
                  <AlertDialog.Close className={buttonVariants({ variant: "outline" })}>
                    취소
                  </AlertDialog.Close>
                  <MyPageButton
                    type="button"
                    variant="destructive"
                    disabled={confirmText.trim() !== CONFIRM_TEXT}
                    onClick={handleWithdraw}
                  >
                    탈퇴하기
                  </MyPageButton>
                </div>
              </AlertDialog.Popup>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
