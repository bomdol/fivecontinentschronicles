# 컴포넌트 인벤토리

**생성일:** 2026-05-14  
**스캔 레벨:** Quick Scan

---

## 화면 컴포넌트 (src/screens/)

### CharacterSelectScreen.jsx
**역할:** 게임 시작 전 5단계 캐릭터 생성 흐름 관리

| 단계 | 화면 | 주요 기능 |
|------|------|-----------|
| 1 | 언어 선택 | 20개국 언어 버튼 그리드 |
| 2 | 인트로 | 세계관 소개 텍스트 (선택 언어로) |
| 3 | 대륙 선택 | 4대륙 카드 (각 대륙 설명 포함) |
| 4 | 직업 선택 | 대륙별 5직업 카드 (일러스트 + 설명) |
| 5 | 능력치 | D&D 5e 6능력치 주사위 굴리기 UI |

**Props 출력:** character 객체 → App.jsx → GameplayScreen

---

### GameplayScreen.jsx
**역할:** 게임 전체 로직 및 UI. 프로젝트에서 가장 복잡한 단일 컴포넌트.

**주요 UI 영역:**

| 영역 | 설명 |
|------|------|
| API 키 패널 | AI 공급자 선택 + API 키 입력 (미설정 시 자동 표시) |
| HUD (상단) | 캐릭터명, 레벨, XP, 챕터 진행바 |
| 채팅 영역 | AI 응답 + 플레이어 입력 히스토리 |
| 전투 턴 스트립 | 전투 중 턴 순서 표시 |
| 동료 패널 | 에리나·타이론·백화·아리엘 상태 |
| 입력창 | 플레이어 행동 입력 (텍스트) |
| 세이브/로드 버튼 | Firebase + localStorage 저장/불러오기 |

**React Hooks 사용 패턴:**
- `useState` — 게임 상태 전체 (messages, character, combat, chapter 등)
- `useEffect([apiKey])` — API 키 변경 감지 → 게임 시작 트리거
- `useEffect([firebaseUser])` — 로그인 상태 변경 → 세이브 동기화

---

## 서비스 모듈 (src/services/)

| 파일 | 역할 | 외부 의존성 |
|------|------|-------------|
| `ai.js` | 4개 AI API 추상화 (`callAI` 라우터) | Anthropic, Groq, Google AI, OpenAI |
| `firebase.js` | Auth 초기화 + Google 로그인 + Firestore | Firebase SDK |
| `save.js` | 세이브/로드 (이중 저장) | firebase.js |
| `prompts.js` | 시스템 프롬프트 조합 | src/lore/, src/data/constants.js |

---

## 데이터 모듈 (src/data/, src/lore/)

### constants.js — 게임 정적 데이터
| 상수 | 내용 |
|------|------|
| `LANGS` | 20개국 언어 목록 |
| `CONTINENTS` | 4대륙 정보 |
| `JOBS` | 20종 직업 (대륙별 5개) |
| `SKILLS` | 140개 스킬 정의 |
| `STORY_CHAPTERS` | 8챕터 스토리 구조 |

### lore/ 모듈
| 파일 | 내용 |
|------|------|
| `terra_nova.js` | 판게아 분열, 5대륙 세계관, 역사 |
| `characters.js` | 생물 12종 로어 (극광늑대, 빙해고래 등) |
| `combat_rules.js` | 전투 규칙 (턴 기반, 스킬 효과) |
| `companions.js` | 동료 4명 배경 및 성격 (에리나·타이론·백화·아리엘) |
| `dnd_rules.js` | D&D 5e 규칙 적용 (능력치 판정, 수정치) |
| `jobs_levels.js` | 직업 20종 상세 + Lv1~12 성장 곡선 |

---

## 에셋 (images/)

**총 32개 PNG 파일**

| 카테고리 | 개수 | 예시 |
|----------|------|------|
| 직업 일러스트 | 20 | 각성자, 검객, 대마법사, 마법기사, 발명가 등 |
| 생물/몬스터 | 12 | 극광늑대, 빙결곤충군, 빙해고래, 빙혈미르 등 |

**이미지 서빙 방식:**
- 개발: Vite `imagePlugin` 미들웨어 → `/images/*` 경로
- 빌드: `closeBundle` 훅 → `dist/images/`로 자동 복사
