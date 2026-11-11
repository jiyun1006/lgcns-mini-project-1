"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { BoardPost } from "@/types/board";
import { mockPosts, mockComments } from "@/lib/board/mock-data";
import { parsePosts, STORAGE_KEY, commentCount } from "@/lib/board/logic";

type BoardState = {
  posts: BoardPost[];
  commit: (change: (posts: BoardPost[]) => BoardPost[]) => boolean;
  notify: (message: string) => void;
};

const Context = createContext<BoardState | null>(null);

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useBoard() {
  const value = useContext(Context);
  if (!value) throw new Error("BoardProvider가 필요합니다.");
  return value;
}

export default function BoardProvider({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!isClient) {
    return (
      <main className="board-main" role="status">
        게시판을 불러오는 중이에요…
      </main>
    );
  }

  return <ClientBoardProvider>{children}</ClientBoardProvider>;
}

function ClientBoardProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      const posts: BoardPost[] = saved
        ? parsePosts(saved)
        : mockPosts.map((p) => {
            const comments = p.id === "1" ? structuredClone(mockComments) : [];

            return {
              ...p,
              comments,
              commentCount: commentCount(comments),
              liked: false,
            };
          });

      return { posts, error: "" };
    } catch (e) {
      return {
        posts: [] as BoardPost[],
        error: e instanceof Error ? e.message : "저장 데이터를 불러올 수 없어요.",
      };
    }
  });

  const [posts, setPosts] = useState<BoardPost[]>(initial.posts);
  const [notice, setNotice] = useState("");
  const latest = useRef<BoardPost[]>(initial.posts);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  function commit(change: (posts: BoardPost[]) => BoardPost[]) {
    try {
      const next = change(latest.current);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      latest.current = next;
      setPosts(next);

      return true;
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "저장하지 못했어요. 저장 공간을 확인해 주세요.");
      return false;
    }
  }

  if (initial.error) {
    return (
      <main className="board-main">
        <h1>저장 데이터를 확인해 주세요</h1>
        <p role="alert">{initial.error}</p>
        <p>기존 데이터는 덮어쓰지 않았어요. README의 복구 안내를 확인해 주세요.</p>
        <button onClick={() => location.reload()}>다시 시도</button>
      </main>
    );
  }

  return (
    <Context.Provider value={{ posts, commit, notify: setNotice }}>
      {children}

      {notice && (
        <div className="board-toast" role="status">
          {notice}
          <button aria-label="알림 닫기" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
