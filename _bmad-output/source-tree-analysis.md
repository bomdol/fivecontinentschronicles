# 소스 트리 분석

**생성일:** 2026-05-14  
**스캔 레벨:** Quick Scan

---

## 전체 디렉토리 구조

```
5continentschronicles/                 # 프로젝트 루트
│
├── 📄 index.html                       # HTML 진입점 (Vite root)
├── 📄 vite.config.js                   # Vite 설정 + imagePlugin (images/ 서빙/복사)
├── 📄 package.json                     # 의존성 (React, Vite, Capacitor, Firebase)
├── 📄 capacitor.config.json            # Capacitor 설정 (appId, webDir: dist)
│
├── src/                               # 애플리케이션 소스
│   ├── 📄 main.jsx                     # React 앱 마운트 진입점
│   ├── 📄 App.jsx                      # 루트 컴포넌트 (화면 전환 라우팅)
│   │
│   ├── data/                          # 게임 정적 데이터
│   │   └── 📄 constants.js             # LANGS, CONTINENTS, JOBS, STORY_CHAPTERS 등 모든 게임 상수
│   │
│   ├── lore/                          # 게임 세계관 & 규칙 (ESM 변환본)
│   │   ├── 📄 index.js                 # 로어 모듈 통합 진입점
│   │   ├── 📄 terra_nova.js            # 세계관: 대륙, 지형, 역사
│   │   ├── 📄 characters.js            # 생물 12종 로어
│   │   ├── 📄 combat_rules.js          # 전투 규칙
│   │   ├── 📄 companions.js            # 동료 4명 설정
│   │   ├── 📄 dnd_rules.js             # D&D 5e 규칙 (능력치, 판정)
│   │   └── 📄 jobs_levels.js           # 직업 20종 + 레벨업 시스템
│   │
│   ├── services/                      # 외부 서비스 통합
│   │   ├── 📄 ai.js                    # 다중 AI 공급자: callClaude/Gemini/OpenAI/Groq + callAI 라우터
│   │   ├── 📄 firebase.js              # Firebase Auth (Google) + Firestore 초기화
│   │   ├── 📄 save.js                  # saveGame/loadSave (localStorage + Firestore 이중 저장)
│   │   └── 📄 prompts.js               # buildSystemPrompt / buildSystemPromptCompact / buildChapterPrompt
│   │
│   ├── screens/                       # 화면 컴포넌트
│   │   ├── 📄 CharacterSelectScreen.jsx # 5단계 캐릭터 생성 흐름
│   │   └── 📄 GameplayScreen.jsx        # 게임 전체 로직 (React hooks 기반)
│   │
│   └── styles/
│       └── 📄 global.css               # 전역 CSS (기존 두 HTML 파일 스타일 통합본)
│
├── images/                            # 게임 에셋 PNG (32개)
│   ├── [직업 일러스트 20종]             # 각성자, 검객, 대마법사 등
│   └── [생물/몬스터 이미지 12종]        # 극광늑대, 빙결곤충군, 빙해고래 등
│
├── android/                           # Capacitor Android 프로젝트
│   └── app/
│       ├── src/main/res/              # Android 리소스 (drawable, mipmap 등)
│       └── build/outputs/apk/debug/   # 빌드된 APK 출력 위치
│
├── dist/                              # Vite 빌드 출력 (Capacitor webDir)
│
├── docs/                              # 문서 폴더 (현재 비어있음)
│
├── _bmad-output/                      # BMAD 생성 문서 (이 파일들)
│
│── 📄 worldbuilding.md                # [기존] 세계관 설정 문서
│── 📄 job_illustrations.md            # [기존] 직업 일러스트 레퍼런스
│── 📄 공통줄거리.txt                   # [기존] 게임 공통 줄거리
│── 📄 괴물그림설명.txt                 # [기존] 몬스터 이미지 설명
│── 📄 등장인물그림설명.txt              # [기존] 등장인물 이미지 설명
│
└── [레거시 파일]
    ├── 📄 01_character_select.html     # 레거시 HTML (React 마이그레이션 전)
    ├── 📄 02_gameplay.html             # 레거시 HTML (React 마이그레이션 전)
    └── 📄 lore_*.js                    # 레거시 로어 파일 (src/lore/로 이전됨)
```

---

## 핵심 폴더 설명

| 경로 | 역할 |
|------|------|
| `src/data/constants.js` | 게임 데이터의 단일 진실 공급원. 모든 언어, 대륙, 직업, 챕터 정의 |
| `src/lore/` | 게임 세계관 및 규칙. AI 프롬프트 컨텍스트로 주입됨 |
| `src/services/ai.js` | 4개 AI API 추상화 레이어. `callAI()` 로 통합 호출 |
| `src/services/prompts.js` | 시스템 프롬프트 생성기. 세계관+캐릭터+챕터 컨텍스트 조합 |
| `src/screens/GameplayScreen.jsx` | 핵심 게임 루프. 모든 게임 상태와 로직이 집중됨 |
| `images/` | 게임 이미지 에셋. dev에서는 imagePlugin 미들웨어, build에서는 dist/images/로 복사 |
| `android/` | Capacitor가 자동 관리하는 Android 프로젝트. `npx cap sync`로 동기화 |

---

## 데이터 흐름

```
사용자 입력
    ↓
GameplayScreen.jsx (React State)
    ↓
prompts.js → buildSystemPrompt (lore + character + chapter context)
    ↓
ai.js → callAI() → [Claude / Groq / Gemini / GPT] API
    ↓
AI 응답 → 화면 렌더링
    ↓
save.js → localStorage + Firestore (이중 저장)
```
