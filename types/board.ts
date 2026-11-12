export const categories = ["프롬프트 공유", "활용 후기", "팁", "모델 비교", "질문"] as const;

export type Category = (typeof categories)[number];

export interface BoardPost {
  id: string;
  category: Category;
  title: string;
  content: string;
  prompt: string;
  result: string;
  tags: string[];
  author: string;
  authorId?: string;
  authorProfileImageUrl?: string | null;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  comments?: BoardComment[];
  liked?: boolean;
}

export interface BoardComment {
  id: string;
  author: string;
  authorId?: string;
  content: string;
  replies: BoardComment[];
  deleted?: boolean;
}
