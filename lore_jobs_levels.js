// 직업·레벨 시스템 — 레벨별 HP/MP 성장, 직업별 스킬, XP 규칙

// ─── 역할별 HP/MP 성장 ────────────────────────────────────────────────
// base: 레벨 1 기본값 / perLv: 레벨당 증가량 / mpStat: MP 보정 능력치
const ROLE_GROWTH = {
  warrior: { baseHp:120, hpPerLv:90, baseMp:30,  mpPerLv:15, mpStat:'CON' },
  mage:    { baseHp:60,  hpPerLv:40, baseMp:100, mpPerLv:65, mpStat:'INT' },
  rogue:   { baseHp:80,  hpPerLv:55, baseMp:50,  mpPerLv:30, mpStat:'DEX' },
  support: { baseHp:85,  hpPerLv:55, baseMp:90,  mpPerLv:55, mpStat:'WIS' },
  tech:    { baseHp:90,  hpPerLv:60, baseMp:60,  mpPerLv:40, mpStat:'INT' },
  special: { baseHp:75,  hpPerLv:50, baseMp:80,  mpPerLv:60, mpStat:'WIS' },
};

// 직업 ID → 성장 역할 매핑
const JOB_ROLE = {
  kn:'warrior', am:'mage',   ma:'rogue',   hl:'support', fb:'special',
  ar:'warrior', iv:'tech',   hk:'rogue',   md:'support', nw:'special',
  sw:'warrior', sc:'mage',   jk:'rogue',   us:'support', dh:'special',
  fc:'warrior', tk:'tech',   jy:'rogue',   ep:'support', aw:'special',
};

// ─── XP 레벨 임계값 (0=Lv1, 1=Lv2, ..., 11=Lv12) ────────────────────
const XP_LEVELS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000];

// ─── 몬스터 레벨별 기본 경험치 ───────────────────────────────────────
const XP_BY_MONSTER_LEVEL = {
  1:25, 2:50, 3:100, 4:200, 5:450, 6:700,
  7:1100, 8:1800, 9:2300, 10:2900, 11:3900, 12:5000,
};

// ─── 레벨 차이에 따른 XP 배율 (플레이어 - 몬스터 기준) ─────────────
// 음수 = 몬스터가 더 강함 (더 많은 XP)
const XP_MULTIPLIERS = [
  { diff: -5, mult: 2.0, label: '매우 강한 적' },
  { diff: -3, mult: 1.5, label: '강한 적' },
  { diff: -1, mult: 1.2, label: '약간 강한 적' },
  { diff:  0, mult: 1.0, label: '동급 적' },
  { diff:  2, mult: 0.75, label: '약간 약한 적' },
  { diff:  4, mult: 0.5,  label: '약한 적' },
  { diff: Infinity, mult: 0.1, label: '훨씬 약한 적' },
];

// ─── 직업별 스킬 (7개: Lv1패시브, Lv1액티브, Lv3, Lv5, Lv7, Lv9, Lv12) ─────
// cost: {mp:N} 또는 {hp:N} 또는 {}(무비용)
const JOB_SKILLS = {

  // ═══ 마법 대륙 ═══════════════════════════════════════════════════════
  kn: [ // 마법 기사 (warrior)
    { lv:1,  name:'마법 갑옷',   passive:true,  cost:{},     effect:'피해를 받을 때마다 CON 판정(DC10) 성공 시 피해 10% 감소' },
    { lv:1,  name:'방패 강타',   passive:false, cost:{mp:10}, effect:'방패에 마력을 실어 공격. 피해+30%, 적 1명 넘어짐(STR 판정 DC12)' },
    { lv:3,  name:'신성 방어',   passive:false, cost:{mp:20}, effect:'다음 공격 피해 50% 감소, 1턴 지속' },
    { lv:5,  name:'성기사의 빛', passive:false, cost:{mp:40}, effect:'신성한 빛으로 아군 전체 HP 60 회복' },
    { lv:7,  name:'성스러운 검', passive:false, cost:{mp:60}, effect:'검에 신성 마력 부여, 3턴간 ATK+50%' },
    { lv:9,  name:'철의 요새',   passive:false, cost:{mp:100},effect:'2턴간 모든 피해 90% 감소, 아군 전체 적용' },
    { lv:12, name:'성전사의 심판',passive:false,cost:{mp:150},effect:'신성 에너지 폭발, 적 전체 HP 250 피해 + 속박 1턴' },
  ],

  am: [ // 대마법사 (mage)
    { lv:1,  name:'마나 증폭',   passive:true,  cost:{},      effect:'전투 시작 시 MP 15 보너스 획득. INT 판정에 이점' },
    { lv:1,  name:'마법 화살',   passive:false, cost:{mp:10}, effect:'순수 마력 화살 발사, 단일 대상 INT 기반 피해' },
    { lv:3,  name:'불꽃 폭발',   passive:false, cost:{mp:30}, effect:'화염 구체 폭발, 적 전체 화염 피해' },
    { lv:5,  name:'시간 정지',   passive:false, cost:{mp:60}, effect:'국소적 시간 정지, 적 전체 1턴 기절(WIS 판정 DC15로 저항)' },
    { lv:7,  name:'고대의 분노', passive:false, cost:{mp:80}, effect:'고대 마법 방출, 단일 대상에게 INT×4 피해' },
    { lv:9,  name:'마법 결계',   passive:false, cost:{mp:120},effect:'2턴간 피해 무효화, 무효화된 피해의 50%를 반사' },
    { lv:12, name:'소멸의 섬광', passive:false, cost:{mp:200},effect:'적 전체에 소멸 마법 폭격, INT×6 피해 + 3턴간 마력 봉인' },
  ],

  ma: [ // 마법 암살자 (rogue)
    { lv:1,  name:'은신 마법',   passive:true,  cost:{},      effect:'적이 눈치채기 전 첫 공격 피해 2배, DEX 판정에 이점' },
    { lv:1,  name:'마법 단검',   passive:false, cost:{mp:10}, effect:'마력 주입 단검 투척, 단일 대상 DEX+INT 피해' },
    { lv:3,  name:'그림자 이동', passive:false, cost:{mp:20}, effect:'순간 그림자 속으로 이동, 다음 행동까지 무적 + 위치 변경' },
    { lv:5,  name:'마비 독',     passive:false, cost:{mp:40}, effect:'독 주입, 적 1명 3턴간 매 턴 HP -20 + CON 판정(DC13) 실패 시 1턴 행동 불능' },
    { lv:7,  name:'환영 분신',   passive:false, cost:{mp:60}, effect:'3개의 마법 분신 생성, 2턴간 피해 회피 + 적 혼란(WIS 판정 DC15)' },
    { lv:9,  name:'심장 관통',   passive:false, cost:{mp:90}, effect:'급소를 노린 일격, 단일 대상에게 DEX×5 피해 + 출혈 3턴' },
    { lv:12, name:'죽음의 춤',   passive:false, cost:{mp:150},effect:'3턴간 매 턴 그림자 속에서 기습, 공격마다 DEX×3 피해 + 기절' },
  ],

  hl: [ // 성약사 (support)
    { lv:1,  name:'치료의 손길', passive:true,  cost:{},      effect:'매 턴 시작 시 아군 1명 HP 5 자동 회복. WIS 판정에 이점' },
    { lv:1,  name:'치유술',      passive:false, cost:{mp:15}, effect:'빛 마법으로 아군 1명 HP 50 + WIS 수정치×5 회복' },
    { lv:3,  name:'정화',        passive:false, cost:{mp:20}, effect:'마법적 오염 제거, 아군 1명 상태이상 모두 해제' },
    { lv:5,  name:'부활의 빛',   passive:false, cost:{mp:50}, effect:'강력한 치유 마법, 아군 1명 HP 150 회복' },
    { lv:7,  name:'신성 방어막', passive:false, cost:{mp:80}, effect:'아군 전체 1턴간 피해 무효화 + HP 50 회복' },
    { lv:9,  name:'기적',        passive:false, cost:{mp:150},effect:'신의 가호, 아군 전체 HP 완전 회복 + 모든 상태이상 해제' },
    { lv:12, name:'성전의 가호', passive:false, cost:{mp:220},effect:'3턴간 아군 전체 피해 50% 감소 + 매 턴 HP 80 회복' },
  ],

  fb: [ // 금서 사용자 (special)
    { lv:1,  name:'금서 지식',   passive:true,  cost:{},      effect:'금지된 마법에 대한 본능적 이해. 적 마법 계열 즉시 파악, INT/WIS 판정에 이점' },
    { lv:1,  name:'농경 저주',   passive:false, cost:{mp:15}, effect:'생명력을 비틀어 적 1명 매 턴 HP -15, 2턴 지속' },
    { lv:3,  name:'금서 낭독',   passive:false, cost:{mp:25}, effect:'금지된 주문 낭독, 적 전체 INT 판정(DC14) 실패 시 혼란 2턴' },
    { lv:5,  name:'생명 흡수',   passive:false, cost:{mp:40}, effect:'적 1명 HP 100 흡수 (자신 HP +100, 최대 HP 초과 불가)' },
    { lv:7,  name:'죽음의 들판', passive:false, cost:{mp:70}, effect:'주변에 생명력 흡수 결계, 3턴간 적 전체 매 턴 HP -30, 자신 MP +10' },
    { lv:9,  name:'금서 해방',   passive:false, cost:{hp:80, mp:100}, effect:'금서를 완전 해방, 전장 전체 대혼란. 적 전체 HP 300 피해 + 2턴 기절' },
    { lv:12, name:'세계 멸망 문구',passive:false,cost:{hp:150,mp:200},effect:'태초의 금지 주문. 전장의 모든 것에 막대한 피해, 아군에게도 영향' },
  ],

  // ═══ 과학 대륙 ═══════════════════════════════════════════════════════
  ar: [ // 기갑병 (warrior)
    { lv:1,  name:'강화 외골격', passive:true,  cost:{},      effect:'동력 갑옷 자동 충격 흡수. 모든 물리 피해 5 감소. STR 판정에 이점' },
    { lv:1,  name:'기계 주먹',   passive:false, cost:{mp:10}, effect:'동력 강화 주먹 공격, STR×3 피해 + 넘어짐(STR 판정 DC12)' },
    { lv:3,  name:'철벽 방어',   passive:false, cost:{mp:20}, effect:'갑옷 긴급 잠금, 1턴간 피해 70% 감소' },
    { lv:5,  name:'로켓 돌격',   passive:false, cost:{mp:40}, effect:'추진기 발동 전속 돌격, 적 전체에 충격 + 1턴 행동 불능(CON 판정 DC13)' },
    { lv:7,  name:'EMP 충격파',  passive:false, cost:{mp:70}, effect:'전자기 펄스 방출, 적 전체 HP 120 피해 + 기계형 적 2턴 기절' },
    { lv:9,  name:'자기 수리',   passive:false, cost:{mp:80}, effect:'긴급 수리 프로토콜 작동, HP 250 회복' },
    { lv:12, name:'전쟁 기계',   passive:false, cost:{mp:150},effect:'3턴간 모든 공격력 2배, 피해 50% 감소, 이동 불가 상태이상 면역' },
  ],

  iv: [ // 발명가 (tech)
    { lv:1,  name:'현장 제작',   passive:true,  cost:{},      effect:'전투 중 잔해로 임시 장비 제작. INT 판정에 이점, 매 전투 시작 시 임시 장비 1개 획득' },
    { lv:1,  name:'폭발물 투척', passive:false, cost:{mp:10}, effect:'즉석 폭탄 투척, 적 1명 INT 기반 폭발 피해' },
    { lv:3,  name:'자동 포탑',   passive:false, cost:{mp:30}, effect:'소형 포탑 설치, 2턴간 매 턴 적 전체에 INT 기반 피해' },
    { lv:5,  name:'전기 충격망', passive:false, cost:{mp:50}, effect:'전기 충격 장치 기동, 적 전체 HP 100 피해 + 턴 지연 1(DEX 판정 DC13)' },
    { lv:7,  name:'전투 드론',   passive:false, cost:{mp:70}, effect:'공격 드론 배치, 2턴간 아군 전체 ATK+30% + 적 전체 매 턴 HP -40' },
    { lv:9,  name:'핵 배터리 폭주',passive:false,cost:{hp:50,mp:80},effect:'배터리 과부하 유도 폭발, 적 전체에 INT×5 피해. 자신도 HP 50 소모' },
    { lv:12, name:'전설의 발명', passive:false, cost:{mp:200},effect:'전장 상황에 맞는 최적의 장치를 즉석 발명. GM이 효과를 최대치로 판정' },
  ],

  hk: [ // 해커 (rogue)
    { lv:1,  name:'시스템 침투', passive:true,  cost:{},      effect:'기계·장비·정보 관련 모든 판정에 이점. 적 스킬 정보 자동 파악' },
    { lv:1,  name:'전자 방해',   passive:false, cost:{mp:10}, effect:'적 기계·기술 기반 스킬 1개를 1턴 봉인' },
    { lv:3,  name:'데이터 도용', passive:false, cost:{mp:20}, effect:'적 스킬 1개를 복사, INT 판정(DC15) 성공 시 당장 1회 사용 가능' },
    { lv:5,  name:'바이러스 주입',passive:false,cost:{mp:40}, effect:'적 1명에게 바이러스 심기, 3턴간 매 턴 HP -30 + 공격 실패 확률 상승' },
    { lv:7,  name:'시스템 장악', passive:false, cost:{mp:70}, effect:'기계형 적 1명을 1턴간 아군으로 전환(기계형 아닌 경우 혼란 2턴)' },
    { lv:9,  name:'전면 해킹',   passive:false, cost:{mp:100},effect:'적 전체 스킬 2턴 봉인 + 적 장비/강화 효과 모두 해제' },
    { lv:12, name:'세계 붕괴 코드',passive:false,cost:{mp:180},effect:'전장 전체 전자기기 파괴, 적 전체 대피해 + 기계형 적 즉시 기절 3턴' },
  ],

  md: [ // 의무병 (support)
    { lv:1,  name:'응급 처치',   passive:true,  cost:{},      effect:'아군이 HP 0 도달 시 즉시 CON 판정(DC15), 성공 시 HP 30으로 생존. WIS 판정 이점' },
    { lv:1,  name:'진통제 투여', passive:false, cost:{mp:15}, effect:'응급 진통제 처치, 아군 1명 HP 50 회복 + 고통·출혈 해제' },
    { lv:3,  name:'독소 분석',   passive:false, cost:{mp:20}, effect:'독·방사능·화학 상태이상 진단 및 제거, 아군 1명 적용' },
    { lv:5,  name:'현장 수술',   passive:false, cost:{mp:50}, effect:'1턴 소요 집중 수술, 아군 1명 HP 180 회복 + 부상 상태이상 제거' },
    { lv:7,  name:'강화 약물',   passive:false, cost:{mp:60}, effect:'전투 강화제 투여, 아군 1명 2턴간 ATK+50% + 피해 받을 때 HP 자동 20 회복' },
    { lv:9,  name:'소생술',      passive:false, cost:{mp:130},effect:'임상사망 상태 아군 1명을 HP 100으로 소생' },
    { lv:12, name:'완전 치료',   passive:false, cost:{mp:200},effect:'아군 전체 HP 완전 회복 + 모든 상태이상 제거 + 1턴간 피해 면역' },
  ],

  nw: [ // 새사람 (special)
    { lv:1,  name:'기계 감각',   passive:true,  cost:{},      effect:'내장 센서로 적의 HP·스킬·약점 자동 분석. 전투 시작 시 적 정보 공개' },
    { lv:1,  name:'내장 무기',   passive:false, cost:{mp:10}, effect:'신체 내장 무기 사용, STR+INT 기반 피해' },
    { lv:3,  name:'사이버 방어', passive:false, cost:{mp:20}, effect:'내장 방어 시스템 가동, 1턴간 피해 60% 감소 + 상태이상 면역' },
    { lv:5,  name:'과부하 방출', passive:false, cost:{mp:50}, effect:'체내 에너지 과부하 방출, 적 전체 전기 피해 + 1턴 기절(CON 판정 DC14)' },
    { lv:7,  name:'나노봇 수리', passive:false, cost:{mp:60}, effect:'체내 나노봇 활성화, HP 200 회복 + 2턴간 매 턴 HP 30 회복' },
    { lv:9,  name:'인터페이스',  passive:false, cost:{mp:100},effect:'전장의 모든 기계·통신 장악. 적 기계형 전체 제어 + 아군 전체 정보 공유' },
    { lv:12, name:'완전 각성',   passive:false, cost:{mp:200},effect:'인간·기계 경계 초월. 3턴간 HP 소모 없음, 모든 피해 2배, 상태이상 면역' },
  ],

  // ═══ 무협 대륙 ═══════════════════════════════════════════════════════
  sw: [ // 검객 (warrior)
    { lv:1,  name:'검기',        passive:true,  cost:{},      effect:'내공을 검날에 실어 기본 공격 피해+20%. STR 판정에 이점' },
    { lv:1,  name:'단월검',      passive:false, cost:{mp:10}, effect:'기초 검식, 내공 실은 단일 베기. STR×3 피해' },
    { lv:3,  name:'선풍검무',    passive:false, cost:{mp:30}, effect:'회전 검무로 적 전체 베기, STR×2 피해' },
    { lv:5,  name:'혈사도',      passive:false, cost:{mp:50}, effect:'강렬한 베기, 단일 대상 STR×4 피해 + 출혈 3턴(매 턴 HP -25)' },
    { lv:7,  name:'비룡검기',    passive:false, cost:{mp:70}, effect:'하늘을 가르는 검기 파동, 적 전체 STR×3 피해 + 넘어짐' },
    { lv:9,  name:'만초귀종',    passive:false, cost:{mp:100},effect:'신속 연속 10회 공격, 각 공격마다 STR×2 피해' },
    { lv:12, name:'천하제일검',  passive:false, cost:{mp:200},effect:'절세 무공의 극의. 적 전체에 STR×8 피해 + 2턴 기절, 저항 불가' },
  ],

  sc: [ // 술사 (mage)
    { lv:1,  name:'오행 감응',   passive:true,  cost:{},      effect:'오행의 기 흐름 감지. 적 원소 속성 자동 파악, WIS 판정에 이점' },
    { lv:1,  name:'기폭',        passive:false, cost:{mp:10}, effect:'기 폭발 투사, 단일 대상 WIS 기반 피해' },
    { lv:3,  name:'화기 분출',   passive:false, cost:{mp:30}, effect:'화(火)의 기 폭발, 적 전체 WIS×3 화염 피해' },
    { lv:5,  name:'토기 결계',   passive:false, cost:{mp:50}, effect:'토(土)의 기로 방어 결계, 아군 전체 2턴간 피해 40% 감소' },
    { lv:7,  name:'수기 빙결',   passive:false, cost:{mp:70}, effect:'수(水)의 기로 빙결, 적 전체 WIS×3 피해 + 2턴 속박(DEX 판정 DC15)' },
    { lv:9,  name:'뇌기 폭풍',   passive:false, cost:{mp:100},effect:'뇌(雷)의 기 폭발, 적 전체 WIS×4 피해 + 1턴 기절' },
    { lv:12, name:'오행 합일',   passive:false, cost:{mp:200},effect:'오행 완전 조화, 연속 5속성 공격. 적 전체 WIS×10 피해 + 3턴 완전 행동 불능' },
  ],

  jk: [ // 자객 (rogue)
    { lv:1,  name:'경공',        passive:true,  cost:{},      effect:'경공술로 지형 이점 극대화. 기습 공격 피해 2배, DEX 판정에 이점' },
    { lv:1,  name:'암기 투척',   passive:false, cost:{mp:10}, effect:'숨겨둔 암기 투척, 단일 대상 DEX×3 피해' },
    { lv:3,  name:'그림자 보법', passive:false, cost:{mp:20}, effect:'순간 적 뒤로 이동, 다음 공격 기습 효과(피해 2배) + DEX 판정에 이점' },
    { lv:5,  name:'독침',        passive:false, cost:{mp:40}, effect:'독침 적중, 3턴간 매 턴 HP -30 + CON 판정(DC14) 실패 시 1턴 행동 불능' },
    { lv:7,  name:'연막 탈출',   passive:false, cost:{mp:50}, effect:'연막 살포, 아군 전체 1턴 회피 + 본인 2턴간 은신(공격 시 자동 기습)' },
    { lv:9,  name:'십자 암격',   passive:false, cost:{mp:90}, effect:'여러 급소 동시 타격, 단일 대상 DEX×6 피해 + 기절 1턴' },
    { lv:12, name:'무영각',      passive:false, cost:{mp:150},effect:'존재 지움. 3턴간 모든 적이 본인을 표적화 불가 + 매 턴 기습 공격(DEX×4)' },
  ],

  us: [ // 의선 (support)
    { lv:1,  name:'경혈 파악',   passive:true,  cost:{},      effect:'인체 경혈 정밀 파악. 아군 치료 시 항상 +20% 효과, WIS 판정에 이점' },
    { lv:1,  name:'기공 치료',   passive:false, cost:{mp:15}, effect:'내공으로 경혈 자극, 아군 1명 HP 50 회복' },
    { lv:3,  name:'해독 침술',   passive:false, cost:{mp:20}, effect:'독·마비·출혈 등 상태이상 제거, 아군 1명' },
    { lv:5,  name:'영약 조제',   passive:false, cost:{mp:50}, effect:'영약 즉석 조제, 아군 1명 HP 160 회복 + 2턴간 STR+WIS 판정 이점' },
    { lv:7,  name:'봉혈',        passive:false, cost:{mp:60}, effect:'적 급소 경혈 봉쇄, 적 1명 2턴간 스킬 사용 불가(CON 판정 DC15로 저항)' },
    { lv:9,  name:'대환단',      passive:false, cost:{mp:130},effect:'전설적 영약 투여, 아군 전체 HP 200 회복 + 상태이상 제거' },
    { lv:12, name:'불로장생공',  passive:false, cost:{mp:220},effect:'불로장생 내공 전수, 3턴간 아군 전체 HP 자동 회복(매 턴 HP 100) + 사망 무효 1회' },
  ],

  dh: [ // 달마 내공자 (special)
    { lv:1,  name:'마기 내공',   passive:true,  cost:{},      effect:'마법·무공 이중 내공. HP가 30% 이하일 때 모든 공격력 30% 상승' },
    { lv:1,  name:'마기 장타',   passive:false, cost:{mp:15}, effect:'마기 실린 장권 일격, STR+WIS 기반 피해' },
    { lv:3,  name:'주화입마 유도',passive:false,cost:{mp:25}, effect:'적에게 주화입마 유발, WIS 판정(DC14) 실패 시 자신 공격 1턴' },
    { lv:5,  name:'금강마체',    passive:false, cost:{mp:50}, effect:'마기로 신체 강화, 2턴간 피해 70% 감소 + 매 턴 HP 30 회복' },
    { lv:7,  name:'달마 벽관',   passive:false, cost:{mp:70}, effect:'마기 집중 방출, 적 전체 STR×3+WIS×3 피해 + 혼란 2턴' },
    { lv:9,  name:'마기 흡수',   passive:false, cost:{mp:0},  effect:'적 마법 공격을 내공으로 흡수, 피해 무효 + MP 흡수량×50% 획득(1회 사용)' },
    { lv:12, name:'달마진신',    passive:false, cost:{mp:200},effect:'달마 대사의 비전 완전 각성. 3턴간 무결 전투 상태 — 피해 무효, 매 공격 즉사급 피해' },
  ],

  // ═══ 초능력 대륙 ═════════════════════════════════════════════════════
  fc: [ // 역장사 (warrior)
    { lv:1,  name:'역장 방어막', passive:true,  cost:{},      effect:'항상 역장 방어막 유지. 피해 5 감소. STR/CON 판정에 이점' },
    { lv:1,  name:'역장 충격',   passive:false, cost:{mp:10}, effect:'역장 파동 방출, 단일 대상 STR×3 피해 + 밀쳐냄(넘어짐)' },
    { lv:3,  name:'역장 방벽',   passive:false, cost:{mp:20}, effect:'강화 역장 전개, 1턴간 아군 전체 피해 무효' },
    { lv:5,  name:'중력 압착',   passive:false, cost:{mp:50}, effect:'국소 중력 강화, 적 전체 STR×2 피해 + 속박 1턴(STR 판정 DC13)' },
    { lv:7,  name:'역장 폭발',   passive:false, cost:{mp:70}, effect:'역장을 내부에서 폭파, 적 1명에게 STR×6 피해 + 기절 1턴' },
    { lv:9,  name:'무중력 제압', passive:false, cost:{mp:100},effect:'적 전체를 무중력 상태로 띄움, 2턴간 완전 행동 불능' },
    { lv:12, name:'역장 대붕괴', passive:false, cost:{mp:180},effect:'역장 완전 해방, 전장 전체에 역장 대폭발. 적 전체 STR×8 피해 + 2턴 기절' },
  ],

  tk: [ // 염동력자 (tech)
    { lv:1,  name:'염동 지각',   passive:true,  cost:{},      effect:'염동력으로 주변 모든 물체·생명체 감지. 기습 불가, DEX 판정에 이점' },
    { lv:1,  name:'염동력 투사', passive:false, cost:{mp:10}, effect:'주변 물체를 염력으로 투사, DEX×2 피해' },
    { lv:3,  name:'다중 투사',   passive:false, cost:{mp:25}, effect:'여러 물체를 동시 투사, 적 전체에 DEX×2 피해' },
    { lv:5,  name:'물질 방패',   passive:false, cost:{mp:40}, effect:'주변 물체로 방패 구성, 2턴간 피해 50% 감소' },
    { lv:7,  name:'심층 염동',   passive:false, cost:{mp:70}, effect:'강대한 염동력 방출, 단일 대상 DEX×6 피해 + 2턴 속박' },
    { lv:9,  name:'물질 분해',   passive:false, cost:{mp:100},effect:'적의 장비·방어구를 분해, 방어력 0 + DEX×4 피해' },
    { lv:12, name:'염동 폭풍',   passive:false, cost:{mp:180},effect:'전장의 모든 물체를 폭풍처럼 방출, 적 전체 DEX×6 피해 + 3턴 혼란' },
  ],

  jy: [ // 잠영술사 (rogue)
    { lv:1,  name:'마음 읽기',   passive:true,  cost:{},      effect:'상대 의도 즉시 감지. 기습 불가, 협상·속임 판정에 이점' },
    { lv:1,  name:'정신 교란',   passive:false, cost:{mp:10}, effect:'단기 정신 혼란 유도, 적 1명 WIS 판정(DC12) 실패 시 1턴 혼란' },
    { lv:3,  name:'환각',        passive:false, cost:{mp:25}, effect:'강렬한 환각 주입, 적 1명 2턴간 혼란(WIS 판정 DC14)' },
    { lv:5,  name:'공포 심기',   passive:false, cost:{mp:40}, effect:'심층 공포 유도, 적 1명 3턴간 아군 공격 불가(WIS 판정 DC15 저항)' },
    { lv:7,  name:'정신 마비',   passive:false, cost:{mp:70}, effect:'정신 회로 차단, 적 1명 1턴 완전 기절(WIS 판정 DC16, 저항 불가 시 2턴)' },
    { lv:9,  name:'집단 환각',   passive:false, cost:{mp:100},effect:'적 전체 강렬한 환각, 2턴간 혼란 + 서로 공격(WIS 판정 DC15)' },
    { lv:12, name:'정신 소각',   passive:false, cost:{mp:160},effect:'적 1명의 정신을 완전 소각, 즉시 기절 3턴 + 전투 후에도 기억·스킬 일시 봉인' },
  ],

  ep: [ // 초능력 의사 (support)
    { lv:1,  name:'고통 흡수',   passive:true,  cost:{},      effect:'아군의 고통을 자동 감지·흡수. 아군 디버프 지속시간 1턴 감소. WIS 판정에 이점' },
    { lv:1,  name:'감응 치유',   passive:false, cost:{mp:15}, effect:'초능력으로 상처 직접 치유, 아군 1명 HP 50 회복' },
    { lv:3,  name:'신경 회복',   passive:false, cost:{mp:20}, effect:'신경계 복원, 마비·기절·혼란 등 상태이상 제거 (아군 1명)' },
    { lv:5,  name:'생명력 전이', passive:false, cost:{hp:50}, effect:'자신 HP 50 소모, 아군 1명 HP 120 회복 (MP 소모 없음)' },
    { lv:7,  name:'집단 감응',   passive:false, cost:{mp:80}, effect:'아군 전체 심리 안정화, HP 80 회복 + 모든 정신계 상태이상 해제' },
    { lv:9,  name:'소생 감응',   passive:false, cost:{mp:130},effect:'임상사망 아군 1명 HP 80으로 소생 + 2턴간 고통 면역' },
    { lv:12, name:'공명',        passive:false, cost:{mp:200},effect:'전장 전체 생명 에너지 공명. 아군 전체 HP 완전 회복 + 3턴간 피해 받을 때마다 자동 HP 50 회복' },
  ],

  aw: [ // 각성자 (special)
    { lv:1,  name:'불안정 각성', passive:true,  cost:{},      effect:'예측 불가능한 초능력 폭발. HP 20% 이하 시 모든 초능력 비용 0, 피해 2배' },
    { lv:1,  name:'에너지 방출', passive:false, cost:{mp:15}, effect:'각성 에너지 방출, 단일 대상 WIS×3 피해' },
    { lv:3,  name:'강제 각성',   passive:false, cost:{hp:30}, effect:'자신을 강제로 각성, HP 30 소모. MP 80 즉시 회복 + 다음 스킬 비용 0' },
    { lv:5,  name:'프로토콜 파괴',passive:false,cost:{mp:50}, effect:'새사람 프로젝트 기억 활용, 기계형 적 완전 제어 1턴 + 모든 적 방어력 무시' },
    { lv:7,  name:'각성 폭발',   passive:false, cost:{mp:80}, effect:'통제 불능 에너지 폭발, 적 전체 WIS×4 피해. 자신도 WIS×1 피해' },
    { lv:9,  name:'완전체 접근', passive:false, cost:{mp:120},effect:'순간 완전체 각성, 2턴간 모든 수치 2배 + 상태이상 면역' },
    { lv:12, name:'신인류',      passive:false, cost:{mp:250},effect:'새사람 프로젝트의 완성형. 모든 한계 초월 — 3턴간 HP/MP 소모 없이 모든 스킬 자유 사용' },
  ],
};

// ─── 헬퍼 함수 ───────────────────────────────────────────────────────

// 능력치 문자열에서 특정 스탯 수정치 추출 (예: "STR 15, DEX 12, ...")
function getStatMod(statsStr, statName) {
  const m = statsStr.match(new RegExp(statName + '\\s+(\\d+)'));
  if (!m) return 0;
  return Math.floor((parseInt(m[1]) - 10) / 2);
}

// 레벨·직업·능력치로 최대 HP 계산
function calcMaxHp(jobId, level, statsStr) {
  const role = JOB_ROLE[jobId] || 'rogue';
  const g = ROLE_GROWTH[role];
  const conMod = getStatMod(statsStr, 'CON');
  return g.baseHp + (level - 1) * g.hpPerLv + conMod * level;
}

// 레벨·직업·능력치로 최대 MP 계산
function calcMaxMp(jobId, level, statsStr) {
  const role = JOB_ROLE[jobId] || 'rogue';
  const g = ROLE_GROWTH[role];
  const mod = getStatMod(statsStr, g.mpStat);
  return g.baseMp + (level - 1) * g.mpPerLv + mod * level;
}

// 현재 XP에서 레벨 계산 (1-12)
function calcLevel(xp) {
  let lv = 1;
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i]) { lv = i + 1; break; }
  }
  return Math.min(lv, 12);
}

// 몬스터 처치 경험치 계산
function getMonsterXp(monsterLevel, playerLevel) {
  const base = XP_BY_MONSTER_LEVEL[monsterLevel] || 25;
  const diff = playerLevel - monsterLevel; // 양수 = 몬스터가 약함
  const m = XP_MULTIPLIERS.find(r => diff <= r.diff) || XP_MULTIPLIERS[XP_MULTIPLIERS.length - 1];
  return Math.round(base * m.mult);
}

// 해당 레벨에서 사용 가능한 스킬 목록
function getAvailableSkills(jobId, level) {
  return (JOB_SKILLS[jobId] || []).filter(s => s.lv <= level);
}

// ─── 시스템 프롬프트용 텍스트 생성 ──────────────────────────────────

function buildJobSkills(jobId, level) {
  const skills = getAvailableSkills(jobId, level);
  if (!skills.length) return '';

  const locked = (JOB_SKILLS[jobId] || []).filter(s => s.lv > level);

  const lines = skills.map(s => {
    const costStr = s.cost?.hp && s.cost?.mp ? `HP${s.cost.hp}+MP${s.cost.mp}`
                  : s.cost?.hp ? `HP${s.cost.hp}`
                  : s.cost?.mp ? `MP${s.cost.mp}`
                  : '무비용';
    const tag = s.passive ? '[패시브]' : `[액티브 ${costStr}]`;
    return `  · ${s.name} ${tag} — ${s.effect}`;
  }).join('\n');

  const lockedLine = locked.length
    ? `  (잠김: ${locked.map(s=>`Lv${s.lv} ${s.name}`).join(', ')})`
    : '';

  return `[직업 스킬 — Lv${level} 기준 사용 가능]\n${lines}${lockedLine ? '\n' + lockedLine : ''}`;
}

function buildXpRules() {
  const nextLvRows = XP_LEVELS.slice(0,11).map((xp,i)=>
    `  Lv${i+1}→Lv${i+2}: ${XP_LEVELS[i+1].toLocaleString()} XP 필요`
  ).join('\n');

  const multRows = XP_MULTIPLIERS.map(r =>
    `  · ${r.label}: ×${r.mult}`
  ).join('\n');

  return `[경험치·레벨 규칙]
최대 레벨: 12. 전투 종료 시 xp_gained 필드에 획득 XP를 반드시 반환할 것.

몬스터 레벨별 기본 XP:
  Lv3:100 / Lv4:200 / Lv5:450 / Lv6:700 / Lv7:1100 / Lv8:1800 / Lv9:2300 / Lv10:2900 / Lv11:3900 / Lv12:5000

레벨 차이에 따른 XP 배율 (플레이어 레벨 − 몬스터 레벨 기준):
${multRows}

레벨 임계값:
${nextLvRows}`;
}
