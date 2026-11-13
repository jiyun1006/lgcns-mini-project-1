import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import BoardProvider from "@/components/board/BoardProvider";
import AuthShell from "@/components/auth/providers/AuthShell";
import "./globals.css";
import "./posts/board.css";
import "@/components/design/tokens.css";
import "@/components/design/skins/board.skin.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat EXAONE",
  description: "EXAONE과 대화하고 AI 프롬프트를 함께 나누는 커뮤니티",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* 글꼴 SUIT: 내려받지 않고 CDN에서 불러온다 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css"
          precedence="default"
        />
        <Suspense
          fallback={
            <div role="status" className="ds-page-loading">
              화면을 불러오는 중이에요…
            </div>
          }
        >
          <AuthShell>
            <BoardProvider>{children}</BoardProvider>
          </AuthShell>
        </Suspense>
      </body>
    </html>
  );
}
