import type { ReactNode } from "react";
import SiteHeader from "@/components/design/organisms/SiteHeader";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
