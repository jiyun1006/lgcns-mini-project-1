"use client";

import Link from "next/link";
import { Tabs } from "@base-ui/react/tabs";
import { History } from "lucide-react";
import { useBoard } from "@/components/board/BoardProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectActivity } from "@/lib/mypage/activity";

export default function ActivityCard() {
  const { posts, user } = useBoard();
  const activity = selectActivity(posts, user?.name ?? "", user?.id);
  const tabs = [
    {
      value: "posts",
      label: "내가 쓴 글",
      empty: "아직 작성한 글이 없어요.",
      items: activity.posts.map((p) => ({
        key: p.id,
        href: p.id,
        title: p.title,
        meta: p.category,
      })),
    },
    {
      value: "comments",
      label: "내 댓글",
      empty: "아직 작성한 댓글이 없어요.",
      items: activity.comments.map(({ post, comment }) => ({
        key: comment.id,
        href: post.id,
        title: comment.content,
        meta: `${post.title}에 남긴 댓글`,
      })),
    },
    {
      value: "liked",
      label: "좋아요한 글",
      empty: "좋아요한 글이 없어요.",
      items: activity.liked.map((p) => ({ key: p.id, href: p.id, title: p.title, meta: p.author })),
    },
    {
      value: "popular",
      label: "내 인기글",
      empty: "아직 작성한 글이 없어요.",
      items: activity.popular.map((p) => ({
        key: p.id,
        href: p.id,
        title: p.title,
        meta: `좋아요 ${p.likeCount} · 조회 ${p.viewCount}`,
      })),
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
            <History className="size-4" />
          </span>
          내 활동
        </CardTitle>
        <CardDescription>게시판에서 작성하고 좋아요한 내역을 모아봅니다</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs.Root defaultValue="posts">
          <Tabs.List className="flex flex-wrap gap-1 border-b pb-2">
            {tabs.map((t) => (
              <Tabs.Tab
                key={t.value}
                value={t.value}
                className="rounded-lg px-2.5 py-1 text-sm text-stone-500 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[active]:bg-board-accent-soft data-[active]:font-bold data-[active]:text-board-accent"
              >
                {t.label} {t.items.length}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {tabs.map((t) => (
            <Tabs.Panel key={t.value} value={t.value} className="pt-3 outline-none">
              {t.items.length ? (
                <ul className="grid gap-1">
                  {t.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={`/posts/${item.href}`}
                        className="grid rounded-lg px-2 py-1.5 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        <span className="truncate text-sm font-medium">{item.title}</span>
                        <span className="truncate text-xs text-stone-500">{item.meta}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-stone-500">{t.empty}</p>
              )}
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </CardContent>
    </Card>
  );
}
