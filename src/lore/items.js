// 직업별 기본 아이템 설정
// ac_bonus: JOB_BASE_AC에 더해지는 방어 보너스 (원본 수치를 D&D AC 스케일로 변환)
// skill.flatDamage: 고정 피해량 (직업 스킬의 주사위 굴림 대신 사용)
// skill.healAmount: 치유량 (hp_delta에 양수로 적용)
// skill.attackStat: 공격 판정 능력치 (한국어)

export const ITEM_SLOTS = ['무기', '상체갑옷', '하체갑옷', '투구', '장갑', '신발', '목걸이', '반지', '허리띠', '방패'];

export const JOB_DEFAULT_ITEM = {

  // ═══ 마법 대륙 ═══════════════════════════════════════════════════════
  kn: {
    type: '상체 갑옷', slot: '상체갑옷', name: '각인 갑옷',
    desc: '마법 문양이 새겨진 기본 갑옷',
    ac_bonus: 2, statsText: '마법 저항 +10',
    skill: { name: '마법 충격', passive: false,
      effect: '갑옷의 마법 문양에서 에너지를 방출해 적 1명에게 20 피해',
      cost: { mp: 10 }, flatDamage: 20, attackStat: '근력' },
  },

  am: {
    type: '지팡이', slot: '무기', name: '대마법사의 지팡이',
    desc: '강력한 마력을 담은 기본 지팡이',
    ac_bonus: 0, statsText: '마력 +20',
    skill: { name: '원소 폭발', passive: false,
      effect: '지팡이에서 강력한 원소 에너지를 방출해 적 1명에게 35 피해',
      cost: { mp: 20 }, flatDamage: 35, attackStat: '지력' },
  },

  ma: {
    type: '단검', slot: '무기', name: '그림자 마검',
    desc: '마법이 깃든 은밀한 단검',
    ac_bonus: 0, statsText: '치명타 확률 +7%',
    skill: { name: '그림자 일격', passive: false,
      effect: '그림자 속으로 녹아들었다가 급습, 적 1명에게 25 피해',
      cost: { mp: 12 }, flatDamage: 25, attackStat: '민첩' },
  },

  hl: {
    type: '목걸이', slot: '목걸이', name: '성약의 목걸이',
    desc: '신성한 계약의 힘을 담은 목걸이',
    ac_bonus: 0, statsText: '치유력 +15',
    skill: { name: '성약 치유', passive: false,
      effect: '성약의 힘으로 아군 1명 HP 30 회복',
      cost: { mp: 15 }, healAmount: 30 },
  },

  fb: {
    type: '반지', slot: '반지', name: '봉인의 반지',
    desc: '금서의 힘을 제어하는 기본 반지',
    ac_bonus: 0, statsText: '정신력 +12',
    skill: { name: '금서 해방', passive: false,
      effect: '반지에 봉인된 금서의 힘을 방출해 적 1명에게 40 피해',
      cost: { hp: 10, mp: 15 }, flatDamage: 40, attackStat: '지력' },
  },

  // ═══ 과학 대륙 ═══════════════════════════════════════════════════════
  ar: {
    type: '상체 갑옷', slot: '상체갑옷', name: '동력 갑옷',
    desc: '기계식 동력으로 강화된 전투용 갑옷',
    ac_bonus: 3, statsText: '체력 +20, 방어력 +15',
    skill: { name: '파워 스트라이크', passive: false,
      effect: '동력 갑옷 출력을 최대로 올려 강화된 주먹으로 적 1명에게 25 피해',
      cost: { hp: 10 }, flatDamage: 25, attackStat: '근력' },
  },

  iv: {
    type: '장갑', slot: '장갑', name: '기술자의 장갑',
    desc: '다양한 도구를 내장한 기본 장갑',
    ac_bonus: 1, statsText: '장비 수리 속도 +15%',
    skill: { name: '기계 폭탄', passive: false,
      effect: '장갑 내장 폭탄 발사 장치로 소형 폭탄을 투척, 적 1명에게 20 피해',
      cost: { hp: 5 }, flatDamage: 20, attackStat: '지력' },
  },

  hk: {
    type: '목걸이', slot: '목걸이', name: '데이터 링크 목걸이',
    desc: '네트워크 접속을 돕는 기본 장신구',
    ac_bonus: 0, statsText: '정신력 +15',
    skill: { name: '시스템 교란', passive: false,
      effect: '목걸이를 통해 적의 기계·장비를 해킹, 1턴간 행동 불가',
      cost: { mp: 12 } },
  },

  md: {
    type: '허리띠', slot: '허리띠', name: '응급 키트 벨트',
    desc: '의료 도구가 내장된 기본 벨트',
    ac_bonus: 0, statsText: '치유력 +12',
    skill: { name: '응급 처치', passive: false,
      effect: '벨트 내 의료 도구로 아군 1명 HP 25 회복',
      cost: { hp: 8 }, healAmount: 25 },
  },

  nw: {
    type: '투구', slot: '투구', name: '실험체 헬멧',
    desc: '인간+기계 혼합체를 위한 기본 보호구',
    ac_bonus: 1, statsText: '체력 +10, 정신력 +10',
    skill: { name: '융합 폭발', passive: false,
      effect: '헬멧의 기계 회로와 정신력이 공명, 에너지를 폭발적으로 방출해 적 1명에게 30 피해',
      cost: { hp: 10, mp: 10 }, flatDamage: 30, attackStat: '체력' },
  },

  // ═══ 무협 대륙 ═══════════════════════════════════════════════════════
  sw: {
    type: '칼', slot: '무기', name: '초심검',
    desc: '검술 수련생이 사용하는 기본 장검',
    ac_bonus: 0, statsText: '공격력 +5',
    skill: { name: '일섬', passive: false,
      effect: '검기를 실은 빠른 베기로 적 1명에게 15 피해',
      cost: { hp: 5 }, flatDamage: 15, attackStat: '근력' },
  },

  sc: {
    type: '지팡이', slot: '무기', name: '술사의 지팡이',
    desc: '원소와 기운을 다루는 기본 지팡이',
    ac_bonus: 0, statsText: '마력 +10',
    skill: { name: '원소탄', passive: false,
      effect: '지팡이로 기를 응축해 작은 원소 구체를 발사, 적 1명에게 18 피해',
      cost: { mp: 8 }, flatDamage: 18, attackStat: '지혜' },
  },

  jk: {
    type: '단검', slot: '무기', name: '그림자 단검',
    desc: '은밀한 암살용 기본 무기',
    ac_bonus: 0, statsText: '치명타 확률 +5%',
    skill: { name: '암살', passive: false,
      effect: '경공으로 순식간에 적 후방에 나타나 급소를 노린 일격, 적 1명에게 20 피해',
      cost: { hp: 8 }, flatDamage: 20, attackStat: '민첩' },
  },

  us: {
    type: '목걸이', slot: '목걸이', name: '치유의 목걸이',
    desc: '치유력을 증폭하는 기본 장신구',
    ac_bonus: 0, statsText: '회복력 +12',
    skill: { name: '치유술', passive: false,
      effect: '목걸이의 기운을 이용해 아군 1명 HP 25 회복',
      cost: { mp: 10 }, healAmount: 25 },
  },

  dh: {
    type: '허리띠', slot: '허리띠', name: '내공의 띠',
    desc: '마법과 무공을 융합한 내공을 안정시키는 띠',
    ac_bonus: 1, statsText: '내공 회복 속도 +10%',
    skill: { name: '기공파', passive: false,
      effect: '내공과 마기를 합쳐 충격파를 방출, 적 1명에게 22 피해',
      cost: { hp: 10, mp: 5 }, flatDamage: 22, attackStat: '근력' },
  },

  // ═══ 초능력 대륙 ═════════════════════════════════════════════════════
  fc: {
    type: '방패', slot: '방패', name: '역장의 방패',
    desc: '에너지 결계를 생성하는 기본 방패',
    ac_bonus: 2, statsText: '방어력 +12',
    skill: { name: '역장 충격', passive: false,
      effect: '방패에서 역장 에너지를 방출해 적 1명을 밀어내며 18 피해',
      cost: { mp: 10 }, flatDamage: 18, attackStat: '지혜' },
  },

  tk: {
    type: '마법막대', slot: '무기', name: '사이오닉 로드',
    desc: '염동력을 증폭하는 기본 막대',
    ac_bonus: 0, statsText: '정신 공격력 +8',
    skill: { name: '염동파', passive: false,
      effect: '막대를 통해 염동력을 증폭, 충격파로 적 1명에게 20 피해',
      cost: { mp: 12 }, flatDamage: 20, attackStat: '민첩' },
  },

  jy: {
    type: '반지', slot: '반지', name: '환영의 반지',
    desc: '마음읽기와 환영술을 돕는 기본 반지',
    ac_bonus: 0, statsText: '은신 지속시간 +10%',
    skill: { name: '환영 교란', passive: false,
      effect: '반지로 환영을 만들어 적의 시야를 혼란시켜 1턴간 행동 불가',
      cost: { mp: 8 } },
  },

  ep: {
    type: '장갑', slot: '장갑', name: '감응 장갑',
    desc: '환자의 고통을 흡수하는 기본 장갑',
    ac_bonus: 1, statsText: '치유력 +10',
    skill: { name: '공감 치유', passive: false,
      effect: '장갑을 통해 생명 에너지를 전달, 아군 1명 HP 25 회복',
      cost: { mp: 12 }, healAmount: 25 },
  },

  aw: {
    type: '상체 갑옷', slot: '상체갑옷', name: '실험복 잔해',
    desc: '새사람 프로젝트에서 탈출한 자의 기본 복장',
    ac_bonus: 1, statsText: '정신력 +15',
    skill: { name: '폭주', passive: false,
      effect: '각성 에너지를 제어 없이 폭발시켜 적 1명에게 35 피해',
      cost: { mp: 20 }, flatDamage: 35, attackStat: '지혜' },
  },
};

// ═══ 제작 가능 아이템 (등급별) ════════════════════════════════════════════
// tier: '평범' | '비범' | '희귀' | '유일'
// recipe_id: recipes.js의 레시피 id (Story 2.3에서 연결)

export const CRAFTABLE_ITEMS = [

  // ─── 무기 ────────────────────────────────────────────────────────────────
  {
    id: 'iron_sword',      slot: '무기', tier: '평범',
    name: '철제 검',       desc: '철광석으로 만든 기본 검. 어떤 직업도 쓸 수 있다.',
    ac_bonus: 0, statsText: '공격력 +8',
    skill: { name: '기본 베기', passive: false,
      effect: '철제 검으로 적 1명에게 18 피해',
      cost: { hp: 5 }, flatDamage: 18, attackStat: '근력' },
    recipe_id: 'r_iron_sword',
  },
  {
    id: 'iron_dagger',     slot: '무기', tier: '평범',
    name: '철제 단검',     desc: '빠르고 가벼운 단검. 민첩 위주 직업에 적합.',
    ac_bonus: 0, statsText: '치명타 확률 +5%',
    skill: { name: '빠른 찌르기', passive: false,
      effect: '빠른 찌르기로 적 1명에게 14 피해',
      cost: { hp: 3 }, flatDamage: 14, attackStat: '민첩' },
    recipe_id: 'r_iron_dagger',
  },
  {
    id: 'frost_blade',     slot: '무기', tier: '비범',
    name: '냉기 단검',     desc: '빙결 결정체를 날에 녹여 만든 단검. 명중 시 냉기 디버프.',
    ac_bonus: 0, statsText: '냉기 피해 +10, 치명타 확률 +8%',
    skill: { name: '냉기 일격', passive: false,
      effect: '냉기가 깃든 일격으로 적 1명에게 28 피해 + 1턴 이동속도 감소',
      cost: { hp: 5, mp: 8 }, flatDamage: 28, attackStat: '민첩' },
    recipe_id: 'r_frost_blade',
  },
  {
    id: 'aurora_staff',    slot: '무기', tier: '희귀',
    name: '오로라 지팡이', desc: '오로라 결정을 핵심에 박은 지팡이. 마력이 크게 증폭된다.',
    ac_bonus: 0, statsText: '마력 +25, MP 최대치 +30',
    skill: { name: '오로라 폭발', passive: false,
      effect: '오로라 에너지를 폭발시켜 적 1명에게 45 피해',
      cost: { mp: 25 }, flatDamage: 45, attackStat: '지력' },
    recipe_id: 'r_aurora_staff',
  },
  {
    id: 'mirr_claw',       slot: '무기', tier: '유일',
    name: '미르의 발톱',   desc: '빙혈 미르의 비늘과 혈석으로 만든 유일무이한 무기. 얼음과 불을 동시에 다룬다.',
    ac_bonus: 0, statsText: '공격력 +40, 냉기·화염 피해 +20',
    skill: { name: '빙염 강타', passive: false,
      effect: '빙염 에너지를 실어 적 1명에게 70 피해. 빙결·화상 동시 적용',
      cost: { hp: 10, mp: 30 }, flatDamage: 70, attackStat: '근력' },
    recipe_id: 'r_mirr_claw',
  },

  // ─── 상체갑옷 ─────────────────────────────────────────────────────────────
  {
    id: 'iron_chest',      slot: '상체갑옷', tier: '평범',
    name: '철제 흉갑',     desc: '철광석으로 만든 기본 흉갑.',
    ac_bonus: 2, statsText: '방어력 +10',
    recipe_id: 'r_iron_chest',
  },
  {
    id: 'ironhide_chest',  slot: '상체갑옷', tier: '비범',
    name: '철갑 흉갑',     desc: '철갑 설곰의 금속 갑각으로 보강한 흉갑. 무겁지만 방어력이 뛰어나다.',
    ac_bonus: 3, statsText: '방어력 +18, 체력 +10',
    recipe_id: 'r_ironhide_chest',
  },
  {
    id: 'glacier_armor',   slot: '상체갑옷', tier: '희귀',
    name: '빙하 갑옷',     desc: '빙하 거북 등껍질을 가공한 갑옷. 냉기 저항과 방어력이 모두 높다.',
    ac_bonus: 4, statsText: '방어력 +22, 냉기 저항 +25%',
    recipe_id: 'r_glacier_armor',
  },
  {
    id: 'mirr_scale_armor', slot: '상체갑옷', tier: '유일',
    name: '미르 비늘 갑옷', desc: '빙혈 미르의 비늘로 만든 갑옷. 모든 속성 저항을 갖는다.',
    ac_bonus: 6, statsText: '방어력 +35, 모든 속성 저항 +20%',
    recipe_id: 'r_mirr_scale_armor',
  },

  // ─── 하체갑옷 ─────────────────────────────────────────────────────────────
  {
    id: 'iron_greaves',    slot: '하체갑옷', tier: '평범',
    name: '철제 각반',     desc: '철광석으로 만든 기본 각반.',
    ac_bonus: 1, statsText: '방어력 +7',
    recipe_id: 'r_iron_greaves',
  },
  {
    id: 'aurora_greaves',  slot: '하체갑옷', tier: '비범',
    name: '오로라 각반',   desc: '오로라 모피를 안감으로 댄 각반. 민첩성이 향상된다.',
    ac_bonus: 1, statsText: '방어력 +10, 민첩 +5',
    recipe_id: 'r_aurora_greaves',
  },
  {
    id: 'ancient_greaves', slot: '하체갑옷', tier: '희귀',
    name: '고대 각반',     desc: '고대 광석으로 만든 각반. 이동속도와 방어력을 동시에 높인다.',
    ac_bonus: 2, statsText: '방어력 +15, 이동속도 +10%',
    recipe_id: 'r_ancient_greaves',
  },

  // ─── 투구 ────────────────────────────────────────────────────────────────
  {
    id: 'iron_helm',       slot: '투구', tier: '평범',
    name: '철제 투구',     desc: '철광석으로 만든 기본 투구.',
    ac_bonus: 1, statsText: '방어력 +6',
    recipe_id: 'r_iron_helm',
  },
  {
    id: 'fossil_helm',     slot: '투구', tier: '비범',
    name: '화석 투구',     desc: '화석 조각으로 보강한 투구. 정신 공격 저항이 붙는다.',
    ac_bonus: 2, statsText: '방어력 +12, 정신 저항 +15%',
    recipe_id: 'r_fossil_helm',
  },
  {
    id: 'spirit_helm',     slot: '투구', tier: '희귀',
    name: '영혼 투구',     desc: '영혼 결정이 박힌 투구. 지혜와 정신력을 크게 높인다.',
    ac_bonus: 2, statsText: '방어력 +14, 지혜 +8, MP 최대치 +20',
    recipe_id: 'r_spirit_helm',
  },

  // ─── 장갑 ────────────────────────────────────────────────────────────────
  {
    id: 'iron_gloves',     slot: '장갑', tier: '평범',
    name: '철제 장갑',     desc: '철광석으로 만든 기본 장갑.',
    ac_bonus: 1, statsText: '방어력 +5',
    recipe_id: 'r_iron_gloves',
  },
  {
    id: 'aurora_gloves',   slot: '장갑', tier: '비범',
    name: '오로라 장갑',   desc: '오로라 모피로 안감을 댄 장갑. 마법 스킬 비용이 줄어든다.',
    ac_bonus: 1, statsText: '방어력 +8, 스킬 MP 소모 -10%',
    recipe_id: 'r_aurora_gloves',
  },
  {
    id: 'lava_gauntlets',  slot: '장갑', tier: '희귀',
    name: '용암 건틀릿',   desc: '용암 핵을 손등에 박은 장갑. 주먹 공격에 화염 피해가 추가된다.',
    ac_bonus: 2, statsText: '방어력 +12, 근접 공격 화염 피해 +15',
    skill: { name: '용암 주먹', passive: false,
      effect: '용암 에너지를 실어 적 1명에게 30 피해',
      cost: { mp: 15 }, flatDamage: 30, attackStat: '근력' },
    recipe_id: 'r_lava_gauntlets',
  },

  // ─── 신발 ────────────────────────────────────────────────────────────────
  {
    id: 'leather_boots',   slot: '신발', tier: '평범',
    name: '가죽 신발',     desc: '테라 노바 풀로 엮은 기본 신발.',
    ac_bonus: 0, statsText: '이동속도 +5%',
    recipe_id: 'r_leather_boots',
  },
  {
    id: 'frost_boots',     slot: '신발', tier: '비범',
    name: '빙결 신발',     desc: '한기 이끼로 안창을 댄 신발. 빙결 지형에서도 민첩하게 움직인다.',
    ac_bonus: 1, statsText: '이동속도 +12%, 빙결 지형 페널티 무효',
    recipe_id: 'r_frost_boots',
  },
  {
    id: 'shadow_boots',    slot: '신발', tier: '희귀',
    name: '그림자 신발',   desc: '흑요석 조각을 밑창에 박은 신발. 은신 시 발소리가 완전히 사라진다.',
    ac_bonus: 1, statsText: '이동속도 +18%, 은신 탐지 저항 +20%',
    recipe_id: 'r_shadow_boots',
  },

  // ─── 목걸이 ───────────────────────────────────────────────────────────────
  {
    id: 'liferoot_amulet', slot: '목걸이', tier: '평범',
    name: '영약 목걸이',   desc: '영약 뿌리를 엮어 만든 목걸이. HP 회복 속도가 약간 오른다.',
    ac_bonus: 0, statsText: 'HP 회복 +8',
    recipe_id: 'r_liferoot_amulet',
  },
  {
    id: 'aurora_necklace', slot: '목걸이', tier: '비범',
    name: '오로라 목걸이', desc: '오로라 꽃잎을 감싸 만든 목걸이. 텔레파시 계열 스킬이 강화된다.',
    ac_bonus: 0, statsText: '지혜 +6, 텔레파시 스킬 효과 +15%',
    recipe_id: 'r_aurora_necklace',
  },
  {
    id: 'mana_pendant',    slot: '목걸이', tier: '비범',
    name: '마나 메탈 펜던트', desc: '마나 메탈 조각을 가공한 펜던트. MP 최대치와 회복력이 오른다.',
    ac_bonus: 0, statsText: 'MP 최대치 +25, MP 회복 +10',
    recipe_id: 'r_mana_pendant',
  },
  {
    id: 'spirit_necklace', slot: '목걸이', tier: '희귀',
    name: '영혼 목걸이',   desc: '영혼 결정을 핵심에 담은 목걸이. 모든 정신 능력치가 크게 오른다.',
    ac_bonus: 0, statsText: '지혜 +10, 지력 +8, MP 최대치 +35',
    recipe_id: 'r_spirit_necklace',
  },

  // ─── 반지 ────────────────────────────────────────────────────────────────
  {
    id: 'iron_ring',       slot: '반지', tier: '평범',
    name: '철제 반지',     desc: '철광석으로 만든 기본 반지. 체력이 약간 오른다.',
    ac_bonus: 0, statsText: '체력 +5',
    recipe_id: 'r_iron_ring',
  },
  {
    id: 'glacier_ring',    slot: '반지', tier: '비범',
    name: '빙하 반지',     desc: '빙하 원석을 박은 반지. 냉기 스킬 위력이 오른다.',
    ac_bonus: 0, statsText: '냉기 스킬 피해 +12%',
    recipe_id: 'r_glacier_ring',
  },
  {
    id: 'mirr_ring',       slot: '반지', tier: '유일',
    name: '미르의 반지',   desc: '미르 광석으로 만든 반지. 모든 능력치에 보정이 붙는다.',
    ac_bonus: 1, statsText: '모든 능력치 +4, 스킬 피해 +15%',
    recipe_id: 'r_mirr_ring',
  },

  // ─── 허리띠 ───────────────────────────────────────────────────────────────
  {
    id: 'grass_belt',      slot: '허리띠', tier: '평범',
    name: '풀 허리띠',     desc: '테라 노바 풀로 엮은 기본 허리띠.',
    ac_bonus: 0, statsText: '소지 무게 +10%',
    recipe_id: 'r_grass_belt',
  },
  {
    id: 'ancient_belt',    slot: '허리띠', tier: '비범',
    name: '고대 허리띠',   desc: '고대 나무껍질로 만든 허리띠. 내구성이 뛰어나다.',
    ac_bonus: 1, statsText: '방어력 +6, 소지 무게 +20%',
    recipe_id: 'r_ancient_belt',
  },
  {
    id: 'lava_belt',       slot: '허리띠', tier: '희귀',
    name: '용암 허리띠',   desc: '용암석으로 만든 허리띠. 화염 저항과 근력이 오른다.',
    ac_bonus: 1, statsText: '방어력 +9, 근력 +6, 화염 저항 +20%',
    recipe_id: 'r_lava_belt',
  },

  // ─── 방패 ────────────────────────────────────────────────────────────────
  {
    id: 'iron_shield',     slot: '방패', tier: '평범',
    name: '철제 방패',     desc: '철광석으로 만든 기본 방패.',
    ac_bonus: 2, statsText: '방어력 +12',
    recipe_id: 'r_iron_shield',
  },
  {
    id: 'fossil_shield',   slot: '방패', tier: '비범',
    name: '화석 방패',     desc: '화석 조각으로 보강한 방패. 무겁지만 방어력이 높다.',
    ac_bonus: 3, statsText: '방어력 +18',
    recipe_id: 'r_fossil_shield',
  },
  {
    id: 'spirit_shield',   slot: '방패', tier: '희귀',
    name: '영혼 방패',     desc: '영혼 결정을 박은 방패. 물리·마법 방어를 동시에 높인다.',
    ac_bonus: 4, statsText: '방어력 +24, 마법 저항 +15%',
    skill: { name: '영혼 방벽', passive: false,
      effect: '영혼 방패의 에너지로 3초간 피해 무효 방어막 생성',
      cost: { mp: 20 } },
    recipe_id: 'r_spirit_shield',
  },
];

// 아이템 목록 전체 AC 보너스 합계
export function getItemsAC(items) {
  if (!items?.length) return 0;
  return items.reduce((sum, item) => sum + (item.ac_bonus ?? 0), 0);
}

// 시스템 프롬프트용 아이템 텍스트 (full)
export function buildItemPrompt(items) {
  if (!items?.length) return '';
  const lines = items.map(item => {
    const acStr = item.ac_bonus > 0 ? ` AC+${item.ac_bonus}` : '';
    let skillLine = '';
    if (item.skill) {
      const mpC = item.skill.cost?.mp ? `MP${item.skill.cost.mp}` : '';
      const hpC = item.skill.cost?.hp ? `HP${item.skill.cost.hp}` : '';
      const costStr = [hpC, mpC].filter(Boolean).join('+') || '무비용';
      skillLine = `\n    내장 스킬: ${item.skill.name} [액티브 ${costStr}] — ${item.skill.effect}`;
    }
    return `  · ${item.name} (${item.type})${acStr} — ${item.desc}. ${item.statsText}${skillLine}`;
  }).join('\n');
  return `[장비 아이템]\n${lines}`;
}

// 시스템 프롬프트용 아이템 텍스트 (compact)
export function buildItemPromptCompact(items) {
  if (!items?.length) return '';
  return '[아이템] ' + items.map(item => {
    const acStr = item.ac_bonus > 0 ? ` AC+${item.ac_bonus}` : '';
    const skillStr = item.skill
      ? ` / ${item.skill.name}(${item.skill.cost?.mp ? 'MP'+item.skill.cost.mp : ''}${item.skill.cost?.hp ? 'HP'+item.skill.cost.hp : ''}): ${item.skill.effect}`
      : '';
    return `${item.name}(${item.type})${acStr}${skillStr}`;
  }).join(', ');
}
