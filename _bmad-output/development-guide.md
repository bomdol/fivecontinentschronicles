# 개발 가이드

**생성일:** 2026-05-14

---

## 사전 요구사항

| 도구 | 버전 | 비고 |
|------|------|------|
| Node.js | 18+ | npm 포함 |
| JDK | 21 | `C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot` |
| Android SDK | — | `%LOCALAPPDATA%\Android\Sdk` |
| Android Studio | — | SDK 및 에뮬레이터 관리 |

### 환경변수 (Windows)
```
ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk
JAVA_HOME    = C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot
```

---

## 설치

```bash
git clone <repo>
cd 5continentschronicles
npm install
```

---

## 개발 명령어

### 웹 개발 서버
```bash
npm run dev
# → http://localhost:5173
# imagePlugin이 /images/* 미들웨어로 기존 images/ 서빙
```

### 웹 빌드
```bash
npm run build
# → dist/ 폴더 생성
# imagePlugin이 images/ → dist/images/ 자동 복사
```

### 빌드 미리보기
```bash
npm run preview
```

---

## Android APK 빌드

### 전체 흐름 (코드 수정 후)
```bash
# 1. Vite 빌드
npm run build

# 2. dist → android 동기화
npx cap sync

# 3. APK 빌드 (Windows)
cd android
./gradlew assembleDebug
```

### APK 출력 위치
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Capacitor 설정
```json
// capacitor.config.json
{
  "appId": "com.fivecontents.chronicles",
  "appName": "오대륙전기",
  "webDir": "dist",
  "server": { "androidScheme": "https" }
}
```

---

## API 키 설정

게임은 플레이어가 직접 AI API 키를 입력하는 방식이다. 개발/테스트 시:

1. 게임 실행 후 API 키 패널이 자동 표시됨
2. AI 공급자 선택: Claude / Groq / Gemini / GPT
3. 해당 공급자의 API 키 입력
4. 저장 후 즉시 게임 시작

**로컬 테스트용 키 파일:** `5대륙전기 게임마스터 api key.txt` (`.gitignore`에 포함됨)

---

## Firebase 설정

`src/services/firebase.js`에 Firebase 프로젝트 설정이 포함되어 있다.

- **Auth:** Google Sign-In
- **Firestore:** 유저별 세이브 데이터

---

## 프로젝트 구조 이해

### 게임 데이터 수정
- 직업/스킬/언어 변경: `src/data/constants.js`
- 세계관/로어 수정: `src/lore/` 내 해당 파일
- 챕터 내용 수정: `src/data/constants.js`의 `STORY_CHAPTERS`

### AI 프롬프트 수정
- `src/services/prompts.js`의 `buildSystemPrompt()` 수정

### UI 스타일 수정
- `src/styles/global.css`

---

## 배포 (선택사항)

### Google Play 릴리즈 APK
```bash
# 서명 키스토어 생성 (최초 1회)
keytool -genkey -v -keystore release-key.jks -alias five-continents -keyalg RSA -keysize 2048 -validity 10000

# Release APK 빌드
cd android
./gradlew assembleRelease
```

### 앱 아이콘 / 스플래시 스크린
```bash
npm install @capacitor/assets
npx @capacitor/assets generate
```

---

## 알려진 이슈 / 주의사항

- `node_modules/`, `dist/`, `android/` — git 제외 (`.gitignore`)
- `5대륙전기 게임마스터 api key.txt` — git 제외 (API 키 노출 방지)
- 레거시 `01_character_select.html`, `02_gameplay.html` — 참조용 보존, 수정 불필요
- `lore_*.js` (루트) — 레거시 파일, `src/lore/`가 정규 버전
