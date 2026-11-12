import type { BoardPost, BoardComment } from "@/types/board";
// TODO: 게시판 Service에서 Prisma 조회 결과를 BoardPost로 변환하여 전달합니다.
export const mockPosts: BoardPost[] = [
  {
    id: "1",
    category: "프롬프트 공유",
    title: "회의록을 액션 아이템 표로 바꿔주는 프롬프트",
    content:
      "매주 회의가 끝나면 회의록에서 할 일을 뽑아 정리하는 데 30분 정도 걸렸어요. 회의록 전체를 붙여 넣고 담당자, 할 일, 마감일을 표로 정리하게 했고, 회의록에 없는 정보는 지어내지 말고 질문으로 되묻게 조건을 걸었어요.",
    prompt:
      '아래 회의록에서 할 일을 뽑아 표로 정리해 줘.\n열은 [담당자 | 할 일 | 마감일 | 근거 문장] 순서로 해 줘.\n회의록에 담당자나 마감일이 없으면 지어내지 말고,\n표 아래에 "확인이 필요한 항목"으로 따로 질문해 줘.\n\n[회의록 붙여 넣기]',
    result:
      "담당자: 민수 / 할 일: 랜딩 페이지 시안 공유 / 마감일: 11월 12일\n\n근거 문장 열을 넣었더니 AI가 지어낸 할 일을 바로 찾아낼 수 있었어요.",
    tags: ["업무자동화", "요약", "회의록"],
    author: "promptkim",
    createdAt: "2026-11-09",
    viewCount: 3412,
    likeCount: 286,
    commentCount: 41,
  },
  {
    id: "2",
    category: "활용 후기",
    title: "GPT로 SQL 쿼리 리뷰 받기: 실패한 세 가지와 고친 방법",
    content:
      "테이블 구조를 안 알려줬더니 엉뚱한 컬럼을 추천했어요. 스키마를 먼저 주는 순서로 바꾼 과정을 정리했어요.",
    prompt: "[테이블 구조]를 참고하여 [SQL]의 개선점을 설명해 줘.",
    result: "테이블 구조를 먼저 제공하니 더 정확한 리뷰를 받을 수 있었어요.",
    tags: ["SQL", "코드리뷰"],
    author: "data_jun",
    createdAt: "2026-11-08",
    viewCount: 2890,
    likeCount: 241,
    commentCount: 33,
  },
  {
    id: "3",
    category: "팁",
    title: '긴 PDF를 요약할 때 "단계별로 읽어줘"가 효과 있던 이유',
    content:
      "한 번에 요약시키면 앞부분만 자세했어요. 장별로 나눠 요약한 뒤 합치는 방식이 더 고르게 나왔어요.",
    prompt: "[문서]를 장별로 나누어 요약해 줘.",
    result: "장별 핵심 내용을 비교하기 편했어요.",
    tags: ["요약", "긴문서"],
    author: "readmore",
    createdAt: "2026-11-07",
    viewCount: 4105,
    likeCount: 198,
    commentCount: 22,
  },
  {
    id: "4",
    category: "모델 비교",
    title: "같은 질문, 세 모델의 기획서 초안 비교",
    content: "같은 프롬프트로 기획서 초안을 받아 구조, 길이, 사실 오류를 나란히 비교했어요.",
    prompt: "[주제]에 관한 기획서 초안을 작성해 줘.",
    result: "모델마다 구성 방식에 차이가 있었어요.",
    tags: ["기획", "비교"],
    author: "pm_sora",
    createdAt: "2026-11-06",
    viewCount: 5230,
    likeCount: 175,
    commentCount: 58,
  },
];
export const mockComments: BoardComment[] = [
  {
    id: "c1",
    author: "data_jun",
    content: "근거 문장 열 넣는 아이디어 좋네요. 회의록이 길면 나눠 넣으시나요?",
    replies: [
      {
        id: "r1",
        author: "promptkim",
        content: "네, 안건별로 끊어서 넣고 마지막에 표만 합쳐 달라고 해요.",
        replies: [],
      },
    ],
  },
];
export function findMockPost(id: string) {
  return mockPosts.find((post) => post.id === id);
}

mockPosts.push(
  {
    id: "5",
    category: "프롬프트 공유",
    title: "자기소개서 첨삭 프롬프트: 과장 표현만 골라내기",
    content: "문장을 새로 쓰는 대신 과장되거나 근거 없는 표현만 표시하고 이유를 달게 했어요.",
    prompt: "[자기소개서]에서 과장된 표현을 찾아 이유와 확인 질문을 적어 줘.",
    result: "사실과 근거를 점검하기 편했어요.",
    tags: ["자기소개서", "첨삭"],
    author: "careerlab",
    createdAt: "2026-11-05",
    viewCount: 2675,
    likeCount: 152,
    commentCount: 0,
  },
  {
    id: "6",
    category: "프롬프트 공유",
    title: "영어 이메일 톤 조절 프롬프트 (정중함 3단계)",
    content: "같은 내용을 가볍게, 기본, 아주 정중하게 세 가지 버전으로 받아 골라 쓰는 방법이에요.",
    prompt: "[이메일]을 정중함 3단계의 영어로 작성해 줘.",
    result: "상대방에 맞게 고를 수 있었어요.",
    tags: ["이메일", "영어"],
    author: "mailpro",
    createdAt: "2026-11-04",
    viewCount: 1840,
    likeCount: 133,
    commentCount: 0,
  },
  {
    id: "7",
    category: "활용 후기",
    title: "데이터 분석 과제에서 코드 대신 해설만 받는 방법",
    content: "정답 코드 대신 원리와 힌트만 주도록 조건을 걸었어요.",
    prompt: "[문제]의 정답 코드를 주지 말고 개념과 힌트만 알려 줘.",
    result: "직접 풀면서 이해할 수 있었어요.",
    tags: ["공부법", "파이썬"],
    author: "study_hye",
    createdAt: "2026-11-03",
    viewCount: 2210,
    likeCount: 120,
    commentCount: 0,
  },
  {
    id: "8",
    category: "질문",
    title: "시스템 프롬프트에 역할을 너무 길게 쓰면 생기는 일",
    content: "역할 설명을 길게 넣었더니 답변이 오히려 짧아졌어요. 왜 그런지 아시는 분 있나요?",
    prompt: "",
    result: "",
    tags: ["시스템프롬프트"],
    author: "newbie_dev",
    createdAt: "2026-11-10",
    viewCount: 980,
    likeCount: 64,
    commentCount: 0,
  },
);
mockPosts[0].result =
  "| 담당자 | 할 일 | 마감일 | 근거 문장 |\n| --- | --- | --- | --- |\n| 민수 | 랜딩 페이지 시안 공유 | 11/12 | 수요일까지 시안 올릴게요 |\n| 미정 | 사용자 인터뷰 일정 잡기 | 미정 | 인터뷰도 해야 할 것 같아요 |\n\n근거 문장 열을 넣었더니 AI가 지어낸 할 일을 바로 찾아낼 수 있었어요.";
