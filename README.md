# 미니프로젝트1

> LG CNS AM Inspire Camp 7기 미니프로젝트 (8명 · 4일)
> 주제: _(Day 1에 정해지면 업데이트)_

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js (App Router), TypeScript |
| Style | Tailwind CSS, shadcn/ui |
| 협업 | GitHub Issues, Projects(Kanban), ESLint, Prettier, husky + lint-staged |

## 시작하기

```bash
git clone <레포 주소>
cd mini-project-1
npm install
cp .env.example .env    # 실제 값은 팀 채널에서 받아서 채우기
npm run dev
```

- 프로젝트를 열면 뜨는 **추천 확장(Prettier, ESLint) 설치** 알림에서 Install을 눌러주세요.
- 저장하면 자동으로 포맷되고, 커밋할 때 lint-staged가 한 번 더 검사합니다.

## 브랜치 전략

```
main        ← 발표·배포용 (직접 push 금지)
 └ develop  ← 기본 브랜치, PR로만 머지
    ├ feat/12-login-form
    ├ fix/15-header-overlap
    └ refactor/20-api-client
```

- 브랜치 이름: `타입/이슈번호-설명`
- 작업 시작 전 항상 최신 develop에서 브랜치를 따주세요.

```bash
git checkout develop
git pull
git checkout -b feat/12-login-form
# 작업 후
git push -u origin feat/12-login-form
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
- 리뷰 요청을 받으면 가능한 빨리 확인해주세요.

## 커밋 메시지

**제목 한 줄은 필수, 본문은 "왜 이렇게 했는지" 설명이 필요할 때만** 씁니다.

```
feat: 로그인 폼 유효성 검사 추가 (#12)
```

```
fix: 모바일 헤더 겹침 수정 (#15)

z-index가 모달보다 낮아서 스크롤 시 헤더가 가려지던 문제.
헤더를 sticky로 바꾸고 z-index를 50으로 올림.
```

- 제목은 `타입: 내용 (#이슈번호)`, 50자 이내, 마침표 없이
- 본문은 제목과 한 줄 띄우고 작성 (`git commit`만 치면 에디터가 열려서 여러 줄을 쓸 수 있어요)

| 타입 | 의미 |
| --- | --- |
| feat | 새 기능 |
| fix | 버그 수정 |
| refactor | 기능 변화 없는 코드 개선 |
| style | 포맷, 세미콜론 등 (동작 변화 없음) |
| docs | 문서 수정 |
| chore | 설정, 패키지 등 기타 |

## 폴더 구조

```
mini-project-1/
├── app/              ← 라우트 (page, layout)
├── components/
│   ├── common/       ← 공용 컴포넌트 (수정 시 담당자와 상의)
│   └── [기능명]/      ← 기능별 컴포넌트
├── hooks/
├── lib/              ← API 클라이언트, 유틸
└── types/
```

## 팀 규칙

- **패키지 설치는 공유 후** 진행해주세요. `package-lock.json`은 꼭 같이 커밋합니다.
- 환경변수를 추가하면 `.env.example`에도 키 이름을 추가해주세요. (값은 절대 커밋 금지)

## 팀원

| 이름 | GitHub | 담당 |
| --- | --- | --- |
|  |  |  |
