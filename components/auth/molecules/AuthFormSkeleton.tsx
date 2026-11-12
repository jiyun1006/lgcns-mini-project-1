import "@/components/design/skins/auth.css";

export default function AuthFormSkeleton() {
  return (
    <div role="status" aria-label="불러오는 중" className="ds-auth-card animate-pulse">
      <div className="mx-auto h-7 w-24 rounded bg-(--ds-line)" />
      <div className="h-12 rounded-[10px] bg-(--ds-surface-2)" />
      <div className="h-12 rounded-[10px] bg-(--ds-surface-2)" />
      <div className="h-12.5 rounded-[10px] bg-(--ds-line)" />
    </div>
  );
}
