// 게임 정적 데이터 — 01_character_select.html + 02_gameplay.html에서 추출

export const LANGS = [
  {code:'ko',flag:'🇰🇷',native:'한국어',name:'한국어',builtin:true},
  {code:'en',flag:'🇺🇸',native:'English',name:'영어',builtin:true},
  {code:'zh',flag:'🇨🇳',native:'中文',name:'중국어',builtin:true},
  {code:'ja',flag:'🇯🇵',native:'日本語',name:'일본어',builtin:true},
  {code:'es',flag:'🇪🇸',native:'Español',name:'스페인어',builtin:true},
  {code:'fr',flag:'🇫🇷',native:'Français',name:'프랑스어',builtin:true},
  {code:'ar',flag:'🇸🇦',native:'العربية',name:'아랍어',builtin:true},
  {code:'pt',flag:'🇧🇷',native:'Português',name:'포르투갈어',builtin:true},
  {code:'ru',flag:'🇷🇺',native:'Русский',name:'러시아어',builtin:true},
  {code:'vi',flag:'🇻🇳',native:'Tiếng Việt',name:'베트남어',builtin:true},
  {code:'hi',flag:'🇮🇳',native:'हिन्दी',name:'힌디어',builtin:false},
  {code:'id',flag:'🇮🇩',native:'Bahasa',name:'인도네시아어',builtin:false},
  {code:'de',flag:'🇩🇪',native:'Deutsch',name:'독일어',builtin:false},
  {code:'tr',flag:'🇹🇷',native:'Türkçe',name:'터키어',builtin:false},
  {code:'th',flag:'🇹🇭',native:'ภาษาไทย',name:'태국어',builtin:false},
  {code:'it',flag:'🇮🇹',native:'Italiano',name:'이탈리아어',builtin:false},
  {code:'pl',flag:'🇵🇱',native:'Polski',name:'폴란드어',builtin:false},
  {code:'uk',flag:'🇺🇦',native:'Українська',name:'우크라이나어',builtin:false},
  {code:'nl',flag:'🇳🇱',native:'Nederlands',name:'네덜란드어',builtin:false},
  {code:'ms',flag:'🇲🇾',native:'Melayu',name:'말레이어',builtin:false},
];

export const UI = {
  ko:{title:'오 대 륙 전 기',sub:'FIVE CONTINENTS CHRONICLES',langSel:'언어 선택',langConfirm:'이 언어로 시작',lore:'태초에 판게아가 다섯 땅으로 갈라졌더라.\n그 가운데 빈 땅 — 테라 노바 — 에는\n철이 묻히고 영약이 자라고 미르가 잠들어 있더라.\n이제 네 대륙의 칼과 마법과 내공이\n그 땅 위에서 부딪히니...',startBtn:'— 게 임 시 작 —',s1:'대 륙 선 택',s2:'직 업 선 택',s3:'능 력 치 조 정',next:'다음 →',back:'← 뒤로',statStart:'모험 시작 →',pool:'남은 추가 점수',maxDelta:'직업 기본값 기준 최대',poolRule:'− 누르면 점수 +1 · + 누르면 점수 −1',modLabel:'수정치',bonLabel:'대륙',sumMore:'추가 점수',sumLeft:'점 남음',sumDone:'추가 점수를 모두 사용했습니다'},
  en:{title:'FIVE CONTINENTS',sub:'CHRONICLES',langSel:'Select Language',langConfirm:'Start in English',lore:'In the beginning, Pangaea split into five lands.\nIn the empty land — Terra Nova —\niron is buried, elixirs grow, and mirrs sleep.\nNow blades, magic, and inner force\nof four continents clash upon that land...',startBtn:'— START GAME —',s1:'CONTINENT',s2:'CLASS',s3:'STATS',next:'Next →',back:'← Back',statStart:'Begin Adventure →',pool:'Remaining Points',maxDelta:'Max ±2 from job base',poolRule:'− adds point · + spends point',modLabel:'Modifier',bonLabel:'Cont.',sumMore:'Points left:',sumLeft:'',sumDone:'All points spent'},
  zh:{title:'五 大 陆 战 记',sub:'FIVE CONTINENTS CHRONICLES',langSel:'选择语言',langConfirm:'用中文开始',lore:'太初盘古大陆分裂为五片土地。\n其中空旷之地——特拉诺瓦——\n埋藏着铁矿，生长着灵药，沉睡着龙。\n如今四大陆的剑、魔法与内功\n在那片土地上交锋...',startBtn:'— 开 始 游 戏 —',s1:'选择大陆',s2:'选择职业',s3:'分配能力值',next:'下一步 →',back:'← 返回',statStart:'开始冒险 →',pool:'剩余点数',maxDelta:'职业基础值最大±2',poolRule:'− 加点数 · + 扣点数',modLabel:'调整值',bonLabel:'大陆',sumMore:'剩余',sumLeft:'点',sumDone:'点数已全部分配'},
  ja:{title:'五 大 陸 戦 記',sub:'FIVE CONTINENTS CHRONICLES',langSel:'言語を選択',langConfirm:'日本語で始める',lore:'太初にパンゲアが五つの大地に分かれた。\nその中の空白の地——テラ・ノヴァ——には\n鉄が埋まり、霊薬が育ち、竜が眠っている。\n今や四大陸の剣と魔法と内功が\nその地で激突する...',startBtn:'— ゲ ー ム 開 始 —',s1:'大陸選択',s2:'職業選択',s3:'能力値調整',next:'次へ →',back:'← 戻る',statStart:'冒険を始める →',pool:'残りポイント',maxDelta:'職業基準値から最大±2',poolRule:'− でポイント+1 · + でポイント−1',modLabel:'修正値',bonLabel:'大陸',sumMore:'残り',sumLeft:'ポイント',sumDone:'ポイントをすべて使用しました'},
  vi:{title:'BIÊN NIÊN SỬ',sub:'NĂM ĐẠI LỤC',langSel:'Chọn ngôn ngữ',langConfirm:'Bắt đầu bằng tiếng Việt',lore:'Ban đầu Pangaea tách thành năm vùng đất.\nTrong vùng đất trống — Terra Nova —\nsắt được chôn vùi, linh dược mọc lên, và rồng đang ngủ.\nNay kiếm, phép thuật và nội công\ncủa bốn đại lục đang va chạm trên mảnh đất ấy...',startBtn:'— BẮT ĐẦU CHƠI —',s1:'CHỌN LỤC ĐỊA',s2:'CHỌN NGHỀ',s3:'PHÂN BỔ CHỈ SỐ',next:'Tiếp →',back:'← Quay lại',statStart:'Bắt đầu phiêu lưu →',pool:'Điểm còn lại',maxDelta:'Tối đa ±2 từ chỉ số nghề',poolRule:'− thêm điểm · + tiêu điểm',modLabel:'Chỉ số',bonLabel:'Lục địa',sumMore:'Còn',sumLeft:'điểm',sumDone:'Đã dùng hết điểm'},
};

export function getUI(code) {
  return UI[code] || {...UI.en, langConfirm:`Start in ${LANGS.find(x=>x.code===code)?.native||code}`};
}

export const CONTS = [
  {id:'magic',icon:'✦',name:{ko:'마법 대륙',en:'Arcania',zh:'魔法大陆',ja:'魔法大陸',vi:'Đại Lục Ma Pháp'},flavor:'ARCANIA',desc:{ko:'마법사 귀족이 지배. 마나 메탈을 갈망하며 빈 땅에 500명 파견.',en:'Ruled by mage nobles. 500 sent to Terra Nova seeking mana metal.',zh:'法师贵族统治。渴望魔导金属，派遣500人。',ja:'魔法師貴族が支配。マナメタルを求め500名を派遣。',vi:'Quý tộc pháp sư cai trị. 500 người được cử đến Terra Nova.'},tags:{ko:['마법 주문','마나 메탈','번역 마법구'],en:['Spells','Mana Metal','Translate Orb'],zh:['魔法咒语','魔导金属','翻译魔具'],ja:['魔法呪文','マナメタル','翻訳魔道具'],vi:['Phép thuật','Kim loại mana','Cầu dịch']},bonus:{지력:2,지혜:1}},
  {id:'science',icon:'⚙',name:{ko:'과학 대륙',en:'Mechanica',zh:'科学大陆',ja:'科学大陸',vi:'Đại Lục Khoa Học'},flavor:'MECHANICA',desc:{ko:'비행선·기계 발달, 철 고갈. 새사람 프로젝트의 어두운 비밀.',en:'Airships & machines, but iron depleted. Dark secret: the New Human Project.',zh:'飞船与机械发达，铁矿耗尽。暗藏新人类计划。',ja:'飛行船と機械が発達、鉄が枯渇。新人間計画の暗い秘密。',vi:'Tàu bay và máy móc phát triển. Dự án Con Người Mới bí ẩn.'},tags:{ko:['비행선','번역기','기계 무기'],en:['Airship','Translator','Mech Arms'],zh:['飞行船','翻译机','机械武器'],ja:['飛行船','翻訳機','機械武器'],vi:['Tàu bay','Máy dịch','Vũ khí cơ học']},bonus:{지력:2,체력:1}},
  {id:'wuxia',icon:'彡',name:{ko:'무협 대륙',en:'Wuxia',zh:'武侠大陆',ja:'武侠大陸',vi:'Đại Lục Võ Hiệp'},flavor:'WUXIA',desc:{ko:'흑도·백도가 갈린 무림. 내공과 경공으로 하늘을 나는 무인들의 땅.',en:'Split between Black & White paths. Warriors who fly with inner force.',zh:'黑道白道对立的武林。凭内功与轻功飞翔的武者之地。',ja:'黒道と白道に分かれた武林。内功と軽功で空を飛ぶ武人の地。',vi:'Hắc đạo và bạch đạo đối lập. Vùng đất của võ sĩ.'},tags:{ko:['내공','경공','영약·미르'],en:['Inner Force','Qinggong','Elixir·Mirr'],zh:['内功','轻功','灵药·神龙'],ja:['内功','軽功','霊薬・竜'],vi:['Nội công','Khinh công','Linh dược']},bonus:{근력:1,민첩:2}},
  {id:'psychic',icon:'◎',name:{ko:'초능력 대륙',en:'Psychia',zh:'超能大陆',ja:'超能力大陸',vi:'Đại Lục Siêu Năng'},flavor:'PSYCHIA',desc:{ko:'초능력자들의 땅. 인구 희소, 과학 대륙에 착취당한 한이 깊다.',en:'Land of psychics. Few in number, deeply wronged by Mechanica.',zh:'超能力者之地。人口稀少，被科学大陆剥削，积怨深重。',ja:'超能力者の地。人口希少、科学大陸に搾取された深い恨み。',vi:'Vùng đất của siêu năng lực. Mang hận thù với Đại Lục Khoa Học.'},tags:{ko:['텔레파시','염동력','잠영'],en:['Telepathy','Telekinesis','Stealth'],zh:['心灵感应','念动力','隐身'],ja:['テレパシー','念動力','潜影'],vi:['Thần giao','念동력','Ẩn thân']},bonus:{지혜:2,민첩:1}},
];

export const JOBS = {
  magic:[
    {id:'kn',role:{ko:'전사형',en:'Warrior',zh:'战士型',ja:'戦士型',vi:'Chiến sĩ'},name:{ko:'마법 기사',en:'Magic Knight',zh:'魔法骑士',ja:'魔法騎士',vi:'Kỵ sĩ phép thuật'},sp:0,asc:' ⚔\n[✦]\n/ \\',desc:{ko:'갑옷에 마법을 새겨 싸우는 전사.',en:'Warrior who inscribes magic into armor.',zh:'将魔法刻入铠甲战斗的战士。',ja:'鎧に魔法を刻む戦士。',vi:'Chiến sĩ khắc phép thuật vào giáp.'},s:{근력:80,민첩:55,지력:70,지혜:50,체력:75,매력:45}},
    {id:'am',role:{ko:'마법형',en:'Mage',zh:'魔法型',ja:'魔法型',vi:'Pháp sư'},name:{ko:'대마법사',en:'Archmage',zh:'大魔法师',ja:'大魔法師',vi:'Đại pháp sư'},sp:0,asc:' ★\n(✦)\n/ \\',desc:{ko:'낮은 전투력, 강력한 광역 주문.',en:'Low combat, powerful area spells.',zh:'战斗力低，但拥有强力范围魔法。',ja:'戦闘力は低いが強力な広域呪文。',vi:'Chiến đấu yếu nhưng phép thuật diện rộng mạnh.'},s:{근력:25,민첩:45,지력:95,지혜:80,체력:35,매력:65}},
    {id:'ma',role:{ko:'도적형',en:'Rogue',zh:'盗贼型',ja:'盗賊型',vi:'Thích khách'},name:{ko:'마법 암살자',en:'Spell Assassin',zh:'魔法刺客',ja:'魔法暗殺者',vi:'Thích khách phép thuật'},sp:0,asc:' •\n/✦\\\n/ \\',desc:{ko:'은신 마법과 단검의 결합.',en:'Combines stealth magic with daggers.',zh:'隐身魔法与短刃的结合。',ja:'隠身魔法と短剣の組み合わせ。',vi:'Kết hợp phép ẩn thân và dao găm.'},s:{근력:55,민첩:90,지력:65,지혜:45,체력:50,매력:40}},
    {id:'hl',role:{ko:'지원형',en:'Support',zh:'辅助型',ja:'支援型',vi:'Hỗ trợ'},name:{ko:'성약사',en:'Sanctum Healer',zh:'圣药师',ja:'聖薬師',vi:'Thánh dược sư'},sp:0,asc:' +\n[✦]\n/ \\',desc:{ko:'치유 마법과 약초 지식 겸비.',en:'Combines healing magic with herbalism.',zh:'兼备治愈魔法与草药知识。',ja:'治癒魔法と薬草知識を兼ね備える。',vi:'Kết hợp phép chữa lành và thảo mộc.'},s:{근력:35,민첩:50,지력:60,지혜:90,체력:55,매력:75}},
    {id:'fb',role:{ko:'특수 — 희귀',en:'Special',zh:'特殊',ja:'特殊',vi:'Đặc biệt'},name:{ko:'금서 사용자',en:'Forbidden Arts',zh:'禁书使用者',ja:'禁書使用者',vi:'Người dùng sách cấm'},sp:1,asc:' 📖\n/!!\\\n/ \\',desc:{ko:'금지된 농경 마법서를 아는 자.',en:'Knows the forbidden agrarian grimoire.',zh:'知晓被禁止的农耕魔法书。',ja:'禁じられた農耕魔法書を知る者。',vi:'Người biết bộ sách phép thuật bị cấm.'},s:{근력:40,민첩:60,지력:75,지혜:85,체력:45,매력:55}},
  ],
  science:[
    {id:'ar',role:{ko:'전사형',en:'Warrior',zh:'战士型',ja:'戦士型',vi:'Chiến sĩ'},name:{ko:'기갑병',en:'Iron Soldier',zh:'机甲兵',ja:'機甲兵',vi:'Lính thiết giáp'},sp:0,asc:' ◉\n[⚙]\n/ \\',desc:{ko:'동력 갑옷 전투 병사.',en:'Powered armor combat soldier.',zh:'动力装甲战斗士兵。',ja:'動力鎧戦闘兵士。',vi:'Lính chiến đấu trong giáp động lực.'},s:{근력:85,민첩:40,지력:55,지혜:35,체력:90,매력:30}},
    {id:'iv',role:{ko:'기술형',en:'Tech',zh:'技术型',ja:'技術型',vi:'Kỹ thuật'},name:{ko:'발명가',en:'Inventor',zh:'发明家',ja:'発明家',vi:'Nhà phát minh'},sp:0,asc:' ⚙\n/⚒\\\n/ \\',desc:{ko:'현장 즉흥 발명가.',en:'Improvises inventions on the field.',zh:'战场即兴发明家。',ja:'現場即興発明家。',vi:'Nhà phát minh ứng biến tại trận.'},s:{근력:35,민첩:65,지력:90,지혜:70,체력:45,매력:50}},
    {id:'hk',role:{ko:'도적형',en:'Rogue',zh:'盗贼型',ja:'盗賊型',vi:'Thích khách'},name:{ko:'해커',en:'Hacker',zh:'黑客',ja:'ハッカー',vi:'Hacker'},sp:0,asc:' ●\n/⚡\\\n/ \\',desc:{ko:'기계·정보망 침투 전문.',en:'Specialist in machine & network infiltration.',zh:'机械与信息网络渗透专家。',ja:'機械・情報網侵入のスペシャリスト。',vi:'Chuyên gia xâm nhập máy móc và mạng.'},s:{근력:30,민첩:80,지력:85,지혜:60,체력:40,매력:45}},
    {id:'md',role:{ko:'지원형',en:'Support',zh:'辅助型',ja:'支援型',vi:'Hỗ trợ'},name:{ko:'의무병',en:'Field Medic',zh:'医务兵',ja:'衛生兵',vi:'Y tá chiến trường'},sp:0,asc:' +\n[⚕]\n/ \\',desc:{ko:'전장 응급처치 전문.',en:'Field emergency medical specialist.',zh:'战场急救专家。',ja:'戦場応急処置の専門家。',vi:'Chuyên gia cấp cứu chiến trường.'},s:{근력:45,민첩:65,지력:70,지혜:80,체력:60,매력:60}},
    {id:'nw',role:{ko:'특수 — 희귀',en:'Special',zh:'特殊',ja:'特殊',vi:'Đặc biệt'},name:{ko:'새사람',en:'New Human',zh:'新人类',ja:'新人間',vi:'Con Người Mới'},sp:1,asc:' ◎\n/⚙\\\n/ \\',desc:{ko:'인간-기계 혼합체 실험체.',en:'Human-machine hybrid experiment subject.',zh:'人机混合实验体。',ja:'人間と機械の複合実験体。',vi:'Thực thể thí nghiệm lai người-máy.'},s:{근력:70,민첩:75,지력:65,지혜:50,체력:80,매력:20}},
  ],
  wuxia:[
    {id:'sw',role:{ko:'전사형',en:'Warrior',zh:'战士型',ja:'戦士型',vi:'Chiến sĩ'},name:{ko:'검객',en:'Swordsman',zh:'剑客',ja:'剣客',vi:'Kiếm khách'},sp:0,asc:' O\n/|\\\n/ \\',desc:{ko:'검술·내공 겸비 정통 무인.',en:'Orthodox warrior combining swordsmanship and inner force.',zh:'兼备剑术与内功的正统武者。',ja:'剣術と内功を兼ね備える正統武人。',vi:'Võ sĩ chính thống kết hợp kiếm thuật và nội công.'},s:{근력:85,민첩:80,지력:40,지혜:55,체력:75,매력:50}},
    {id:'sc',role:{ko:'마법형',en:'Mage',zh:'魔法型',ja:'魔法型',vi:'Pháp sư'},name:{ko:'술사',en:'Elementalist',zh:'术士',ja:'術士',vi:'Thuật sĩ'},sp:0,asc:' ☯\n/道\\\n/ \\',desc:{ko:'오행의 기를 다루는 도사.',en:'Taoist who wields the five elemental forces.',zh:'操控五行之气的道士。',ja:'五行の気を操る道士。',vi:'Đạo sĩ điều khiển khí ngũ hành.'},s:{근력:35,민첩:60,지력:70,지혜:90,체력:40,매력:65}},
    {id:'jk',role:{ko:'도적형',en:'Rogue',zh:'盗贼型',ja:'盗賊型',vi:'Thích khách'},name:{ko:'자객',en:'Assassin',zh:'刺客',ja:'刺客',vi:'Thích khách'},sp:0,asc:' •\n/彡\\\n/ \\',desc:{ko:'경공·암기 결합 암살자.',en:'Assassin combining qinggong and hidden weapons.',zh:'结合轻功与暗器的刺客。',ja:'軽功と暗器を組み合わせた刺客。',vi:'Sát thủ kết hợp khinh công và ám khí.'},s:{근력:55,민첩:95,지력:50,지혜:55,체력:50,매력:35}},
    {id:'us',role:{ko:'지원형',en:'Support',zh:'辅助型',ja:'支援型',vi:'Hỗ trợ'},name:{ko:'의선',en:'Physician',zh:'医仙',ja:'医仙',vi:'Y tiên'},sp:0,asc:' +\n/藥\\\n/ \\',desc:{ko:'영약 조제·경혈 치료의 고수.',en:'Master of elixirs and acupressure healing.',zh:'擅长灵药调制与穴位治疗的高手。',ja:'霊薬調製と経穴治療の達人。',vi:'Cao thủ bào chế linh dược và trị liệu.'},s:{근력:30,민첩:55,지력:65,지혜:95,체력:50,매력:70}},
    {id:'dh',role:{ko:'특수 — 희귀',en:'Special',zh:'特殊',ja:'特殊',vi:'Đặc biệt'},name:{ko:'달마 내공자',en:'Dharma',zh:'达摩内功者',ja:'達磨内功者',vi:'Người nội công Đạt Ma'},sp:1,asc:' ☯\n/✦彡\n/ \\',desc:{ko:'마법·무협 융합 비정통 내공.',en:'Unorthodox inner force fusing magic and martial arts.',zh:'融合魔法与武侠的非正统内功。',ja:'魔法と武侠を融合した非正統内功。',vi:'Nội công phi chính thống kết hợp phép thuật và võ hiệp.'},s:{근력:75,민첩:70,지력:65,지혜:80,체력:70,매력:45}},
  ],
  psychic:[
    {id:'fc',role:{ko:'전사형',en:'Warrior',zh:'战士型',ja:'戦士型',vi:'Chiến sĩ'},name:{ko:'역장사',en:'Force User',zh:'力场士',ja:'力場士',vi:'Lực trường sĩ'},sp:0,asc:' O\n/◎\\\n/ \\',desc:{ko:'결계를 이용한 공수 겸비.',en:'Pushes and pulls enemies with telekinesis.',zh:'用念动力推拉敌人。',ja:'念動力で敵を押したり引いたりする。',vi:'Đẩy và kéo kẻ thù bằng念동력.'},s:{근력:65,민첩:70,지력:55,지혜:80,체력:65,매력:45}},
    {id:'tk',role:{ko:'원거리형',en:'Ranged',zh:'远程型',ja:'遠距離型',vi:'Tầm xa'},name:{ko:'염동력자',en:'Telekinetic',zh:'念动力者',ja:'念動力者',vi:'Nhà염동력'},sp:0,asc:' ◎\n/ \\\n/ \\',desc:{ko:'물체·에너지 원격 조종.',en:'Remote control of objects and energy.',zh:'远程操控物体与能量。',ja:'物体とエネルギーの遠隔操作。',vi:'Điều khiển từ xa vật thể và năng lượng.'},s:{근력:30,민첩:75,지력:70,지혜:90,체력:40,매력:55}},
    {id:'jy',role:{ko:'도적형',en:'Rogue',zh:'盗贼型',ja:'盗賊型',vi:'Thích khách'},name:{ko:'잠영술사',en:'Shadow Walker',zh:'潜影术士',ja:'潜影術士',vi:'Thuật sĩ ẩn bóng'},sp:0,asc:' ●\n/◎\\\n/ \\',desc:{ko:'마음 읽기·환각으로 교란.',en:'Disrupts with mind-reading and illusions.',zh:'以读心术与幻觉扰乱敌人。',ja:'読心術と幻覚で敵を撹乱する。',vi:'Quấy rối bằng đọc tâm trí và ảo giác.'},s:{근력:35,민첩:85,지력:75,지혜:85,체력:40,매력:65}},
    {id:'ep',role:{ko:'지원형',en:'Support',zh:'辅助型',ja:'支援型',vi:'Hỗ trợ'},name:{ko:'초능력 의사',en:'Psychic Healer',zh:'超能医师',ja:'超能力医師',vi:'Bác sĩ siêu năng'},sp:0,asc:' ♡\n/◎\\\n/ \\',desc:{ko:'감응으로 부상 진단·고통 흡수.',en:'Diagnoses wounds via empathy, absorbs pain.',zh:'通过感应诊断伤势、吸收痛苦。',ja:'感応で傷を診断し痛みを吸収する。',vi:'Chẩn đoán thương tích qua cảm ứng, hấp thụ đau đớn.'},s:{근력:25,민첩:55,지력:65,지혜:95,체력:45,매력:85}},
    {id:'aw',role:{ko:'특수 — 희귀',en:'Special',zh:'特殊',ja:'特殊',vi:'Đặc biệt'},name:{ko:'각성자',en:'Awakened',zh:'觉醒者',ja:'覚醒者',vi:'Người thức tỉnh'},sp:1,asc:' ◎!\n/!!\\\n/ \\',desc:{ko:'새사람 프로젝트 탈출자.',en:'Escaped subject of the New Human Project.',zh:'新人类计划的逃脱实验体。',ja:'新人間計画からの逃亡実験体。',vi:'Thực thể thoát khỏi Dự án Con Người Mới.'},s:{근력:60,민첩:80,지력:70,지혜:65,체력:70,매력:25}},
  ],
};

export const JOB_IMAGES = {
  kn:'images/마법기사.png',   am:'images/대마법사.png',
  ma:'images/마법암살자.png', hl:'images/성약사.png',
  fb:'images/금서사용자.png', ar:'images/기갑병.png',
  iv:'images/발명가.png',     hk:'images/해커.png',
  md:'images/의무병.png',     nw:'images/새사람.png',
  sw:'images/검객.png',       sc:'images/술사.png',
  jk:'images/자객.png',       us:'images/의선.png',
  dh:'images/달마내공자.png', fc:'images/역장사.png',
  tk:'images/염동력자.png',   jy:'images/잠영술사.png',
  ep:'images/초능력의사.png', aw:'images/각성자.png',
};

export const CREATURE_IMAGES = {
  frost_swarm:        { img:'images/빙결곤충군.png',   ko:'빙결 곤충군',   en:'Frost Swarm' },
  aurora_jellyfish:   { img:'images/극광해파리.png',   ko:'극광 해파리',   en:'Aurora Jellyfish' },
  aurora_wolf:        { img:'images/극광늑대.png',     ko:'극광 늑대',     en:'Aurora Wolf' },
  cryo_turtle:        { img:'images/빙하거북.png',     ko:'빙하 거북',     en:'Cryo Turtle' },
  frost_spirit_bear:  { img:'images/빙결영혼곰.png',   ko:'빙결 영혼곰',   en:'Frost Spirit Bear' },
  frostwhale:         { img:'images/빙해고래.png',     ko:'빙해 고래',     en:'Frostwhale' },
  pyroclast_elemental:{ img:'images/용암정령.png',     ko:'용암 정령',     en:'Pyroclast Elemental' },
  ironhide_bear:      { img:'images/철갑설곰.png',     ko:'철갑 설곰',     en:'Ironhide Polar Bear' },
  fossil_titan:       { img:'images/화석거인.png',     ko:'화석 거인',     en:'Fossil Titan' },
  bloodsnow_bear:     { img:'images/혈설곰.png',       ko:'혈설곰',        en:'Bloodsnow Bear' },
  glacier_wyrm:       { img:'images/빙혈미르.png',     ko:'빙혈 미르',     en:'Glacier Wyrm' },
  ice_kraken:         { img:'images/빙결크라켄.png',   ko:'빙결 크라켄',   en:'Ice Kraken' },
  // 신규 괴물
  tundra_rat:         { img:'images/툰드라쥐.png',     ko:'툰드라 쥐',     en:'Tundra Rat' },
  snow_fox:           { img:'images/설여우.png',       ko:'설 여우',       en:'Snow Fox' },
  magma_crab:         { img:'images/용암게.png',       ko:'용암 게',       en:'Magma Crab' },
  stone_golem:        { img:'images/암석골렘.png',     ko:'암석 골렘',     en:'Stone Golem' },
  mana_wisp:          { img:'images/마나위습.png',     ko:'마나 위습',     en:'Mana Wisp' },
  shadow_lynx:        { img:'images/그림자스라소니.png', ko:'그림자 스라소니', en:'Shadow Lynx' },
  ancient_guardian:   { img:'images/고대수호자.png',   ko:'고대 수호자',   en:'Ancient Guardian' },
  psychic_moth:       { img:'images/초능력나방.png',   ko:'초능력 나방',   en:'Psychic Moth' },
  volcanic_serpent:   { img:'images/화산뱀.png',       ko:'화산 뱀',       en:'Volcanic Serpent' },
  frost_bat:          { img:'images/빙결박쥐.png',     ko:'빙결 박쥐',     en:'Frost Bat' },
};

export const STORY_CHAPTERS = [
  { id:1, name:'전초기지 건설', turns:10,
    main:'탐사대가 테라 노바에 도착해 기초 거점을 세움.',
    events:[
      {type:'story',  desc:'건설 자재 확보를 위한 주변 탐사', prob:100},
      {type:'combat', desc:'탐사 도중 괴물과의 조우',         prob:50},
      {type:'story',  desc:'건설 과정에서 사소한 사고 발생',  prob:30},
      {type:'combat', desc:'영역을 침범당한 괴물의 습격',     prob:30},
      {type:'gather', desc:'전초기지 주변 약초·풀 채집',     prob:40,
        yields:[
          {material_id:'liferoot',   prob:0.60, qty:1},
          {material_id:'terra_grass',prob:0.80, qty:2},
          {material_id:'snowflake_herb',prob:0.30, qty:1},
        ]},
      {type:'mine',   desc:'전초기지 인근 노출 광맥 채굴',   prob:30,
        yields:[
          {material_id:'iron_ore',      prob:0.70, qty:2},
          {material_id:'volcanic_rock', prob:0.40, qty:1},
          {material_id:'frost_crystal', prob:0.20, qty:1},
        ]},
    ]},
  { id:2, name:'전초기지 확장 및 광맥 탐사', turns:15,
    main:'기지가 안정되며 주변 자원과 광맥 탐사 시작.',
    events:[
      {type:'story',  desc:'광맥 발견을 위한 정찰 임무',           prob:100},
      {type:'combat', desc:'정찰 중 괴물 은신처 발견',             prob:40},
      {type:'story',  desc:'채굴 장비 고장으로 인한 수리 작업',    prob:30},
      {type:'story',  desc:'탐사대 내부 갈등 — 자원 분배 문제',   prob:20},
      {type:'gather', desc:'광맥 주변 희귀 식물 채집',            prob:35,
        yields:[
          {material_id:'frost_moss',    prob:0.60, qty:2},
          {material_id:'polar_herb',    prob:0.40, qty:1},
          {material_id:'aurora_petal',  prob:0.15, qty:1},
        ]},
      {type:'mine',   desc:'발견된 광맥 본격 채굴',               prob:60,
        yields:[
          {material_id:'iron_ore',      prob:0.75, qty:3},
          {material_id:'mana_shard',    prob:0.35, qty:1},
          {material_id:'deep_iron',     prob:0.25, qty:1},
          {material_id:'fossil_mineral',prob:0.20, qty:1},
        ]},
    ]},
  { id:3, name:'대륙 탐사', turns:20,
    main:'대륙 깊숙한 곳으로 탐사 확장.',
    events:[
      {type:'mine',   desc:'새로운 광맥 발견 및 채굴',            prob:100,
        yields:[
          {material_id:'deep_iron',     prob:0.50, qty:2},
          {material_id:'obsidian',      prob:0.40, qty:1},
          {material_id:'glacier_gem',   prob:0.20, qty:1},
          {material_id:'ancient_ore',   prob:0.15, qty:1},
        ]},
      {type:'story',  desc:'고대 문명 흔적 발견',                 prob:40},
      {type:'combat', desc:'갱도 내 괴물과의 전투',               prob:50},
      {type:'story',  desc:'탐사 중 실종자 발생',                 prob:20},
      {type:'gather', desc:'화산대·빙하 지대 특수 식물 채집',    prob:40,
        yields:[
          {material_id:'volcano_flower',     prob:0.35, qty:1},
          {material_id:'ice_flower',         prob:0.20, qty:1},
          {material_id:'volcanic_ash_herb',  prob:0.40, qty:1},
          {material_id:'ancient_bark',       prob:0.30, qty:1},
        ]},
    ]},
  { id:4, name:'타 대륙 개척단 조우', turns:10,
    main:'다른 대륙에서 온 개척단과 첫 접촉.',
    events:[
      {type:'story',  desc:'우호적 교류 — 기술/마법/무공 교환', prob:50},
      {type:'combat', desc:'긴장된 대치 — 자원 확보 경쟁',      prob:40},
      {type:'combat', desc:'오해로 인한 충돌',                   prob:20},
    ]},
  { id:5, name:'대륙 간 협력과 경쟁', turns:15,
    main:'자원 확보와 세력 확장 경쟁.',
    events:[
      {type:'story',  desc:'공동 탐사 프로젝트 추진',            prob:40},
      {type:'combat', desc:'자원 채굴권을 둘러싼 갈등',          prob:50},
      {type:'story',  desc:'개척단 내부 배신 사건',              prob:20},
      {type:'mine',   desc:'공동 채굴 — 심층 광맥 개발',        prob:35,
        yields:[
          {material_id:'aurora_crystal', prob:0.30, qty:1},
          {material_id:'spirit_stone',   prob:0.25, qty:1},
          {material_id:'fossil_mineral', prob:0.45, qty:2},
        ]},
    ]},
  { id:6, name:'잠든 미르 발견', turns:8,
    main:'대륙 깊은 곳에서 전설의 미르(드래곤) 존재 확인.',
    events:[
      {type:'story',  desc:'미르의 봉인 흔적 발견',             prob:40},
      {type:'combat', desc:'미르의 하수인과의 전투',            prob:50},
      {type:'story',  desc:'미르의 힘에 의해 환경 변화 발생',  prob:30},
      {type:'gather', desc:'미르 흔적지 특수 채집',            prob:25,
        yields:[
          {material_id:'mirr_moss', prob:0.50, qty:1},
          {material_id:'mirr_ore',  prob:0.15, qty:1},
        ]},
    ]},
  { id:7, name:'미르와의 결전', turns:12,
    main:'모든 개척단이 힘을 합쳐 미르와 결전.',
    events:[
      {type:'story',  desc:'미르의 약점을 찾아내는 특별 임무', prob:40},
      {type:'combat', desc:'전투 중 개척단 간 협력 강화',      prob:50},
      {type:'combat', desc:'미르의 예기치 못한 변이',          prob:30},
    ]},
  { id:8, name:'협력과 신뢰의 자리매김', turns:6,
    main:'미르 격퇴 후, 각 개척단이 서로의 영역과 체계를 인정.',
    events:[
      {type:'story',  desc:'무공과 마법의 융합 시도',            prob:30},
      {type:'story',  desc:'초능력과 기술의 상호 보완',          prob:30},
      {type:'story',  desc:'개척단 연합 결성 — 테라 노바 연합', prob:50},
    ]},
];

export const CONT_BG = {
  magic:  {ko:r=>`${r} 출신. 마법 대륙 귀족의 명을 받아 마나 메탈 탐사대 일원으로 테라 노바에 왔다.`,
            en:r=>`A ${r} dispatched by Arcanian mage nobility to find mana metal in Terra Nova.`},
  science:{ko:r=>`${r} 출신. 과학 대륙의 철 고갈 위기를 해결하기 위해 테라 노바 개척대에 자원했다.`,
            en:r=>`A ${r} who joined the Terra Nova expedition to address Mechanica's iron shortage.`},
  wuxia:  {ko:r=>`${r} 출신. 무림의 내분을 피해 영약과 미르의 전설을 좇아 테라 노바로 건너왔다.`,
            en:r=>`A ${r} who crossed to Terra Nova — fleeing martial world conflict, seeking elixirs and the legendary mirr.`},
  psychic:{ko:r=>`${r} 출신. 과학 대륙의 착취에 분노하며 테라 노바로 건너온 초능력인. 같은 초능력인들을 찾고 있다.`,
            en:r=>`A ${r} who crossed to Terra Nova in anger over Mechanica's exploitation, searching for fellow psychics.`},
};

export const ROLE_HINT = {
  ko:{'전사형':'전투 주도·피해 흡수','마법형':'주문명 사용·광역 효과','기술형':'장치 활용·즉흥 해결','도적형':'은신·기습·정보 수집','지원형':'치유·버프·정보 역할','원거리형':'원격 조종·공격','특수 — 희귀':'고유 능력 적극 활용'},
  en:{'Warrior':'leads combat, absorbs damage','Mage':'named spells, area effects','Tech':'gadgets, improvised solutions','Rogue':'stealth, ambush, intel','Support':'healing, buffs, information','Ranged':'remote attacks and control','Special':'unique unorthodox abilities'},
};

export const AI_PROVIDERS = {
  claude: { label:'Claude', placeholder:'sk-ant-...',
            desc:'풍부한 서사와 창의적 묘사에 강합니다. API 키는 console.anthropic.com에서 발급.' },
  groq:   { label:'Groq',   placeholder:'gsk_...',
            desc:'Llama 3.3 70B 무료 제공. 하루 14,400회. console.groq.com → API Keys에서 발급.' },
  gemini: { label:'Gemini', placeholder:'AIzaSy...',
            desc:'무료 티어 제공. API 키는 aistudio.google.com → Get API Key 에서 발급.' },
  openai: { label:'GPT',    placeholder:'sk-...',
            desc:'GPT-4o mini 사용. API 키는 platform.openai.com에서 발급.' },
};

export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCNb-V-s3mhJj-Aej99QIjkjsRUHzZjqdE",
  authDomain:        "fivecontinentschronicles.firebaseapp.com",
  projectId:         "fivecontinentschronicles",
  storageBucket:     "fivecontinentschronicles.firebasestorage.app",
  messagingSenderId: "40307095715",
  appId:             "1:40307095715:web:7da77e8b18b415c2256716"
};

export const SN = ['근력','민첩','체력','지력','지혜','매력'];
export const SL = {근력:'STR',민첩:'DEX',체력:'CON',지력:'INT',지혜:'WIS',매력:'CHA'};
export const INIT_POOL = 6;
export const MAX_D = 2;

export function scaleBase(v) { return Math.round(8 + (v / 100) * 7); }
export function jobBase(cid, jid) {
  const j = JOBS[cid]?.find(x => x.id === jid);
  if (!j) return null;
  const r = {};
  SN.forEach(s => r[s] = scaleBase(j.s[s]));
  return r;
}
