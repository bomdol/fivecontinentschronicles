// 테라 노바 생물·괴물 설정
// buildSystemPrompt()에서 TERRA_NOVA_CREATURES 전역으로 참조

export const TERRA_NOVA_CREATURES = [
  {
    id: 'glacier_wyrm',
    name: { ko: '빙혈 미르', en: 'Glacier Wyrm' },
    icon: '🐉',
    threat: 5,
    level: 11, level_min: 10, level_max: 12,
    habitat: '테라 노바 화산 지대',
    desc: '얼음과 용암을 동시에 다루는 드래곤 아종. 잠든 본진 미르의 마력이 화산열·빙하와 결합해 탄생한 반(半)미르 변종으로, 본진 미르의 각성 전조로 여겨진다.',
    usage: '최종 보스급 전투, 대륙 연합 이벤트 (단독으로는 쓰러뜨리기 불가능한 상대)',
    key_stats: ['STR', 'CON'],
    special: '빙화(氷火) 브레스 — 얼음과 용암을 동시에 뿜어 광역 동결·화상',
    combat: {
      hp: 5000, atk: 350, mp: 800, ac: 19,
      skills: [
        { name: '빙염 브레스',   type: '공격',   cost: { mp: 80  }, effect: '광역 200 피해 + 5초 빙결 디버프' },
        { name: '용암 방패',     type: '방어',   cost: { mp: 60  }, effect: '10초간 받는 피해 50% 감소' },
        { name: '얼음의 포효',   type: '군중제어', cost: { mp: 100 }, effect: '3초간 적 전체 기절' },
      ],
    },
  },
  {
    id: 'fossil_titan',
    name: { ko: '화석 거인', en: 'Fossil Titan' },
    icon: '🪨',
    threat: 4,
    level: 9, level_min: 8, level_max: 10,
    habitat: '테라 노바 지하 광산',
    desc: '철광맥에 오랫동안 잠들어 있던 암석 거석 생물. 채굴 소음에 반응해 각성한다.',
    usage: 'STR 보너스, 자원 쟁탈 이벤트 — 쓰러뜨리면 희귀 철광석 획득 가능',
    key_stats: ['STR'],
    special: '암석 투척 / 암석 충격파 — 몸을 떼어 던지거나 지면을 내리쳐 반경 5m 균열, 넘어짐 판정(DEX)',
    combat: {
      hp: 5500, atk: 280, mp: 300, ac: 17,
      skills: [
        { name: '암석 투척',     type: '공격',   cost: { hp: 40  }, effect: '자신의 몸 일부를 떼어 던짐, 단일 대상 250 피해' },
        { name: '철벽 방어',     type: '방어',   cost: { mp: 40  }, effect: '15초간 방어력 +30%' },
        { name: '대지의 분노',   type: '군중제어', cost: { mp: 80  }, effect: '5m 내 적 5초간 이동속도 -50%' },
      ],
    },
  },
  {
    id: 'aurora_wolf',
    name: { ko: '극광 늑대', en: 'Aurora Wolf' },
    icon: '🌌',
    threat: 3,
    level: 5, level_min: 4, level_max: 6,
    habitat: '설원과 오로라 지대',
    desc: '오로라 빛을 두르고 이동하는 늑대. 군생하며 정신 감응으로 무리가 일제히 행동한다. Psychia 초능력자와 교감 가능.',
    usage: '텔레파시 교감(Psychia 캐릭터 전용 선택지), WIS·DEX 판정 보너스 이벤트',
    key_stats: ['WIS', 'DEX'],
    special: '오로라 도약 — 빛으로 순간이동처럼 위치를 바꾸는 회피 기동',
    combat: {
      hp: 2500, atk: 180, mp: 400, ac: 13,
      skills: [
        { name: '빛의 돌진',     type: '공격',   cost: { mp: 30  }, effect: '단일 대상 150 피해 + 2초 기절' },
        { name: '오로라 보호막', type: '버프',   cost: { mp: 50  }, effect: '아군 전체 방어력 +20%, 8초 지속' },
        { name: '은신 이동',     type: '회피',   cost: { mp: 40  }, effect: '5초간 투명화' },
      ],
    },
  },
  {
    id: 'frost_swarm',
    name: { ko: '빙결 곤충군', en: 'Frost Swarm' },
    icon: '🐜',
    threat: 2,
    level: 3, level_min: 2, level_max: 4,
    habitat: '해안 철광 주변',
    desc: '얼음 결정체를 몸에 두른 곤충 무리. 무해해 보이지만 철광맥을 잠식해 채굴 장비를 파괴한다.',
    usage: '자원 방해 이벤트 — 대륙별 대응 차이(Mechanica: 포획 연구, Arcania: 마나 정화)',
    key_stats: ['INT', 'DEX'],
    special: '빙결 코팅 — 장비·무기 표면을 얼려 판정에 -2 패널티',
    combat: {
      hp: 1200, atk: 80, mp: 200, ac: 10,
      note: '무리로 등장. 단일 공격 효과 절반, 광역 공격에 취약',
      skills: [
        { name: '냉기 갉아먹기', type: '공격',   cost: { mp: 30  }, effect: '단일 대상 100 피해' },
        { name: '떼 공격',       type: '군중제어', cost: { mp: 50  }, effect: '3m 내 적 공격속도 -30%, 10초 지속' },
      ],
    },
  },
  {
    id: 'pyroclast_elemental',
    name: { ko: '용암 정령', en: 'Pyroclast Elemental' },
    icon: '🔥',
    threat: 4,
    level: 7, level_min: 6, level_max: 8,
    habitat: '테라 노바 화산대',
    desc: '화산 분출 시 나타나는 불과 돌의 정령. Arcania 마법사가 금서로 소환을 시도하다 폭주 사태가 발생한 전례가 있다.',
    usage: 'Arcania 금서 사용자 연계 이벤트 — 소환 성공 시 강력한 아군, 실패 시 적으로 돌변',
    key_stats: ['INT', 'WIS'],
    special: '용암 분출 — 전방 직선 화상 피해, CON 판정으로 부상 감소',
    combat: {
      hp: 3000, atk: 220, mp: 500, ac: 14,
      skills: [
        { name: '화염탄',       type: '공격', cost: { mp: 40  }, effect: '단일 대상 180 피해' },
        { name: '용암 갑옷',   type: '방어', cost: { mp: 60  }, effect: '12초간 근접 공격 반사 (30% 피해)' },
        { name: '불길 확산',   type: '디버프', cost: { mp: 80  }, effect: '4m 내 적 공격력 -20%, 8초 지속' },
      ],
    },
  },
  {
    id: 'cryo_turtle',
    name: { ko: '빙하 거북', en: 'Cryo Turtle' },
    icon: '🐢',
    threat: 3,
    level: 6, level_min: 5, level_max: 7,
    habitat: '테라 노바 해안 빙하 지대',
    desc: '등에 빙하를 짊어진 거대한 거북. 공격적이지 않지만 등 위에 여러 세력이 거점을 세우려 경쟁한다.',
    usage: '이동 요새 이벤트 — 등에 올라타면 해안 거점 획득, 방어 판정 보너스',
    key_stats: ['CON'],
    special: '빙하 방패 — 공격 시 반사 냉기 피해, STR 판정으로 균열 가능',
    combat: {
      hp: 4500, atk: 150, mp: 600, ac: 17,
      skills: [
        { name: '빙하 충돌',     type: '공격', cost: { hp: 40  }, effect: '단일 대상 200 피해' },
        { name: '빙벽 생성',     type: '방어', cost: { mp: 70  }, effect: '10초간 아군 전체 받는 피해 -25%' },
        { name: '빙하의 축복',   type: '버프', cost: { mp: 100 }, effect: '아군 전체 HP 300 회복' },
      ],
    },
  },
  {
    id: 'ironhide_bear',
    name: { ko: '철갑 설곰', en: 'Ironhide Polar Bear' },
    icon: '🐻',
    threat: 4,
    level: 8, level_min: 7, level_max: 9,
    habitat: '내륙 철광 지대',
    desc: '철광석을 섭취해 금속성 갑각이 형성된 곰. Mechanica 개척단과 철광 지배권을 두고 충돌이 잦다.',
    usage: 'Mechanica 캐릭터 전용 갈등 이벤트 — 쓰러뜨리면 금속 갑각 소재 획득',
    key_stats: ['STR', 'CON'],
    special: '금속 격돌 — 갑각 충격파, 근접 공격자에게 반격 피해',
    combat: {
      hp: 4000, atk: 260, mp: 200, ac: 16,
      skills: [
        { name: '강철 발톱', type: '공격',     cost: { hp: 30  }, effect: '단일 대상 220 피해' },
        { name: '철갑 피부', type: '방어',     cost: { mp: 40  }, effect: '12초간 방어력 +40%' },
        { name: '포효',       type: '군중제어', cost: { mp: 60  }, effect: '5m 내 적 공격속도 -20%, 6초 지속' },
      ],
    },
  },
  {
    id: 'frost_spirit_bear',
    name: { ko: '빙결 영혼곰', en: 'Frost Spirit Bear' },
    icon: '🐻‍❄️',
    threat: 3,
    level: 6, level_min: 5, level_max: 7,
    habitat: '오로라 설원',
    desc: '오로라와 얼음의 정령이 깃든 영적 곰. 물리 공격이 절반만 통하며, Psychia 초능력자 앞에서는 공격성이 크게 낮아진다.',
    usage: 'Psychia 캐릭터 교감 이벤트 — 교감 성공 시 일시 아군, WIS 성장 보상',
    key_stats: ['WIS', 'CHA'],
    special: '영혼 포효 — 정신 충격파, WIS 판정 실패 시 1턴 행동 불능',
    combat: {
      hp: 3500, atk: 200, mp: 500, ac: 13,
      note: '물리 공격 피해 50% 감소. Psychia 캐릭터 앞에서 공격성 저하',
      skills: [
        { name: '빙결 발톱',     type: '공격', cost: { mp: 40  }, effect: '단일 대상 180 피해 + 3초 빙결' },
        { name: '영혼 보호막',   type: '버프', cost: { mp: 70  }, effect: '아군 전체 마법 저항 +25%, 10초 지속' },
        { name: '빙결 순간이동', type: '회피', cost: { mp: 50  }, effect: '1회 공격 회피' },
      ],
    },
  },
  {
    id: 'bloodsnow_bear',
    name: { ko: '혈설곰', en: 'Bloodsnow Bear' },
    icon: '🩸',
    threat: 5,
    level: 10, level_min: 9, level_max: 11,
    habitat: '드래곤 흔적 설원',
    desc: '빙하 아래 봉인된 미르의 오래된 상처 자국에서 스며 나온 고대의 피를 마셔 돌연변이가 된 붉은 눈의 곰. 미르의 마력이 뒤섞여 예측 불가능한 광폭 행동을 보인다.',
    usage: '후반부 결전 이벤트 — 빙혈 미르와 달리 광포함·예측불가가 핵심 위협',
    key_stats: ['STR', 'WIS'],
    special: '혈기(血氣) 폭발 — 체력이 절반 이하일 때 미르의 마력이 폭주, 전 능력치 상승',
    combat: {
      hp: 5000, atk: 320, mp: 400, ac: 15,
      note: 'HP 50% 이하 진입 시 광폭화 자동 발동 — ATK +50%',
      skills: [
        { name: '피의 발톱', type: '공격', cost: { hp: 50   }, effect: '단일 대상 300 피해' },
        { name: '광폭화',     type: '버프', cost: { hp: 100  }, effect: '공격력 +50%, 15초 지속' },
        { name: '피의 저주', type: '디버프', cost: { mp: 80  }, effect: '4m 내 적 HP 회복량 -50%, 12초 지속' },
      ],
    },
  },
  {
    id: 'frostwhale',
    name: { ko: '빙해 고래', en: 'Frostwhale' },
    icon: '🐋',
    threat: 3,
    level: 7, level_min: 6, level_max: 8,
    habitat: '테라 노바 해안 빙해',
    desc: '얼음 결정체가 표피에 박힌 거대한 고래. 항로를 막는 빙산처럼 이동해 선박을 파괴한다.',
    usage: '항해 방해 이벤트 — 우회(DEX)·설득(CHA)·격침(STR/CON) 중 선택',
    key_stats: ['STR', 'DEX'],
    special: '빙파(氷波) — 수면 충격파로 선박 탑승자 전원 DEX 판정',
    combat: {
      hp: 4500, atk: 240, mp: 700, ac: 12,
      skills: [
        { name: '빙결 파도',   type: '공격',     cost: { mp: 60  }, effect: '6m 내 적 200 피해' },
        { name: '고래의 울음', type: '군중제어', cost: { mp: 100 }, effect: '적 전체 혼란(스킬 실패 확률 30%), 8초 지속' },
        { name: '빙해 보호막', type: '방어',     cost: { mp: 80  }, effect: '아군 전체 방어력 +20%, 10초 지속' },
      ],
    },
  },
  {
    id: 'aurora_jellyfish',
    name: { ko: '극광 해파리', en: 'Aurora Jellyfish' },
    icon: '🌌',
    threat: 3,
    level: 4, level_min: 3, level_max: 5,
    habitat: '극지 바다 심해',
    desc: '오로라 빛을 발산하며 정신 혼란을 일으키는 해파리. WIS가 낮은 캐릭터에게는 높은 위협이 된다. Psychia 초능력자와 공명 현상을 일으키기도 한다.',
    usage: 'Psychia 교감 이벤트, 심해 탐사 중 정신 혼란 판정',
    key_stats: ['WIS'],
    special: '환각 광채 — WIS 판정 실패 시 아군을 적으로 오인하는 혼란 상태',
    combat: {
      hp: 2000, atk: 120, mp: 600, ac: 11,
      skills: [
        { name: '전기 촉수', type: '공격',   cost: { mp: 30  }, effect: '단일 대상 150 피해 + 2초 기절' },
        { name: '오로라 빛', type: '버프',   cost: { mp: 50  }, effect: '아군 전체 공격속도 +20%, 8초 지속' },
        { name: '정신 혼란', type: '디버프', cost: { mp: 70  }, effect: '4m 내 적 혼란(명령 반전), 6초 지속' },
      ],
    },
  },
  {
    id: 'ice_kraken',
    name: { ko: '빙결 크라켄', en: 'Ice Kraken' },
    icon: '🐙',
    threat: 5,
    level: 12, level_min: 12, level_max: 12,
    habitat: '테라 노바 연안 심해',
    desc: '얼음 덩어리로 뒤덮인 촉수 괴물. 빙혈 미르·혈설곰과 달리 광역 제압이 특기로, 함대 전체나 대규모 원정대를 동시에 위협한다.',
    usage: '후반부 결전 이벤트, 대륙 연합 해전 — 단일 캐릭터로는 제압 불가',
    key_stats: ['STR', 'CON'],
    special: '빙결 포박 — 촉수로 다수 대상을 동시 구속, CON 판정으로 탈출',
    combat: {
      hp: 7000, atk: 350, mp: 900, ac: 18,
      skills: [
        { name: '얼음 촉수',   type: '공격',     cost: { mp: 80  }, effect: '단일 대상 300 피해 + 3초 속박' },
        { name: '빙결 해류',   type: '군중제어', cost: { mp: 120 }, effect: '8m 내 적 이동속도 -70%, 10초 지속' },
        { name: '심해의 분노', type: '버프',     cost: { hp: 150 }, effect: '공격력 +40%, 12초 지속' },
      ],
    },
  },
];

// 위협도별 한국어 라벨
export const THREAT_LABEL = { 1:'위험 낮음', 2:'주의', 3:'위험', 4:'매우 위험', 5:'극한 위협' };

// 시스템 프롬프트용 요약 텍스트 생성
export function buildCreatureLore() {
  return TERRA_NOVA_CREATURES.map(c => {
    const stars   = '★'.repeat(c.threat) + '☆'.repeat(5 - c.threat);
    const cb      = c.combat;
    const skillTx = cb.skills.map(s => {
      const cost = s.cost.mp ? `MP${s.cost.mp}` : `HP${s.cost.hp}`;
      return `${s.name}(${s.type},${cost}): ${s.effect}`;
    }).join(' / ');
    const note = cb.note ? ` [${cb.note}]` : '';
    return (
      `• ${c.icon} ${c.name.ko}(${c.name.en}) [${stars}] Lv.${c.level} HP:${cb.hp} AC:${cb.ac} ATK:${cb.atk} MP:${cb.mp}${note}\n` +
      `  서식지: ${c.habitat} | ${c.desc}\n` +
      `  스킬: ${skillTx}`
    );
  }).join('\n');
}
