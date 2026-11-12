import { Suspense } from "react";
import Form from "next/form";
import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import { buttonVariants, MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

const MAX_QUERY_LENGTH = 20;
const MAX_RESULTS = 20;

async function SearchResults({
  searchParams,
}: {
  searchParams: PageProps<"/users">["searchParams"];
}) {
  const { q: raw } = await searchParams;
  const q = typeof raw === "string" ? raw.trim().slice(0, MAX_QUERY_LENGTH) : "";
  // MongoDB에서 insensitive contains는 정규식으로 바뀌므로 특수문자를 글자 그대로 찾게 이스케이프한다
  const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 목록에는 이름·아이디만 읽는다(사진·비밀번호 등은 select하지 않음)
  const users = q
    ? await prisma.user.findMany({
        where: {
          loginId: { isSet: true, not: null },
          OR: [
            { name: { contains: pattern, mode: "insensitive" } },
            { loginId: { contains: pattern, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, loginId: true },
        orderBy: { name: "asc" },
        take: MAX_RESULTS,
      })
    : [];

  return (
    <>
      <Form action="/users" className="flex gap-2" role="search">
        <Input
          name="q"
          defaultValue={q}
          maxLength={MAX_QUERY_LENGTH}
          aria-label="닉네임 또는 아이디"
          placeholder="닉네임 또는 아이디로 검색"
          className="bg-white"
        />
        <MyPageButton type="submit">
          <Search />
          검색
        </MyPageButton>
      </Form>
      {q && (
        <Card>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-stone-500">검색 결과가 없습니다.</p>
            ) : (
              <ul className="grid gap-1">
                {users.map(
                  (user) =>
                    user.loginId && (
                      <li key={user.id}>
                        <Link
                          href={`/users/${encodeURIComponent(user.loginId)}`}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                        >
                          <Avatar>
                            <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="grid">
                            <span className="text-sm font-medium text-stone-900">{user.name}</span>
                            <span className="text-xs text-stone-500">@{user.loginId}</span>
                          </span>
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function UsersPage({ searchParams }: PageProps<"/users">) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 bg-[#f3f4f6] px-4 py-8 text-[#222]">
        <div className="mx-auto grid max-w-2xl gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">유저 검색</h1>
            <Link href="/myPage" className={buttonVariants({ variant: "outline" })}>
              <UserRound aria-hidden />
              마이페이지
            </Link>
          </div>
          <Suspense>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
