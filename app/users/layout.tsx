import type { ReactNode } from "react";
import BoardHeader from "@/components/board/BoardHeader";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BoardHeader />
      {children}
    </>
  );
}
