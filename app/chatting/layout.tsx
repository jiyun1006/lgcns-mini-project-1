import type { ReactNode } from "react";
import SiteHeader from "@/components/design/organisms/SiteHeader";

export default function ChattingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="shrink-0">
        <SiteHeader />
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
