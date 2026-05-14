# 오대륙전기 — 프로젝트 문서 인덱스

**생성일:** 2026-05-14  
**스캔 모드:** initial_scan (Quick Scan)  
**생성 도구:** BMAD gds-document-project

---

## 프로젝트 개요

- **유형:** 모놀리스 — 컴포넌트 기반 SPA → 네이티브 모바일 셸
- **주요 언어:** JavaScript ESM (JSX)
- **아키텍처:** React 18 + Vite 5 → Capacitor 8 → Android APK
- **장르:** AI 구동 텍스트 어드벤처 RPG

---

## 빠른 참조

| 항목 | 값 |
|------|-----|
| 앱 ID | `com.fivecontents.chronicles` |
| 진입점 | `src/main.jsx` |
| 게임 데이터 | `src/data/constants.js` |
| AI 서비스 | `src/services/ai.js` |
| 핵심 화면 | `src/screens/GameplayScreen.jsx` |
| APK 위치 | `android/app/build/outputs/apk/debug/app-debug.apk` |

---

## 생성된 문서

- [프로젝트 개요](./project-overview.md) — 기능 목록, 기술 스택, 완료 현황
- [아키텍처](./architecture.md) — 레이어 구조, 서비스 설계, 데이터 흐름
- [소스 트리 분석](./source-tree-analysis.md) — 디렉토리 구조 주석 트리
- [컴포넌트 인벤토리](./component-inventory.md) — 화면·서비스·데이터 모듈 목록
- [개발 가이드](./development-guide.md) — 설치, 빌드, APK 패키징, 배포

---

## 기존 문서

- [worldbuilding.md](../worldbuilding.md) — 판게아 분열 세계관 설정
- [job_illustrations.md](../job_illustrations.md) — 직업 일러스트 레퍼런스
- [공통줄거리.txt](../공통줄거리.txt) — 게임 공통 줄거리
- [괴물그림설명.txt](../괴물그림설명.txt) — 몬스터 이미지 설명
- [등장인물그림설명.txt](../등장인물그림설명.txt) — 등장인물 이미지 설명

---

## 시작하기

```bash
# 의존성 설치
npm install

# 웹 개발 서버 실행
npm run dev

# Android APK 빌드
npm run build && npx cap sync && cd android && ./gradlew assembleDebug
```

→ 자세한 내용: [개발 가이드](./development-guide.md)

---

## 다음 단계 (선택사항)

| 우선순위 | 항목 |
|----------|------|
| 선택 | Release 서명 APK (Google Play 배포 시) |
| 선택 | 앱 아이콘 / 스플래시 스크린 (`@capacitor/assets`) |
