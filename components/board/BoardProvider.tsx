"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { BoardPost } from "@/types/board";
import type { PostInput } from "@/lib/board/logic";
import LoginRequiredNotice from "@/components/auth/molecules/LoginRequiredNotice";
import { useAuth } from "@/components/auth/providers/AuthProvider";

type User = {
  id: string;
  name: string;
};

type Action =
  | {
      action: "createPost";
      values: PostInput;
    }
  | {
      action: "updatePost";
      postId: string;
      values: PostInput;
    }
  | {
      action: "deletePost" | "viewPost";
      postId: string;
    }
  | {
      action: "setLike";
      postId: string;
      liked: boolean;
    }
  | {
      action: "addComment";
      postId: string;
      content: string;
      parentId?: string;
    }
  | {
      action: "editComment";
      postId: string;
      commentId: string;
      content: string;
    }
  | {
      action: "deleteComment";
      postId: string;
      commentId: string;
    };

type State = {
  posts: BoardPost[];
  user: User | null;
  busy: boolean;
  mutate: (action: Action) => Promise<string | null>;
  notify: (message: string) => void;
};

async function fetchBoard() {
  const response = await fetch("/api/board", {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "게시판 조회 실패");
  }

  return data as {
    posts: BoardPost[];
    user: User;
  };
}

const Context = createContext<State | null>(null);

export function useBoard() {
  const state = useContext(Context);

  if (!state) {
    throw new Error("BoardProvider가 필요합니다.");
  }

  return state;
}

export default function BoardProvider({ children }: { children: ReactNode }) {
  const path = usePathname();

  const isBoard = path === "/posts" || path.startsWith("/posts/");
  const { isLoggedIn } = useAuth();

  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    const data = await fetchBoard();

    setPosts(data.posts);
    setUser(data.user);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "게시판 조회 실패");
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!isBoard || !isLoggedIn) return;

    let active = true;

    void fetchBoard()
      .then((data) => {
        if (!active) return;

        setPosts(data.posts);
        setUser(data.user);
        setError("");
      })
      .catch((error: unknown) => {
        if (!active) return;

        setError(error instanceof Error ? error.message : "게시판 조회 실패");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isBoard, isLoggedIn]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 5000);

    return () => clearTimeout(timer);
  }, [notice]);

  const mutate = useCallback(
    async (action: Action) => {
      if (inFlight.current) {
        setNotice("이전 요청 처리 후 다시 시도해 주세요.");
        return null;
      }

      inFlight.current = true;
      setBusy(true);

      try {
        const response = await fetch("/api/board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(action),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "저장 실패");
        }

        try {
          await refresh();
          setError("");
        } catch {
          setError("DB 저장은 완료됐지만 화면 갱신에 실패했습니다. 다시 불러와 주세요.");
        }

        return data.postId as string;
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "저장하지 못했어요.");

        return null;
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [refresh],
  );

  let content = children;

  if (isBoard && !isLoggedIn) {
    content = (
      <main className="board-main">
        <LoginRequiredNotice message="로그인하고 게시판을 이용해 보세요." />
      </main>
    );
  } else if (isBoard && loading) {
    content = (
      <main className="board-main" role="status">
        DB에서 게시글을 불러오는 중이에요…
      </main>
    );
  } else if (isBoard && error) {
    content = (
      <main className="board-main">
        <h1>게시판 연결 확인</h1>
        <p role="alert">{error}</p>

        <button onClick={() => void load()}>다시 불러오기</button>
      </main>
    );
  }

  return (
    <Context.Provider
      value={{
        posts,
        user,
        busy,
        mutate,
        notify: setNotice,
      }}
    >
      {content}

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
