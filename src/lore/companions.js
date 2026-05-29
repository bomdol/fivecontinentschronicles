// 동료 설정 — 대륙별 네임드 NPC 20명
// buildCompanionPrompt(activeCompanions)로 시스템 프롬프트에 주입
// 파티 제한: 플레이어 포함 최대 4인 = 동료 최대 3명

export const COMPANIONS = [
  // ─── 마법 대륙 (Arcania) ─────────────────────────────────────────────
  {
    id: 'kn',
    name: { ko: '가레스', en: 'Gareth Drayne' },
    cont: 'magic', job: 'kn',
    img: 'images/마법기사.png',
    role: { ko: '마법 기사', en: 'Magic Knight' },
    threat: 4,
    desc: {
      ko: 'Arcania 귀족 기사단장. 금서를 되찾기 위해 테라 노바에 파견됐다. 귀족 명예를 중시하지만 미르와 금서의 연결고리를 알고 번민한다.',
      en: 'Arcanian noble knight captain sent to retrieve the Forbidden Tome. Values honor, tormented by the Tome-Myr link.'
    },
    recruit_trigger: {
      ko: '금서 원정 중 부상 아군 구출. "귀족의 명예" 선택지에서 플레이어가 대신 오명을 쓸 때 합류.',
      en: 'Rescue wounded allies during the Tome expedition and take the blame for "noble honor".'
    },
    tension: '귀족 명령에 충실하고 싶지만 금서가 미르와 묶여 있다는 사실에 원정 정당성을 의심하기 시작한다.',
    maxHp: 280, maxMp: 90,
    stats: 'STR 16, DEX 12, CON 15, INT 11, WIS 10, CHA 14',
  },
  {
    id: 'am',
    name: { ko: '셀레스', en: 'Celes Veyn' },
    cont: 'magic', job: 'am',
    img: 'images/대마법사.png',
    role: { ko: '대마법사', en: 'Archmage' },
    threat: 3,
    desc: {
      ko: '금서 해독에 미친 천재. 테라 노바 마력 흐름이 금서 의식과 일치함을 발견했다.',
      en: 'Genius obsessed with the Forbidden Tome. Found Terra Nova ley lines match the Tome ritual.'
    },
    recruit_trigger: {
      ko: '금서 유적 마법 퍼즐 해독 실패 시 나타나 도움. 마나 폭주 현장을 함께 진정시켰을 때.',
      en: 'Appears when you fail a Tome ruin puzzle, or when calming a mana surge together.'
    },
    tension: '마나 메탈 결정화가 금서의 금기를 건드린다는 것을 알면서도 멈추지 못한다.',
    maxHp: 110, maxMp: 220,
    stats: 'STR 7, DEX 10, CON 9, INT 18, WIS 14, CHA 12',
  },
  {
    id: 'ma',
    name: { ko: '베일', en: 'Veil' },
    cont: 'magic', job: 'ma',
    img: 'images/마법암살자.png',
    role: { ko: '마법 암살자', en: 'Spell Assassin' },
    threat: 4,
    desc: {
      ko: 'Arcania 비밀조직 요원. 금서 유출자를 처단하며 내공의 기원이 금서임을 파헤쳤다.',
      en: 'Arcanian secret agent hunting Tome leakers. Discovered martial inner power originates from the Tome.'
    },
    recruit_trigger: {
      ko: '플레이어도 금서 유출자를 쫓는 퀘스트 중일 때, 밤에 기습했다가 목표가 같음을 알고 임시 동맹.',
      en: 'Ambushes you during a Tome leaker hunt, then allies when realizing you share the target.'
    },
    tension: '조직 명령(유출자 제거)과 진실(배신자는 Arcania 내부) 사이에서 선택을 강요받는다.',
    maxHp: 160, maxMp: 130,
    stats: 'STR 10, DEX 17, CON 11, INT 13, WIS 12, CHA 9',
  },
  {
    id: 'hl',
    name: { ko: '에리나', en: 'Erina Soleil' },
    cont: 'magic', job: 'hl',
    img: 'images/성약사.png',
    role: { ko: '성약사', en: 'Sanctum Healer' },
    threat: 2,
    desc: {
      ko: '마법 대륙 성약원 소속 치유사. 마나 메탈이 상처를 봉합하는 속도가 일반 치유 마법의 세 배라는 가설을 검증하러 테라 노바에 파견됐다. 겉으론 냉정하지만 부상자를 보면 반드시 멈춘다.',
      en: 'Arcanian healer testing if mana metal triples wound closure speed. Cold outwardly, but always stops for the injured.'
    },
    recruit_trigger: {
      ko: '채굴 중 부상당한 탐사대원을 함께 구조하거나, 야전 치료에 협력하는 상황이 생겼을 때.',
      en: 'When you rescue injured miners together, or cooperate during field triage.'
    },
    tension: '귀족에게만 영약을 제공하라는 명령과 타 대륙 부상자를 치료하고 싶은 양심이 충돌한다.',
    maxHp: 140, maxMp: 180,
    stats: 'STR 8, DEX 12, CON 11, INT 13, WIS 16, CHA 14',
  },
  {
    id: 'fb',
    name: { ko: '노아르', en: 'Noir' },
    cont: 'magic', job: 'fb',
    img: 'images/금서사용자.png',
    role: { ko: '금서 사용자', en: 'Forbidden Tome Wielder' },
    threat: 5,
    desc: {
      ko: '금단의 농경 마법서를 직접 다루는 이단. 내공과 마법 융합을 시도하며 어떤 세력에도 속하지 않는다.',
      en: 'Heretic wielding the Forbidden Tome directly. Attempts to fuse magic and inner power, loyal to none.'
    },
    recruit_trigger: {
      ko: '달마 내공자 dh와 전투 후 둘 다 빈사 시 금서 힘으로 서로를 살리며 강제 동맹. 또는 금서 지식을 공유할 때.',
      en: 'Forced alliance after near-death duel with Dharmic Monk dh, reviving each other with Tome power.'
    },
    tension: '금서의 힘은 강력하지만 사용자를 잠식한다. 마법 암살자가 자신을 제거하려는 것을 안다.',
    maxHp: 150, maxMp: 250,
    stats: 'STR 9, DEX 11, CON 10, INT 17, WIS 15, CHA 8',
  },

  // ─── 과학 대륙 (Mechanica) ────────────────────────────────────────────
  {
    id: 'ar',
    name: { ko: '브락스', en: 'Braxx Ironhide' },
    cont: 'science', job: 'ar',
    img: 'images/기갑병.png',
    role: { ko: '기갑병', en: 'Armored Trooper' },
    threat: 4,
    desc: {
      ko: 'Mechanica 철갑 분대장. 테라 노바 철광 점령이 임무지만 새사람 실험의 진실을 어렴풋이 안다.',
      en: 'Mechanica armored squad leader. Mission is seizing iron, but suspects the truth of Project Newman.'
    },
    recruit_trigger: {
      ko: '철광 수송 호위 중 화석 거인 습격. 함께 방패벽을 형성해 버틴 후 군 명령에 의문을 표할 때.',
      en: 'Survive a Fossil Titan attack by forming a shield wall during iron convoy escort, then question orders.'
    },
    tension: '새사람 진실 알게 되면 항명하고 탈영할 가능성이 있다.',
    maxHp: 320, maxMp: 60,
    stats: 'STR 17, DEX 9, CON 16, INT 10, WIS 11, CHA 10',
  },
  {
    id: 'iv',
    name: { ko: '타이론', en: 'Tyron Vex' },
    cont: 'science', job: 'iv',
    img: 'images/발명가.png',
    role: { ko: '발명가', en: 'Inventor' },
    threat: 2,
    desc: {
      ko: '채굴 공단 엔지니어. 테라 노바 철광석이 Mechanica 기계와 비정상 반응함을 발견하고 혼자 분석 중이다. 고집이 세고 말이 없지만 함께 문제를 풀면 신뢰한다.',
      en: 'Mining guild engineer who discovered anomalous reactions between Terra Nova iron and Mechanica machinery. Stubborn, quiet, but trusts those who solve problems with him.'
    },
    recruit_trigger: {
      ko: '채굴 장비가 이상 반응을 일으켜 함께 수습하거나, 그의 함정에서 서로 구해줬을 때.',
      en: 'When you help contain a malfunction in his mining rig, or save each other from one of his traps.'
    },
    tension: '테라 노바 철이 새사람 뇌와 공명함을 발견. 연구 공개 시 반역죄로 처형될 수 있다.',
    maxHp: 130, maxMp: 150,
    stats: 'STR 9, DEX 14, CON 10, INT 16, WIS 13, CHA 11',
  },
  {
    id: 'hk',
    name: { ko: '제로', en: 'Zero' },
    cont: 'science', job: 'hk',
    img: 'images/해커.png',
    role: { ko: '해커', en: 'Hacker' },
    threat: 3,
    desc: {
      ko: 'Mechanica 정보부 소속. 새사람 프로젝트 데이터를 몰래 빼돌리다 정체 발각 위기에 처했다.',
      en: 'Mechanica intel agent secretly leaking Project Newman data, now at risk of exposure.'
    },
    recruit_trigger: {
      ko: '과학 대륙 보안 시설 침투 시 경비망 무력화 지원. 의뢰하는 형태로 접근해 합류.',
      en: 'Supports you by disabling security during infiltration, then proposes joining.'
    },
    tension: '새사람 피해자에 동정심 느끼지만 임무 완수가 우선. 발각 시 뇌 세척형.',
    maxHp: 120, maxMp: 160,
    stats: 'STR 8, DEX 15, CON 9, INT 17, WIS 12, CHA 10',
  },
  {
    id: 'md',
    name: { ko: '클라라', en: 'Clara Morten' },
    cont: 'science', job: 'md',
    img: 'images/의무병.png',
    role: { ko: '의무병', en: 'Combat Medic' },
    threat: 2,
    desc: {
      ko: 'Mechanica 야전 의무병. Psychia 포로 치료 거부 명령을 받았지만 히포크라테스 선서를 지킨다.',
      en: 'Mechanica field medic. Ordered to deny treatment to Psychia prisoners, but upholds her oath.'
    },
    recruit_trigger: {
      ko: 'Psychia 포로 치료 거부 명령 불복 후 군 헌병에 쫓길 때 함께 탈출시켜주면 합류.',
      en: 'Joins after you help her escape MPs when she defies orders to heal Psychia prisoners.'
    },
    tension: '새사람 부작용 치료법 개발 중. 실험 중단 요구 시 군과 척지게 된다.',
    maxHp: 150, maxMp: 170,
    stats: 'STR 9, DEX 13, CON 12, INT 14, WIS 15, CHA 12',
  },
  {
    id: 'nw',
    name: { ko: '세븐', en: 'Seven' },
    cont: 'science', job: 'nw',
    img: 'images/새사람.png',
    role: { ko: '새사람', en: 'Newman' },
    threat: 4,
    desc: {
      ko: '폐기된 새사람 수용소의 유일 생존자. 실험체 번호 7로 불렸다. 감정이 결여된 듯 보이지만 복수심이 깊다.',
      en: 'Lone survivor of a decommissioned Newman facility. Called No.7. Seems emotionless, but deeply vengeful.'
    },
    recruit_trigger: {
      ko: '폐기된 수용소 발견 시 보호. "너는 번호가 아니라 사람이다" 선택지 선택 시 합류.',
      en: 'Protect them upon finding the decommissioned facility. Join when you choose "You are not a number".'
    },
    tension: '기억 조작이 해제됨. 창조주 Mechanica에 복수할 것인가, 용서할 것인가 사이에서 갈등.',
    maxHp: 180, maxMp: 200,
    stats: 'STR 14, DEX 14, CON 13, INT 15, WIS 8, CHA 6',
  },

  // ─── 무협 대륙 (Wuxia) ───────────────────────────────────────────────
  {
    id: 'sw',
    name: { ko: '백화', en: 'Baekhwa' },
    cont: 'wuxia', job: 'sw',
    img: 'images/검객.png',
    role: { ko: '검객', en: 'Swordsman' },
    threat: 3,
    desc: {
      ko: '흑도·백도 모두에게 쫓기는 방랑 검객. 구음절맥에 걸린 정인을 위해 열양신룡의 내단을 찾아 테라 노바에 왔다.',
      en: 'Wandering swordsman hunted by all. Came to Terra Nova seeking the Sun Dragon Core to save his lover.'
    },
    recruit_trigger: {
      ko: '미르 관련 정보로 시비 거는 무인들을 대신 막아주거나, 정인의 병을 치료할 단서를 제공할 때.',
      en: 'Defend them from martial artists seeking Myr info, or provide a clue to cure his lover.'
    },
    tension: '정인의 구음절맥 치료 위해 미르 내단이 필요. 달마 내공을 사도로 여기지만 금서와의 연관을 알면 혼란.',
    maxHp: 200, maxMp: 100,
    stats: 'STR 15, DEX 16, CON 12, INT 9, WIS 11, CHA 13',
  },
  {
    id: 'sc',
    name: { ko: '소요', en: 'Soyo' },
    cont: 'wuxia', job: 'sc',
    img: 'images/술사.png',
    role: { ko: '술사', en: 'Mystic' },
    threat: 3,
    desc: {
      ko: '무협 대륙 기문둔갑 전문가. 금서 유적의 봉인이 기문진과 유사함을 발견하고 흥미를 느낀다.',
      en: 'Wuxia qimen dunjia expert. Finds Forbidden Tome ruins use similar seals and is intrigued.'
    },
    recruit_trigger: {
      ko: '금서 유적 봉인 해제 실패 시 기문진으로 보조. "마법도 기공의 일종" 대화 선택 시 합류.',
      en: 'Assists with qimen formations when you fail a Tome seal. Joins if you say "Magic is a form of Qi".'
    },
    tension: '금서 술법이 무협 기공술의 기원일 수 있다. 공개 시 정사마 모두에게 공분 사서 파문 위험.',
    maxHp: 130, maxMp: 190,
    stats: 'STR 8, DEX 12, CON 10, INT 16, WIS 15, CHA 11',
  },
  {
    id: 'jk',
    name: { ko: '야율', en: 'Yalu' },
    cont: 'wuxia', job: 'jk',
    img: 'images/자객.png',
    role: { ko: '자객', en: 'Assassin' },
    threat: 4,
    desc: {
      ko: '흑도 살수. 마법기사 kn과 같은 금서 유출자를 추적 중이다. 목표 우선, 수단은 안 가린다.',
      en: 'Black Path killer. Hunting the same Tome leaker as Magic Knight kn. Mission first, methods second.'
    },
    recruit_trigger: {
      ko: '마법기사 kn과 같은 표적 암살 경쟁 후, 더 큰 배후가 있음을 알고 협공을 제안할 때.',
      en: 'After competing to kill the same target as kn, propose tackling the bigger mastermind together.'
    },
    tension: '흑도 명령 vs 금서 진실. 백도와 손잡는 선택지도 생기며 정체성 혼란.',
    maxHp: 170, maxMp: 110,
    stats: 'STR 11, DEX 18, CON 10, INT 12, WIS 10, CHA 8',
  },
  {
    id: 'us',
    name: { ko: '청운', en: 'Chingyun' },
    cont: 'wuxia', job: 'us',
    img: 'images/의선.png',
    role: { ko: '의선', en: 'Medicinal Sage' },
    threat: 2,
    desc: {
      ko: '백도 의선. 영약 독점에 반대해 민초를 무료로 치료한다. 성약사의 치유법에 관심이 많다.',
      en: 'White Path sage. Opposes elixir monopoly, heals commoners free. Interested in Sanctum healing methods.'
    },
    recruit_trigger: {
      ko: '전염병 퀘스트에서 영약 없이 민초 치료 성공 시 존경. "의술에 귀천은 없다" 선택 시 합류.',
      en: 'Gains respect when you cure plague without elixirs. Joins if you say "Medicine has no class".'
    },
    tension: '영약 독점은 백도 위선. 성약사 hl과 지식 교환 원하지만 문파에서 파문당할 수 있다.',
    maxHp: 145, maxMp: 185,
    stats: 'STR 7, DEX 11, CON 12, INT 14, WIS 17, CHA 13',
  },
  {
    id: 'dh',
    name: { ko: '무명', en: 'Wuming' },
    cont: 'wuxia', job: 'dh',
    img: 'images/달마내공자.png',
    role: { ko: '달마 내공자', en: 'Dharmic Monk' },
    threat: 5,
    desc: {
      ko: '달마 전설의 계승자. 내공 근원이 금서임을 알고 무림에서 파문당했다. 힘보다 깨달음을 추구한다.',
      en: 'Heir to Dharma legend. Excommunicated for learning inner power originates from the Tome. Seeks truth over power.'
    },
    recruit_trigger: {
      ko: '금서 사용자 fb가 무인 학살 시 저지하러 난입. "힘의 근원을 알아야 막을 수 있다" 설득 시 합류.',
      en: 'Intervenes when fb massacres martial artists. Joins if you persuade "We must know the source to stop it".'
    },
    tension: '내공 근원이 금서. 무림에서 파문당해도 진실 추구. 금서 사용자와 최후에 융합/결전 분기.',
    maxHp: 220, maxMp: 180,
    stats: 'STR 14, DEX 13, CON 15, INT 12, WIS 18, CHA 9',
  },

  // ─── 초능력 대륙 (Psychia) ───────────────────────────────────────────
  {
    id: 'fc',
    name: { ko: '카인', en: 'Cain' },
    cont: 'psychia', job: 'fc',
    img: 'images/역장사.png',
    role: { ko: '역장사', en: 'Force Adept' },
    threat: 4,
    desc: {
      ko: 'Psychia 해방전선 리더. 새사람은 Psychia 아이들을 납치해 만든 것임을 안다. Mechanica와 전면전을 원한다.',
      en: 'Psychia liberation leader. Knows Newmen are kidnapped Psychia children. Wants total war with Mechanica.'
    },
    recruit_trigger: {
      ko: '과학 대륙 채굴장 노예 해방 작전 시 역장으로 전선 유지. "함께 싸우자" 선택 시 합류.',
      en: 'Holds the line with force fields during slave liberation. Joins if you say "Let us fight together".'
    },
    tension: '새사람은 Psychia 아이들. 전면전 vs 민간인 피해 우려 사이 갈등.',
    maxHp: 190, maxMp: 170,
    stats: 'STR 12, DEX 10, CON 14, INT 13, WIS 15, CHA 12',
  },
  {
    id: 'tk',
    name: { ko: '리라', en: 'Lyra' },
    cont: 'psychia', job: 'tk',
    img: 'images/염동력자.png',
    role: { ko: '염동력자', en: 'Telekine' },
    threat: 3,
    desc: {
      ko: '오로라 늑대 무리와 교감하는 Psychia 소녀. Mechanica의 뇌파 차단 장치에 트라우마가 있다.',
      en: 'Psychia girl bonded with Aurora Wolf pack. Traumatized by Mechanica brainwave jammers.'
    },
    recruit_trigger: {
      ko: '오로라 늑대 교감 실패 시 나타나 중재. 뇌파 차단 장치 파괴 퀘스트 함께 수행 시 합류.',
      en: 'Mediates when you fail to bond with Aurora Wolves. Joins after destroying brainwave jammers together.'
    },
    tension: 'Mechanica 뇌파 차단 장치를 보면 이성을 잃고 파괴하려 해 민간인 피해 유발 가능.',
    maxHp: 140, maxMp: 190,
    stats: 'STR 8, DEX 14, CON 10, INT 15, WIS 12, CHA 14',
  },
  {
    id: 'jy',
    name: { ko: '미스트', en: 'Mist' },
    cont: 'psychia', job: 'jy',
    img: 'images/잠영술사.png',
    role: { ko: '잠영술사', en: 'Shadow Walker' },
    threat: 3,
    desc: {
      ko: 'Psychia 정보부. 마법/과학 대륙 밀약 현장을 잠입 감시 중. 양다리 외교의 진실을 안다.',
      en: 'Psychia intel. Infiltrating secret Arcania-Mechanica pacts. Knows the truth of double-dealing.'
    },
    recruit_trigger: {
      ko: '마법/과학 대륙 밀약 현장 잠입 시 정보 공유. "진실을 폭로하자" 선택 시 합류, "이용하자" 선택 시 거래.',
      en: 'Shares intel when you infiltrate the secret pact. Joins if "Expose truth", deals if "Exploit it".'
    },
    tension: '밀약 폭로하면 Psychia 내전. 침묵하면 동족 착취 방관. 어느 쪽도 최적해가 없다.',
    maxHp: 150, maxMp: 150,
    stats: 'STR 9, DEX 17, CON 10, INT 14, WIS 13, CHA 11',
  },
  {
    id: 'ep',
    name: { ko: '나이아', en: 'Naia' },
    cont: 'psychia', job: 'ep',
    img: 'images/초능력의사.png',
    role: { ko: '초능력 의사', en: 'Psi-Medic' },
    threat: 2,
    desc: {
      ko: '뇌수술 특화 Psychia 의사. 새사람 nw의 뇌를 수술해 기억 복원을 시도한다. 윤리에 민감.',
      en: 'Psychia brain surgeon. Attempts to restore nw\'s memories via surgery. Highly ethical.'
    },
    recruit_trigger: {
      ko: '새사람 nw 치료 시 뇌수술 공조. "생명 앞에선 적도 환자다" 선택 시 존경하며 합류.',
      en: 'Cooperate on nw brain surgery. Joins if you say "Even enemies are patients before life".'
    },
    tension: 'Psychia 능력도 새사람 기술에서 유출됐을 수 있다. 능력을 쓸수록 새사람화가 두렵다.',
    maxHp: 135, maxMp: 195,
    stats: 'STR 7, DEX 12, CON 11, INT 16, WIS 17, CHA 12',
  },
  {
    id: 'aw',
    name: { ko: '이든', en: 'Eden' },
    cont: 'psychia', job: 'aw',
    img: 'images/각성자.png',
    role: { ko: '각성자', en: 'Awakened' },
    threat: 5,
    desc: {
      ko: 'Psychia 전설의 각성자. 전 인류 정신 연결을 꿈꾸지만 그 과정에 개인 의지 말살을 감수해야 한다.',
      en: 'Legendary Psychia Awakened. Dreams of linking all minds, but it requires erasing individual will.'
    },
    recruit_trigger: {
      ko: '새사람 nw 기억 복원 의식 호위 시 텔레파시 폭주를 막아줌. "개인의 고통도 의미있다" 인정하면 합류.',
      en: 'Stops telepathic backlash during nw memory ritual. Joins if you acknowledge "Individual pain matters".'
    },
    tension: '전 인류 정신 연결 vs 개인 의지. 반대 시 최종보스화 가능.',
    maxHp: 200, maxMp: 240,
    stats: 'STR 10, DEX 11, CON 12, INT 15, WIS 19, CHA 16',
  },
];

// 동료 ID → COMPANIONS 항목
export function getCompanion(id) {
  return COMPANIONS.find(c => c.id === id) ?? null;
}

// 동료 항목 상세 줄 생성
function companionDetailLine(c) {
  const crossStr = c.cross?.length ? ` [크로스: ${c.cross.join('/')}]` : '';
  return `  • ${c.name.ko}(${c.id}) [${c.role.ko}·★${c.threat}]${crossStr}: ${c.desc.ko.slice(0, 55)}… / 영입: ${c.recruit_trigger.ko}`;
}

// 시스템 프롬프트 주입 텍스트
// playerCont: 플레이어 대륙 ID (같은 대륙 동료를 상세 표시)
export function buildCompanionPrompt(activeCompanions, playerCont) {
  const crossPairs = [...new Set(
    COMPANIONS.flatMap(c => (c.cross ?? []).map(x => [c.id, x].sort().join('-')))
  )].map(pair => {
    const [a, b] = pair.split('-');
    const ca = COMPANIONS.find(c => c.id === a);
    const cb = COMPANIONS.find(c => c.id === b);
    return ca && cb ? `${ca.name.ko}(${a})↔${cb.name.ko}(${b})` : null;
  }).filter(Boolean).join(', ');

  // 같은 대륙: 전체 상세 / 다른 대륙: 위협 높은 2명 상세 + 나머지 이름만
  const sameCont   = COMPANIONS.filter(c => c.cont === playerCont);
  const otherCont  = COMPANIONS.filter(c => c.cont !== playerCont);
  const otherDetail = [...otherCont].sort((a, b) => b.threat - a.threat).slice(0, 2);
  const otherBrief  = otherCont.filter(c => !otherDetail.includes(c));

  const detailLines = [...sameCont, ...otherDetail].map(companionDetailLine).join('\n');
  const briefLine   = otherBrief.length
    ? `  (그 외) ${otherBrief.map(c => `${c.name.ko}(${c.id}/${c.cont})`).join(', ')}`
    : '';

  const activeList = (activeCompanions || []).length > 0
    ? activeCompanions.map(a => {
        const base = getCompanion(a.id);
        const pct = base ? Math.round((a.hp / a.maxHp) * 100) : '?';
        return `  • ${a.name ?? base?.name.ko ?? a.id}: HP ${a.hp}/${a.maxHp} (${pct}%) — ${a.status}`;
      }).join('\n')
    : '  없음';

  return `[동료 시스템 — 파티 최대 3명]
현재 파티 동료:
${activeList}

영입 가능한 네임드 동료 (같은 대륙 상세, 타 대륙 위협 상위 2명 상세, 나머지 이름만):
${detailLines}
${briefLine}

동료 규칙:
- 동료는 전투 중 AI 자율 행동 (GM이 서사에 녹여 자연스럽게 묘사)
- HP가 0이 되면 '전투 불능(down)' 상태 — 행동 불가, 추가 공격 받으면 영구 사망(dead)
- 전투 종료 후 down 상태인 동료는 HP 1로 회복 (dead는 영구 소실)
- 파티 인원이 3명 미만일 때만 새 동료 영입 가능

[크로스 충돌 쌍 — 동시 파티 시 매 장면 종료마다 갈등 판정]
${crossPairs}

[응답 JSON 동료 필드]
"companion_recruit": "",   // 이번 턴에 영입 확정된 동료 id. 없으면 ""
"companion_state": []      // 활성 동료 변화: [{"id":"hl","hp_delta":-30,"status":"active"}]
  status 값: "active"(정상) | "down"(전투불능) | "dead"(영구사망)
  동료에게 변화가 없으면 []`;
}

// 압축 프롬프트용 — 이름·id·영입조건 요약만
export function buildCompanionPromptCompact(activeCompanions) {
  const activeList = (activeCompanions || []).length > 0
    ? activeCompanions.map(a => {
        const base = getCompanion(a.id);
        return `${a.name ?? base?.name.ko ?? a.id}: HP ${a.hp}/${a.maxHp} (${a.status})`;
      }).join(', ')
    : '없음';

  const recruitSummary = COMPANIONS.map(c =>
    `${c.name.ko}(${c.id}/${c.cont})`
  ).join(', ');

  return `[파티 동료] ${activeList}
동료: HP 0→down. down 중 추가공격→dead(영구). 전투종료→down은 HP1 자동회복.
[영입 가능 — 조건 충족 시 companion_recruit 반환] ${recruitSummary}`;
}
