// 동료 설정 — 대륙별 네임드 NPC
// buildCompanionPrompt(activeCompanions)로 시스템 프롬프트에 주입

export const COMPANIONS = [
  {
    id: 'erina',
    name: { ko: '에리나', en: 'Erina Soleil' },
    cont: 'magic',
    job: 'hl',
    img: 'images/성약사.png',
    role: { ko: '성약사', en: 'Sanctum Healer' },
    threat: 2,
    desc: {
      ko: '마법 대륙 성약원 소속 치유사. 마나 메탈이 상처를 봉합하는 속도가 일반 치유 마법의 세 배라는 가설을 검증하러 테라 노바에 파견됐다. 겉으론 냉정하지만 부상자를 보면 반드시 멈춘다.',
      en: 'Arcanian healer sent to verify her hypothesis that mana metal accelerates wound closure threefold. Cold outwardly, but always stops for the injured.',
    },
    recruit_trigger: {
      ko: '채굴 중 부상당한 탐사대원을 함께 구조하거나, 야전 치료에 협력하는 상황이 생겼을 때.',
      en: 'When you rescue injured miners together, or cooperate during field triage.',
    },
    maxHp: 140, maxMp: 180,
    stats: 'STR 8, DEX 12, CON 11, INT 13, WIS 16, CHA 14',
  },
  {
    id: 'tyron',
    name: { ko: '타이론', en: 'Tyron Vex' },
    cont: 'science',
    job: 'iv',
    img: 'images/발명가.png',
    role: { ko: '발명가', en: 'Inventor' },
    threat: 2,
    desc: {
      ko: '과학 대륙 채굴 공단 소속 엔지니어. 테라 노바의 철광석이 과학 대륙 기계와 반응하는 방식이 비정상적이라는 것을 발견하고 혼자 분석 중이다. 고집이 세고 말이 없지만 함께 문제를 풀면 신뢰한다.',
      en: 'Mining guild engineer who discovered anomalous reactions between Terra Nova iron and Mechanica machinery. Stubborn and quiet, but trusts those who solve problems alongside him.',
    },
    recruit_trigger: {
      ko: '발명가의 채굴 장비가 이상 반응을 일으켜 함께 수습하거나, 그의 함정에서 서로 구해줬을 때.',
      en: 'When you help contain a malfunction in his mining rig, or save each other from one of his own traps.',
    },
    maxHp: 130, maxMp: 150,
    stats: 'STR 9, DEX 14, CON 10, INT 16, WIS 13, CHA 11',
  },
  {
    id: 'baekhwa',
    name: { ko: '백화', en: 'Baekhwa' },
    cont: 'wuxia',
    job: 'sw',
    img: 'images/검객.png',
    role: { ko: '검객', en: 'Swordsman' },
    threat: 3,
    desc: {
      ko: '무협 대륙 무림에서 흑도·백도 모두에게 쫓기는 방랑 검객. 전설의 미르가 잠든 테라 노바에서 검의 궁극을 완성하겠다는 목적 하나로 이곳에 왔다. 시비보다 검으로 말하는 편.',
      en: 'Wandering swordsman hunted by both black and white martial paths. Came to Terra Nova to perfect his blade art at the mirr\'s resting place. Prefers settling things with a blade.',
    },
    recruit_trigger: {
      ko: '위험한 생물을 함께 처치하거나, 일대일 내공 겨루기에서 실력을 인정받았을 때.',
      en: 'When you take down a powerful creature together, or he acknowledges your strength after a martial duel.',
    },
    maxHp: 200, maxMp: 100,
    stats: 'STR 16, DEX 15, CON 14, INT 9, WIS 12, CHA 11',
  },
  {
    id: 'ariel',
    name: { ko: '아리엘', en: 'Ariel Yun' },
    cont: 'psychic',
    job: 'jy',
    img: 'images/잠영술사.png',
    role: { ko: '잠영술사', en: 'Shadow Walker' },
    threat: 2,
    desc: {
      ko: '초능력 대륙 저항 조직 소속 정보원. 과학 대륙이 초능력자를 생체실험에 사용했다는 증거를 수집하기 위해 테라 노바에 잠입했다. 텔레파시로 플레이어의 의도를 먼저 읽어 행동한다.',
      en: 'Resistance operative gathering evidence that Mechanica used psychics for bioexperiments. Infiltrated Terra Nova. Reads the player\'s intentions via telepathy before acting.',
    },
    recruit_trigger: {
      ko: '과학 대륙 요원에게 쫓기는 아리엘을 도와주거나, 테라 노바에서 초능력자 탄압 현장에서 함께 싸웠을 때.',
      en: 'When you help Ariel escape Mechanica agents, or fight alongside against a psychic crackdown.',
    },
    maxHp: 120, maxMp: 170,
    stats: 'STR 9, DEX 17, CON 10, INT 14, WIS 16, CHA 13',
  },
];

// 동료 ID → COMPANIONS 항목
export function getCompanion(id) {
  return COMPANIONS.find(c => c.id === id) ?? null;
}

// 시스템 프롬프트 주입 텍스트
export function buildCompanionPrompt(activeCompanions) {
  const recruitList = COMPANIONS.map(c => {
    const trigger = c.recruit_trigger.ko;
    return `  • ${c.name.ko}(${c.id}) — ${c.cont} 대륙, ${c.role.ko}: ${c.desc.ko}\n    영입 조건: ${trigger}`;
  }).join('\n');

  const activeList = (activeCompanions || []).length > 0
    ? (activeCompanions).map(a => {
        const base = getCompanion(a.id);
        const pct = base ? Math.round((a.hp / a.maxHp) * 100) : '?';
        return `  • ${a.name ?? base?.name.ko ?? a.id}: HP ${a.hp}/${a.maxHp} (${pct}%) — 상태: ${a.status}`;
      }).join('\n')
    : '  없음';

  return `[동료 시스템]
현재 파티 동료:
${activeList}

영입 가능한 네임드 동료 (조건을 만나면 영입 기회 제공):
${recruitList}

동료 규칙:
- 동료는 전투 중 AI 자율 행동 (GM이 서사에 녹여 자연스럽게 묘사)
- HP가 0이 되면 '전투 불능(down)' 상태 — 행동 불가, 추가 공격 받으면 영구 사망(dead)
- 전투 종료 후 down 상태인 동료는 HP 1로 회복 (dead는 영구 소실)
- 전투 외 휴식·물약·치료 스킬로 HP 회복 가능

[응답 JSON 동료 필드]
"companion_recruit": "",   // 이번 턴에 영입 확정된 동료 id. 없으면 ""
"companion_state": []      // 활성 동료 HP 변화: [{"id":"erina","hp_delta":-30,"status":"active"}]
  status 값: "active"(정상) | "down"(전투불능) | "dead"(영구사망)
  동료에게 변화가 없으면 []`;
}
