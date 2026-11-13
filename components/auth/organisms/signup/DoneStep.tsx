import Link from "next/link";
import { Check } from "lucide-react";

import { CONTINUE_PATH } from "@/lib/returnTo";

type DoneStepProps = { nickname: string; needsApproval: boolean };

const buttonClass =
  "flex h-12.5 w-full items-center justify-center rounded-[10px] bg-(--ds-primary) text-[16px] font-bold text-white hover:bg-(--ds-primary-strong) max-sm:h-13.5";

export default function DoneStep({ nickname, needsApproval }: DoneStepProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 pt-12 pb-2 text-center">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-(--ds-ok)"
      >
        <Check size={30} strokeWidth={2.4} />
      </span>
      <h2 className="text-[22px] font-extrabold">
        {needsApproval ? "가입 신청을 받았어요" : "가입을 마쳤어요"}
      </h2>
      <p className="text-[15px] leading-[1.7] text-(--ds-ink-2)">
        {nickname} 님, 환영해요.
        <br />
        {needsApproval
          ? "관리자가 승인하면 로그인할 수 있어요."
          : "가입 전에 보던 페이지로 돌아갈게요."}
      </p>
    </div>
  );
}

// 가입 완료 버튼: SignupForm 아래 고정 칸에 놓아 이전 · 다음 버튼과 같은 자리에 오게 한다
export function DoneStepAction({ needsApproval }: { needsApproval: boolean }) {
  return needsApproval ? (
    <Link href="/login" className={buttonClass}>
      로그인 화면으로
    </Link>
  ) : (
    <a href={CONTINUE_PATH} className={buttonClass}>
      시작하기
    </a>
  );
}
