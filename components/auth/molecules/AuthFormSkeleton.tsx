export default function AuthFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="불러오는 중"
      className="flex w-full max-w-[420px] animate-pulse flex-col gap-[18px] rounded-2xl border border-[#E4E4E7] bg-white px-8 py-9"
    >
      <div className="mx-auto h-7 w-24 rounded bg-[#E4E4E7]" />
      <div className="h-12 rounded-[10px] bg-[#F4F4F5]" />
      <div className="h-12 rounded-[10px] bg-[#F4F4F5]" />
      <div className="h-[50px] rounded-[10px] bg-[#E4E4E7]" />
    </div>
  );
}
