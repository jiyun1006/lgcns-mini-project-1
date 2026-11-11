# 게시판 완성본 안내

## 실행

Node.js 22 LTS 이상 환경 권장함. 프로젝트 폴더에서 실행함.

```bash
npm ci
npm run dev
```

브라우저에서 터미널의 Local 주소에 접속하면 `/posts`로 이동함.
PowerShell의 npm.ps1 실행 정책 오류가 나면 `npm.cmd ci`, `npm.cmd run dev` 사용 가능함.

```bash
npm test
npm run build
npm run start
```

## 구현 범위

- Next.js App Router + TypeScript 구조 유지함
- 목록 검색, 카테고리, 기간 필터, 정렬, 인기글, 8개 단위 페이지 이동 구현함
- 새 글 작성, 수정, 삭제와 입력 검증 구현함
- 댓글 및 1단계 답글 등록/수정/삭제 구현함
- 좋아요 토글, 상세 방문 조회수 반영함
- 마크다운과 표 지원, 원시 HTML 실행하지 않음
- 프롬프트 복사 및 `/chat` 입력창 전달 구현함
- 새로고침, 상세 URL 직접 진입, 브라우저 뒤로 가기 지원함
- 잘못된 게시글 ID 및 타인 글 수정 접근에 안내 화면 제공함
- localStorage 저장 실패 시 폼 입력 유지함
- 브라우저 저장 내용을 읽기 전에 로딩 화면을 표시하여 서버/브라우저 렌더링 불일치 방지함

## 범위와 제한

이전 요청과 동일한 프론트엔드 구현임. DB 연결, 실제 로그인, 실제 LLM 응답은 구현 범위 밖임.
사용자는 데모 사용자 `지혜`로 고정되어 있음. 새 글을 작성하면 수정/삭제 확인 가능함.
현재 데이터는 이 브라우저의 `lgcns-board.v1`에 저장됨. 다른 기기에는 전달되지 않음. 여러 탭을 동시에 편집하면 마지막 저장 내용이 우선임.
화면의 작성자 검사는 UI 기능이며 보안 장치가 아님. 실제 서비스는 서버에서 인증 사용자 ID를 기준으로 권한을 검증해야 함.
좋아요는 브라우저의 데모 사용자 1명 기준임. 조회수는 상세 컴포넌트 방문 기준이며 고유 방문자 수가 아님.
기간 필터는 최근 7일/30일 내 작성된 글이며 정렬은 누적 좋아요임. 주간 좋아요 증가량 집계는 별도 이벤트 데이터가 필요함.
샘플 댓글 수는 실제 예시 댓글 개수와 맞췄음.
작성 페이지 취소/새로고침 시 이탈 확인이 있음. 브라우저 뒤로 가기 등 모든 이동에 대한 작성 초안 복구는 제공하지 않음.
현재 없는 글 안내는 클라이언트 화면이며 HTTP 404는 아님. 실제 서버 데이터 조회 도입 시 notFound로 교체해야 함.

## 채팅 연결 규약

상세 페이지의 `프롬프트 사용하기` 버튼이 sessionStorage의 `board-chat-draft`에 다음 값을 저장한 뒤 `/chat?from=board`로 이동함.

```ts
{ prompt: string, sourcePostId: string }
```

`components/board/ChatDraft.tsx`가 이를 읽어 수정 가능한 입력창에 넣음. 자동 전송하지 않음.
채팅 팀은 해당 컴포넌트를 실제 채팅 입력창으로 교체하고 사용자 전송 버튼에서 자신의 API를 호출하면 됨.
API 키를 프론트엔드에 넣으면 안 됨. 전달값은 같은 탭 세션에 남으며 다시 사용하기를 누르면 갱신됨.

## 백엔드 연결 지점

`BoardProvider.tsx`의 초기 읽기와 `commit`은 데모 localStorage 저장임. 서버 연결 시 게시글/댓글/좋아요별 API 요청으로 바꾸고 응답을 상태에 반영해야 함.
클라이언트가 전체 게시글 배열을 보내 DB를 덮어쓰는 방식으로 구현하면 안 됨.
`types/board.ts`는 기존 필드명을 유지하고 `comments`, `liked`, 댓글 `deleted` 필드를 추가함.
기존 Prisma MongoDB 스키마와 lib/prisma.ts는 보존함. 현재 게시판은 Prisma를 호출하지 않음.
서버 전환 시 사용자 ID, 좋아요 중복 방지, 삭제 권한, 페이지네이션과 검색은 서버에서 처리해야 함.

## 파일별 역할

| 파일                               | 역할                            |
| ---------------------------------- | ------------------------------- |
| app/posts/*                        | 목록·상세·작성·수정 URL         |
| components/board/BoardProvider.tsx | 공유 상태와 브라우저 저장       |
| components/board/BoardList.tsx     | 검색·정렬·페이지 이동           |
| components/board/PostDetail.tsx    | 상세·좋아요·복사·채팅 전달      |
| components/board/PostForm.tsx      | 입력·검증·작성·수정             |
| components/board/Comments.tsx      | 댓글·답글                       |
| components/board/ChatDraft.tsx     | 채팅 팀 연결용 입력창           |
| lib/board/logic.ts                 | 입력·저장 검증, 필터, 댓글 처리 |
| lib/board/mock-data.ts             | 목업 예시 데이터                |
| app/posts/board.css                | 게시판·모바일 스타일            |
| tests/board.test.ts                | 동작 규칙 검증                  |

## 저장 데이터 오류 복구

손상 데이터가 있으면 덮어쓰지 않고 오류 화면을 보여 줌. 개발자 도구 Application > Local Storage의 `lgcns-board.v1` 값을 파일로 백업한 후 복구하면 됨. 샘플 초기화가 필요할 경우 백업 후 해당 키만 삭제하고 새로고침함.

## 검증 기록

- Next.js production build 통과
- TypeScript 검사 통과
- 핵심 규칙 테스트 6개 통과
- 이 환경의 미리보기 실행기가 Next.js에 지원되지 않는 `--host`, `--strictPort` 옵션을 붙여 브라우저 QA는 수행하지 못함
- 모바일 스타일은 포함했으나 실제 모바일 기기 검증은 미실시
