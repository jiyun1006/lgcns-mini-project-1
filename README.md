# 미니프로젝트1

> LG CNS AM Inspire Camp 7기 미니프로젝트 (8명 · 4일)
> **K-EXAONE 2.5를 활용한 AI 채팅 서비스**

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js (App Router), TypeScript |
| Style | Tailwind CSS, shadcn/ui |
| DB | MongoDB Atlas + Prisma 6 |
| Auth | NextAuth |
| AI | K-EXAONE 2.5 (EXAONE API) |
| 협업 | GitHub Issues, Projects(Kanban), ESLint, Prettier, husky + lint-staged |

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
- **스키마가 바뀌었다는 공지를 받으면:** `git pull` → `npx prisma generate`

### 환경변수 (`.env`)

| 키 | 설명 |
| --- | --- |
| `DATABASE_URL` | MongoDB Atlas 연결 주소 (DB 이름 `mjp1` 포함) |
| `EXAONE_API_KEY` | EXAONE API 키 (**서버 코드에서만 사용, 브라우저 노출 금지**) |

> 실제 값은 절대 커밋하지 마세요. 키를 추가하면 `.env.example`에도 키 이름을 추가해주세요.

## 서비스 구조

```
[브라우저] 채팅 입력
    ↓
[Next 서버] ① 질문 저장 → ② 이전 대화 조회 → ③ EXAONE API 호출
    ↓
[Next 서버] ④ 답변 받기 → ⑤ 답변 저장
    ↓
[브라우저] 답변 표시
```

### 데이터 모델

```
User ──< Conversation ──< Message
                          (role: USER / ASSISTANT)
```

| 모델 | 설명 |
| --- | --- |
| User | 사용자 |
| Conversation | 대화방 (사이드바 목록 하나) |
| Message | 말풍선 하나 (질문 또는 AI 답변) |

## 파트 구성

| 파트 | 담당 범위 |
| --- | --- |
| 🅰 인증·레이아웃 | 회원가입, 로그인, 보호 페이지, 공통 레이아웃 |
| 🅱 채팅 UI | 메시지 목록, 입력창, 로딩·에러, 마크다운 렌더링 |
| 🅲 채팅 API·AI | 메시지 전송 API, EXAONE 연동, 권한 체크, 에러 처리 |
| 🅳 대화방 관리 | 대화방 목록, `/chat/[conversationId]`, 새 대화, 이름 변경·삭제 |

## 브랜치 전략

```
main        ← 발표·배포용 (직접 push 금지)
 └ develop  ← 기본 브랜치, PR로만 머지
    ├ feat/12-chat-api
    ├ fix/15-scroll-bug
    └ refactor/20-message-list
```

- 브랜치 이름: `타입/이슈번호-설명`
- 작업 시작 전 항상 최신 develop에서 브랜치를 따주세요.

```bash
git checkout develop
git pull
git checkout -b feat/12-chat-api
# 작업 후
git push -u origin feat/12-chat-api
```

## 작업 흐름

1. **이슈 생성** (아래 이슈 양식 사용) → 담당자 지정
2. 보드에서 카드를 **In progress**로 이동
3. develop에서 브랜치 생성 → 작업 → push
4. develop으로 **PR** 생성, 본문에 `closes #이슈번호` → 카드를 **In review**로 이동
5. 리뷰 승인 후 머지 → 이슈 자동 종료, 카드 자동으로 **Done**

## 이슈 양식

이슈를 만들 때 아래 양식을 복사해서 써주세요.

**기능 추가** (제목: `[feat] 작업 이름`, 라벨: `feat`)

```markdown
## 작업 내용
무엇을 만드는지 한두 줄로

## 체크리스트
- [ ] 
- [ ] 

## 참고
디자인, API 명세, 관련 이슈 등 (없으면 생략)
```

**버그 제보** (제목: `[fix] 문제 요약`, 라벨: `bug`)

```markdown
## 어떤 문제인가요?
한두 줄로

## 재현 방법
1. 
2. 

## 기대한 동작
원래 어떻게 동작해야 하는지

## 스크린샷 / 에러 메시지
있으면 첨부
```

## PR 양식

PR을 만들 때 아래 양식을 복사해서 써주세요.

```markdown
## 관련 이슈
closes #

## 작업 내용
- 

## 스크린샷
화면 변경이 있으면 첨부 (없으면 생략)

## 체크리스트
- [ ] develop 최신 상태를 pull 받고 충돌을 해결했어요
- [ ] `npm run build`가 성공해요
- [ ] 보드에서 카드를 In review로 옮겼어요

## 리뷰어에게
특히 봐줬으면 하는 부분, 고민한 점 (없으면 생략)
```

## PR 규칙

| PR | 리뷰 | 머지 방식 |
| --- | --- | --- |
| feature → develop | 팀원 1명 승인 | **Squash and merge** |
| develop → main | 팀장 | **Create a merge commit** |

- PR은 작게 나눠서 올려주세요.
- 충돌은 PR을 올린 사람이 `git pull origin develop`으로 해결합니다.
- `closes #번호`는 develop에 머지될 때 이슈를 자동으로 닫아요. 일부만 끝낸 PR에는 `refs #번호`를 써주세요.

## 커밋 메시지

**제목 한 줄은 필수, 본문은 "왜 이렇게 했는지" 설명이 필요할 때만** 씁니다.

```
feat: 메시지 전송 API 추가 (#12)
```

```
fix: 새 메시지 수신 시 스크롤이 안 내려가는 문제 수정 (#15)

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

- 제목은 `타입: 내용 (#이슈번호)`, 50자 이내, 마침표 없이
- 본문은 제목과 한 줄 띄우고 작성 (`git commit`만 치면 에디터가 열려서 여러 줄을 쓸 수 있어요)

## 폴더 구조

```
lgcns-mini-project-1/
├── app/
│   ├── (auth)/           ← login, signup
│   ├── chat/
│   │   └── [conversationId]/
│   └── api/chat/         ← 메시지 전송 API
├── components/
│   ├── common/           ← 공용 컴포넌트 (수정 시 담당자와 상의)
│   └── chat/             ← 채팅 관련 컴포넌트
├── hooks/
├── lib/
│   ├── prisma.ts         ← PrismaClient (여기서만 생성)
│   └── ai.ts             ← EXAONE API 호출
├── prisma/
│   └── schema.prisma     ← DB 담당자만 수정
└── types/
```

## 팀 규칙

- **스키마 수정과 `prisma db push`는 DB 담당자만** 합니다. 필요한 필드가 있으면 이슈나 채널로 요청해주세요.
- **DB 접근은 `lib/prisma.ts`의 `prisma`만** import해서 사용합니다. (`new PrismaClient()` 직접 생성 금지)
- **EXAONE 호출은 `lib/ai.ts`를 통해서만** 합니다. API 키가 브라우저 코드에 들어가지 않게 주의해주세요.
- **패키지 설치는 공유 후** 진행해주세요. 버전을 명시해서 설치하고 `package-lock.json`은 꼭 같이 커밋합니다.

## 팀원

| 이름 | GitHub | 파트 |
| --- | --- | --- |
|  |  |  |
