import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/mypage/atoms/MyPageButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function PublicProfile({ params }: { params: PageProps<"/users/[loginId]">["params"] }) {
  const { loginId } = await params;
  const user = await prisma.user.findFirst({
    where: { loginId },
    select: {
      name: true,
      loginId: true,
      email: true,
      bio: true,
      interests: true,
      profileImageUrl: true,
      isProfilePublic: true,
      showEmail: true,
      showInterests: true,
    },
  });
  if (!user) notFound();

  const isPublic = user.isProfilePublic ?? true;
  const showEmail = isPublic && (user.showEmail ?? false); // 마이페이지와 같은 기본값: 이메일은 비공개
  const showIntro = isPublic && (user.showInterests ?? true);

  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {isPublic && user.profileImageUrl && (
              <AvatarImage src={user.profileImageUrl} alt={`${user.name} 프로필 사진`} />
            )}
            <AvatarFallback className="text-2xl">{user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="grid">
            <h1 className="text-lg font-bold text-stone-900">{user.name}</h1>
            <span className="text-sm text-stone-500">@{user.loginId}</span>
          </div>
        </div>
        {!isPublic ? (
          <p className="text-sm text-stone-500">비공개 프로필입니다.</p>
        ) : (
          <dl className="grid gap-3">
            {showEmail && (
              <div className="grid gap-1">
                <dt className="text-xs font-medium text-stone-500">이메일</dt>
                <dd className="text-sm text-stone-900">{user.email}</dd>
              </div>
            )}
            {showIntro && (
              <>
                <div className="grid gap-1">
                  <dt className="text-xs font-medium text-stone-500">자기소개</dt>
                  <dd className="text-sm whitespace-pre-line text-stone-900">
                    {user.bio || "자기소개가 없습니다."}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="text-xs font-medium text-stone-500">관심사</dt>
                  <dd>
                    {user.interests.length ? (
                      <ul className="flex flex-wrap gap-2">
                        {user.interests.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full bg-board-accent-soft px-3 py-0.5 text-sm text-board-accent"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-stone-500">관심사가 없습니다.</span>
                    )}
                  </dd>
                </div>
              </>
            )}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

export default function UserProfilePage({ params }: PageProps<"/users/[loginId]">) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 bg-[#f3f4f6] px-4 py-8 text-[#222]">
        <div className="mx-auto grid max-w-2xl gap-6">
          <Link
            href="/users"
            className={buttonVariants({ variant: "outline", className: "justify-self-start" })}
          >
            <Search aria-hidden />
            유저 검색
          </Link>
          <Suspense>
            <PublicProfile params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
