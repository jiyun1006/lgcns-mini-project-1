import type { ReactNode } from "react";
import SiteHeader from "@/components/design/organisms/SiteHeader";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
