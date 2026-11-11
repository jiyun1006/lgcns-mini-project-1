# Auth — 이메일 인증 / 아이디·비밀번호 찾기 / 로그아웃 API

테스트 서버(`http://15.164.3.88:8080`) 기준. 운영(`api.callab-hub.com` / `15.164.252.128`)에는 배포하지 않습니다.

Swagger: [http://15.164.3.88:8080/swagger-ui/index.html](http://15.164.3.88:8080/swagger-ui/index.html) (Basic `swagger` / `swagger`)

공통 응답 래퍼: `ApiResponse<T>` → `{ success, message, data, code }`

SMTP(`MAIL_*`)가 없으면 인증번호·보안키는 **서버 로그**에 남고, `expose-demo-code=true`일 때 응답의 `demoCode` / `demoToken`으로도 확인할 수 있습니다.

---

## 신규 API

### 1. 이메일 중복 확인

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/check-email`                       |
| **Auth**          | 불필요                                                |
| **Purpose**       | 개인 회원가입 전 이메일(로그인 아이디) 중복 여부 확인 |

**Request**

```json
{ "email": "user@example.com" }
```

**Response `data`**

```json
{ "available": true, "message": "사용 가능한 이메일입니다." }
```

- 이미 가입된 이메일이면 `available=false`.

---

### 2. 이메일 인증번호 발송

|                   |                                                  |
| ----------------- | ------------------------------------------------ |
| **Method / Path** | `POST /api/v1/auth/email/send-code`              |
| **Auth**          | 불필요                                           |
| **Purpose**       | 입력 이메일로 6자리 인증번호(auth key) 생성·발송 |

**Request**

```json
{ "email": "user@example.com" }
```

**Response `data`**

```json
{
  "message": "입력하신 이메일로 인증번호를 보냈습니다. ...",
  "demoCode": "123456"
}
```

- `demoCode`: SMTP 미설정 + `EMAIL_VERIFICATION_EXPOSE_DEMO_CODE`/`PASSWORD_RESET_EXPOSE_DEMO_CODE=true` 일 때만.
- 이미 가입된 이메일이면 `409 CONFLICT`.
- 코드는 DB에 SHA-256 해시로 저장, TTL 기본 10분, 재발송 시 이전 미사용 코드 무효화.

---

### 3. 이메일 인증번호 검증

|                   |                                                 |
| ----------------- | ----------------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/email/verify-code`           |
| **Auth**          | 불필요                                          |
| **Purpose**       | 발송된 인증번호와 입력값 일치 여부 확인 (1회용) |

**Request**

```json
{ "email": "user@example.com", "code": "123456" }
```

**Response `data`**

```json
{ "verified": true, "message": "이메일 인증이 완료되었습니다." }
```

- 불일치/만료/재사용 시 `400`.

---

### 4. 로그아웃

|                   |                                                              |
| ----------------- | ------------------------------------------------------------ |
| **Method / Path** | `POST /api/v1/auth/logout`                                   |
| **Auth**          | Bearer access token 필요                                     |
| **Purpose**       | 로그인 시 발급된 토큰(세션의 access+refresh)을 DB에서 무효화 |

**Request body**: 없음 (Authorization 헤더의 access token 사용)

**Response**: `data=null`

- Redis 없이 `user_issued_tokens` 테이블의 `jti`를 revoke.
- 이후 동일 access/refresh 토큰은 거부됨.

---

## 변경·확장된 기존 API

### 5. 아이디(이메일) 찾기 — 이메일 발송 추가

|                   |                                                                         |
| ----------------- | ----------------------------------------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/find-id`                                             |
| **Auth**          | 불필요                                                                  |
| **Purpose**       | 이름/이메일로 계정을 찾고, **로그인 아이디(이메일)를 해당 메일로 발송** |

**Request** (이름 또는 이메일 중 하나 이상)

```json
{ "name": "홍길동", "email": "user@example.com" }
```

**Response `data`**

```json
{
  "maskedEmails": ["u***@example.com"],
  "hint": "CollabHub 로그인 아이디는 가입 시 사용한 이메일입니다. ...",
  "message": "등록된 계정이 있다면 로그인 아이디를 이메일로 보냈습니다.",
  "emailed": true
}
```

---

### 6. 비밀번호 재설정 보안키 요청

|                   |                                              |
| ----------------- | -------------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/password/forgot`          |
| **Auth**          | 불필요                                       |
| **Purpose**       | 임시 보안키(원타임 토큰) 생성 후 이메일 발송 |

**Request**

```json
{ "email": "user@example.com" }
```

**Response `data`**

```json
{
  "message": "해당 이메일이 등록되어 있다면 비밀번호 재설정 보안키를 이메일로 보냈습니다. ...",
  "demoToken": "<raw-security-key>"
}
```

- 메일 본문에 **보안키**와 링크를 함께 포함.
- 계정 존재 여부는 응답으로 노출하지 않음.
- 토큰은 SHA-256 해시 저장, TTL 기본 30분, 재요청 시 이전 미사용 키 무효화.

---

### 7. 비밀번호 재설정 (보안키 필수, 1회용)

|                   |                                           |
| ----------------- | ----------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/password/reset`        |
| **Auth**          | 불필요                                    |
| **Purpose**       | 이메일 + 임시 보안키 + 새 비밀번호로 변경 |

**Request**

```json
{
  "email": "user@example.com",
  "token": "<security-key-from-email-or-demoToken>",
  "newPassword": "newpassword12"
}
```

**Notes**

- `token`은 forgot에서 발급한 원타임 보안키.
- 사용 즉시 `usedAt` 처리 + 동일 사용자 미사용 키 전부 무효화 → **재사용 불가**.
- 성공 시 해당 사용자의 로그인 세션(`user_issued_tokens`)도 전부 로그아웃 처리.

---

### 8. 로그인 / 리프레시 — 발급 토큰 DB 저장

|                   |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| **Method / Path** | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`            |
| **변경점**        | 발급 JWT에 `jti` 포함, `user_issued_tokens`에 access+refresh 저장 |
| **refresh**       | 기존 refresh `jti`/세션을 무효화한 뒤 새 쌍 발급 (회전, 1회용)    |

`JwtAuthenticationFilter`는 access token의 `jti`가 DB에 활성 상태가 아니면 인증을 거부합니다.

---

## 관련 기존 API (변경 없음 / 참고)

| Method | Path                    | 설명                       |
| ------ | ----------------------- | -------------------------- |
| `POST` | `/api/v1/auth/register` | 회원가입                   |
| `GET`  | `/api/v1/auth/me`       | 내 정보 (토큰 재발급 없음) |

---

## 저장소 테이블 (Hibernate ddl-auto)

| 테이블                     | 용도                                                    |
| -------------------------- | ------------------------------------------------------- |
| `email_verification_codes` | 이메일 인증번호 (해시, TTL, 1회용)                      |
| `password_reset_tokens`    | 비밀번호 재설정 보안키 (기존, 해시·1회용)               |
| `user_issued_tokens`       | 로그인 발급 JWT(`jti`, sessionId, expiresAt, revokedAt) |

---

## 테스트 서버 환경 힌트

```env
PASSWORD_RESET_EXPOSE_DEMO_CODE=true
EMAIL_VERIFICATION_EXPOSE_DEMO_CODE=true   # 미설정 시 password-reset 값 상속
SIGNUP_AUTO_APPROVE=true
SWAGGER_SERVER_URL=http://15.164.3.88:8080
SWAGGER_USERNAME=swagger
SWAGGER_PASSWORD=swagger
```
