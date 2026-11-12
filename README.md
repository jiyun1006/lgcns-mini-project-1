<div align="center">


# Chat EXAONE

**K-EXAONE 2.5를 활용한 AI 채팅 · 커뮤니티 서비스**

LG CNS AM Inspire Camp 7기 미니프로젝트 (8명 · 4일)

<a href="https://lgcns-mini-project-1.vercel.app">
  <img src="https://img.shields.io/badge/Live%20Demo-Chat%20EXAONE-4938d1?style=for-the-badge&logo=vercel&logoColor=white" alt="Chat EXAONE 바로가기" />
</a>

</div>

## 팀원

| 파트 | 팀원 | 브랜치 | 담당 범위 |
| --- | --- | --- | --- |
| 인증 | 오동현, 이지혜 | [`part/auth`](https://github.com/lgcns-mjp1-team/lgcns-mini-project-1/tree/part/auth) | 회원가입, 로그인, 아이디·비밀번호 찾기, 마이페이지 |
| 채팅 | 김지윤, 허진우 | [`part/chat`](https://github.com/lgcns-mjp1-team/lgcns-mini-project-1/tree/part/chat) | 채팅 UI, 메시지 전송 API, EXAONE 연동, 대화방 관리 |
| 포스트 | 김유진, 방경호, 배상아, 안승찬 | [`part/post`](https://github.com/lgcns-mjp1-team/lgcns-mini-project-1/tree/part/post) | 게시글 작성·수정·삭제, 검색·필터·정렬, 댓글·답글, 좋아요 |

## 서비스 소개

| 기능 | 경로 | 설명 |
| --- | --- | --- |
| AI 채팅 | `/chatting` | K-EXAONE 2.5와 대화, 답변 실시간 스트리밍, 대화 저장·수정·삭제 |
| 커뮤니티 | `/posts` | 게시글 작성·수정·삭제, 댓글·답글, 좋아요 |
| 마이페이지 | `/myPage` | 프로필·계정 설정 변경, 내 활동 모아보기 |
| 인증 | `/login`, `/signup` 등 | 가입, 로그인, 아이디·비밀번호 찾기 |

- `/` 로 접속하면 `/chatting`으로 이동합니다.
- 질문 전송과 게시글 작성·수정은 **로그인이 필요**합니다.

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | ![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| Style | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white) |
| DB | ![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat-square&logo=prisma&logoColor=white) |
| Auth | ![NextAuth](https://img.shields.io/badge/NextAuth-4938d1?style=flat-square) ![Spring](https://img.shields.io/badge/Spring_회원_API-6DB33F?style=flat-square&logo=spring&logoColor=white) |
| AI | ![K-EXAONE](https://img.shields.io/badge/K--EXAONE_2.5-A50034?style=flat-square) ![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=flat-square&logo=vercel&logoColor=white) |
| 배포 | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |
| 협업 | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |

## 시작하기

```bash
git clone https://github.com/lgcns-mjp1-team/lgcns-mini-project-1.git
cd lgcns-mini-project-1
npm install
cp .env.example .env    # 실제 값은 팀 채널에서 받아서 채우기
npx prisma generate
npm run dev
```

- 프로젝트를 열면 뜨는 **추천 확장(Prettier, ESLint) 설치** 알림에서 Install을 눌러주세요.
- 저장하면 자동으로 포맷되고, 커밋할 때 lint-staged가 한 번 더 검사합니다.
- **`git pull` 뒤에 `prisma/schema.prisma`가 바뀌었다면** `npx prisma generate`를 다시 실행하세요. 안 하면 타입 에러(예: `recoveryEmail does not exist`)가 납니다.

### 환경변수 (`.env`)

| 키 | 설명 |
| --- | --- |
| `DATABASE_URL` | MongoDB Atlas 연결 주소 (DB 이름 `mjp1` 포함) |
| `EXAONE_API_KEY` | EXAONE API 키 (**서버 코드에서만 사용, 브라우저 노출 금지**) |
| `NEXTAUTH_SECRET` | 로그인 세션·토큰 서명용 비밀 값 |
| `NEXTAUTH_URL` | 로컬은 `http://localhost:3000`. **Vercel Preview에는 넣지 않습니다** (아래 배포 참고) |
| `NEXT_PUBLIC_API_URL` | Spring 회원 API 주소 (빌드 시점에 값이 고정됨) |

> `.env`는 Git에 올라가지 않습니다. 값은 공개된 곳(채팅방, 이슈, PR)에 붙여 넣지 말고 개인 DM으로 전달하세요.

## 서비스 구조

```
[로그인]
브라우저 → NextAuth → Spring 회원 API 로그인 → 세션 발급
                    → MongoDB 사용자 연동 (없으면 생성)

[채팅]
브라우저 → POST /api/chat
   ① 질문 저장 → ② 이전 대화 조회 → ③ EXAONE 호출(스트리밍)
   ④ 답변을 브라우저로 실시간 전송
   ⑤ 서버가 끝까지 생성 후 답변 저장 (연결이 끊겨도 저장됨)
```

### 데이터 모델

```
User ──< Conversation ──< Message (role: USER / ASSISTANT)
User ──< Post ──< Comment ──< Comment (답글, parentId)
User ──< PostLike >── Post
```

| 모델 | 설명 | 주요 필드 |
| --- | --- | --- |
| User | 회원 | `email`(unique), `loginId`(아이디), `name`(닉네임), `recoveryEmail`, `profileImageUrl`, `bio`, `interests`, 공개 설정(`isProfilePublic`, `showEmail`, `showInterests`) |
| Conversation | 대화방 (사이드바 목록 하나) | `title`, `userId`, `updatedAt` |
| Message | 말풍선 하나 (질문 또는 AI 답변) | `role`(USER/ASSISTANT), `content`, `reasoning`, `conversationId` |
| Post | 게시글 | `title`, `content`, `category`, `prompt`, `result`, `tags`, `viewCount`, `authorId` |
| Comment | 댓글·답글 | `content`, `deleted`, `postId`, `authorId`, `parentId`(답글이면 부모 댓글) |
| PostLike | 게시글 좋아요 | `userId`, `postId` (사용자당 게시글 1회) |

- 사용자를 지우면 그 사용자의 대화·게시글·댓글·좋아요도 함께 삭제됩니다. 대화를 지우면 메시지도, 게시글을 지우면 댓글·좋아요도 같이 삭제됩니다.
- `Comment`의 답글 관계는 MongoDB 자기 참조 제약 때문에 삭제 시 연쇄 삭제(`NoAction`)를 쓰지 않아서, 댓글은 `deleted` 플래그로 처리합니다.

## 폴더 구조

```
lgcns-mini-project-1/
├── app/                ← 페이지와 API 라우트 (App Router)
│   ├── (auth)/         ← 로그인, 회원가입, 아이디·비밀번호 찾기
│   ├── chatting/       ← AI 채팅
│   ├── posts/          ← 커뮤니티 게시판
│   ├── myPage/         ← 마이페이지
│   ├── users/          ← 유저 검색·프로필
│   └── api/            ← 서버 API (auth, chat, conversations, board, users)
├── components/         ← 화면 컴포넌트 (auth, chat, board, mypage, ui)
├── actions/            ← Server Actions (가입, 아이디·비밀번호 찾기 등)
├── service/            ← 외부 API 호출 (Spring 회원 API 등)
├── lib/                ← 공용 로직
│   ├── prisma.ts       ← PrismaClient (여기서만 생성)
│   └── ai.ts           ← EXAONE API 호출
├── prisma/             ← DB 스키마 (schema.prisma)
├── types/              ← 공용 타입
├── hooks/              ← 커스텀 훅
├── config/             ← 설정 값 (API 경로 등)
├── docs/               ← 파트별 문서
├── tests/              ← 테스트
└── scripts/            ← 일회성 스크립트
```

## 배포 (Vercel)

배포된 서비스는 맨 위의 **Live Demo** 배지에서 확인할 수 있습니다.

| 브랜치 | 결과 |
| --- | --- |
| `main` | **Production** 배포 (Live Demo가 가리키는 주소) |
| `develop`, `part/*` 등 | 푸시할 때마다 **Preview** 배포가 자동 생성 |

- 확인용으로는 **브랜치 주소**(항상 해당 브랜치의 최신 배포)를 씁니다. 주소에 해시가 붙은 **배포별 주소**는 그 배포 하나에 고정돼 있어 최신이 아닐 수 있습니다.
- **배포는 만들어진 시점의 스냅샷**입니다. 환경 변수를 바꿔도 이미 만든 배포에는 반영되지 않으니, 새로 푸시하거나 **최신 배포를** Redeploy 하세요. Error 난 옛 배포를 Redeploy 하면 같은 에러가 반복됩니다.
- Vercel 환경 변수에서 `NEXTAUTH_URL`은 **Production에만** 운영 도메인으로 지정하고, Preview에는 넣지 않습니다.
- 배포 대시보드와 서버 로그는 계정 소유자만 볼 수 있습니다. 에러가 나면 **어떤 동작을 했는지와 화면 캡처, 브라우저 Network 탭의 실패한 요청**을 공유해주세요.
- 모든 배포가 **같은 DB를 공유**합니다. 테스트 계정 이름에 `test`를 붙이고, 남의 데이터는 건드리지 않습니다.

## 브랜치 전략

```
main        ← 발표·배포용 (직접 push 금지)
 └ develop  ← 기본 브랜치, PR로만 머지
    ├ part/auth      ← 파트 작업은 part/파트이름
    ├ part/chat
    ├ part/post
    ├ part/mypage
    └ fix/scroll-bug  ← 그 외 작업은 타입/설명
```

- 브랜치 이름
  - 파트 작업: `part/파트이름` (예: `part/chat`)
  - 그 외 작업: `타입/설명` (예: `fix/scroll-bug`, `refactor/message-list`)
- 작업 시작 전 항상 **최신 develop**에서 브랜치를 따주세요.
- 작업 중에도 **develop이 바뀌었으면 `git pull origin develop`으로 합치세요.** 오래 방치된 브랜치는 PR에서 빌드가 깨집니다(`develop`의 변경을 못 받아서).

```bash
git checkout develop
git pull
git checkout -b part/chat
# 작업 후
git push -u origin part/chat
```

## 작업 흐름

1. develop에서 브랜치 생성 → 작업 → push
2. develop으로 **PR** 생성
3. 리뷰 승인 후 머지

## PR 양식

PR을 만들 때 아래 양식을 복사해서 써주세요.

```markdown
## 작업 내용

-

## 스크린샷

화면 변경이 있으면 첨부 (없으면 생략)

## 체크리스트

- [ ] develop 최신 상태를 pull 받고 충돌을 해결했어요
- [ ] `npm run build`가 성공해요

## 리뷰어에게

특히 봐줬으면 하는 부분, 고민한 점 (없으면 생략)
```

## PR 규칙

| PR | 리뷰 | 머지 방식 |
| --- | --- | --- |
| 작업 브랜치 → develop | 팀원 1명 승인 | **Squash and merge** |
| develop → main | 팀장 | **Create a merge commit** |

- PR은 작게 나눠서 올려주세요.
- 충돌은 PR을 올린 사람이 `git pull origin develop`으로 해결합니다.

## 커밋 메시지

**제목 한 줄은 필수, 본문은 "왜 이렇게 했는지" 설명이 필요할 때만** 씁니다.

```
feat: 메시지 전송 API 추가
```

```
fix: 새 메시지 수신 시 스크롤이 안 내려가는 문제 수정

메시지 목록이 렌더링되기 전에 스크롤 이동이 실행되던 문제.
useEffect 의존성에 messages를 추가해서 렌더링 후 이동하도록 변경.
```

| 타입 | 의미 |
| --- | --- |
| feat | 새 기능 |
| fix | 버그 수정 |
| refactor | 기능 변화 없는 코드 개선 |
| style | 포맷, 세미콜론 등 (동작 변화 없음) |
| docs | 문서 수정 |
| chore | 설정, 패키지 등 기타 |

- 제목은 `타입: 내용`, 50자 이내, 마침표 없이
- 본문은 제목과 한 줄 띄우고 작성 (`git commit`만 치면 에디터가 열려서 여러 줄을 쓸 수 있어요)

## 팀 규칙

- **DB 접근은 `lib/prisma.ts`의 `prisma`만** import해서 사용합니다. (`new PrismaClient()` 직접 생성 금지)
- **EXAONE 호출은 `lib/ai.ts`를 통해서만** 합니다. API 키가 브라우저 코드에 들어가지 않게 주의해주세요.
- **`getCurrentUser()`는 로그인 안 했으면 `null`을 돌려줍니다.** 호출 직후 항상 `if (!user)`를 처리하세요. (API는 401, 페이지는 `/login`으로 이동)
- **푸시 전에 `npm run build`로 확인하세요.** `npm run dev`는 타입 에러가 있어도 돌아가고, 빌드(Vercel)에서만 막힙니다.
- **패키지 설치는 공유 후** 진행해주세요. 버전을 명시해서 설치하고 `package-lock.json`은 꼭 같이 커밋합니다.
