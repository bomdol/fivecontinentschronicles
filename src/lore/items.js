// 직업별 기본 아이템 설정
// ac_bonus: JOB_BASE_AC에 더해지는 방어 보너스 (원본 수치를 D&D AC 스케일로 변환)
// skill.flatDamage: 고정 피해량 (직업 스킬의 주사위 굴림 대신 사용)
// skill.healAmount: 치유량 (hp_delta에 양수로 적용)
// skill.attackStat: 공격 판정 능력치 (한국어)

export const JOB_DEFAULT_ITEM = {

  // ═══ 마법 대륙 ═══════════════════════════════════════════════════════
  kn: {
    type: '상체 갑옷', name: '각인 갑옷',
    desc: '마법 문양이 새겨진 기본 갑옷',
    ac_bonus: 2, statsText: '마법 저항 +10',
    skill: { name: '마법 충격', passive: false,
      effect: '갑옷의 마법 문양에서 에너지를 방출해 적 1명에게 20 피해',
      cost: { mp: 10 }, flatDamage: 20, attackStat: '근력' },
  },

  am: {
    type: '지팡이', name: '대마법사의 지팡이',
    desc: '강력한 마력을 담은 기본 지팡이',
    ac_bonus: 0, statsText: '마력 +20',
    skill: { name: '원소 폭발', passive: false,
      effect: '지팡이에서 강력한 원소 에너지를 방출해 적 1명에게 35 피해',
      cost: { mp: 20 }, flatDamage: 35, attackStat: '지력' },
  },

  ma: {
    type: '단검', name: '그림자 마검',
    desc: '마법이 깃든 은밀한 단검',
    ac_bonus: 0, statsText: '치명타 확률 +7%',
    skill: { name: '그림자 일격', passive: false,
      effect: '그림자 속으로 녹아들었다가 급습, 적 1명에게 25 피해',
      cost: { mp: 12 }, flatDamage: 25, attackStat: '민첩' },
  },

  hl: {
    type: '목걸이', name: '성약의 목걸이',
    desc: '신성한 계약의 힘을 담은 목걸이',
    ac_bonus: 0, statsText: '치유력 +15',
    skill: { name: '성약 치유', passive: false,
      effect: '성약의 힘으로 아군 1명 HP 30 회복',
      cost: { mp: 15 }, healAmount: 30 },
  },

  fb: {
    type: '반지', name: '봉인의 반지',
    desc: '금서의 힘을 제어하는 기본 반지',
    ac_bonus: 0, statsText: '정신력 +12',
    skill: { name: '금서 해방', passive: false,
      effect: '반지에 봉인된 금서의 힘을 방출해 적 1명에게 40 피해',
      cost: { hp: 10, mp: 15 }, flatDamage: 40, attackStat: '지력' },
  },

  // ═══ 과학 대륙 ═══════════════════════════════════════════════════════
  ar: {
    type: '상체 갑옷', name: '동력 갑옷',
    desc: '기계식 동력으로 강화된 전투용 갑옷',
    ac_bonus: 3, statsText: '체력 +20, 방어력 +15',
    skill: { name: '파워 스트라이크', passive: false,
      effect: '동력 갑옷 출력을 최대로 올려 강화된 주먹으로 적 1명에게 25 피해',
      cost: { hp: 10 }, flatDamage: 25, attackStat: '근력' },
  },

  iv: {
    type: '장갑', name: '기술자의 장갑',
    desc: '다양한 도구를 내장한 기본 장갑',
    ac_bonus: 1, statsText: '장비 수리 속도 +15%',
    skill: { name: '기계 폭탄', passive: false,
      effect: '장갑 내장 폭탄 발사 장치로 소형 폭탄을 투척, 적 1명에게 20 피해',
      cost: { hp: 5 }, flatDamage: 20, attackStat: '지력' },
  },

  hk: {
    type: '목걸이', name: '데이터 링크 목걸이',
    desc: '네트워크 접속을 돕는 기본 장신구',
    ac_bonus: 0, statsText: '정신력 +15',
    skill: { name: '시스템 교란', passive: false,
      effect: '목걸이를 통해 적의 기계·장비를 해킹, 1턴간 행동 불가',
      cost: { mp: 12 } },
  },

  md: {
    type: '허리띠', name: '응급 키트 벨트',
    desc: '의료 도구가 내장된 기본 벨트',
    ac_bonus: 0, statsText: '치유력 +12',
    skill: { name: '응급 처치', passive: false,
      effect: '벨트 내 의료 도구로 아군 1명 HP 25 회복',
      cost: { hp: 8 }, healAmount: 25 },
  },

  nw: {
    type: '투구', name: '실험체 헬멧',
    desc: '인간+기계 혼합체를 위한 기본 보호구',
    ac_bonus: 1, statsText: '체력 +10, 정신력 +10',
    skill: { name: '융합 폭발', passive: false,
      effect: '헬멧의 기계 회로와 정신력이 공명, 에너지를 폭발적으로 방출해 적 1명에게 30 피해',
      cost: { hp: 10, mp: 10 }, flatDamage: 30, attackStat: '체력' },
  },

  // ═══ 무협 대륙 ═══════════════════════════════════════════════════════
  sw: {
    type: '칼', name: '초심검',
    desc: '검술 수련생이 사용하는 기본 장검',
    ac_bonus: 0, statsText: '공격력 +5',
    skill: { name: '일섬', passive: false,
      effect: '검기를 실은 빠른 베기로 적 1명에게 15 피해',
      cost: { hp: 5 }, flatDamage: 15, attackStat: '근력' },
  },

  sc: {
    type: '지팡이', name: '술사의 지팡이',
    desc: '원소와 기운을 다루는 기본 지팡이',
    ac_bonus: 0, statsText: '마력 +10',
    skill: { name: '원소탄', passive: false,
      effect: '지팡이로 기를 응축해 작은 원소 구체를 발사, 적 1명에게 18 피해',
      cost: { mp: 8 }, flatDamage: 18, attackStat: '지혜' },
  },

  jk: {
    type: '단검', name: '그림자 단검',
    desc: '은밀한 암살용 기본 무기',
    ac_bonus: 0, statsText: '치명타 확률 +5%',
    skill: { name: '암살', passive: false,
      effect: '경공으로 순식간에 적 후방에 나타나 급소를 노린 일격, 적 1명에게 20 피해',
      cost: { hp: 8 }, flatDamage: 20, attackStat: '민첩' },
  },

  us: {
    type: '목걸이', name: '치유의 목걸이',
    desc: '치유력을 증폭하는 기본 장신구',
    ac_bonus: 0, statsText: '회복력 +12',
    skill: { name: '치유술', passive: false,
      effect: '목걸이의 기운을 이용해 아군 1명 HP 25 회복',
      cost: { mp: 10 }, healAmount: 25 },
  },

  dh: {
    type: '허리띠', name: '내공의 띠',
    desc: '마법과 무공을 융합한 내공을 안정시키는 띠',
    ac_bonus: 1, statsText: '내공 회복 속도 +10%',
    skill: { name: '기공파', passive: false,
      effect: '내공과 마기를 합쳐 충격파를 방출, 적 1명에게 22 피해',
      cost: { hp: 10, mp: 5 }, flatDamage: 22, attackStat: '근력' },
  },

  // ═══ 초능력 대륙 ═════════════════════════════════════════════════════
  fc: {
    type: '방패', name: '역장의 방패',
    desc: '에너지 결계를 생성하는 기본 방패',
    ac_bonus: 2, statsText: '방어력 +12',
    skill: { name: '역장 충격', passive: false,
      effect: '방패에서 역장 에너지를 방출해 적 1명을 밀어내며 18 피해',
      cost: { mp: 10 }, flatDamage: 18, attackStat: '지혜' },
  },

  tk: {
    type: '마법막대', name: '사이오닉 로드',
    desc: '염동력을 증폭하는 기본 막대',
    ac_bonus: 0, statsText: '정신 공격력 +8',
    skill: { name: '염동파', passive: false,
      effect: '막대를 통해 염동력을 증폭, 충격파로 적 1명에게 20 피해',
      cost: { mp: 12 }, flatDamage: 20, attackStat: '민첩' },
  },

  jy: {
    type: '반지', name: '환영의 반지',
    desc: '마음읽기와 환영술을 돕는 기본 반지',
    ac_bonus: 0, statsText: '은신 지속시간 +10%',
    skill: { name: '환영 교란', passive: false,
      effect: '반지로 환영을 만들어 적의 시야를 혼란시켜 1턴간 행동 불가',
      cost: { mp: 8 } },
  },

  ep: {
    type: '장갑', name: '감응 장갑',
    desc: '환자의 고통을 흡수하는 기본 장갑',
    ac_bonus: 1, statsText: '치유력 +10',
    skill: { name: '공감 치유', passive: false,
      effect: '장갑을 통해 생명 에너지를 전달, 아군 1명 HP 25 회복',
      cost: { mp: 12 }, healAmount: 25 },
  },

  aw: {
    type: '상체 갑옷', name: '실험복 잔해',
    desc: '새사람 프로젝트에서 탈출한 자의 기본 복장',
    ac_bonus: 1, statsText: '정신력 +15',
    skill: { name: '폭주', passive: false,
      effect: '각성 에너지를 제어 없이 폭발시켜 적 1명에게 35 피해',
      cost: { mp: 20 }, flatDamage: 35, attackStat: '지혜' },
  },
};

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
