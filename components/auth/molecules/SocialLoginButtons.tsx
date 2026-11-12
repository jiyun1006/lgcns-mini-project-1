import Button from "@/components/auth/atoms/Button";

// 소셜 로그인을 붙일 때 진짜 버튼으로 바꾼다
export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
        <span className="h-px flex-1 bg-[#E4E4E7]" />
        간편로그인
        <span className="h-px flex-1 bg-[#E4E4E7]" />
      </div>
      <Button variant="secondary" fullWidth disabled>
        구글 로그인
      </Button>
      <Button variant="secondary" fullWidth disabled>
        카카오 로그인
      </Button>
      <span className="text-Center text-[12px] text-[#52525B]">간편로그인 준비중</span>
    </div>
  );
}
