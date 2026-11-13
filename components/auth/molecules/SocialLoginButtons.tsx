import Button from "@/components/auth/atoms/Button";

export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-[13px] text-(--ds-ink-2)">
        <span className="h-px flex-1 bg-(--ds-line)" />
        간편로그인
        <span className="h-px flex-1 bg-(--ds-line)" />
      </div>
      <Button variant="secondary" fullWidth disabled>
        구글 로그인
      </Button>
      <Button variant="secondary" fullWidth disabled>
        카카오 로그인
      </Button>
      <span className="text-Center text-[12px] text-(--ds-ink-2)">간편로그인 준비중</span>
    </div>
  );
}
