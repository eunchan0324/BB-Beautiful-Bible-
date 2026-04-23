# Beautiful Bible - Spring Boot 백엔드 포트폴리오 계획

## 목적

주니어 백엔드 개발자(Java/Spring Boot) 포트폴리오 구성. 각 단계별로 개념을 학습하고 면접에서 설명할 수 있는 수준을 목표로 한다.

- 프론트엔드: `bb-bible/` (Next.js 15, Vercel 배포 완료, Claude가 담당)
- 백엔드: `bb-bible-backend/` (Spring Boot 3.x, 본인이 직접 구현)

---

## 기술 스택

| 도구              | 버전         | 선택 이유                          |
| --------------- | ---------- | ------------------------------ |
| Java            | 21         | Virtual Threads(Loom) - 면접 포인트 |
| Spring Boot     | 3.3.x      | 최신 LTS, Spring Security 6 포함   |
| Gradle          | Kotlin DSL | 카카오/라인/네이버 표준, Maven보다 빠름      |
| PostgreSQL      | 16         | 내장 FTS, Railway 무료 티어          |
| Docker Compose  | -          | 로컬 개발 환경 표준화                   |
| Swagger/OpenAPI | 3          | springdoc-openapi로 자동 문서화      |
| jjwt            | 0.12.x     | JWT 처리 (jjwt-api/impl/jackson) |
| Railway         | -          | 배포 플랫폼 (무료, PostgreSQL 포함)     |

---

## 프로젝트 구조

```
BB-Beautiful-Bible-/
├── bb-bible/              ← 기존 프론트엔드 (Next.js)
├── bb-bible-backend/      ← 새로 생성할 Spring Boot 프로젝트
└── BACKEND_PLAN.md        ← 이 파일
```

### 패키지 구조 (도메인 주도 패키징)

```
com.bb.bible/
├── config/           # Security, CORS, Swagger 설정
├── domain/
│   ├── bible/        # entity, repository, service, controller, dto
│   ├── user/         # 회원가입/로그인
│   ├── highlight/    # 하이라이트 CRUD + 동기화
│   ├── preference/   # 사용자 설정
│   ├── bookmark/     # 책갈피
│   ├── search/       # 전문 검색
│   ├── readingplan/  # 읽기 계획
│   └── votd/         # 오늘의 말씀
├── global/
│   ├── exception/    # @ControllerAdvice
│   └── security/     # JWT Filter, Provider
└── infrastructure/
    └── importer/     # 성경 데이터 초기 임포트
```

**면접 포인트:** "레이어 패키징이 아닌 도메인 패키징을 선택한 이유는, 관련 파일이 응집되어 Bounded Context 역할을 하기 때문입니다."

---

## Phase 1: 기초 (Bible API + DB)

### 학습 목표

- JPA 엔티티 설계, `@OneToMany` / `FetchType.LAZY`
- `@RestController`, `@PathVariable`, DTO 패턴
- `CommandLineRunner`로 초기 데이터 임포트 (31,089 구절)
- Docker Compose로 로컬 PostgreSQL 실행

### DB 스키마

```sql
-- bible_books (66행)
id, book_code VARCHAR(10) UNIQUE,  -- '창','출','삼상' (프론트 bookId와 동일)
name_korean, testament ENUM(OLD/NEW), book_order INT,  chapter_count

-- bible_chapters (1,189행)
id, book_id FK, chapter_num

-- bible_verses (31,089행)
id, chapter_id FK, verse_num, verse_text TEXT,
verse_key VARCHAR(30) UNIQUE  -- '창1:1' 형식 (프론트 localStorage 키와 동일!)

-- 인덱스
CREATE INDEX idx_verse_key ON bible_verses(verse_key);
CREATE INDEX idx_verse_text_fts ON bible_verses USING gin(to_tsvector('simple', verse_text));
```

**핵심 설계:** `verse_key`가 프론트 localStorage 키(`창1:1`)와 동일 → 하이라이트 동기화 시 변환 불필요.

### 데이터 임포트

```java
@Component
public class BibleDataImporter implements CommandLineRunner {
    @Override
    @Transactional
    public void run(String... args) {
        if (bookRepo.count() > 0) return;  // 멱등성 보장
        // bible.json 파싱 후 saveAll() 배치 500건 단위
        // 개별 save() 31,089번 호출 방지
    }
}
```

데이터: `bb-bible/public/bible.json` → `src/main/resources/data/bible.json`으로 복사

### API 엔드포인트

```
GET /api/v1/bible/books
GET /api/v1/bible/books/{bookCode}
GET /api/v1/bible/books/{bookCode}/chapters
GET /api/v1/bible/books/{bookCode}/chapters/{n}   ← 성경 읽기 페이지 핵심 연동
GET /api/v1/bible/verses/{verseKey}
GET /api/v1/health
```

### 면접 포인트

- FetchType.LAZY 기본값 이유 (EAGER는 N+1 유발)
- `saveAll()` 배치 vs 개별 `save()` 성능 차이
- DTO로 엔티티 직접 노출 방지 (API 계약 ≠ DB 스키마)

---

## Phase 2: 인증 (Spring Security + JWT)

### 학습 목표

- `SecurityFilterChain` (deprecated `WebSecurityConfigurerAdapter` 대체)
- `OncePerRequestFilter`로 JWT 파싱
- BCrypt: 느린 해시 = 브루트포스 방어
- Access Token(15분) + Refresh Token(7일) 이중 토큰 패턴

### DB 스키마

```sql
-- users
id, email VARCHAR(255) UNIQUE, password_hash(BCrypt),
nickname, role DEFAULT 'USER', created_at, is_active

-- refresh_tokens (DB 탈취 대비 - 원본 아닌 해시 저장!)
id, user_id FK, token_hash VARCHAR(255) UNIQUE,
expires_at, is_revoked BOOLEAN DEFAULT false
```

### API 엔드포인트

```
POST /api/v1/auth/register
POST /api/v1/auth/login       → { accessToken, refreshToken, expiresIn }
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/users/me
PUT  /api/v1/users/me
```

### 면접 포인트

- Stateless 인증: 서버 세션 저장 불필요 → 수평 확장 가능
- Refresh Token을 DB에 해시로 저장하는 이유
- Access Token은 Zustand 메모리에만 보관 → XSS 방어
- Spring Security Filter Chain 실행 순서

---

## Phase 3: 사용자 기능 (클라우드 동기화)

### 학습 목표

- 사용자 스코프 데이터 (`user_id` 필터링 필수)
- `@AuthenticationPrincipal`로 컨트롤러에서 인증 유저 주입
- **Bulk Sync 패턴** (localStorage 전체 덤프 → 서버 업서트)
- `ON CONFLICT DO UPDATE` (PostgreSQL 네이티브 upsert)
- `@Valid` + `jakarta.validation`

### DB 스키마

```sql
-- highlights
id, user_id FK, verse_key VARCHAR(30), color VARCHAR(10),
note TEXT, created_at
UNIQUE(user_id, verse_key)   ← 동시 요청에도 중복 방지

-- user_preferences (1:1)
id, user_id FK UNIQUE, font_size DEFAULT 'large',
theme_mode DEFAULT 'system', show_verse_numbers DEFAULT true

-- bookmarks
id, user_id FK, verse_key, label, created_at
UNIQUE(user_id, verse_key)
```

### API 엔드포인트

```
GET    /api/v1/highlights
POST   /api/v1/highlights
PUT    /api/v1/highlights/{verseKey}
DELETE /api/v1/highlights/{verseKey}
POST   /api/v1/highlights/sync    ← localStorage 전체 덤프 업서트 (핵심!)
GET/PUT /api/v1/preferences
GET    /api/v1/bookmarks
POST   /api/v1/bookmarks
DELETE /api/v1/bookmarks/{verseKey}
```

### Bulk Sync 요청 형식

```json
{
  "highlights": [
    { "verseKey": "창1:1", "color": "yellow", "note": null, "timestamp": "2024-01-01T00:00:00Z" }
  ]
}
```

**면접 포인트:** "Local-first with cloud sync 패턴입니다. 비로그인 = localStorage, 로그인 첫 접속 시 전체 동기화, 이후 API 사용. 오프라인에서도 동작합니다."

---

## Phase 4: 고급 기능

| 기능     | 핵심 기술                                                         | 핵심 학습 포인트                                       |
| ------ | ------------------------------------------------------------- | ----------------------------------------------- |
| 전문 검색  | PostgreSQL FTS (`tsvector`, `plainto_tsquery('simple', ...)`) | `simple` 사전 사용 이유: 한국어는 영어 형태소 분석 불필요           |
| 오늘의 말씀 | `@Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")`       | 결정론적 선택(`epoch % totalVerses`) → 서버 재시작 후 동일 결과 |
| 읽기 계획  | `ReadingPlan`(템플릿) + `UserReadingProgress`(진행)                | Template-Instance 분리 패턴                         |

### API 엔드포인트

```
GET  /api/v1/search?q=&page=&size=
GET  /api/v1/votd
GET  /api/v1/votd/{date}
GET  /api/v1/plans
POST /api/v1/plans/{id}/enroll
GET  /api/v1/plans/my
PUT  /api/v1/plans/my/progress
```

---

## Phase 5: 프로덕션 배포

### 주요 작업

- `@ControllerAdvice` 전역 예외 처리 (404/400/409/500 표준화)
- CORS: Vercel 도메인 + localhost:3000만 허용
- Bucket4j 레이트 리미팅 (60 req/min per IP)
- Dockerfile 멀티스테이지 빌드 (JDK 빌드 → JRE 런타임)
- `application-prod.yml` 환경변수 주입 (`DATABASE_URL`, `JWT_SECRET`)
- `ddl-auto: validate` (prod에서 `create-drop` 절대 금지)
- Railway 배포

### 면접 포인트

- 멀티스테이지 Dockerfile: 이미지 크기 절반 (JDK vs JRE)
- `ddl-auto: validate` vs `create-drop` 차이
- `spring.threads.virtual.enabled=true` (Java 21 Virtual Threads)

---

## 프론트엔드 연동 전략 (Phase 2 완료 후)

1. 로그인/회원가입 UI 추가
2. Access Token → Zustand 메모리, Refresh Token → httpOnly 쿠키
3. Axios 인터셉터: 자동 `Authorization: Bearer` 헤더 첨부
4. 401 응답 → `/auth/refresh` 후 원본 요청 재시도
5. 로그인 직후 `POST /highlights/sync` (localStorage → 서버)
6. Dual-mode: 로그인 유저 = API, 비로그인 유저 = localStorage

---

## 전체 API 목록

| Phase | Method  | Path                                      | Auth |
| ----- | ------- | ----------------------------------------- | ---- |
| 1     | GET     | `/api/v1/bible/books`                     | No   |
| 1     | GET     | `/api/v1/bible/books/{code}/chapters/{n}` | No   |
| 1     | GET     | `/api/v1/bible/verses/{verseKey}`         | No   |
| 1     | GET     | `/api/v1/health`                          | No   |
| 2     | POST    | `/api/v1/auth/register`                   | No   |
| 2     | POST    | `/api/v1/auth/login`                      | No   |
| 2     | POST    | `/api/v1/auth/refresh`                    | No   |
| 2     | POST    | `/api/v1/auth/logout`                     | Yes  |
| 2     | GET     | `/api/v1/users/me`                        | Yes  |
| 3     | GET     | `/api/v1/highlights`                      | Yes  |
| 3     | POST    | `/api/v1/highlights/sync`                 | Yes  |
| 3     | GET/PUT | `/api/v1/preferences`                     | Yes  |
| 3     | GET     | `/api/v1/bookmarks`                       | Yes  |
| 4     | GET     | `/api/v1/search?q=`                       | No   |
| 4     | GET     | `/api/v1/votd`                            | No   |
| 4     | POST    | `/api/v1/plans/{id}/enroll`               | Yes  |
| 5     | GET     | `/actuator/health`                        | No   |

---

## 단계별 검증

| Phase | 검증 방법                                                        |
| ----- | ------------------------------------------------------------ |
| 1     | Swagger UI에서 `GET /api/v1/bible/books/창/chapters/1` → 31절 응답 |
| 2     | register → login → Bearer 토큰으로 `/users/me` 접근 성공             |
| 3     | sync 요청 → GET highlights → 동일 데이터 반환                         |
| 4     | `/search?q=사랑` 결과 확인, `/votd` 날짜별 다른 구절 확인                   |
| 5     | Railway 배포 URL에서 프론트(Vercel) → API 호출 성공                     |