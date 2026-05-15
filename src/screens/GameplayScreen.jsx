import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CONTS, JOBS, JOB_IMAGES, CREATURE_IMAGES, AI_PROVIDERS, STORY_CHAPTERS } from '../data/constants.js';
import { buildSystemPrompt, buildSystemPromptCompact } from '../services/prompts.js';
import { callAI } from '../services/ai.js';
import { saveGame, generateGameId } from '../services/save.js';
import { onAuthChange, signInWithGoogle, signOutUser } from '../services/firebase.js';
import { calcMaxHp, calcMaxMp, calcLevel, XP_LEVELS, getAvailableSkills } from '../lore/jobs_levels.js';
import { getCompanion } from '../lore/companions.js';
import { TERRA_NOVA_CREATURES } from '../lore/terra_nova.js';

function L(obj, lang) {
  return typeof obj === 'object' ? (obj[lang] || obj.ko || obj.en || Object.values(obj)[0]) : obj;
}

function getPlayerDex(statsStr) {
  const m = statsStr.match(/민첩\s+(\d+)/);
  return m ? +m[1] : 10;
}

const FALLBACK_CHOICES = {
  ko: ['계속 살핀다','다른 방향으로 간다','잠시 기다린다','상황을 파악한다'],
  en: ['Continue observing','Go another way','Wait a moment','Assess the situation'],
  zh: ['继续观察','换个方向','稍等片刻','判断形势'],
  ja: ['様子を見る','別の方向へ','しばらく待つ','状況を把握する'],
  es: ['Seguir observando','Ir por otro camino','Esperar un momento','Evaluar la situación'],
  fr: ['Continuer à observer','Aller dans une autre direction','Attendre un moment','Évaluer la situation'],
  ar: ['الاستمرار في المراقبة','الذهاب في اتجاه آخر','الانتظار لحظة','تقييم الوضع'],
  pt: ['Continuar observando','Ir por outro caminho','Esperar um momento','Avaliar a situação'],
  ru: ['Продолжать наблюдать','Пойти в другую сторону','Подождать немного','Оценить ситуацию'],
  vi: ['Tiếp tục quan sát','Đi hướng khác','Chờ một lúc','Đánh giá tình hình'],
  hi: ['देखते रहो','दूसरी दिशा में जाओ','थोड़ा इंतजार करो','स्थिति का आकलन करो'],
  id: ['Terus amati','Pergi ke arah lain','Tunggu sebentar','Nilai situasi'],
  de: ['Weiter beobachten','In eine andere Richtung gehen','Einen Moment warten','Die Lage einschätzen'],
  tr: ['Gözlemlemeye devam et','Başka yöne git','Biraz bekle','Durumu değerlendir'],
  th: ['สังเกตต่อไป','ไปทิศทางอื่น','รอสักครู่','ประเมินสถานการณ์'],
  it: ["Continuare a osservare","Andare in un'altra direzione","Aspettare un momento","Valutare la situazione"],
  pl: ['Obserwować dalej','Iść w innym kierunku','Poczekać chwilę','Ocenić sytuację'],
  uk: ['Продовжувати спостерігати','Піти в інший бік','Зачекати хвилину','Оцінити ситуацію'],
  nl: ['Blijven observeren','Een andere richting gaan','Even wachten','De situatie inschatten'],
  ms: ['Terus perhatikan','Pergi ke arah lain','Tunggu sebentar','Nilai keadaan'],
};

function safeParseGM(raw, chapterLabel, charStatus, lang = 'en') {
  let text = raw.replace(/```json|```/g, '').trim();
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end > start) text = text.slice(start, end + 1);
  try { return JSON.parse(text); } catch(_) {}
  try {
    const fixed = text.replace(/"((?:[^"\\]|\\.)*)"/gs, (_, inner) =>
      '"' + inner.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"'
    );
    return JSON.parse(fixed);
  } catch(_) {}
  // JSON 잘림(토큰 한도) — 스트리밍에서 추출한 값 재활용
  const story   = extractStreamStory(raw.replace(/▌$/, '')) ?? chapterLabel;
  const chapter = raw.match(/"chapter"\s*:\s*"([^"\\]*)"/)?.[1] ?? chapterLabel;
  return {
    chapter, story,
    choices: FALLBACK_CHOICES[lang] ?? FALLBACK_CHOICES.en,
    hp_delta: 0, mp_delta: 0, xp_gained: 0, rest: '',
    enemies: [], enemy_attack: '',
    status: charStatus, items_gained: [], items_lost: [],
  };
}

// 스트리밍 중 누적 JSON에서 story 값을 점진적으로 추출
function extractStreamStory(raw) {
  const closed = raw.match(/"story"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
  if (closed) return closed[1]
    .replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\t/g, '\t')
    .replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  const open = raw.match(/"story"\s*:\s*"((?:[^"\\]|\\.)*)/s);
  if (open) return open[1]
    .replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\t/g, '\t')
    .replace(/\\"/g, '"').replace(/\\\\/g, '\\') + '▌';
  return null;
}

function hasForeignChars(text) {
  return /[一-鿿぀-ヿ฀-๿؀-ۿЀ-ӿ]/.test(text);
}

function buildInitiativeOrder(enemies, char, jobName) {
  const playerDex = getPlayerDex(char.stats);
  const participants = [{
    type: 'player', id: char.job, name: jobName,
    img: JOB_IMAGES[char.job] || null,
    dex: playerDex, hp: char.hp, maxHp: char.maxHp,
  }];
  char.companions.forEach(comp => {
    if (comp.status === 'dead') return;
    const base = getCompanion(comp.id);
    const dexMatch = base?.stats?.match(/DEX\s+(\d+)/);
    const compDex = dexMatch ? +dexMatch[1] : 12;
    participants.push({
      type: 'companion', id: comp.id, name: comp.name,
      img: comp.img || null, dex: compDex,
      hp: comp.hp, maxHp: comp.maxHp, status: comp.status,
    });
  });
  enemies.forEach(e => {
    const cr = TERRA_NOVA_CREATURES.find(c => c.id === e.id);
    const eInfo = CREATURE_IMAGES[e.id];
    const eDex = cr ? Math.min(20, 6 + (cr.threat ?? 2) * 2) : 10;
    const cnt = Math.min(e.count ?? 1, 5);
    for (let i = 0; i < cnt; i++) {
      participants.push({
        type: 'enemy', id: e.id,
        name: eInfo ? eInfo.ko : e.id,
        img: eInfo ? eInfo.img : null,
        dex: eDex + Math.floor(Math.random() * 3),
        hp: cr?.combat?.hp ?? 100, maxHp: cr?.combat?.hp ?? 100,
        lv: e._rolled_level ?? cr?.level ?? '?',
      });
    }
  });
  const typeOrder = { player: 0, companion: 1, enemy: 2 };
  participants.sort((a, b) => b.dex - a.dex || (typeOrder[a.type] ?? 2) - (typeOrder[b.type] ?? 2));
  return participants;
}

export default function GameplayScreen({ charData, onRestart }) {
  const contObj = CONTS.find(c => c.id === charData.cont);
  const jobObj  = JOBS[charData.cont]?.find(j => j.id === charData.job);
  const contName = L(contObj?.name, charData.lang);
  const jobName  = L(jobObj?.name,  charData.lang);
  const jobRole  = L(jobObj?.role,  charData.lang);
  const jobDesc  = L(jobObj?.desc,  charData.lang);

  const initMaxHp = calcMaxHp(charData.job, 1, charData.stats);
  const initMaxMp = calcMaxMp(charData.job, 1, charData.stats);

  const [char, setChar] = useState({
    ...charData,
    level: 1, xp: 0,
    hp: initMaxHp, maxHp: initMaxHp,
    mp: initMaxMp, maxMp: initMaxMp,
    status: ['정상'],
    companions: [],
    storyChapter: 1,
    chapterTurns: 0,
  });
  const charRef = useRef(char);
  charRef.current = char;

  const [storyContent, setStoryContent]   = useState([]);
  const [choices, setChoices]             = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [logItems, setLogItems]           = useState([]);
  const [showLog, setShowLog]             = useState(false);
  const [showApiSetup, setShowApiSetup]   = useState(() => {
    const p = sessionStorage.getItem('fcc_provider') || 'claude';
    return !(sessionStorage.getItem(`fcc_key_${p}`) || '');
  });
  const [currentProvider, setCurrentProvider] = useState(
    () => sessionStorage.getItem('fcc_provider') || 'claude'
  );
  const [apiKeys, setApiKeys] = useState(() => ({
    claude: sessionStorage.getItem('fcc_key_claude') || '',
    groq:   sessionStorage.getItem('fcc_key_groq')   || '',
    gemini: sessionStorage.getItem('fcc_key_gemini') || '',
    openai: sessionStorage.getItem('fcc_key_openai') || '',
  }));
  const [apiKeyInput, setApiKeyInput]     = useState(() => {
    const p = sessionStorage.getItem('fcc_provider') || 'claude';
    return sessionStorage.getItem(`fcc_key_${p}`) || '';
  });
  const [turnStripOrder, setTurnStripOrder]   = useState([]);
  const [turnStripActive, setTurnStripActive] = useState(0);
  const [showTurnStrip, setShowTurnStrip]     = useState(false);
  const [enemyPanel, setEnemyPanel]       = useState(null);
  const [chapterBarInfo, setChapterBarInfo] = useState(null);
  const [chapterLabel, setChapterLabel]   = useState('— 대기 중 —');
  const [showEnding, setShowEnding]       = useState(false);
  const [saveStatus, setSaveStatus]       = useState({ text:'', cls:'' });
  const [authUser, setAuthUser]           = useState(null);
  const [gameId, setGameId]               = useState(() => charData._gameId ?? generateGameId());
  const [inCombat, setInCombat]           = useState(false);
  const [combatTurns, setCombatTurns]     = useState(0);

  const historyRef        = useRef([]);
  const combatEnemiesRef  = useRef([]);
  const combatTurnRef     = useRef(0);
  const stripOrderRef     = useRef([]);
  const pendingSaveRef    = useRef(null);
  const saveTimerRef      = useRef(null);
  const freeInputRef      = useRef(null);
  const startedRef        = useRef(false);
  const loadingRef        = useRef(false);
  const gameIdRef         = useRef(gameId);
  const inCombatRef       = useRef(false);
  const combatTurnsRef    = useRef(0);

  const apiKey = apiKeys[currentProvider];

  // ── Firebase 인증 ────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthChange(user => setAuthUser(user));
    return unsub;
  }, []);

  // ── 저장 상태 표시 ───────────────────────────────────────────────────
  function showSaveStatus(text, cls) {
    setSaveStatus({ text, cls });
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveStatus({ text:'', cls:'' }), 3000);
  }

  // ── 게임 저장 ────────────────────────────────────────────────────────
  async function doSaveGame(charSnapshot) {
    const c = charSnapshot || charRef.current;
    try {
      await saveGame(authUser?.uid || null, gameIdRef.current, c, historyRef.current, chapterLabel);
      if (authUser) showSaveStatus('저장됨 ✓', 'ok');
      else showSaveStatus('임시저장', 'ok');
    } catch(e) {
      showSaveStatus('저장 실패', 'err');
    }
  }

  // ── 챕터 HUD 갱신 ────────────────────────────────────────────────────
  function updateChapterHUD(c) {
    const chap = STORY_CHAPTERS[c.storyChapter - 1];
    if (!chap) return;
    const pct = Math.min(100, Math.round((c.chapterTurns / chap.turns) * 100));
    setChapterBarInfo({
      num: `챕터 ${chap.id}/8`,
      name: chap.name,
      turns: `${c.chapterTurns}/${chap.turns}`,
      pct,
    });
  }

  // ── 챕터 진행 ────────────────────────────────────────────────────────
  function advanceChapterTurn(prevChar) {
    const chap = STORY_CHAPTERS[prevChar.storyChapter - 1];
    if (!chap) return prevChar;
    const newTurns = prevChar.chapterTurns + 1;
    let newChar = { ...prevChar, chapterTurns: newTurns };

    if (newTurns >= chap.turns) {
      if (prevChar.storyChapter < 8) {
        newChar = { ...newChar, storyChapter: prevChar.storyChapter + 1, chapterTurns: 0 };
        const next = STORY_CHAPTERS[newChar.storyChapter - 1];
        setTimeout(() => {
          setStoryContent(prev => [...prev, {
            type:'notice', text:`◈ 챕터 ${newChar.storyChapter}/8 시작 — ${next.name}`
          }]);
        }, 200);
      } else {
        setTimeout(() => setShowEnding(true), 700);
      }
    }
    updateChapterHUD(newChar);
    return newChar;
  }

  // ── 전투 턴 스트립 ──────────────────────────────────────────────────
  function updateTurnStrip(enemies, currentChar) {
    if (!enemies || enemies.length === 0) {
      setShowTurnStrip(false);
      combatEnemiesRef.current = [];
      combatTurnRef.current = 0;
      stripOrderRef.current = [];
      return;
    }
    if (combatEnemiesRef.current.length === 0) {
      combatTurnRef.current = 0;
      stripOrderRef.current = buildInitiativeOrder(enemies, currentChar, jobName);
    }
    combatEnemiesRef.current = enemies;
    const order = stripOrderRef.current;
    const playerCard = order.find(p => p.type === 'player');
    if (playerCard) { playerCard.hp = currentChar.hp; playerCard.maxHp = currentChar.maxHp; }
    setTurnStripOrder([...order]);
    setTurnStripActive(combatTurnRef.current % order.length);
    combatTurnRef.current++;
    setShowTurnStrip(true);
  }

  // ── 적 패널 갱신 ────────────────────────────────────────────────────
  function updateEnemyPanel(enemies) {
    if (!enemies || enemies.length === 0) { setEnemyPanel(null); return; }
    let primary = enemies[0];
    for (const e of enemies) {
      const a = TERRA_NOVA_CREATURES.find(c => c.id === e.id);
      const b = TERRA_NOVA_CREATURES.find(c => c.id === primary.id);
      if (a && b && (a.threat ?? 0) > (b.threat ?? 0)) primary = e;
    }
    const pInfo = CREATURE_IMAGES[primary.id];
    if (!pInfo) { setEnemyPanel(null); return; }
    let statsItems = [];
    enemies.forEach((e, i) => {
      const eInfo = CREATURE_IMAGES[e.id];
      const cr = TERRA_NOVA_CREATURES.find(c => c.id === e.id);
      const lv = e._rolled_level ?? cr?.level ?? '?';
      const cnt = (e.count ?? 1) > 1 ? ` ×${e.count}` : '';
      statsItems.push({ name:(eInfo?.ko||e.id)+cnt, lv, threat:cr?.threat??'?', combat:cr?.combat, i });
    });
    setEnemyPanel({ img: pInfo.img, ko: pInfo.ko, en: pInfo.en, count: primary.count, statsItems });
  }

  // ── GM 응답 적용 ────────────────────────────────────────────────────
  function applyResult(p, userMsg, prevChar) {
    let c = { ...prevChar };
    if (p.hp_delta) c.hp = Math.max(0, Math.min(c.maxHp, c.hp + p.hp_delta));
    if (p.mp_delta) c.mp = Math.max(0, Math.min(c.maxMp, c.mp + p.mp_delta));

    if (p.xp_gained && p.xp_gained > 0 && c.level < 12) {
      c.xp += p.xp_gained;
      const newLevel = calcLevel(c.xp);
      if (newLevel > c.level) {
        const hpBefore = c.maxHp; const mpBefore = c.maxMp;
        const oldLevel = c.level;
        c.level = newLevel;
        c.maxHp = calcMaxHp(c.job, newLevel, c.stats);
        c.hp = Math.min(c.hp + (c.maxHp - hpBefore), c.maxHp);
        c.maxMp = calcMaxMp(c.job, newLevel, c.stats);
        c.mp = Math.min(c.mp + (c.maxMp - mpBefore), c.maxMp);
        setTimeout(() => {
          setStoryContent(prev => [...prev, {
            type:'level', text:`★ 레벨 업! Lv ${oldLevel} → Lv ${c.level} — 최대 HP/MP가 증가했습니다.`
          }]);
        }, 100);
      }
    }

    const rawEnemies = (p.enemies && p.enemies.length > 0) ? p.enemies
      : (p.creature_id ? [{id:p.creature_id, count:1, level_min:1, level_max:1}] : []);
    const rolledEnemies = rawEnemies.map(e => {
      const min = e.level_min ?? 1; const max = e.level_max ?? min;
      return {...e, _rolled_level: min + Math.floor(Math.random()*(max-min+1))};
    });

    if (p.companion_recruit) {
      const base = getCompanion(p.companion_recruit);
      if (base && !c.companions.find(x => x.id === base.id)) {
        c.companions = [...c.companions, {
          id: base.id, name: base.name.ko, img: base.img,
          hp: base.maxHp, maxHp: base.maxHp, maxMp: base.maxMp, status: 'active',
        }];
        setTimeout(() => {
          setStoryContent(prev => [...prev, {
            type:'companion', text:`✦ ${base.name.ko}이(가) 동료로 합류했습니다!`
          }]);
        }, 100);
      }
    }

    if (p.companion_state?.length) {
      c.companions = c.companions.map(comp => {
        const cs = p.companion_state.find(x => x.id === comp.id);
        if (!cs || comp.status === 'dead') return comp;
        let nc = {...comp};
        if (cs.hp_delta) nc.hp = Math.max(0, Math.min(nc.maxHp, nc.hp + cs.hp_delta));
        if (cs.status) {
          if (nc.status === 'down' && cs.status === 'dead') nc.status = 'dead';
          else if (cs.status !== 'dead') nc.status = cs.status;
        }
        return nc;
      });
      if (!rolledEnemies.length) {
        c.companions = c.companions.map(comp =>
          comp.status === 'down' ? {...comp, hp:1, status:'active'} : comp
        );
      }
    }

    if (p.status?.length) c.status = p.status;
    if (p.chapter) setChapterLabel(p.chapter);

    updateEnemyPanel(rolledEnemies);
    updateTurnStrip(rolledEnemies, c);

    // 전투 상태 진입/종료
    if (rolledEnemies.length > 0) {
      if (!inCombatRef.current) {
        inCombatRef.current = true;
        setInCombat(true);
        combatTurnsRef.current = 0;
        setCombatTurns(0);
      }
    } else if (inCombatRef.current) {
      inCombatRef.current = false;
      setInCombat(false);
      combatTurnsRef.current = 0;
      setCombatTurns(0);
    }

    // 휴식 회복
    if (p.rest === 'outdoor') {
      c.hp = Math.min(c.maxHp, c.hp + Math.floor(c.maxHp * 0.5));
      c.mp = Math.min(c.maxMp, c.mp + Math.floor(c.maxMp * 0.5));
    } else if (p.rest === 'base') {
      c.hp = c.maxHp;
      c.mp = c.maxMp;
    }

    const paras = (p.story||'').split('\n\n').map((t,i) => ({type:'para',text:t,key:`s${i}`}));
    if (p.enemy_attack && rolledEnemies.length > 0) {
      paras.push({type:'enemy_atk', text:p.enemy_attack, key:'ea'});
    }
    setStoryContent(paras);
    setChoices(p.choices || []);

    if (userMsg) {
      setLogItems(prev => [...prev.slice(-9), {choice:userMsg, story:(p.story||'').slice(0,80)+'…'}]);
    }

    c = advanceChapterTurn(c);
    setChar(c);
    charRef.current = c;
    doSaveGame(c);
    return c;
  }

  // ── callGM ───────────────────────────────────────────────────────────
  const callGM = useCallback(async (userMsg) => {
    if (loadingRef.current) return;
    if (!apiKey) { setShowApiSetup(true); return; }
    loadingRef.current = true;
    setIsLoading(true);
    setStoryContent([{type:'loading'}]);
    setChoices([]);
    historyRef.current = [...historyRef.current, {role:'user', content: userMsg}];

    try {
      const c = charRef.current;
      const groqMode = currentProvider === 'groq';
      const isCompact = groqMode || historyRef.current.length > 12;
      const msgs = isCompact
        ? historyRef.current.slice(groqMode ? -6 : -12)
        : historyRef.current;
      const msgsForAI = c.lang === 'ko'
        ? msgs.map((m, i) => i === msgs.length-1 && m.role==='user'
            ? {...m, content: m.content + '\n[반드시 순수 한국어로만 응답. 한자·가나·태국어 등 비한국어 문자 절대 사용 금지]'}
            : m)
        : msgs;
      const sys = isCompact
        ? buildSystemPromptCompact(c, contName, jobName)
        : buildSystemPrompt(c, contName, jobName, jobRole, jobDesc);
      const raw = await callAI(currentProvider, apiKey, sys, msgsForAI, (partial) => {
        const story = extractStreamStory(partial);
        if (story) {
          const paras = story.split('\n\n').map((t, i) => ({type:'para', text:t, key:`s${i}`}));
          setStoryContent(paras);
        }
      });
      historyRef.current = [...historyRef.current, {role:'assistant', content: raw}];

      let parsed = safeParseGM(raw, chapterLabel, charRef.current.status, c.lang);
      if (c.lang === 'ko' &&
          (hasForeignChars(parsed.story||'') || parsed.choices?.some(x => hasForeignChars(x)))) {
        try {
          const fixPrompt = `아래 JSON의 story와 choices에서 한국어가 아닌 문자를 모두 한국어로 번역하세요. 순수 JSON만 반환.\n${JSON.stringify({story:parsed.story,choices:parsed.choices})}`;
          const fixRaw = await callAI(currentProvider, apiKey,
            '한국어 텍스트 교정기. 비한국어 문자만 한국어로 변환. 순수 JSON만 반환.',
            [{role:'user',content:fixPrompt}]);
          const fix = JSON.parse(fixRaw.replace(/```json|```/g,'').trim());
          if (fix.story) parsed.story = fix.story;
          if (fix.choices) parsed.choices = fix.choices;
        } catch(_) {}
      }
      applyResult(parsed, userMsg, charRef.current);
    } catch(err) {
      setStoryContent([{type:'error', text:err.message}]);
      setChoices(['다시 시도']);
    }
    loadingRef.current = false;
    setIsLoading(false);
  }, [apiKey, currentProvider, chapterLabel, contName, jobName, jobRole, jobDesc]);

  // ── 이어하기 적용 ────────────────────────────────────────────────────
  function applyResume(save) {
    const gs = save.gameState || {};
    const newChar = {
      ...charRef.current,
      level:  gs.level  ?? 1,
      xp:     gs.xp     ?? 0,
      maxHp:  gs.maxHp  ?? initMaxHp,
      hp:     gs.hp     ?? initMaxHp,
      maxMp:  gs.maxMp  ?? initMaxMp,
      mp:     gs.mp     ?? initMaxMp,
      status: gs.status ?? ['정상'],
      companions:   gs.companions   ?? [],
      storyChapter: gs.storyChapter ?? 1,
      chapterTurns: gs.chapterTurns ?? 0,
    };
    historyRef.current = save.history || [];
    setChar(newChar);
    charRef.current = newChar;
    if (save.chapter) setChapterLabel(save.chapter);
    updateChapterHUD(newChar);
    callGM('게임을 이어합니다. 직전 상황을 한 문장으로 간략히 요약한 뒤 바로 다음 장면을 시작해주세요.');
  }

  // ── 저장 확인 & 배너 ────────────────────────────────────────────────
  // ── 게임 시작 ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    callGM(`게임을 시작합니다. 테라 노바의 첫 장면을 시작해주세요. ${jobName}(${contName} 출신)으로서 테라 노바에 막 도착한 상황으로 시작해 주세요.`);
  }, [callGM, contName, jobName]);

  function doStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    if (charData._resume) {
      applyResume(charData._resume);
    } else {
      startGame();
    }
  }

  // ── 초기화 ──────────────────────────────────────────────────────────
  useEffect(() => {
    updateChapterHUD(charRef.current);
    if (apiKey) doStart();
  }, []);

  useEffect(() => {
    if (apiKey) doStart();
  }, [apiKey]);

  // ── API 키 저장 ──────────────────────────────────────────────────────
  function handleSaveKey() {
    const key = apiKeyInput.trim();
    if (!key) { alert('API 키를 입력하세요'); return; }
    setApiKeys(prev => ({...prev, [currentProvider]: key}));
    sessionStorage.setItem(`fcc_key_${currentProvider}`, key);
    sessionStorage.setItem('fcc_provider', currentProvider);
    setShowApiSetup(false);
    // apiKey 상태 변경 후 useEffect([apiKey])가 startGame 호출
  }

  function handleProviderChange(p) {
    setCurrentProvider(p);
    setApiKeyInput(apiKeys[p] || '');
  }

  function handleFreeInput() {
    const v = freeInputRef.current?.value.trim();
    if (!v || loadingRef.current) return;
    if (freeInputRef.current) freeInputRef.current.value = '';
    callGM(v);
  }

  // ── 전투 스킬 사용 ──────────────────────────────────────────────────
  function handleCombatSkill(skill) {
    if (loadingRef.current) return;
    const turn = combatTurnsRef.current + 1;
    combatTurnsRef.current = turn;
    setCombatTurns(turn);
    const costStr = skill.cost?.mp ? ` (MP ${skill.cost.mp} 소모)` : '';
    callGM(`[전투 ${turn}/10턴] ${jobName}이(가) '${skill.name}'을(를) 사용합니다${costStr}! ${skill.effect}`);
  }

  // ── 도주 시도 (d20 + 민첩 보정 vs DC 12) ──────────────────────────
  function handleFlee() {
    if (loadingRef.current) return;
    const turn = combatTurnsRef.current + 1;
    combatTurnsRef.current = turn;
    setCombatTurns(turn);
    const dex = getPlayerDex(charRef.current.stats);
    const dexMod = Math.floor((dex - 10) / 2);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const roll = d20 + dexMod;
    const dc = 12;
    if (roll >= dc) {
      inCombatRef.current = false;
      setInCombat(false);
      combatTurnsRef.current = 0;
      setCombatTurns(0);
      callGM(`[도주 성공 — d20(${d20})${dexMod >= 0 ? '+' : ''}${dexMod}=${roll} ≥ DC${dc}] 전장에서 빠져나왔습니다. enemies:[] 전투 종료. 이후 상황을 서술해 주세요.`);
    } else {
      callGM(`[도주 실패 — d20(${d20})${dexMod >= 0 ? '+' : ''}${dexMod}=${roll} < DC${dc}] 도주를 시도했으나 실패! 적이 기회를 놓치지 않고 반격합니다.`);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  const nextXp = XP_LEVELS[char.level] ?? '—';
  const hpPct = Math.round((char.hp / char.maxHp) * 100);
  const mpPct = char.maxMp > 0 ? Math.round((char.mp / char.maxMp) * 100) : 0;

  return (
    <div className="gp-root">

      {/* API 키 설정 */}
      {showApiSetup && (
        <div className="api-setup">
          <p className="api-setup-guide">게임을 시작하려면 AI 제공자의 API 키를 입력해 주세요. Groq과 Gemini는 무료로 사용할 수 있습니다.</p>
          <div className="provider-tabs">
            {Object.entries(AI_PROVIDERS).map(([p, info]) => (
              <button key={p} className={`ptab${currentProvider===p?' on':''}`} onClick={() => handleProviderChange(p)}>
                {info.label}
                {(p==='groq'||p==='gemini') && <span className="free-tag">무료</span>}
              </button>
            ))}
          </div>
          <p className="provider-desc">{AI_PROVIDERS[currentProvider].desc}</p>
          <div className="api-input-row">
            <input
              className="api-input" type="password"
              placeholder={AI_PROVIDERS[currentProvider].placeholder}
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
            />
            <button className="api-btn" onClick={handleSaveKey}>저장 후 시작</button>
          </div>
        </div>
      )}

      {/* Firebase 인증 바 */}
      <div className="auth-bar">
        <div className="auth-left">
          <span className={`auth-info${authUser?' on':''}`}>
            {authUser ? (authUser.displayName || authUser.email || '로그인됨')
                      : '로그인하면 게임이 자동 저장되어 다른 기기에서도 이어서 할 수 있습니다.'}
          </span>
          {saveStatus.text && <span className={`save-status ${saveStatus.cls}`}>{saveStatus.text}</span>}
        </div>
        {authUser
          ? <button className="auth-btn" onClick={() => signOutUser()}>로그아웃</button>
          : <button className="auth-btn" onClick={() => signInWithGoogle()}>Google로 로그인</button>
        }
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-block">
          <div className="hud-label">HP</div>
          <div className="hud-val">{char.hp} / {char.maxHp}</div>
          <div className="hp-bar"><div className={`hp-fill${hpPct<=30?' low':''}`} style={{width:`${hpPct}%`}} /></div>
          <div className="hud-sub">MP <span>{char.mp} / {char.maxMp}</span></div>
          <div className="mp-bar"><div className="mp-fill" style={{width:`${mpPct}%`}} /></div>
        </div>
        <div className="hud-block">
          <div className="hud-label">캐릭터</div>
          <div className="hud-val" style={{fontSize:'12px'}}>{jobName}</div>
          <div style={{fontSize:'9px',color:'#5a5130',marginTop:'3px'}}>{contName}</div>
        </div>
        <div className="hud-block">
          <div className="hud-label">레벨 / 상태</div>
          <div className="lv-badge">Lv {char.level}</div>
          <div className="hud-sub">XP {char.xp.toLocaleString()} / {typeof nextXp==='number'?nextXp.toLocaleString():nextXp}</div>
          <div className="status-tags">
            {char.status.map((s,i) => <span key={i} className="stag">{s}</span>)}
          </div>
        </div>
      </div>

      {/* 챕터 진행 바 */}
      {chapterBarInfo && (
        <div className="chapter-bar show">
          <span className="chapter-bar-label">{chapterBarInfo.num}</span>
          <span className="chapter-bar-name">{chapterBarInfo.name}</span>
          <div className="chapter-track"><div className="chapter-track-fill" style={{width:`${chapterBarInfo.pct}%`}} /></div>
          <span className="chapter-turns">{chapterBarInfo.turns}</span>
        </div>
      )}

      {/* 전투 턴 스트립 */}
      {showTurnStrip && (
        <div className="turn-strip show">
          {turnStripOrder.map((p, i) => {
            const isActive = i === turnStripActive % turnStripOrder.length;
            const hpPct2 = p.maxHp > 0 ? Math.round((p.hp/p.maxHp)*100) : 0;
            const isPlayer = p.type==='player'; const isComp = p.type==='companion'; const isEnemy = p.type==='enemy';
            const isDown = p.status==='down';
            let cls = 'turn-card';
            if (isPlayer) cls += ' player';
            if (isComp)   cls += ' companion';
            if (isActive && !isDown) cls += ' active';
            if (isDown)   cls += ' down';
            const badge = isPlayer ? `Lv.${char.level}` : isComp ? (isDown?'DOWN':'동료') : `Lv.${p.lv??'?'}`;
            const hpFillCls = isEnemy ? ' enemy' : isComp ? ' comp' : '';
            return (
              <div key={`${p.id}-${i}`} className={cls}>
                <div style={{overflow:'hidden',height:'72px'}}>
                  {p.img
                    ? <img src={`/${p.img}`} alt={p.name} onError={e=>e.target.style.display='none'} />
                    : <div style={{height:'72px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',color:'#3a3218'}}>{isPlayer?'⚔':isComp?'✦':'☠'}</div>
                  }
                </div>
                <div className="turn-badge">{badge}</div>
                <div className="turn-hp"><div className={`turn-hp-fill${hpFillCls}`} style={{width:`${hpPct2}%`}} /></div>
                <div className="turn-card-name">{p.name}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 스토리 */}
      <div className="story-wrap">
        <div className="story-chapter">{chapterLabel}</div>
        <div className="story-body">
          <div className="story-text">
            {storyContent.map((item, i) => {
              if (item.type === 'loading') return (
                <div key={i} className="loading-dots">
                  <div className="ld" /><div className="ld" /><div className="ld" />
                </div>
              );
              if (item.type === 'para') return <p key={item.key ?? i}>{item.text}</p>;
              if (item.type === 'enemy_atk') return <p key="ea" className="enemy-atk-notice">{item.text}</p>;
              if (item.type === 'notice') return <p key={i} className="chapter-notice">{item.text}</p>;
              if (item.type === 'level') return <p key={i} className="level-notice">{item.text}</p>;
              if (item.type === 'companion') return <p key={i} className="companion-notice">{item.text}</p>;
              if (item.type === 'error') return (
                <div key={i}>
                  <p style={{color:'#e06060'}}>오류: {item.text}</p>
                  <p style={{color:'#5a5030',fontSize:'11px'}}>API 키를 확인하거나 잠시 후 다시 시도하세요.</p>
                </div>
              );
              return null;
            })}
          </div>
          {enemyPanel && (
            <div className="creature-panel show">
              <img src={`/${enemyPanel.img}`} alt={enemyPanel.ko} />
              <div className="creature-panel-info">
                <div className="creature-panel-name">{enemyPanel.ko}{enemyPanel.count>1?` ×${enemyPanel.count}`:''}</div>
                <div className="creature-panel-en">{enemyPanel.en}</div>
                <div className="creature-panel-stats">
                  {enemyPanel.statsItems.map((s,i) => (
                    <div key={i} style={i>0?{borderTop:'1px solid #1a1810',marginTop:'4px',paddingTop:'4px'}:{}}>
                      {i>0&&<>{s.name}<br/></>}
                      Lv.{s.lv} ★{s.threat}
                      {s.combat&&<><br/>HP {s.combat.hp} · ATK {s.combat.atk}</>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 선택지 — 전투 중 숨김 */}
      {!inCombat && (
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} className="choice-btn" disabled={isLoading} onClick={() => callGM(c)}>
              <span className="choice-num">{i+1}.</span><span>{c}</span>
            </button>
          ))}
        </div>
      )}

      {/* 전투 스킬 패널 */}
      {inCombat && (
        <div className="combat-panel">
          <div className="combat-turn-info">
            ⚔ 전투 진행 중 — 플레이어 {combatTurns}/10턴
            {combatTurns >= 10 && <span className="combat-warn"> (최대 턴 도달 — 도주 가능)</span>}
          </div>
          <div className="combat-skills">
            {getAvailableSkills(char.job, char.level)
              .filter(s => !s.passive)
              .map(s => {
                const mpCost = s.cost?.mp ?? 0;
                const noMp = mpCost > 0 && char.mp < mpCost;
                const maxed = combatTurns >= 10;
                return (
                  <button
                    key={s.name}
                    className={`skill-btn${noMp || maxed ? ' disabled' : ''}`}
                    disabled={isLoading || noMp || maxed}
                    onClick={() => handleCombatSkill(s)}
                    title={s.effect}
                  >
                    <span className="skill-name">{s.name}</span>
                    {mpCost > 0 && <span className="skill-cost">MP {mpCost}</span>}
                  </button>
                );
              })
            }
            <button className="skill-btn flee" disabled={isLoading}
              onClick={handleFlee}>
              🏃 도주
            </button>
          </div>
          <div className="combat-hint">스킬을 클릭하거나 아래 입력창에 직접 행동을 입력하세요</div>
        </div>
      )}

      {/* 하단 */}
      <div className="bottom-row">
        <div className="input-wrap">
          <input
            ref={freeInputRef}
            className="free-input"
            placeholder="직접 행동을 입력하세요..."
            disabled={isLoading}
            onKeyDown={e => { if(e.key==='Enter') handleFreeInput(); }}
          />
          <button className="send-btn" disabled={isLoading} onClick={handleFreeInput}>↵</button>
        </div>
        <button className="menu-btn" onClick={() => setShowLog(v=>!v)}>{showLog?'기록 ▴':'기록 ▾'}</button>
        <button className="menu-btn" onClick={() => { setShowApiSetup(v=>!v); setApiKeyInput(apiKeys[currentProvider]||''); }}>API 키</button>
        <button className="menu-btn" onClick={onRestart}>처음으로</button>
      </div>

      {/* 로그 */}
      {showLog && (
        <div className="log-wrap open">
          {[...logItems].reverse().map((item,i) => (
            <div key={i} className="log-item">
              <span className="log-choice">▶ {item.choice}</span><br/>{item.story}
            </div>
          ))}
        </div>
      )}

      {/* 엔딩 오버레이 */}
      {showEnding && (
        <div className="ending-overlay show">
          <div className="ending-ascii">{`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░   오 대 륙 전 기  —  에 필 로 그    ░░
░░   FIVE CONTINENTS CHRONICLES         ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</div>
          <div className="ending-title">테라 노바 연대기 완결</div>
          <div className="ending-sub">EPILOGUE · END OF CHAPTER VIII</div>
          <div className="ending-text">
            미르의 잔해 속에서 새로운 문명의 흔적이 발견됩니다.<br/>
            대륙 밖에서 미지의 신호가 수신됩니다.<br/>
            테라 노바 연합이 첫 회의를 엽니다.
          </div>
          <div className="ending-hint">「테라 노바는 끝이 아니다」</div>
          <button className="ending-btn" onClick={onRestart}>새 게임 시작</button>
        </div>
      )}
    </div>
  );
}
