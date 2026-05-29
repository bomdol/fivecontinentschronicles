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
    drops: [
      { id: 'mirr_scale',    prob: 0.30, qty_min: 1, qty_max: 1 },
      { id: 'glacier_gem',   prob: 0.40, qty_min: 1, qty_max: 2 },
      { id: 'ice_flower',    prob: 0.25, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'fossil_fragment', prob: 0.55, qty_min: 1, qty_max: 2 },
      { id: 'fossil_mineral',  prob: 0.30, qty_min: 1, qty_max: 2 },
      { id: 'ancient_ore',     prob: 0.15, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'aurora_pelt',  prob: 0.60, qty_min: 1, qty_max: 2 },
      { id: 'aurora_petal', prob: 0.15, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'frost_crystal', prob: 0.70, qty_min: 1, qty_max: 2 },
      { id: 'frost_moss',    prob: 0.30, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'lava_core',      prob: 0.50, qty_min: 1, qty_max: 1 },
      { id: 'volcanic_rock',  prob: 0.60, qty_min: 2, qty_max: 3 },
      { id: 'volcano_flower', prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'glacier_shell', prob: 0.50, qty_min: 1, qty_max: 1 },
      { id: 'frost_moss',    prob: 0.40, qty_min: 1, qty_max: 2 },
    ],
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
    drops: [
      { id: 'iron_hide',  prob: 0.55, qty_min: 1, qty_max: 2 },
      { id: 'deep_iron',  prob: 0.25, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'spirit_crystal', prob: 0.45, qty_min: 1, qty_max: 1 },
      { id: 'aurora_pelt',    prob: 0.30, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'mirr_bloodstone', prob: 0.35, qty_min: 1, qty_max: 1 },
      { id: 'spirit_crystal',  prob: 0.40, qty_min: 1, qty_max: 1 },
      { id: 'aurora_pelt',     prob: 0.30, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'frostwhale_fat', prob: 0.70, qty_min: 2, qty_max: 4 },
      { id: 'glacier_gem',    prob: 0.15, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'aurora_tentacle', prob: 0.60, qty_min: 1, qty_max: 2 },
      { id: 'aurora_petal',    prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
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
    drops: [
      { id: 'kraken_fang',    prob: 0.30, qty_min: 1, qty_max: 1 },
      { id: 'aurora_crystal', prob: 0.35, qty_min: 1, qty_max: 1 },
      { id: 'spirit_stone',   prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },

  // ─── 신규 괴물 10종 ──────────────────────────────────────────────────────
  {
    id: 'tundra_rat',
    name: { ko: '툰드라 쥐', en: 'Tundra Rat' },
    icon: '🐀',
    threat: 1,
    level: 1, level_min: 1, level_max: 2,
    habitat: '테라 노바 평원·설원',
    desc: '테라 노바 평원 어디서나 볼 수 있는 작은 설치류. 단독으로는 위협이 없지만 떼로 몰려들면 물자를 훔치거나 갉아먹는다.',
    usage: '초반 채집 방해 이벤트 — 식량·약초 강탈 시도. 모든 대륙 캐릭터 공통',
    key_stats: ['DEX'],
    special: '군집 잠식 — 무리 5마리 이상일 때 아이템 1개 무작위 탈취 시도',
    combat: {
      hp: 300, atk: 30, mp: 0, ac: 8,
      note: '무리로 등장(3~8마리). 단독 위협도 낮음',
      skills: [
        { name: '집단 갉기', type: '공격', cost: { mp: 0 }, effect: '단일 대상 20 피해' },
      ],
    },
    drops: [
      { id: 'terra_grass',  prob: 0.50, qty_min: 1, qty_max: 2 },
      { id: 'liferoot',     prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'snow_fox',
    name: { ko: '설 여우', en: 'Snow Fox' },
    icon: '🦊',
    threat: 1,
    level: 2, level_min: 1, level_max: 3,
    habitat: '설원 외곽',
    desc: '흰 털을 가진 민첩한 여우. 공격적이지 않지만 탐사대의 식량을 노리며 접근한다. Wuxia 캐릭터는 경공 판정으로 포획 가능.',
    usage: '초반 이벤트 — 포획 성공 시 모피 재료 획득. 무협 캐릭터 전용 경공 판정',
    key_stats: ['DEX', 'WIS'],
    special: '순간 도주 — DEX 판정 실패 시 전투 전에 도망',
    combat: {
      hp: 500, atk: 40, mp: 50, ac: 11,
      skills: [
        { name: '물기',     type: '공격', cost: { mp: 0  }, effect: '단일 대상 35 피해' },
        { name: '모래 뿌리기', type: '디버프', cost: { mp: 20 }, effect: '대상 명중률 -15%, 2턴 지속' },
      ],
    },
    drops: [
      { id: 'aurora_pelt',  prob: 0.55, qty_min: 1, qty_max: 1 },
      { id: 'snowflake_herb', prob: 0.35, qty_min: 1, qty_max: 2 },
    ],
  },
  {
    id: 'frost_bat',
    name: { ko: '빙결 박쥐', en: 'Frost Bat' },
    icon: '🦇',
    threat: 1,
    level: 2, level_min: 1, level_max: 3,
    habitat: '지하 광산·빙하 동굴',
    desc: '광산과 빙하 동굴에 서식하는 박쥐. 채굴 소음에 반응해 무리로 공격한다. 채광 중 자주 조우.',
    usage: '채광 방해 이벤트 — 광산 탐사 중 필수 조우. Mechanica 캐릭터 초음파 장비로 격퇴 가능',
    key_stats: ['DEX', 'CON'],
    special: '초음파 교란 — WIS 판정 실패 시 1턴 방향감각 상실',
    combat: {
      hp: 400, atk: 35, mp: 80, ac: 9,
      note: '무리로 등장. 광산·동굴 내부에서만 조우',
      skills: [
        { name: '냉기 물기',   type: '공격',   cost: { mp: 20 }, effect: '단일 대상 40 피해 + 1턴 빙결' },
        { name: '초음파 비명', type: '디버프', cost: { mp: 30 }, effect: '3m 내 적 WIS 판정 DC+2, 2턴 지속' },
      ],
    },
    drops: [
      { id: 'frost_crystal', prob: 0.40, qty_min: 1, qty_max: 1 },
      { id: 'frost_moss',    prob: 0.45, qty_min: 1, qty_max: 2 },
    ],
  },
  {
    id: 'magma_crab',
    name: { ko: '용암 게', en: 'Magma Crab' },
    icon: '🦀',
    threat: 2,
    level: 3, level_min: 2, level_max: 4,
    habitat: '화산대 용암 근처',
    desc: '화산대 용암 근처에 서식하는 갑각류. 껍데기가 굳은 용암으로 이루어져 물리 방어가 높고, 화염 속성 피해를 반사한다.',
    usage: '화산대 탐사 방해 이벤트 — 화염 계열 스킬 사용 시 반사 주의',
    key_stats: ['STR', 'CON'],
    special: '용암 껍질 — 화염 속성 피해 반사 (20%). 물 계열 스킬에 취약',
    combat: {
      hp: 1500, atk: 100, mp: 100, ac: 14,
      skills: [
        { name: '집게 강타',   type: '공격', cost: { hp: 10 }, effect: '단일 대상 90 피해' },
        { name: '용암 분사',   type: '공격', cost: { mp: 30 }, effect: '단일 대상 70 피해 + 화상 디버프 2턴' },
      ],
    },
    drops: [
      { id: 'volcanic_rock',  prob: 0.65, qty_min: 2, qty_max: 3 },
      { id: 'lava_core',      prob: 0.20, qty_min: 1, qty_max: 1 },
      { id: 'obsidian',       prob: 0.15, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'mana_wisp',
    name: { ko: '마나 위습', en: 'Mana Wisp' },
    icon: '✨',
    threat: 2,
    level: 4, level_min: 3, level_max: 5,
    habitat: '마나 메탈 광맥 주변',
    desc: '마나 메탈 광맥 주변을 떠도는 에너지 구체. 물리 공격이 거의 통하지 않으며, Arcania 마법사에게는 마나 메탈 위치를 알려주는 신호가 된다.',
    usage: 'Arcania 전용 이벤트 — 마나 메탈 광맥 위치 탐지 가능. 물리 공격 취약점 없음',
    key_stats: ['INT', 'WIS'],
    special: '마나 흡수 — 마법 스킬 사용 시 MP를 10 흡수',
    combat: {
      hp: 800, atk: 90, mp: 400, ac: 12,
      note: '물리 공격 피해 50% 감소. 마법 공격에 표준 피해',
      skills: [
        { name: '마나 방출', type: '공격',   cost: { mp: 40 }, effect: '단일 대상 120 피해' },
        { name: '마나 실드', type: '방어',   cost: { mp: 50 }, effect: '8초간 받는 피해 30% 감소' },
      ],
    },
    drops: [
      { id: 'mana_shard',     prob: 0.60, qty_min: 1, qty_max: 2 },
      { id: 'aurora_crystal', prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'psychic_moth',
    name: { ko: '초능력 나방', en: 'Psychic Moth' },
    icon: '🦋',
    threat: 2,
    level: 4, level_min: 3, level_max: 5,
    habitat: '오로라 지대 심부',
    desc: '오로라 빛을 날개에 담은 나방. 날갯짓으로 환각을 일으킨다. Psychia 초능력자에게는 정신력 수련 파트너가 될 수 있다.',
    usage: 'Psychia 전용 교감 이벤트 — 교감 성공 시 WIS +2 임시 버프. 기타 대륙은 환각 디버프 조심',
    key_stats: ['WIS', 'CHA'],
    special: '오로라 인분 — 날갯짓 시 3m 내 적에게 환각 상태 (1턴)',
    combat: {
      hp: 900, atk: 70, mp: 350, ac: 10,
      skills: [
        { name: '환각 날갯짓', type: '디버프', cost: { mp: 40 }, effect: '3m 내 적 1턴 환각(선택지 랜덤 변경)' },
        { name: '정신 파동',   type: '공격',   cost: { mp: 30 }, effect: '단일 대상 100 피해' },
      ],
    },
    drops: [
      { id: 'aurora_petal',   prob: 0.50, qty_min: 1, qty_max: 2 },
      { id: 'spirit_stone',   prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'shadow_lynx',
    name: { ko: '그림자 스라소니', en: 'Shadow Lynx' },
    icon: '🐈',
    threat: 3,
    level: 5, level_min: 4, level_max: 6,
    habitat: '테라 노바 삼림·협곡',
    desc: '그림자 속에서 이동하는 날렵한 대형 고양이. 기습 공격이 특기로, 은신 중인 도적형 캐릭터와는 서로를 인식한다.',
    usage: 'Rogue 계열 전용 이벤트 — 기습 당하거나 역으로 기습 가능. 포획 시 동료 후보',
    key_stats: ['DEX', 'STR'],
    special: '그림자 도약 — 매 전투 첫 번째 공격은 반드시 기습(방어 무시)',
    combat: {
      hp: 2200, atk: 160, mp: 200, ac: 14,
      skills: [
        { name: '그림자 급습', type: '공격', cost: { mp: 30 }, effect: '단일 대상 180 피해 (첫 턴 방어 무시)' },
        { name: '발톱 연격',   type: '공격', cost: { hp: 15 }, effect: '단일 대상 120 피해 × 2회' },
      ],
    },
    drops: [
      { id: 'aurora_pelt',    prob: 0.55, qty_min: 1, qty_max: 2 },
      { id: 'obsidian',       prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'volcanic_serpent',
    name: { ko: '화산 뱀', en: 'Volcanic Serpent' },
    icon: '🐍',
    threat: 3,
    level: 6, level_min: 5, level_max: 7,
    habitat: '화산대 용암 지층',
    desc: '화산 지층 용암 속을 헤엄치는 거대 뱀. 독니에서 화산재 독을 뿜으며, 지하 광산 깊은 곳에서 갑자기 출현한다.',
    usage: '채광 심층 조우 이벤트 — 광산 깊이 파고들수록 출현 확률 상승',
    key_stats: ['STR', 'CON'],
    special: '화산재 독 — 물린 대상 3턴간 HP 20씩 감소',
    combat: {
      hp: 2800, atk: 190, mp: 150, ac: 13,
      skills: [
        { name: '독니 공격',   type: '공격',   cost: { mp: 20 }, effect: '단일 대상 150 피해 + 독 3턴(20HP/턴)' },
        { name: '화산 분기',   type: '공격',   cost: { mp: 40 }, effect: '전방 3m 범위 화염 피해 120' },
      ],
    },
    drops: [
      { id: 'volcanic_ash_herb', prob: 0.45, qty_min: 1, qty_max: 2 },
      { id: 'obsidian',          prob: 0.30, qty_min: 1, qty_max: 1 },
      { id: 'lava_core',         prob: 0.15, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'stone_golem',
    name: { ko: '암석 골렘', en: 'Stone Golem' },
    icon: '🪨',
    threat: 3,
    level: 7, level_min: 6, level_max: 8,
    habitat: '고대 광산·화석 지대',
    desc: '고대 문명이 제작한 것으로 추정되는 암석 자동 인형. 채굴 구역에 침입자를 경고하며 방어한다. Mechanica 기술자는 제어 코드를 해킹 가능.',
    usage: 'Mechanica 전용 해킹 이벤트 — 해킹 성공 시 임시 아군. 실패 시 강화 모드 돌입',
    key_stats: ['STR', 'CON'],
    special: '고대 방어 프로토콜 — 해킹 시도 실패 시 ATK +30% 강화 모드',
    combat: {
      hp: 3800, atk: 210, mp: 100, ac: 16,
      skills: [
        { name: '암석 주먹',   type: '공격', cost: { hp: 20 }, effect: '단일 대상 190 피해' },
        { name: '방어 강화',   type: '방어', cost: { mp: 50 }, effect: '10초간 방어력 +35%' },
      ],
    },
    drops: [
      { id: 'fossil_fragment', prob: 0.50, qty_min: 1, qty_max: 2 },
      { id: 'ancient_ore',     prob: 0.25, qty_min: 1, qty_max: 1 },
      { id: 'ancient_bark',    prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
  },
  {
    id: 'ancient_guardian',
    name: { ko: '고대 수호자', en: 'Ancient Guardian' },
    icon: '⚔️',
    threat: 4,
    level: 8, level_min: 7, level_max: 9,
    habitat: '테라 노바 고대 유적',
    desc: '테라 노바 고대 문명의 유적을 지키는 거대한 인형. 네 대륙의 어떤 기술도 결합된 존재로, 마법·기계·내공·초능력 모두 부분적으로 흡수한다.',
    usage: '고대 유적 탐사 이벤트 — 대륙별 고유 약점 공략 시 보상 아이템 획득',
    key_stats: ['STR', 'INT', 'WIS'],
    special: '사원소 흡수 — 마법·기술·내공·초능력 계열 스킬 피해 20% 감소. 물리 공격에 정상 피해',
    combat: {
      hp: 4200, atk: 240, mp: 600, ac: 15,
      skills: [
        { name: '고대 격파',   type: '공격',   cost: { hp: 30 }, effect: '단일 대상 220 피해' },
        { name: '원소 흡수',   type: '버프',   cost: { mp: 60 }, effect: '8초간 마법·기술 계열 피해 50% 흡수' },
        { name: '고대의 포효', type: '군중제어', cost: { mp: 80 }, effect: '5m 내 적 2턴 행동 지연' },
      ],
    },
    drops: [
      { id: 'ancient_ore',     prob: 0.40, qty_min: 1, qty_max: 2 },
      { id: 'fossil_mineral',  prob: 0.35, qty_min: 1, qty_max: 2 },
      { id: 'spirit_stone',    prob: 0.25, qty_min: 1, qty_max: 1 },
      { id: 'ancient_bark',    prob: 0.20, qty_min: 1, qty_max: 1 },
    ],
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
