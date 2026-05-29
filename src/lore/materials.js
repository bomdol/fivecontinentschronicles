// 테라 노바 재료 데이터 — 아이템 제작 시스템 기반
// source: 'monster' | 'gather' | 'mine'
// rarity: '평범' | '비범' | '희귀' | '유일'

export const MATERIALS = [

  // ═══ 괴물 드랍 재료 (12종) ══════════════════════════════════════════════

  {
    id: 'frost_crystal',
    name: { ko: '빙결 결정체', en: 'Frost Crystal' },
    desc: '빙결 곤충군의 몸에서 떨어진 얼음 결정. 냉기 무기·방어구 제작에 쓰인다.',
    source: 'monster', creature_id: 'frost_swarm', habitat: null,
    rarity: '평범',
  },
  {
    id: 'aurora_tentacle',
    name: { ko: '발광 촉수', en: 'Aurora Tentacle' },
    desc: '극광 해파리의 촉수. 절단 후에도 희미하게 빛난다. 정신 방어 장신구 재료.',
    source: 'monster', creature_id: 'aurora_jellyfish', habitat: null,
    rarity: '비범',
  },
  {
    id: 'aurora_pelt',
    name: { ko: '오로라 모피', en: 'Aurora Pelt' },
    desc: '극광 늑대의 털. 오로라 빛을 머금어 경량 방어구로 만들면 민첩 보정이 붙는다.',
    source: 'monster', creature_id: 'aurora_wolf', habitat: null,
    rarity: '비범',
  },
  {
    id: 'glacier_shell',
    name: { ko: '빙하 등껍질', en: 'Glacier Shell' },
    desc: '빙하 거북의 등딱지 파편. 두껍고 단단해 최상급 갑옷 소재로 꼽힌다.',
    source: 'monster', creature_id: 'cryo_turtle', habitat: null,
    rarity: '희귀',
  },
  {
    id: 'spirit_crystal',
    name: { ko: '영혼 결정', en: 'Spirit Crystal' },
    desc: '빙결 영혼곰에게서 얻은 반투명 결정. 정신력을 증폭하는 장신구 핵심 재료.',
    source: 'monster', creature_id: 'frost_spirit_bear', habitat: null,
    rarity: '희귀',
  },
  {
    id: 'frostwhale_fat',
    name: { ko: '빙해 고래 지방', en: 'Frostwhale Fat' },
    desc: '빙해 고래의 피하 지방. 방한 처리와 무기 윤활에 폭넓게 쓰인다.',
    source: 'monster', creature_id: 'frostwhale', habitat: null,
    rarity: '평범',
  },
  {
    id: 'lava_core',
    name: { ko: '용암 핵', en: 'Lava Core' },
    desc: '용암 정령의 중심부에서 추출한 응고된 마그마 결정. 화염 무기 제작에 필수.',
    source: 'monster', creature_id: 'pyroclast_elemental', habitat: null,
    rarity: '희귀',
  },
  {
    id: 'iron_hide',
    name: { ko: '금속 갑각', en: 'Iron Hide' },
    desc: '철갑 설곰의 금속성 피부 조각. 철광석보다 밀도가 높아 강인한 갑옷을 만들 수 있다.',
    source: 'monster', creature_id: 'ironhide_bear', habitat: null,
    rarity: '비범',
  },
  {
    id: 'fossil_fragment',
    name: { ko: '화석 조각', en: 'Fossil Fragment' },
    desc: '화석 거인의 몸에서 떨어진 고대 암석. 고대 문명 유물 복원과 중형 갑옷 소재로 쓰인다.',
    source: 'monster', creature_id: 'fossil_titan', habitat: null,
    rarity: '희귀',
  },
  {
    id: 'mirr_bloodstone',
    name: { ko: '미르 혈석', en: 'Mirr Bloodstone' },
    desc: '혈설곰 체내에 응고된 미르의 피. 강렬한 붉은 빛을 발하며 유일 무기 제작에 필요하다.',
    source: 'monster', creature_id: 'bloodsnow_bear', habitat: null,
    rarity: '유일',
  },
  {
    id: 'mirr_scale',
    name: { ko: '미르 비늘', en: 'Mirr Scale' },
    desc: '빙혈 미르에게서 얻은 반룡 비늘. 얼음과 화염의 에너지를 동시에 담아 최강 방어구 소재.',
    source: 'monster', creature_id: 'glacier_wyrm', habitat: null,
    rarity: '유일',
  },
  {
    id: 'kraken_fang',
    name: { ko: '크라켄 이빨', en: 'Kraken Fang' },
    desc: '빙결 크라켄의 촉수 끝에 박힌 거대한 이빨. 유일 무기 자루나 장식으로 사용된다.',
    source: 'monster', creature_id: 'ice_kraken', habitat: null,
    rarity: '유일',
  },

  // ═══ 채집 재료 (11종) ═══════════════════════════════════════════════════

  {
    id: 'liferoot',
    name: { ko: '영약 뿌리', en: 'Liferoot' },
    desc: '테라 노바 초원에서 자라는 뿌리. 생명력이 응집되어 회복 아이템의 기본 재료.',
    source: 'gather', creature_id: null, habitat: '테라 노바 초원',
    rarity: '평범',
  },
  {
    id: 'frost_moss',
    name: { ko: '한기 이끼', en: 'Frost Moss' },
    desc: '빙하 지대 암석에 붙은 이끼. 한기를 머금어 냉기 물약과 방한 장비 재료.',
    source: 'gather', creature_id: null, habitat: '빙하 지대',
    rarity: '평범',
  },
  {
    id: 'terra_grass',
    name: { ko: '테라 노바 풀', en: 'Terra Nova Grass' },
    desc: '테라 노바 평원의 질긴 풀. 기본 붕대와 끈 재료로 가장 흔하게 쓰인다.',
    source: 'gather', creature_id: null, habitat: '평원',
    rarity: '평범',
  },
  {
    id: 'snowflake_herb',
    name: { ko: '눈꽃 약초', en: 'Snowflake Herb' },
    desc: '설원에서 피는 눈꽃 모양의 약초. 정신력 회복과 해독 효과가 있다.',
    source: 'gather', creature_id: null, habitat: '설원',
    rarity: '평범',
  },
  {
    id: 'volcano_flower',
    name: { ko: '화산 꽃', en: 'Volcano Flower' },
    desc: '화산대 용암 근처에서 피는 붉은 꽃. 화기를 머금어 화염 증폭 물약 재료.',
    source: 'gather', creature_id: null, habitat: '화산대',
    rarity: '비범',
  },
  {
    id: 'polar_herb',
    name: { ko: '극지 약초', en: 'Polar Herb' },
    desc: '극지대 혹한에서 살아남은 강인한 약초. 체력 강화 물약의 핵심 재료.',
    source: 'gather', creature_id: null, habitat: '극지대',
    rarity: '비범',
  },
  {
    id: 'ancient_bark',
    name: { ko: '고대 나무껍질', en: 'Ancient Bark' },
    desc: '화석 삼림에 남은 수천 년 된 나무 껍질. 방어구 내장재와 방패 강화에 쓰인다.',
    source: 'gather', creature_id: null, habitat: '화석 삼림',
    rarity: '비범',
  },
  {
    id: 'volcanic_ash_herb',
    name: { ko: '화산재 약초', en: 'Volcanic Ash Herb' },
    desc: '화산재를 양분 삼아 자라는 약초. 독성과 약효를 동시에 지녀 독 무기 제작에 쓰인다.',
    source: 'gather', creature_id: null, habitat: '화산 주변',
    rarity: '비범',
  },
  {
    id: 'aurora_petal',
    name: { ko: '오로라 꽃잎', en: 'Aurora Petal' },
    desc: '오로라 지대에서 드물게 피는 꽃잎. 정신 방어와 텔레파시 증폭 장신구 재료.',
    source: 'gather', creature_id: null, habitat: '오로라 지대',
    rarity: '희귀',
  },
  {
    id: 'ice_flower',
    name: { ko: '빙화', en: 'Ice Flower' },
    desc: '빙하 심부에서만 채취 가능한 얼음 꽃. 최상급 냉기 무기와 해독제 재료.',
    source: 'gather', creature_id: null, habitat: '빙하 심부',
    rarity: '희귀',
  },
  {
    id: 'mirr_moss',
    name: { ko: '미르 이끼', en: 'Mirr Moss' },
    desc: '미르가 잠든 흔적지에 자라는 이끼. 미르의 기운을 흡수해 유일 장신구 재료로 쓰인다.',
    source: 'gather', creature_id: null, habitat: '미르 흔적지',
    rarity: '희귀',
  },

  // ═══ 채광 재료 (12종) ═══════════════════════════════════════════════════

  {
    id: 'iron_ore',
    name: { ko: '철광석', en: 'Iron Ore' },
    desc: '테라 노바 내륙 광맥에서 캔 기본 철광석. 모든 금속 장비의 기반 재료.',
    source: 'mine', creature_id: null, habitat: '내륙 광맥',
    rarity: '평범',
  },
  {
    id: 'volcanic_rock',
    name: { ko: '화산석', en: 'Volcanic Rock' },
    desc: '화산대에서 채취한 다공성 암석. 가볍고 내열성이 높아 방어구 경량화에 쓰인다.',
    source: 'mine', creature_id: null, habitat: '화산대',
    rarity: '평범',
  },
  {
    id: 'mana_shard',
    name: { ko: '마나 메탈 조각', en: 'Mana Metal Shard' },
    desc: '지하 광맥에서 채취한 마나 메탈 파편. 마법 무기와 마법사 장비 제작에 필수.',
    source: 'mine', creature_id: null, habitat: '지하 광맥',
    rarity: '비범',
  },
  {
    id: 'fossil_mineral',
    name: { ko: '화석 광물', en: 'Fossil Mineral' },
    desc: '지하 광산 깊숙이 매장된 고대 생물 화석화 광물. 내구성이 뛰어나다.',
    source: 'mine', creature_id: null, habitat: '지하 광산',
    rarity: '비범',
  },
  {
    id: 'deep_iron',
    name: { ko: '심층 철광', en: 'Deep Iron' },
    desc: '지하 심층에서만 발견되는 고순도 철광. 일반 철광석보다 경도가 두 배 높다.',
    source: 'mine', creature_id: null, habitat: '지하 심층',
    rarity: '비범',
  },
  {
    id: 'obsidian',
    name: { ko: '흑요석', en: 'Obsidian' },
    desc: '화산 분화구 주변에서 채취한 흑요석. 날이 예리해 단검과 화살촉 재료로 쓰인다.',
    source: 'mine', creature_id: null, habitat: '화산 분화구',
    rarity: '비범',
  },
  {
    id: 'glacier_gem',
    name: { ko: '빙하 원석', en: 'Glacier Gemstone' },
    desc: '빙하 심부 광맥에서 캔 청색 원석. 냉기 마법 집중과 장신구 장식에 사용.',
    source: 'mine', creature_id: null, habitat: '빙하 심부',
    rarity: '희귀',
  },
  {
    id: 'aurora_crystal',
    name: { ko: '오로라 결정', en: 'Aurora Crystal' },
    desc: '오로라 지층에서 채굴되는 무지개빛 결정. 정신력·마력 증폭 장비의 핵심 재료.',
    source: 'mine', creature_id: null, habitat: '오로라 광맥',
    rarity: '희귀',
  },
  {
    id: 'ancient_ore',
    name: { ko: '고대 광석', en: 'Ancient Ore' },
    desc: '화석 광산 깊은 곳에서 발굴된 정체불명의 광석. 고대 문명의 합금 기법으로만 가공 가능.',
    source: 'mine', creature_id: null, habitat: '화석 광산',
    rarity: '희귀',
  },
  {
    id: 'spirit_stone',
    name: { ko: '영혼석', en: 'Spirit Stone' },
    desc: '오로라 지층 깊은 곳에 박힌 반투명 석재. 초능력자의 정신력을 담아두는 그릇 역할.',
    source: 'mine', creature_id: null, habitat: '오로라 지층',
    rarity: '희귀',
  },
  {
    id: 'mirr_ore',
    name: { ko: '미르 광석', en: 'Mirr Ore' },
    desc: '잠든 미르 아래 지층에서 채굴되는 광석. 미르의 마력이 스며들어 유일 장비만 제작 가능.',
    source: 'mine', creature_id: null, habitat: '미르 잠든 지층',
    rarity: '유일',
  },
  {
    id: 'pure_mana_crystal',
    name: { ko: '순수 마나 결정', en: 'Pure Mana Crystal' },
    desc: '마나 메탈 광맥 최심부의 결정체. 마나 메탈의 정수로, 유일 마법 무기에만 사용된다.',
    source: 'mine', creature_id: null, habitat: '마나 메탈 광맥 심부',
    rarity: '유일',
  },
];

// id로 재료 단건 조회
export function getMaterial(id) {
  return MATERIALS.find(m => m.id === id) ?? null;
}

// source별 재료 목록 반환
export function getMaterialsBySource(source) {
  return MATERIALS.filter(m => m.source === source);
}

// 괴물 id로 연관 재료 목록 반환
export function getMaterialsByCreature(creature_id) {
  return MATERIALS.filter(m => m.creature_id === creature_id);
}
