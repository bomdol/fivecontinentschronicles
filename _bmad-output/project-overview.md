# 오대륙전기 (Five Continents Chronicles) — 프로젝트 개요

**생성일:** 2026-05-14  
**스캔 레벨:** Quick Scan (패턴 기반)

---

## 요약

판게아 분열 이후 5대륙이라는 오리지널 세계관을 배경으로 한 AI 구동 텍스트 어드벤처 RPG. 플레이어는 20개 언어 중 하나를 선택하고 4대륙 × 5직업 = 20종 직업 중 캐릭터를 생성한 뒤, 다중 AI(Claude / Groq / Gemini / GPT)가 실시간으로 생성하는 스토리를 경험한다. React + Vite SPA로 구현되어 Capacitor를 통해 Android APK로 패키징된다.

---

## 기술 스택

| 카테고리 | 기술 | 버전 |
|----------|------|------|
| UI 프레임워크 | React | 18.3.1 |
| 빌드 도구 | Vite | 5.4.2 |
| 모바일 브리지 | Capacitor (Android) | 8.3.4 |
| 백엔드/인증 | Firebase (Auth + Firestore) | 10.12.0 |
| AI — 주력 | Anthropic Claude | claude-sonnet-4-20250514 |
| AI — 보조 | Groq (Llama 3.3 70B) | — |
| AI — 보조 | Google Gemini | 2.0 Flash |
| AI — 보조 | OpenAI GPT | 4o-mini |
| 언어 | JavaScript ESM (JSX) | — |

---

## 아키텍처 유형

- **저장소 유형:** 모놀리스
- **아키텍처 패턴:** 컴포넌트 기반 SPA → 네이티브 모바일 셸
- **배포 타겟:** Android APK (Capacitor), 웹 브라우저 (Vite dev/preview)

---

## 핵심 기능

| 기능 | 구현 상태 |
|------|-----------|
| 20개국 언어 선택 | ✅ 완료 |
| 5단계 캐릭터 생성 (언어→인트로→대륙→직업→능력치) | ✅ 완료 |
| D&D 5e 능력치 시스템 (STR/DEX/CON/INT/WIS/CHA) | ✅ 완료 |
| 4대륙 × 5직업 = 20종 직업 / 140개 스킬 | ✅ 완료 |
| 다중 AI 공급자 (Claude / Groq / Gemini / GPT) | ✅ 완료 |
| Firebase Google 로그인 + Firestore 세이브 | ✅ 완료 |
| 동료 4명 (에리나·타이론·백화·아리엘) | ✅ 완료 |
| 8챕터 스토리 진행 시스템 | ✅ 완료 |
| 레벨/XP/전투 시스템 | ✅ 완료 |
| 직업 일러스트 20종 + 생물 이미지 12종 | ✅ 완료 |
| Android APK 패키징 (Capacitor 3) | ✅ 완료 |
| **D&D AC 방어 시스템** — 직업별 기본 AC(JOB_BASE_AC) + 몬스터 12종 AC + d20 명중 판정 | ✅ 완료 (2026-05-15) |
| **직업별 기본 아이템** — 20종 기본 아이템(공격·회복·CC), 아이템 AC 보너스 합산, AI 프롬프트 반영 | ✅ 완료 (2026-05-15) |
| **직업별 평타** — 20종 기본 공격 (MP/HP 비용 없음, 항상 사용 가능) | ✅ 완료 (2026-05-15) |
| **기절 상태** — HP 0 시 행동 불가 + 턴 넘기기, AI에게 동료/적 행동만 서술 지시 | ✅ 완료 (2026-05-15) |
| **클라이언트 전투 엔진** — 적 HP 유닛별 추적(_units[]), 명중 즉시 차감, 엔진이 사망 판정 (AI 임의 결정 불가) | ✅ 완료 (2026-05-15) |
| **동료 HP 변화 표시** — 동료 상태 변화(hp_delta) 스토리 패널 인라인 표시 | ✅ 완료 (2026-05-15) |

---

## 프로젝트 링크

- **앱 ID:** `com.fivecontents.chronicles`
- **APK 위치:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **개발자:** 봄돌
- **목적:** 심심풀이 개인 프로젝트 + AI 활용 학습
