// D&D 5e 기반 게임 규칙
// buildSystemPrompt()에서 buildDndRules()를 호출해 GM 프롬프트에 주입

// ─── 1. 핵심 판정 공식 ───────────────────────────────────────────────────
// d20 + 능력치 수정치 + 숙련 보너스 >= DC → 성공
// 수정치 = floor((능력치 - 10) / 2)
// 숙련 보너스: 해당 능력치 16 이상 +4 / 12~15 +2 / 11 이하 +0

export const DND_MOD_TABLE = [
  { min: 20, mod: +5 }, { min: 18, mod: +4 }, { min: 16, mod: +3 },
  { min: 14, mod: +2 }, { min: 12, mod: +1 }, { min: 10, mod:  0 },
  { min:  8, mod: -1 }, { min:  6, mod: -2 }, { min:  4, mod: -3 },
  { min:  2, mod: -4 }, { min:  1, mod: -5 },
];

// ─── 2. 난이도 등급(DC) ──────────────────────────────────────────────────
export const DC_TABLE = [
  { dc:  5, label: '매우 쉬움', example: '안정된 땅에서 물체 들기, 익숙한 지역 길 찾기' },
  { dc: 10, label: '쉬움',     example: '상처 응급처치, 짧은 거리 추적, 평범한 자물쇠 따기' },
  { dc: 15, label: '보통',     example: '마법 아이템 감별, 미지의 지역 탐색, 경비병 설득' },
  { dc: 20, label: '어려움',   example: '고대 비문 해독, 강력한 생물 제압, 중무장 적 기습' },
  { dc: 25, label: '매우 어려움', example: '마법 봉인 해제, 신화급 유물 감별, 군중 선동' },
  { dc: 30, label: '거의 불가능', example: '봉인된 미르의 흔적 읽기, 금서 완전 해독' },
];

// ─── 3. 능력치별 사용 영역 & 기술 ───────────────────────────────────────
export const ABILITY_SKILLS = {
  STR: {
    name: '근력',
    skills: ['운동(Athletics)'],
    uses: '근접 공격, 물체 파괴, 밀기·당기기·들기, 수영, 등반',
    save: '강제 이동·속박 저항, 물리적 구속 탈출',
  },
  DEX: {
    name: '민첩',
    skills: ['곡예(Acrobatics)', '손재주(Sleight of Hand)', '은신(Stealth)'],
    uses: '원거리 공격, 회피, 선제권 판정, 덫 피하기, 자물쇠 따기, 소매치기',
    save: '광역 효과 회피(폭발·범위 마법), 낙하 피해 감소',
  },
  CON: {
    name: '건강',
    skills: ['지구력(Endurance)'],
    uses: '집중력 유지, 혹독한 환경 버티기, 독·질병 저항, 장기 행군',
    save: '독·질병·극한 환경·HP 절반 이하 버티기',
  },
  INT: {
    name: '지능',
    skills: ['비전학(Arcana)', '역사(History)', '조사(Investigation)', '자연(Nature)', '종교(Religion)'],
    uses: '마법 아이템 감별, 고대 문자 해독, 단서 분석, 함정 발견, 지도 해석',
    save: '환각·정신 조종·착각 저항',
  },
  WIS: {
    name: '지혜',
    skills: ['동물 조련(Animal Handling)', '통찰(Insight)', '의술(Medicine)', '감지(Perception)', '생존(Survival)'],
    uses: '위험 감지, 거짓말 간파, 추적, 길 찾기, 야생 생존, 치료, 생물 교감',
    save: '공포·매혹·혼란 저항',
  },
  CHA: {
    name: '매력',
    skills: ['기만(Deception)', '위협(Intimidation)', '설득(Persuasion)', '공연(Performance)'],
    uses: '협상·외교, 거짓말, 변장, 군중 설득, 상인 흥정, 지도자 호소',
    save: '빙의·영혼 지배 저항',
  },
};

// ─── 4. 이점(Advantage) · 불이점(Disadvantage) ──────────────────────────
export const ADVANTAGE_RULES = {
  advantage:    'd20을 두 번 굴려 높은 값을 사용. 상황이 유리할 때 적용.',
  disadvantage: 'd20을 두 번 굴려 낮은 값을 사용. 상황이 불리할 때 적용.',
  cancel:       '이점과 불이점이 동시에 있으면 상쇄되어 d20 1회만 굴린다.',
  examples: {
    advantage: [
      '적이 눈에 띄지 않을 때 공격', '동료의 도움을 받을 때', '해당 기술에 특기가 있는 직업',
      '상대가 넘어진 상태에서 공격', '교감·신뢰 관계에서 설득',
    ],
    disadvantage: [
      '시야가 어두운 곳에서 공격', '부상 상태로 판정', '혼란·기절 상태에서 판정',
      '처음 다루는 장비·무기', '적대적 관계에서 설득',
    ],
  },
};

// ─── 5. 전투 규칙 ────────────────────────────────────────────────────────
export const COMBAT_RULES = {
  initiative: {
    rule: '선제권: d20 + DEX 수정치. 높은 순서대로 행동. 동점이면 플레이어 우선.',
  },
  attack: {
    melee:  '근접 공격: d20 + STR 수정치 vs 적 AC. AC 이상이면 명중.',
    ranged: '원거리 공격: d20 + DEX 수정치 vs 적 AC.',
    spell:  '마법 공격: d20 + INT 또는 WIS 수정치 vs 적 AC (마법 종류에 따라 결정).',
    ac_default: '기본 AC = 10 + DEX 수정치. 갑옷·방패는 AC를 추가로 높인다.',
  },
  damage: {
    rule: '명중 시 무기·기술별 피해 주사위를 굴린다 + 능력치 수정치.',
    crit: '자연 20(nat 20): 치명타 — 피해 주사위를 두 배로 굴린다. 자동 명중.',
    fumble: '자연 1(nat 1): 치명적 실수 — 자동 빗나감. GM이 불리한 부작용을 서술한다.',
    examples: [
      '기본 근접: 1d8 + STR 수정치',
      '단검/소검: 1d6 + DEX 수정치',
      '마법 공격: 직업·기술에 따라 1d6~3d6',
      '생물 스킬: 각 생물 스탯의 ATK 수치를 기준으로 피해 결정',
    ],
  },
  hp: {
    zero: 'HP 0 도달: 의식불명 상태. 즉사하지 않는다.',
    death_save: '의식불명 시 매 턴 d20 판정. 10 이상 성공(3회 성공 시 안정), 9 이하 실패(3회 실패 시 사망).',
    stabilize: '동료가 DC 10 의술(WIS) 판정 성공 시 의식불명 상태 안정화.',
    healing: '치료 스킬/아이템 사용 시 HP 회복. 전투 외 휴식으로도 HP 일부 회복.',
  },
  monster_turn: {
    rule: '생물의 행동은 해당 생물의 스킬 표를 참고한다. HP·MP 소모를 추적하며, 스킬 비용 부족 시 기본 공격(ATK 수치 기준)만 사용한다.',
  },
};

// ─── 6. 내성 굴림(Saving Throw) ──────────────────────────────────────────
export const SAVING_THROWS = {
  rule: 'd20 + 해당 능력치 수정치 >= 효과의 DC → 저항 성공 (효과 무효 또는 절반 피해)',
  triggers: [
    { stat: 'STR', when: '속박·강제 이동·물리 구속' },
    { stat: 'DEX', when: '광역 폭발·범위 마법·낙하·덫' },
    { stat: 'CON', when: '독·질병·극한 환경·집중 마법 유지' },
    { stat: 'INT', when: '환각·정신 착란·지식 기반 함정' },
    { stat: 'WIS', when: '공포·매혹·혼란·명령 마법' },
    { stat: 'CHA', when: '빙의·영혼 속박·정체성 말살' },
  ],
};

// ─── 7. 기술 판정 시나리오 예시 ──────────────────────────────────────────
export const SKILL_SCENARIOS = [
  { scenario: '보물 지도로 위치 탐색', skill: '생존(WIS)', dc: 15, success: '정확한 위치 파악', fail: '잘못된 방향으로 이동, 시간 낭비' },
  { scenario: '보물 상자 함정 탐지', skill: '감지(WIS) 또는 조사(INT)', dc: 15, success: '함정 발견·해제 시도 가능', fail: '함정 발동, 피해 또는 저주' },
  { scenario: '보물 품질 감별', skill: '역사(INT) 또는 비전학(INT)', dc: 15, success: '정확한 가치·용도 파악', fail: '가치를 잘못 판단, 가짜에 속을 수 있음' },
  { scenario: '어둠 속 매복 탐지', skill: '감지(WIS)', dc: 14, success: '선제권 획득', fail: '기습 당함, 첫 라운드 행동 불가' },
  { scenario: 'NPC 설득·협상', skill: '설득(CHA)', dc: '상대 성향에 따라 10~25', success: '원하는 정보·협력 획득', fail: '거절, 관계 악화 가능' },
  { scenario: '마법 아이템 사용법 파악', skill: '비전학(INT)', dc: 15, success: '즉시 사용 가능', fail: '사용 실패, 우발적 효과 발생 가능' },
  { scenario: '부상자 응급처치', skill: '의술(WIS)', dc: 10, success: 'HP 1d6 + WIS 수정치 회복', fail: '효과 없음 (HP 추가 감소는 없음)' },
  { scenario: '적 추적', skill: '생존(WIS)', dc: '환경에 따라 10~20', success: '적 위치 파악', fail: '흔적 놓침, 매복 위험' },
  { scenario: '자물쇠·함정 해제', skill: '손재주(DEX)', dc: '잠금 수준에 따라 10~25', success: '해제 성공', fail: '실패, 소음 발생 또는 함정 발동' },
  { scenario: '거짓말·변장 간파', skill: '통찰(WIS) vs 기만(CHA)', dc: '상대 CHA 판정 결과', success: '진실 파악', fail: '속임수에 넘어감' },
];

// ─── 8. 보물 결과 판정 ───────────────────────────────────────────────────
export const TREASURE_TABLE = {
  quality: {
    rule: 'd20 + INT 수정치로 보물 품질 결정',
    results: [
      { range: [1, 3],   label: '꽝',        desc: '빈 상자, 함정, 또는 이미 약탈된 장소' },
      { range: [4, 8],   label: '일반',       desc: '소량의 금화, 기본 소모품, 평범한 장비' },
      { range: [9, 13],  label: '양호',       desc: '귀금속, 유용한 약초, 품질 좋은 무기·방어구' },
      { range: [14, 17], label: '희귀',       desc: '마법 아이템, 희귀 영약, 고대 유물 조각' },
      { range: [18, 19], label: '매우 희귀',  desc: '강력한 마법 아이템, 대륙 관련 비밀 문서' },
      { range: [20, 99], label: '전설',       desc: '전설급 유물, 미르의 흔적, 세계관을 바꿀 단서' },
    ],
  },
  type: {
    rule: 'd6으로 보물 종류 결정',
    results: [
      { roll: 1, type: '금화·자원',    desc: '금화, 철광석, 마나 결정 등 대륙별 화폐/자원' },
      { roll: 2, type: '장비·무기',    desc: '무기, 방어구, 도구' },
      { roll: 3, type: '소모품',       desc: '영약, 물약, 두루마리, 식량' },
      { roll: 4, type: '정보·지식',    desc: '지도, 암호 문서, 일지, 비밀 경로' },
      { roll: 5, type: '마법 아이템',  desc: '주문이 새겨진 물건, 마나 충전 아이템' },
      { roll: 6, type: '스토리 아이템', desc: '세계관 단서, 퀘스트 아이템, 대륙 관련 유물' },
    ],
  },
};

// ─── 9. 상태 이상(Conditions) ────────────────────────────────────────────
export const CONDITIONS = [
  { name: '독(Poisoned)',      effect: '모든 공격·판정에 불이점', save: 'CON DC 13으로 매 턴 종료 시 제거 시도' },
  { name: '마비(Paralyzed)',   effect: '행동 불능, 공격 자동 치명타 피격', save: 'CON DC 15' },
  { name: '실명(Blinded)',     effect: '공격에 불이점, 피격에 이점', save: '지속 시간 경과 또는 치료' },
  { name: '공포(Frightened)',  effect: '공포 원천 방향으로 행동 불가, 판정 불이점', save: 'WIS DC 13' },
  { name: '매혹(Charmed)',     effect: '매혹한 자 공격 불가, 사회 판정 이점 제공', save: 'WIS DC 14' },
  { name: '기절(Stunned)',     effect: '행동·이동 불능, 저항 판정 불가', save: '지속 턴 경과' },
  { name: '속박(Restrained)',  effect: '이동 불가, 공격·DEX 판정에 불이점', save: 'STR 또는 CON DC 14 탈출' },
  { name: '혼란(Confused)',    effect: 'WIS 판정 실패 시 행동 반전', save: 'WIS DC 13 매 턴' },
  { name: '빙결(Frozen)',      effect: '이동·행동 불능, 물리 피해에 취약', save: 'CON DC 14, 화염 피해로도 해제' },
  { name: '출혈(Bleeding)',    effect: '매 턴 HP 1d4 감소', save: '의술(WIS) DC 12 또는 치료로 종료' },
];

// ─── 10. 휴식 규칙 ───────────────────────────────────────────────────────
export const REST_RULES = {
  short: {
    duration: '약 1시간',
    effect: 'HP 주사위(CON 수정치 추가)를 굴려 HP 회복. 전투 당 1회 사용 가능.',
    formula: '1d8 + CON 수정치 (직업 따라 다를 수 있음)',
  },
  long: {
    duration: '약 8시간 (안전한 장소 필요)',
    effect: 'HP 전량 회복, MP(마나/내공) 전량 회복. 현재 상태 이상 대부분 해제.',
    restriction: '전투 24시간 내 1회만 가능. 위험한 장소에서는 WIS DC 12 판정 필요.',
  },
};

// ─── 시스템 프롬프트용 텍스트 생성 ──────────────────────────────────────
export function buildDndRules() {
  const dcRows = DC_TABLE.map(d =>
    `  DC ${d.dc} (${d.label}): ${d.example}`
  ).join('\n');

  const abilityRows = Object.entries(ABILITY_SKILLS).map(([k, v]) =>
    `  ${k}(${v.name}): ${v.uses}`
  ).join('\n');

  const savingRows = SAVING_THROWS.triggers.map(t =>
    `  ${t.stat}: ${t.when}`
  ).join('\n');

  const conditionRows = CONDITIONS.map(c =>
    `  [${c.name}] ${c.effect} / 해제: ${c.save}`
  ).join('\n');

  const treasureQ = TREASURE_TABLE.quality.results.map(r =>
    `  ${r.range[0]}~${r.range[1]}: ${r.label} — ${r.desc}`
  ).join('\n');

  const treasureT = TREASURE_TABLE.type.results.map(r =>
    `  ${r.roll}: ${r.type} — ${r.desc}`
  ).join('\n');

  const scenarioRows = SKILL_SCENARIOS.map(s =>
    `  [${s.scenario}] ${s.skill} DC ${s.dc} → 성공: ${s.success} / 실패: ${s.fail}`
  ).join('\n');

  return `[게임 규칙 — D&D 5e 기반, 게임 마스터 필수 준수]

■ 핵심 판정 공식
  d20 + 능력치 수정치 >= DC → 성공 (수정치 = (능력치-10)÷2, 소수점 버림)
  숙련 보너스: 해당 능력치 16 이상 +4 / 12~15 +2 / 11 이하 +0
  이점(Advantage): 유리한 상황 → d20 두 번, 높은 값 사용
  불이점(Disadvantage): 불리한 상황 → d20 두 번, 낮은 값 사용

■ 난이도 등급(DC)
${dcRows}

■ 능력치 사용 영역
${abilityRows}

■ 내성 굴림(Saving Throw) — d20 + 해당 수정치 >= 효과 DC → 저항
${savingRows}

■ 전투 규칙
  선제권: d20 + DEX 수정치 (높은 순 행동)
  공격: d20 + STR(근접)/DEX(원거리)/INT·WIS(마법) vs 적 AC
  AC 기본값: 10 + DEX 수정치 (갑옷 착용 시 추가)
  피해: 무기/기술 주사위 + 능력치 수정치
  자연 20 (치명타): 피해 주사위 2배, 자동 명중
  자연 1 (치명적 실수): 자동 빗나감, GM이 불리한 부작용 서술
  HP 0: 의식불명 → 매 턴 d20 생존 판정 (10+ 성공, 3회 성공=안정, 3회 실패=사망)

■ 기술 판정 시나리오 예시
${scenarioRows}

■ 보물 품질 판정 (d20 + INT 수정치)
${treasureQ}

■ 보물 종류 판정 (d6)
${treasureT}

■ 상태 이상
${conditionRows}

■ 휴식
  단기 휴식(~1시간): 1d8 + CON 수정치 HP 회복 (전투당 1회)
  장기 휴식(~8시간, 안전한 장소): HP·MP 전량 회복, 상태 이상 해제

■ GM 판정 지침
  · 플레이어 행동마다 관련 능력치와 DC를 결정해 판정 결과를 서술한다.
  · 판정 불필요한 단순 행동(대화, 평지 이동 등)은 자동 성공 처리한다.
  · 판정 결과는 성공/실패로 이분하지 않고 성공 차이(얼마나 높게 성공했는가)에 따라 결과의 질을 조정한다.
  · 모든 판정 결과는 hp_delta, status, items_gained/items_lost 필드에 반영한다.`;
}
