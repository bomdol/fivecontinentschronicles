# 아키텍처 문서 — 오대륙전기

**생성일:** 2026-05-14  
**스캔 레벨:** Quick Scan  
**아키텍처 패턴:** 컴포넌트 기반 SPA → 네이티브 모바일 셸

---

## 요약

오대륙전기는 React SPA를 Capacitor를 통해 Android 앱으로 래핑하는 하이브리드 모바일 아키텍처를 채택한다. 게임 로직 전체가 단일 React 컴포넌트(GameplayScreen)에 집중되어 있으며, 외부 AI API 4종과 Firebase를 서비스 레이어로 추상화한다.

---

## 레이어 구조

```
┌─────────────────────────────────────────────┐
│           Android APK (Capacitor 8)          │
│  ┌──────────────────────────────────────┐   │
│  │         WebView (dist/)              │   │
│  │  ┌────────────────────────────────┐  │   │
│  │  │     React SPA (Vite 5)        │  │   │
│  │  │                                │  │   │
│  │  │  App.jsx                       │  │   │
│  │  │  ├── CharacterSelectScreen     │  │   │
│  │  │  │   (5단계 캐릭터 생성)        │  │   │
│  │  │  └── GameplayScreen            │  │   │
│  │  │      (게임 전체 루프)           │  │   │
│  │  └────────────────────────────────┘  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
         ↓ HTTPS API 호출
┌────────────────────────────────────────────────────┐
│                외부 서비스                          │
│  ┌────────────┐ ┌──────────┐ ┌────────┐ ┌──────┐  │
│  │ Claude API │ │ Groq API │ │Gemini  │ │ GPT  │  │
│  │ (기본)     │ │(Llama 70B│ │2.0Flash│ │4o-mini│  │
│  └────────────┘ └──────────┘ └────────┘ └──────┘  │
│  ┌─────────────────────────────────────────────┐   │
│  │         Firebase (Auth + Firestore)          │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

---

## 컴포넌트 아키텍처

### App.jsx — 루트 라우터
- `screen` state로 화면 전환 관리
- `CharacterSelectScreen` ↔ `GameplayScreen` 간 전환
- 캐릭터 데이터를 props로 GameplayScreen에 전달

### CharacterSelectScreen — 캐릭터 생성 흐름
5단계 단방향 흐름:
```
1. 언어 선택 (20개국)
   ↓
2. 인트로 (세계관 소개)
   ↓
3. 대륙 선택 (4개 대륙)
   ↓
4. 직업 선택 (대륙별 5직업)
   ↓
5. 능력치 주사위 (D&D 5e 6능력치)
   ↓
→ GameplayScreen으로 전환
```

### GameplayScreen — 핵심 게임 루프
React Hooks 기반 상태 관리:

| 상태 | 설명 |
|------|------|
| `messages` | 채팅 히스토리 (AI 대화 로그) |
| `character` | 플레이어 캐릭터 데이터 |
| `level`, `xp` | 레벨 / 경험치 |
| `companions` | 동료 4명 상태 |
| `storyChapter`, `chapterTurns` | 챕터 진행 상태 |
| `apiKey`, `aiProvider` | AI 공급자 선택 및 키 |
| `firebaseUser` | Firebase 인증 상태 |

---

## 서비스 레이어

### ai.js — 다중 AI 추상화
```
callAI(provider, apiKey, messages, systemPrompt)
  ├── callClaude()   → Anthropic API (claude-sonnet-4-20250514)
  ├── callGroq()     → Groq API (llama-3.3-70b-versatile)
  ├── callGemini()   → Google Generative AI (gemini-2.0-flash)
  └── callOpenAI()   → OpenAI API (gpt-4o-mini)
```

### prompts.js — 시스템 프롬프트 빌더
```
buildSystemPrompt(character, lang, chapter)
  → 전체 컨텍스트 프롬프트 (로어 + 직업 + 챕터 지시사항)

buildSystemPromptCompact(character, lang, chapter)
  → 압축 프롬프트 (히스토리 길어질 때 사용)

buildChapterPrompt(chapter)
  → 챕터별 특수 지시사항
```

### save.js — 이중 저장 전략
```
saveGame(character, messages, ...)
  ├── localStorage   (즉시, 오프라인 지원)
  └── Firestore      (사용자 로그인 시 클라우드 동기화)

loadSave(userId)
  └── Firestore 우선, 실패 시 localStorage 폴백
```

---

## 데이터 모델 (패턴 기반)

### Character 객체 (추정)
```javascript
{
  name: string,
  lang: string,           // 선택 언어 코드
  continent: string,      // 선택 대륙
  job: string,            // 선택 직업
  stats: {
    STR, DEX, CON,
    INT, WIS, CHA         // D&D 5e 6능력치
  },
  skills: string[],       // 직업 스킬 (최대 7개/레벨)
  level: number,          // 현재 레벨 (최대 Lv12 확인)
  xp: number
}
```

### 저장 데이터 (localStorage / Firestore)
- `character` — 캐릭터 데이터
- `messages` — 채팅 히스토리
- `storyChapter`, `chapterTurns` — 챕터 진행
- `companions` — 동료 상태

---

## 배포 아키텍처

```
소스 코드 (src/)
    ↓ npm run build
dist/                   ← Vite SPA 번들
    ↓ npx cap sync
android/app/src/main/   ← Capacitor Android 동기화
    ↓ ./gradlew assembleDebug
APK (app-debug.apk)     ← 최종 배포 아티팩트
```

### 환경 요구사항
- Node.js (npm)
- JDK 21 (`C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot`)
- Android SDK (`%LOCALAPPDATA%\Android\Sdk`)
- `ANDROID_HOME` 환경변수 등록 필요

---

## 아키텍처 특이사항

1. **API 키 클라이언트 노출:** AI API 키를 사용자가 직접 입력하여 클라이언트에서 직접 호출. 서버 없음 (의도적 설계 — 개인 프로젝트).
2. **컨텍스트 압축:** 히스토리가 길어지면 `buildSystemPromptCompact()`로 전환하여 토큰 절약.
3. **이미지 서빙 분기:** Vite 커스텀 플러그인(`imagePlugin`)으로 개발/빌드 환경 모두 처리.
4. **레거시 파일 공존:** `01_character_select.html`, `02_gameplay.html`, `lore_*.js` (루트)는 React 마이그레이션 전 레거시로 보존.
