// 전투 규칙 — 현재 게임 시스템 기준 적용 규칙
// buildSystemPrompt()에서 buildCombatRules()를 호출해 GM 프롬프트에 주입

// ─── 효과 변환표 ──────────────────────────────────────────────────────────
// 생물 스킬 설정에 명시된 효과를 현재 턴제 텍스트 게임에 맞게 변환하는 규칙.
// 나중에 거리·이동 시스템이 추가되면 이 변환표만 수정하고 생물 스킬 설정 원본은 유지.

const COMBAT_ADAPT = {

  // 거리 개념
  range: {
    rule: '거리 무시',
    desc: '근거리·원거리 공격 구분 없이 모든 공격이 대상에게 즉시 적용된다. ' +
          '생물 스킬에 명시된 근접/원거리 구분은 서사 묘사에만 사용한다.',
  },

  // 범위(AOE) 공격
  aoe: {
    rule: '범위 → 전체 대상',
    desc: '범위 수치(3m, 5m, 8m 등)는 전투 서사 묘사에만 활용한다. ' +
          '기계적 효과는 "적 전체" 또는 "아군 전체"로 처리한다.',
  },

  // 이동속도·공격속도 → 턴 속도
  speed: {
    rule: '이속·공속 감소 → 턴 지연',
    desc: '이동속도 감소와 공격속도 감소는 모두 "턴 지연"으로 처리한다. ' +
          'DEX를 기준으로 다음 행동이 오기까지의 속도가 느려지는 것으로 서술한다.',
    table: [
      { threshold: 30, effect: '턴 지연 1 — 다음 행동 전에 1턴을 추가로 소모한다 (DEX 판정으로 저항 가능)' },
      { threshold: 50, effect: '턴 지연 2 — 다음 행동 전에 2턴을 소모한다 (DEX 판정 실패 시 무조건 적용)' },
      { threshold: 70, effect: '턴 지연 3 — 심각한 둔화. DEX 판정 실패 시 해당 턴 행동 불능으로 처리' },
    ],
    resist_stat: 'DEX',
  },

  // 속박·이동 불가
  bind: {
    rule: '속박 → 행동 불능',
    desc: '속박·이동 불가 효과는 해당 턴 행동 불능으로 처리한다. ' +
          'CON 또는 STR 판정 성공 시 탈출할 수 있다.',
    resist_stat: 'CON / STR',
  },

  // 기절
  stun: {
    rule: '기절 → 행동 불능 + 판정 불가',
    desc: '기절 효과는 지정된 턴 수 동안 행동 불능이며, 그 동안 어떤 저항 판정도 할 수 없다.',
  },

  // 혼란
  confuse: {
    rule: '혼란 → WIS 판정으로 행동 결정',
    desc: '혼란 상태에서 플레이어가 행동을 선택하면 WIS 판정을 실시한다. ' +
          '실패 시 GM이 해당 행동을 반전하거나 예상치 못한 방향으로 적용한다.',
    resist_stat: 'WIS',
  },

  // 디버프 중첩
  debuff_stack: {
    rule: '동일 디버프 중첩 금지',
    desc: '같은 종류의 디버프(예: 턴 지연)는 중첩되지 않는다. ' +
          '더 강한 효과 하나만 적용되며 지속 시간은 새로 적용된 것을 따른다.',
  },
};

// ─── HP/MP 소모형 스킬 규칙 ──────────────────────────────────────────────
const SKILL_COST_RULES = {
  hp_cost: 'HP 소모 스킬은 시전자가 자신의 생명력을 대가로 사용한다. ' +
           'HP가 소모량보다 적으면 시전 불가.',
  mp_cost: 'MP(마나/기력/내공)가 소모량보다 적으면 시전 불가. ' +
           '전투 외 휴식으로 MP는 회복되지만 HP는 치료 없이 회복되지 않는다.',
};

// ─── 생물 HP 등급 기준 ───────────────────────────────────────────────────
// GM이 전투 흐름을 서술할 때 참고하는 내구도 지표
const HP_TIER = [
  { max: 1500,  label: '약함',   desc: '몇 번의 공격으로 제압 가능' },
  { max: 3000,  label: '보통',   desc: '적절한 전략이 필요' },
  { max: 5000,  label: '강함',   desc: '지속전 또는 약점 공략 필요' },
  { max: 99999, label: '극강',   desc: '단독 제압 불가, 연합 또는 특수 조건 필요' },
];

function getHpTier(hp) {
  return HP_TIER.find(t => hp <= t.max) || HP_TIER[HP_TIER.length - 1];
}

// ─── 시스템 프롬프트용 텍스트 생성 ──────────────────────────────────────
function buildCombatRules() {
  const speedRows = COMBAT_ADAPT.speed.table
    .map(r => `    · ${r.threshold}% 이상 감소: ${r.effect}`)
    .join('\n');

  return `[전투 규칙 — 게임 마스터 필수 준수]
이 규칙은 생물·몬스터 스킬 효과를 현재 턴제 텍스트 게임에 적용하는 방식을 정의한다.
생물 스킬 설정의 원본 수치(범위, 속도 등)는 서사 묘사에 활용하고, 아래 규칙에 따라 기계적 효과를 처리한다.

1. 거리 (${COMBAT_ADAPT.range.rule})
   ${COMBAT_ADAPT.range.desc}

2. 범위 공격 (${COMBAT_ADAPT.aoe.rule})
   ${COMBAT_ADAPT.aoe.desc}

3. 이동속도·공격속도 감소 (${COMBAT_ADAPT.speed.rule})
   ${COMBAT_ADAPT.speed.desc}
   감소량 기준:
${speedRows}

4. 속박·이동 불가 (${COMBAT_ADAPT.bind.rule})
   ${COMBAT_ADAPT.bind.desc}

5. 기절 (${COMBAT_ADAPT.stun.rule})
   ${COMBAT_ADAPT.stun.desc}

6. 혼란 (${COMBAT_ADAPT.confuse.rule})
   ${COMBAT_ADAPT.confuse.desc}

7. 디버프 중첩 (${COMBAT_ADAPT.debuff_stack.rule})
   ${COMBAT_ADAPT.debuff_stack.desc}

8. 스킬 비용
   · ${SKILL_COST_RULES.hp_cost}
   · ${SKILL_COST_RULES.mp_cost}`;
}
