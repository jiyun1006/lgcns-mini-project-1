import Link from "next/link";

type DoneStepProps = { nickname: string; needsApproval: boolean };

export default function DoneStep({ nickname, needsApproval }: DoneStepProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 py-5 text-center">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[32px] text-[#15803D]"
      >
        ✓
      </span>
      <h2 className="text-[22px] font-extrabold">
        {needsApproval ? "가입 신청을 받았어요" : "가입을 마쳤어요"}
      </h2>
      <p className="text-[15px] leading-[1.7] text-[#52525B]">
        {nickname} 님, 환영해요.
        <br />
        {needsApproval ? "관리자가 승인하면 로그인할 수 있어요." : "로그인하고 시작해 볼까요?"}
      </p>
      <Link
        href="/login"
        className="mt-2 rounded-[10px] bg-[#4338CA] px-7 py-3.5 text-[16px] font-bold text-white"
      >
        로그인하러 가기
      </Link>
    </div>
  );
}
