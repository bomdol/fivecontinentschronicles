import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CONTS, JOBS, JOB_IMAGES, CREATURE_IMAGES, AI_PROVIDERS, STORY_CHAPTERS } from '../data/constants.js';
import { buildSystemPrompt, buildSystemPromptCompact } from '../services/prompts.js';
import { callAI } from '../services/ai.js';
import { saveGame, generateGameId } from '../services/save.js';
import { onAuthChange, signInWithGoogle, signOutUser } from '../services/firebase.js';
import { calcMaxHp, calcMaxMp, calcLevel, XP_LEVELS, getAvailableSkills, getPlayerAC, getStatMod, JOB_BASIC_ATTACK } from '../lore/jobs_levels.js';
import { getCompanion } from '../lore/companions.js';
import { TERRA_NOVA_CREATURES } from '../lore/terra_nova.js';
import { JOB_DEFAULT_ITEM, CRAFTABLE_ITEMS, getItemsAC } from '../lore/items.js';
import { MATERIALS, getMaterial } from '../lore/materials.js';
import { RECIPES, getCraftableRecipes } from '../lore/recipes.js';

function L(obj, lang) {
  return typeof obj === 'object' ? (obj[lang] || obj.ko || obj.en || Object.values(obj)[0]) : obj;
}

function getPlayerDex(statsStr) {
  const m = statsStr.match(/민첩\s+(\d+)/);
  return m ? +m[1] : 10;
}

function rollGatherMineEvents(storyChapter) {
  const chap = STORY_CHAPTERS[storyChapter - 1];
  if (!chap?.events) return null;
  const events = chap.events.filter(e => e.type === 'gather' || e.type === 'mine');
  for (const evt of events) {
    const perTurnProb = (evt.prob / 100) / Math.max(chap.turns / 3, 1);
    if (Math.random() > perTurnProb) continue;
    const mats = {};
    for (const y of (evt.yields ?? [])) {
      if (Math.random() < y.prob) mats[y.material_id] = (mats[y.material_id] ?? 0) + y.qty;
    }
    if (Object.keys(mats).length > 0) return { action: evt.type === 'gather' ? '채집' : '채광', mats };
  }
  return null;
}

function rollCombatDrops(enemies) {
  const acc = {};
  for (const enemy of enemies) {
    const def = TERRA_NOVA_CREATURES.find(c => c.id === enemy.id);
    if (!def?.drops?.length) continue;
    const count = enemy._units?.length ?? enemy.count ?? 1;
    for (let i = 0; i < count; i++) {
      for (const drop of def.drops) {
        if (Math.random() < drop.prob) {
          const qty = drop.qty_min + Math.floor(Math.random() * (drop.qty_max - drop.qty_min + 1));
          acc[drop.id] = (acc[drop.id] ?? 0) + qty;
        }
      }
    }
  }
  return Object.entries(acc).map(([id, qty]) => ({ id, qty }));
}

function rollD20() { return Math.floor(Math.random() * 20) + 1; }
function rollDice(n, s) { let t = 0; for (let i = 0; i < n; i++) t += Math.floor(Math.random() * s) + 1; return t; }
function rollSkillDamage(skill, statsStr, level = 1) {
  const { dice, sides, bonus_stat } = skill.damage;
  const base = Math.max(1, rollDice(dice, sides) + getStatMod(statsStr, bonus_stat));
  return base * level * 12;
}
function getEnemyAC(enemy) {
  const cr = TERRA_NOVA_CREATURES.find(c => c.id === enemy.id);
  if (cr?.combat?.ac) return cr.combat.ac;
  const lv = enemy._rolled_level ?? enemy.level_min ?? 1;
  return 10 + Math.floor(lv / 2);
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
    const baseHp = cr?.combat?.hp ?? 100;
    const units = e._units?.filter(u => u.hp > 0)
      ?? Array.from({length: Math.min(e.count ?? 1, 5)}, () => ({hp: baseHp, maxHp: baseHp}));
    units.forEach(unit => {
      participants.push({
        type: 'enemy', id: e.id,
        name: eInfo ? eInfo.ko : e.id,
        img: eInfo ? eInfo.img : null,
        dex: eDex + Math.floor(Math.random() * 3),
        hp: unit.hp, maxHp: unit.maxHp,
        lv: e._rolled_level ?? cr?.level ?? '?',
      });
    });
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
    items: [JOB_DEFAULT_ITEM[charData.job]].filter(Boolean),
    materials: {},
    storyChapter: 1,
    chapterTurns: 0,
    activeBuffs: [],
  });
  const charRef = useRef(char);
  charRef.current = char;

  const [storyContent, setStoryContent]   = useState([]);
  const [choices, setChoices]             = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [logItems, setLogItems]           = useState([]);
  const [showLog, setShowLog]             = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showCrafting, setShowCrafting]   = useState(false);
  const [debugLog, setDebugLog]           = useState([]);
  const debugScrollRef                    = useRef(null);
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
  const [subTurnIdx, setSubTurnIdx]       = useState(0);
  const [gameOver, setGameOver]           = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [companionAutoMode, setCompanionAutoMode] = useState(true);
  const [pendingCompanionTurn, setPendingCompanionTurn] = useState(null);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [countdownSec, setCountdownSec] = useState(10);

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
  const inCombatRef              = useRef(false);
  const combatTurnsRef           = useRef(0);
  const pendingCombatOverridesRef = useRef(null);
  const subTurnIdxRef            = useRef(0);
  const isSubTurnActionRef       = useRef(false);
  const companionAutoModeRef     = useRef(true);
  const advanceTimerRef          = useRef(null);

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
      subTurnIdxRef.current = 0;
      setSubTurnIdx(0);
      stripOrderRef.current = [];
      return;
    }
    const prevEnemyCount = stripOrderRef.current.filter(p => p.type === 'enemy').length;
    const newEnemyCount  = enemies.reduce((s, e) => s + ((e._units?.filter(u=>u.hp>0).length) ?? e.count ?? 1), 0);
    if (combatEnemiesRef.current.length === 0 || prevEnemyCount !== newEnemyCount) {
      const isCombatStart = combatEnemiesRef.current.length === 0;
      if (isCombatStart) {
        subTurnIdxRef.current = 0;
        setSubTurnIdx(0);
      }
      // 재빌드 전 현재 참가자 기억 (중간 재빌드 시 인덱스 보정)
      const curPart = !isCombatStart ? stripOrderRef.current[subTurnIdxRef.current] : null;
      stripOrderRef.current = buildInitiativeOrder(enemies, currentChar, jobName);
      if (curPart) {
        const newIdx = stripOrderRef.current.findIndex(p => p.type === curPart.type && p.id === curPart.id);
        const corrected = newIdx >= 0 ? newIdx : Math.min(subTurnIdxRef.current, stripOrderRef.current.length - 1);
        subTurnIdxRef.current = corrected;
        setSubTurnIdx(corrected);
      }
    }
    combatEnemiesRef.current = enemies;
    const order = stripOrderRef.current;

    // 플레이어 HP 갱신
    const playerCard = order.find(p => p.type === 'player');
    if (playerCard) { playerCard.hp = currentChar.hp; playerCard.maxHp = currentChar.maxHp; }

    // 동료 HP·상태 갱신
    order.filter(p => p.type === 'companion').forEach(card => {
      const comp = currentChar.companions.find(c => c.id === card.id);
      if (comp) { card.hp = comp.hp; card.maxHp = comp.maxHp; card.status = comp.status; }
    });

    // 적 유닛별 HP 갱신 (재빌드 없이 개별 카드 HP를 _units 순서대로 동기화)
    const enemyCards = order.filter(p => p.type === 'enemy');
    const unitCursor = {};
    enemyCards.forEach(card => {
      const idx = unitCursor[card.id] ?? 0;
      unitCursor[card.id] = idx + 1;
      const group = enemies.find(e => e.id === card.id);
      const aliveUnits = (group?._units ?? []).filter(u => u.hp > 0);
      const unit = aliveUnits[idx];
      if (unit) { card.hp = unit.hp; card.maxHp = unit.maxHp; }
    });

    setTurnStripOrder([...order]);
    setTurnStripActive(subTurnIdxRef.current);
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
      const unitHps = (e._units ?? []).filter(u=>u.hp>0).map(u=>({hp:u.hp,maxHp:u.maxHp}));
      statsItems.push({ name:(eInfo?.ko||e.id)+cnt, lv, threat:cr?.threat??'?', combat:cr?.combat, unitHps, i });
    });
    setEnemyPanel({ img: pInfo.img, ko: pInfo.ko, en: pInfo.en, count: primary.count, statsItems });
  }

  // ── 서브턴 진행 ─────────────────────────────────────────────────────
  function advanceSubTurn() {
    if (!inCombatRef.current) return;
    const order = stripOrderRef.current;
    if (!order || order.length === 0) return;

    let idx = subTurnIdxRef.current + 1;
    if (idx >= order.length) {
      idx = 0;
      combatTurnsRef.current += 1;
      setCombatTurns(combatTurnsRef.current);
      // 라운드 완료 시 10회 초과 강제 도주 체크
      if (combatTurnsRef.current >= 10 && combatEnemiesRef.current.length > 0) {
        const cc = charRef.current;
        const dex = getPlayerDex(cc.stats);
        const dexMod = Math.floor((dex - 10) / 2);
        const d20f = rollD20();
        const rollF = d20f + dexMod;
        const dexModStr = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`;
        if (rollF >= 12) {
          inCombatRef.current = false;
          setInCombat(false);
          combatTurnsRef.current = 0;
          setCombatTurns(0);
          clearAdvanceTimer(); setPendingAdvance(false);
          setTimeout(() => callGM(
            `[10회 초과 강제 도주 성공 — d20(${d20f})${dexModStr}=${rollF} ≥ DC12] 간신히 전장을 벗어났습니다. enemies:[] 전투 종료. 탈출 직후 상황을 서술해 주세요.`
          ), 400);
        } else {
          setGameOver(true);
          setGameOverReason(`10회 초과 도주 실패 — d20(${d20f})${dexModStr}=${rollF} < DC12, 전원 사망`);
        }
        return;
      }
    }

    // 죽은/기절 참가자 건너뜀
    let checked = 0;
    while (checked < order.length) {
      const p = order[idx];
      let active = false;
      if (p.type === 'player') active = true;
      else if (p.type === 'enemy') active = combatEnemiesRef.current.some(e => e.id === p.id);
      else if (p.type === 'companion') {
        const comp = charRef.current.companions.find(c => c.id === p.id);
        active = comp?.status === 'active';
      }
      if (active) break;
      idx = (idx + 1) % order.length;
      checked++;
    }

    subTurnIdxRef.current = idx;
    setSubTurnIdx(idx);
    setTurnStripActive(idx);
    triggerSubTurn(idx);
  }

  function triggerSubTurn(idx) {
    if (!inCombatRef.current) return;
    const order = stripOrderRef.current;
    const p = order[idx];
    if (!p) return;
    if (p.type === 'enemy') {
      const enemy = combatEnemiesRef.current.find(e => e.id === p.id);
      if (enemy) setTimeout(() => handleEnemySubTurn(enemy), 500);
      else advanceSubTurn();
    } else if (p.type === 'companion') {
      const comp = charRef.current.companions.find(c => c.id === p.id);
      if (comp?.status === 'active') {
        if (companionAutoModeRef.current) {
          setTimeout(() => handleCompanionSubTurn(comp), 500);
        } else {
          setPendingCompanionTurn(comp);
        }
      } else advanceSubTurn();
    }
    // player: 스킬 패널 표시 대기
  }

  // ── 적 서브턴 ────────────────────────────────────────────────────────
  function handleEnemySubTurn(enemy) {
    if (loadingRef.current || !inCombatRef.current) return;

    // 상태이상(confused/silenced/stunned/feared) 체크
    const statusEffects = enemy._statusEffects ?? [];
    const activeEffect = statusEffects.find(s => s.turnsLeft > 0);
    if (activeEffect) {
      const newEffects = statusEffects
        .map(s => s.type === activeEffect.type ? {...s, turnsLeft: s.turnsLeft - 1} : s)
        .filter(s => s.turnsLeft > 0);
      const cr2 = TERRA_NOVA_CREATURES.find(c => c.id === enemy.id);
      const eName = CREATURE_IMAGES[enemy.id]?.ko ?? enemy.id;
      const round = combatTurnsRef.current + 1;
      isSubTurnActionRef.current = true;

      if (activeEffect.type === 'confused') {
        // 엔진이 혼란 효과 결정 & 피해 계산
        const baseAtk = cr2?.combat?.atk ?? 15;
        const variation = Math.floor(Math.random() * 7) - 3; // -3~+3
        const dmg = Math.max(5, baseAtk + variation);
        const roll3 = Math.floor(Math.random() * 3); // 0:자기공격, 1:혈관파열, 2:적군공격(없으면 자기)
        const otherEnemies = combatEnemiesRef.current.filter(e => e.id !== enemy.id && e.count > 0);
        const effect = (roll3 === 2 && otherEnemies.length > 0) ? 'friendly_fire' : roll3 === 1 ? 'blood_vessel' : 'self_attack';
        let engineMsg = '';

        if (effect === 'self_attack' || effect === 'blood_vessel') {
          // 자기 자신에게 피해 (HP 차감)
          const selfDmg = effect === 'blood_vessel' ? Math.floor((cr2?.combat?.hp ?? 80) * 0.2) : dmg;
          combatEnemiesRef.current = combatEnemiesRef.current.map(e => {
            if (e.id !== enemy.id) return e;
            const units = (e._units?.length > 0 ? e._units.map(u => ({...u})) : [{hp: cr2?.combat?.hp ?? 80, maxHp: cr2?.combat?.hp ?? 80}]);
            for (let i = 0; i < units.length; i++) {
              if (units[i].hp > 0) { units[i].hp = Math.max(0, units[i].hp - selfDmg); break; }
            }
            const alive = units.filter(u => u.hp > 0);
            return {...e, _units: alive, count: alive.length, _statusEffects: newEffects};
          }).filter(e => e.count > 0);
          const label = effect === 'blood_vessel' ? `혈관 파열로 자기 피해 ${selfDmg}` : `혼란으로 자신을 공격, 피해 ${selfDmg}`;
          engineMsg = `[엔진 판정] ${eName}이(가) ${label}. hp_delta:0, mp_delta:0 (적 자체 HP 차감 완료).`;
          setDebugLog(prev => [...prev, { type:'engine', content:`${eName} 주화입마 ${effect}: 자기피해 ${selfDmg}`, time: new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) }]);
        } else {
          // 아군(다른 적)에게 피해
          const target2 = otherEnemies[Math.floor(Math.random() * otherEnemies.length)];
          const t2Name = CREATURE_IMAGES[target2.id]?.ko ?? target2.id;
          const t2cr = TERRA_NOVA_CREATURES.find(c => c.id === target2.id);
          const t2DmgFinal = Math.max(5, dmg - Math.floor((t2cr?.combat?.ac ?? 12) / 2));
          combatEnemiesRef.current = combatEnemiesRef.current.map(e => {
            if (e.id !== target2.id) return e === enemy ? {...e, _statusEffects: newEffects} : e;
            const units = (e._units?.length > 0 ? e._units.map(u => ({...u})) : [{hp: t2cr?.combat?.hp ?? 80, maxHp: t2cr?.combat?.hp ?? 80}]);
            for (let i = 0; i < units.length; i++) {
              if (units[i].hp > 0) { units[i].hp = Math.max(0, units[i].hp - t2DmgFinal); break; }
            }
            const alive = units.filter(u => u.hp > 0);
            return {...e, _units: alive, count: alive.length};
          }).filter(e => e.count > 0);
          combatEnemiesRef.current = combatEnemiesRef.current.map(e =>
            e.id === enemy.id ? {...e, _statusEffects: newEffects} : e
          );
          engineMsg = `[엔진 판정] ${eName}이(가) 혼란으로 아군 ${t2Name}을(를) 공격, 피해 ${t2DmgFinal}. hp_delta:0, mp_delta:0 (적 자체 HP 차감 완료).`;
          setDebugLog(prev => [...prev, { type:'engine', content:`${eName} 주화입마 friendly_fire → ${t2Name} 피해 ${t2DmgFinal}`, time: new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) }]);
        }
        pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };
        callGM(`[전투 ${round}회 차례, ${eName}의 행동] ${engineMsg} 이 결과를 생생하게 서술. enemy_attack:"".`);

      } else {
        // stunned/silenced/feared: 피해 없음, AI 서술만
        combatEnemiesRef.current = combatEnemiesRef.current.map(e =>
          e.id === enemy.id ? {...e, _statusEffects: newEffects} : e
        );
        const statusLabels = { stunned:'기절로 행동 불가', silenced:'봉혈로 스킬 봉쇄됨(기본 공격 가능)', feared:'공포로 도주·위축' };
        pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };
        callGM(`[전투 ${round}회 차례, ${eName}의 행동] [상태이상: ${statusLabels[activeEffect.type] ?? activeEffect.type}] 이 상황만 서술. enemy_attack:"". hp_delta:0, mp_delta:0.`);
      }
      return;
    }

    isSubTurnActionRef.current = true;
    const c = charRef.current;
    const cr = TERRA_NOVA_CREATURES.find(cr => cr.id === enemy.id);
    const playerAC = getPlayerAC(c.job, c.stats) + getItemsAC(c.items ?? []);
    const enemyLv = enemy._rolled_level ?? cr?.level_min ?? 1;
    const atkBonus = Math.floor(enemyLv / 2);
    const atkBonusStr = atkBonus >= 0 ? `+${atkBonus}` : `${atkBonus}`;
    const enemyName = CREATURE_IMAGES[enemy.id]?.ko ?? enemy.id;
    const compDamages = [];

    const d20 = rollD20();
    const enemyRoll = d20 + atkBonus;
    let hpDelta = 0;
    let attackMsg = '';
    let attackMsgVerbose = '';

    if (enemyRoll >= playerAC && cr?.combat?.atk) {
      const variance = Math.floor(Math.random() * 5) - 2;
      const levelDefense = c.level * 10 + Math.max(0, getStatMod(c.stats, '체력')) * c.level;
      hpDelta = -Math.max(10, cr.combat.atk + variance - levelDefense);
      attackMsgVerbose = `${enemyName} 공격: d20(${d20})${atkBonusStr}=${enemyRoll} vs AC${playerAC} → 명중 (피해 ${Math.abs(hpDelta)}, 방어 ${levelDefense})`;
      attackMsg = `명중 (피해 ${Math.abs(hpDelta)})`;
    } else {
      attackMsgVerbose = `${enemyName} 공격: d20(${d20})${atkBonusStr}=${enemyRoll} vs AC${playerAC} → 빗나감`;
      attackMsg = `빗나감`;
    }

    // 동료 공격 30% 확률
    if (cr?.combat?.atk) {
      const activeComps = (c.companions ?? []).filter(cp => cp.status === 'active');
      if (activeComps.length > 0 && Math.random() < 0.3) {
        const target = activeComps[Math.floor(Math.random() * activeComps.length)];
        const base = getCompanion(target.id);
        if (base) {
          const compAC = getPlayerAC(base.job, base.stats);
          const cd20 = rollD20();
          const cRoll = cd20 + atkBonus;
          if (cRoll >= compAC) {
            const cv = Math.floor(Math.random() * 5) - 2;
            const compConMod = Math.max(0, getStatMod(base.stats, 'CON'));
            const compDefense = c.level * 5 + compConMod * c.level;
            const compDmg = Math.max(5, cr.combat.atk + cv - compDefense);
            compDamages.push({ id: target.id, hp_delta: -compDmg });
            attackMsgVerbose += ` / ${target.name} d20(${cd20})${atkBonusStr}=${cRoll} vs AC${compAC} → 명중 (피해 ${compDmg})`;
            attackMsg += ` / ${target.name} 명중 (피해 ${compDmg})`;
          } else {
            attackMsgVerbose += ` / ${target.name} d20(${cd20})${atkBonusStr}=${cRoll} vs AC${compAC} → 빗나감`;
            attackMsg += ` / ${target.name} 빗나감`;
          }
        }
      }
    }

    const et = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    setDebugLog(prev => [...prev, { type: 'engine', content: attackMsgVerbose, time: et }]);
    pendingCombatOverridesRef.current = { hp_delta: hpDelta, mp_delta: 0, companion_damages: compDamages };

    const round = combatTurnsRef.current + 1;
    const msg = `[전투 ${round}회 차례, ${enemyName}의 행동] [엔진 판정] 플레이어에게 ${attackMsg}. ${enemyName}의 공격 행동만 서술. enemy_attack:"". hp_delta/mp_delta는 엔진이 처리.`;
    callGM(msg);
  }

  // ── 동료 서브턴 ──────────────────────────────────────────────────────
  function handleCompanionSubTurn(companion) {
    if (loadingRef.current || !inCombatRef.current) return;
    isSubTurnActionRef.current = true;
    const enemies = combatEnemiesRef.current;
    const c = charRef.current;

    if (enemies.length === 0) { advanceSubTurn(); return; }

    let primary = enemies[0];
    for (const e of enemies) {
      const a = TERRA_NOVA_CREATURES.find(cr => cr.id === e.id);
      const b = TERRA_NOVA_CREATURES.find(cr => cr.id === primary.id);
      if (a && b && (a.threat ?? 0) > (b.threat ?? 0)) primary = e;
    }
    const enemyAC = getEnemyAC(primary);
    const atkMod = Math.floor(c.level / 2);
    const modStr = atkMod >= 0 ? `+${atkMod}` : `${atkMod}`;
    const d20 = rollD20();
    const roll = d20 + atkMod;
    const isCrit = d20 === 20;
    const enemyName = CREATURE_IMAGES[primary.id]?.ko ?? primary.id;
    let attackMsg = '';
    let attackMsgVerbose = '';

    if (roll >= enemyAC || isCrit) {
      const compDmg = Math.max(8, 12 + atkMod * 2) * (isCrit ? 2 : 1);
      const crData = TERRA_NOVA_CREATURES.find(cr => cr.id === primary.id);
      const fallbackHp = crData?.combat?.hp ?? 100;
      let killedCount = 0;
      const updatedEnemies = enemies.map(e => {
        if (e.id !== primary.id) return e;
        const units = (e._units?.length > 0 ? e._units.map(u => ({...u}))
          : Array.from({length: Math.min(e.count ?? 1, 5)}, () => ({hp: fallbackHp, maxHp: fallbackHp})));
        for (let i = 0; i < units.length; i++) {
          if (units[i].hp > 0) { units[i].hp = Math.max(0, units[i].hp - compDmg); break; }
        }
        killedCount += units.filter(u => u.hp <= 0).length;
        const alive = units.filter(u => u.hp > 0);
        return {...e, _units: alive, count: alive.length};
      }).filter(e => e.count > 0);
      combatEnemiesRef.current = updatedEnemies;
      attackMsgVerbose = `${companion.name} 공격: d20(${d20})${modStr}=${roll} vs AC${enemyAC} → 명중 (피해 ${compDmg}${isCrit?', 치명타':''})${killedCount>0?` (${killedCount}마리 사망)`:''}`;
      attackMsg = `${enemyName}에게 명중 (피해 ${compDmg}${isCrit?', 치명타':''})`;
    } else {
      attackMsgVerbose = `${companion.name} 공격: d20(${d20})${modStr}=${roll} vs AC${enemyAC} → 빗나감`;
      attackMsg = `${enemyName} 빗나감`;
    }

    const et = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    setDebugLog(prev => [...prev, { type: 'engine', content: attackMsgVerbose, time: et }]);
    pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };

    const round = combatTurnsRef.current + 1;
    const msg = `[전투 ${round}회 차례, ${companion.name}의 행동] [엔진 판정] ${attackMsg}. ${companion.name}의 공격 행동만 서술. enemy_attack:"". hp_delta/mp_delta는 엔진이 처리.`;
    callGM(msg);
  }

  // ── 서브턴 전환 대기 (5초 카운트다운) ────────────────────────────────
  function clearAdvanceTimer() {
    if (advanceTimerRef.current) {
      clearInterval(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function startAdvanceCountdown() {
    setPendingAdvance(true);
    setCountdownSec(10);
    let sec = 10;
    const interval = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        clearInterval(interval);
        advanceTimerRef.current = null;
        setPendingAdvance(false);
        advanceSubTurn();
      } else {
        setCountdownSec(sec);
      }
    }, 1000);
    advanceTimerRef.current = interval;
  }

  function handleAdvanceNow() {
    clearAdvanceTimer();
    setPendingAdvance(false);
    advanceSubTurn();
  }

  // ── 동료 수동 조종 ──────────────────────────────────────────────────
  function toggleCompanionMode() {
    const next = !companionAutoModeRef.current;
    companionAutoModeRef.current = next;
    setCompanionAutoMode(next);
  }

  function handleCompanionManualAttack() {
    const comp = pendingCompanionTurn;
    setPendingCompanionTurn(null);
    handleCompanionSubTurn(comp);
  }

  function handleCompanionManualSkip() {
    const comp = pendingCompanionTurn;
    setPendingCompanionTurn(null);
    isSubTurnActionRef.current = true;
    pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };
    const round = combatTurnsRef.current + 1;
    const msg = `[전투 ${round}회 차례, ${comp.name}의 행동] ${comp.name}이(가) 방어 태세를 취하며 이번 턴을 넘긴다. 이 행동만 서술. enemy_attack:"". hp_delta:0, mp_delta:0.`;
    callGM(msg);
  }

  // ── GM 응답 적용 ────────────────────────────────────────────────────
  // combatOverrides: 엔진이 계산한 전투 수치. 공격 스킬={hp_delta,mp_delta}, 지원 스킬={mp_delta_only}
  function applyResult(p, userMsg, prevChar, combatOverrides = null) {
    const wasInCombat = inCombatRef.current;
    let c = { ...prevChar };
    let hpDelta, mpDelta;
    if (combatOverrides !== null) {
      if ('hp_delta' in combatOverrides) {
        // 공격/치유 스킬: 엔진이 HP/MP 모두 계산 (버프 회복 포함)
        hpDelta = combatOverrides.hp_delta;
        mpDelta = combatOverrides.mp_delta;
      } else {
        // 버프/디버프 스킬: MP·HP코스트·버프회복은 엔진, 나머지 HP는 AI 값
        hpDelta = (p.hp_delta ?? 0) + (combatOverrides.buffRegen ?? 0) - (combatOverrides.hpCost ?? 0);
        mpDelta = combatOverrides.mp_delta_only ?? p.mp_delta ?? 0;
      }
      if (combatOverrides.nextActiveBuffs !== undefined) {
        c.activeBuffs = combatOverrides.nextActiveBuffs;
      }
    } else {
      hpDelta = p.hp_delta ?? 0;
      mpDelta = p.mp_delta ?? 0;
    }
    if (hpDelta) c.hp = Math.max(0, Math.min(c.maxHp, c.hp + hpDelta));
    if (mpDelta) c.mp = Math.max(0, Math.min(c.maxMp, c.mp + mpDelta));

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

    // 적 HP 관리: 신규 전투는 AI 적 목록으로 초기화, 진행 중은 엔진 상태 사용
    let finalEnemies;
    if (!inCombatRef.current && rawEnemies.length > 0) {
      // 신규 전투: 레벨·동료 수 기반 총 적 수 상한 계산
      // lv1+동료0=2, lv3+동료1=4, lv6+동료2=6, lv9+동료3=8, lv12+동료3=9
      const activeCompCount = c.companions.filter(cp => cp.status === 'active').length;
      const maxTotalUnits = Math.min(9, 2 + Math.floor(c.level / 3) + activeCompCount);

      // 그룹별 비례 배분 (AI가 요청한 비율 유지하면서 총합 제한)
      const rawCounts = rawEnemies.map(e => Math.max(1, e.count ?? 1));
      const rawTotal = rawCounts.reduce((s, n) => s + n, 0);
      const cappedCounts = rawTotal <= maxTotalUnits
        ? rawCounts
        : rawCounts.map(n => Math.max(1, Math.round(n * maxTotalUnits / rawTotal)));
      // 반올림 오차 보정
      let allocated = cappedCounts.reduce((s, n) => s + n, 0);
      for (let i = 0; allocated > maxTotalUnits && i < cappedCounts.length; i++) {
        if (cappedCounts[i] > 1) { cappedCounts[i]--; allocated--; }
      }

      finalEnemies = rawEnemies.map((e, i) => {
        const min = e.level_min ?? 1; const max = e.level_max ?? min;
        const lv  = min + Math.floor(Math.random() * (max - min + 1));
        const cr  = TERRA_NOVA_CREATURES.find(c => c.id === e.id);
        const baseHp = cr?.combat?.hp ?? 100;
        const cnt = Math.min(cappedCounts[i], 5);
        const units = Array.from({length: cnt}, () => ({hp: baseHp, maxHp: baseHp}));
        return {...e, _rolled_level: lv, count: cnt, _units: units};
      });
    } else if (inCombatRef.current) {
      // 전투 진행 중: 엔진(handleCombatSkill)이 이미 갱신한 HP 기준
      finalEnemies = combatEnemiesRef.current
        .map(e => ({...e, _units: (e._units ?? []).filter(u => u.hp > 0), count: (e._units ?? []).filter(u => u.hp > 0).length}))
        .filter(e => e.count > 0);
    } else {
      finalEnemies = [];
    }

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

    const compOverrides = combatOverrides?.companion_damages ?? [];
    const compChangeLines = [];
    if (compOverrides.length > 0 || p.companion_state?.length) {
      c.companions = c.companions.map(comp => {
        if (comp.status === 'dead') return comp;
        const engineDmg = compOverrides.find(x => x.id === comp.id);
        const aiState = p.companion_state?.find(x => x.id === comp.id);
        let nc = {...comp};

        // 엔진 피해 우선 적용 (전투 대미지)
        if (engineDmg) {
          nc.hp = Math.max(0, Math.min(nc.maxHp, nc.hp + engineDmg.hp_delta));
          compChangeLines.push(`${comp.name} HP ${engineDmg.hp_delta}`);
        }
        // 엔진 피해 없을 때만 AI hp_delta 적용 (회복·비전투 효과)
        if (!engineDmg && aiState?.hp_delta) {
          nc.hp = Math.max(0, Math.min(nc.maxHp, nc.hp + aiState.hp_delta));
          compChangeLines.push(`${comp.name} HP ${aiState.hp_delta > 0 ? '+' : ''}${aiState.hp_delta}`);
        }
        // AI 상태 변화는 항상 반영 (down/dead/active)
        if (aiState?.status) {
          if (nc.status === 'down' && aiState.status === 'dead') nc.status = 'dead';
          else if (aiState.status !== 'dead') nc.status = aiState.status;
        }
        // HP 0이면 자동 down
        if (nc.hp <= 0 && nc.status === 'active') nc.status = 'down';
        return nc;
      });
      if (!finalEnemies.length) {
        c.companions = c.companions.map(comp =>
          comp.status === 'down' ? {...comp, hp:1, status:'active'} : comp
        );
      }
    }

    // 파티 전멸 체크: 주인공 기절 + 활성 동료 없음 → 게임 오버
    if (c.hp <= 0 && !c.companions.some(cp => cp.status === 'active')) {
      setGameOver(true);
      setGameOverReason('파티 전원 기절 — 전투에서 패배했습니다');
      setChar(c);
      charRef.current = c;
      return c;
    }

    if (Array.isArray(p.status)) c.status = p.status;
    if (p.chapter) setChapterLabel(p.chapter);

    // 전투 종료 직전 적 목록 저장 (updateTurnStrip이 combatEnemiesRef를 초기화하기 전)
    const defeatedEnemies = (inCombatRef.current && finalEnemies.length === 0)
      ? [...combatEnemiesRef.current]
      : [];

    updateEnemyPanel(finalEnemies);
    updateTurnStrip(finalEnemies, c);

    // 전투 상태 진입/종료
    if (finalEnemies.length > 0) {
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
      clearAdvanceTimer(); setPendingAdvance(false);
      c.activeBuffs = [];

      // 재료 드랍 처리
      if (defeatedEnemies.length > 0) {
        const drops = rollCombatDrops(defeatedEnemies);
        if (drops.length > 0) {
          const newMats = { ...(c.materials ?? {}) };
          const lines = [];
          for (const { id, qty } of drops) {
            newMats[id] = (newMats[id] ?? 0) + qty;
            const mat = getMaterial(id);
            if (mat) lines.push(`${mat.name.ko} ×${qty}`);
          }
          c.materials = newMats;
          if (lines.length > 0) {
            setTimeout(() => {
              setStoryContent(prev => [
                ...prev,
                { type: 'drops', text: `✦ 재료 획득: ${lines.join(', ')}`, key: 'drops' },
              ]);
            }, 120);
          }
        }
      }
    }

    // 채집·채광 이벤트 처리 (순수 비전투 턴)
    if (defeatedEnemies.length === 0 && finalEnemies.length === 0) {
      const gathered = rollGatherMineEvents(c.storyChapter);
      if (gathered) {
        const newMats = { ...(c.materials ?? {}) };
        const lines = [];
        for (const [id, qty] of Object.entries(gathered.mats)) {
          newMats[id] = (newMats[id] ?? 0) + qty;
          const mat = getMaterial(id);
          if (mat) lines.push(`${mat.name.ko} ×${qty}`);
        }
        c.materials = newMats;
        if (lines.length > 0) {
          setTimeout(() => {
            setStoryContent(prev => [
              ...prev,
              { type: 'drops', text: `✦ ${gathered.action}: ${lines.join(', ')}`, key: 'gather' },
            ]);
          }, 120);
        }
      }
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
    if (p.enemy_attack && finalEnemies.length > 0) {
      paras.push({type:'enemy_atk', text:p.enemy_attack, key:'ea'});
    }
    if (compChangeLines.length > 0) {
      paras.push({type:'companion', text:`✦ 동료: ${compChangeLines.join(' / ')}`, key:'comp-chg'});
    }
    setStoryContent(paras);
    setChoices(p.choices || []);

    if (userMsg) {
      setLogItems(prev => [...prev.slice(-9), {choice:userMsg, story:(p.story||'').slice(0,80)+'…'}]);
    }

    if (!wasInCombat && finalEnemies.length === 0) {
      c = advanceChapterTurn(c);
    }
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
    const logTime = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    setDebugLog(prev => [...prev, { type:'sent', content: userMsg, time: logTime }]);

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
        ? buildSystemPromptCompact(c, contName, jobName, c.materials)
        : buildSystemPrompt(c, contName, jobName, jobRole, jobDesc, c.materials);
      const raw = await callAI(currentProvider, apiKey, sys, msgsForAI, (partial) => {
        const story = extractStreamStory(partial);
        if (story) {
          const paras = story.split('\n\n').map((t, i) => ({type:'para', text:t, key:`s${i}`}));
          setStoryContent(paras);
        }
      });
      historyRef.current = [...historyRef.current, {role:'assistant', content: raw}];
      const recvTime = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      setDebugLog(prev => {
        const next = [...prev, { type:'received', content: raw, time: recvTime }];
        return next;
      });
      setTimeout(() => {
        if (debugScrollRef.current) debugScrollRef.current.scrollTop = debugScrollRef.current.scrollHeight;
      }, 50);

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
      const wasSubTurn = isSubTurnActionRef.current;
      isSubTurnActionRef.current = false;
      const combatOverrides = pendingCombatOverridesRef.current;
      pendingCombatOverridesRef.current = null;
      applyResult(parsed, userMsg, charRef.current, combatOverrides);

      // 서브턴 진행
      if (inCombatRef.current) {
        if (wasSubTurn) {
          startAdvanceCountdown();
        } else {
          // 스토리 행동으로 전투 시작 — 첫 서브턴 트리거
          triggerSubTurn(subTurnIdxRef.current);
        }
      }
    } catch(err) {
      isSubTurnActionRef.current = false;
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
      items:        gs.items        ?? [JOB_DEFAULT_ITEM[charRef.current.job]].filter(Boolean),
      materials:    gs.materials    ?? {},
      storyChapter: gs.storyChapter ?? 1,
      chapterTurns: gs.chapterTurns ?? 0,
      activeBuffs:  gs.activeBuffs  ?? [],
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

  // ── 제작 실행 ────────────────────────────────────────────────────────
  function executeCraft(recipe) {
    const c = { ...charRef.current };
    const newMats = { ...(c.materials ?? {}) };
    for (const m of recipe.materials) newMats[m.id] = (newMats[m.id] ?? 0) - m.qty;
    const item = CRAFTABLE_ITEMS.find(it => it.id === recipe.item_id);
    if (!item) return;
    c.materials = newMats;
    c.items = [...(c.items ?? []), item];
    setChar(c);
    charRef.current = c;
    doSaveGame(c);
    setStoryContent(prev => [...prev, {
      type: 'drops', text: `✦ 제작 완료: ${item.name} (${item.tier})`, key: `craft-${item.id}`
    }]);
    setShowCrafting(false);
  }

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

  // ── 전투 스킬 사용 (엔진 HP 관리 + D&D AC 판정) ──────────────────
  function handleCombatSkill(skill) {
    if (loadingRef.current) return;
    const c = charRef.current;
    const enemies = combatEnemiesRef.current;
    const mpCost = skill.cost?.mp ?? 0;
    const hpCost = skill.cost?.hp ?? 0;
    const isAttackSkill = !!(skill.attackStat && (skill.damage || skill.flatDamage != null));
    const isHealSkill = skill.healAmount != null;

    // ── 0. 기존 버프 회복량 계산 & 다음 버프 목록 준비 ──────────────────
    const buffRegen = (c.activeBuffs ?? []).reduce((s, b) => s + (b.hpRegen ?? 0), 0);
    let nextActiveBuffs = (c.activeBuffs ?? [])
      .map(b => ({...b, turnsLeft: b.turnsLeft - 1}))
      .filter(b => b.turnsLeft > 0);
    if (skill.buffEffect) {
      nextActiveBuffs = [...nextActiveBuffs, { hpRegen: skill.buffEffect.hpRegen ?? 0, turnsLeft: skill.buffEffect.turns }];
    }

    // ── 1. 플레이어 공격 판정 & 엔진 HP 차감 ─────────────────────────
    let playerHitMsg = '';
    let playerHitMsgVerbose = '';
    let playerDmg = 0;
    let enemyStateMsg = '';

    if (isAttackSkill && enemies.length > 0) {
      let primary = enemies[0];
      for (const e of enemies) {
        const a = TERRA_NOVA_CREATURES.find(cr => cr.id === e.id);
        const b = TERRA_NOVA_CREATURES.find(cr => cr.id === primary.id);
        if (a && b && (a.threat ?? 0) > (b.threat ?? 0)) primary = e;
      }
      const enemyAC = getEnemyAC(primary);
      const attackMod = getStatMod(c.stats, skill.attackStat);
      const d20 = rollD20();
      const roll = d20 + attackMod;
      const isCrit = d20 === 20;
      const modStr = attackMod >= 0 ? `+${attackMod}` : `${attackMod}`;

      if (roll >= enemyAC || isCrit) {
        playerDmg = skill.damage ? rollSkillDamage(skill, c.stats, c.level) : (skill.flatDamage ?? 0) * c.level;
        if (isCrit) playerDmg *= 2;
        playerHitMsgVerbose = `공격: d20(${d20})${modStr}=${roll} vs AC${enemyAC} → 명중 (피해 ${playerDmg}${isCrit ? ', 치명타' : ''})`;
        playerHitMsg = `공격: 명중 (피해 ${playerDmg}${isCrit ? ', 치명타' : ''})`;

        // 엔진이 적 HP 즉시 차감 & 사망 판정
        const crData = TERRA_NOVA_CREATURES.find(cr => cr.id === primary.id);
        const fallbackHp = crData?.combat?.hp ?? 100;
        let killedCount = 0;
        const updatedEnemies = enemies.map(e => {
          if (e.id !== primary.id) return e;
          const units = (e._units && e._units.length > 0
            ? e._units.map(u => ({...u}))
            : Array.from({length: Math.min(e.count ?? 1, 5)}, () => ({hp: fallbackHp, maxHp: fallbackHp}))
          );
          for (let i = 0; i < units.length; i++) {
            if (units[i].hp > 0) { units[i].hp = Math.max(0, units[i].hp - playerDmg); break; }
          }
          killedCount += units.filter(u => u.hp <= 0).length;
          const alive = units.filter(u => u.hp > 0);
          return {...e, _units: alive, count: alive.length};
        }).filter(e => e.count > 0);
        combatEnemiesRef.current = updatedEnemies;

        const remaining = updatedEnemies.reduce((s, e) => s + e.count, 0);
        const detailParts = updatedEnemies.map(e => {
          const n = CREATURE_IMAGES[e.id]?.ko ?? e.id;
          const hpStr = (e._units ?? []).map((u, i) => `${i+1}:HP${u.hp}/${u.maxHp}`).join(', ');
          return `${n}×${e.count}[${hpStr}]`;
        }).join(' | ');
        enemyStateMsg = killedCount > 0
          ? `${killedCount}마리 사망. 잔존: ${remaining > 0 ? detailParts : '없음'}`
          : `잔존: ${detailParts}`;
      } else {
        playerHitMsgVerbose = `공격: d20(${d20})${modStr}=${roll} vs AC${enemyAC} → 빗나감`;
        playerHitMsg = `공격: 빗나감`;
      }
    } else if (isHealSkill) {
      playerHitMsg = `${skill.name} 시전 (HP ${skill.healAmount} 회복)`;
    } else if (skill.saveCheck && skill.onFailEffect && enemies.length > 0) {
      // ── 저항 판정 스킬 (주화입마 유도, 봉혈, 정신 교란 등) ────────────
      const eff = skill.onFailEffect;
      const targets = eff.target === 'all' ? enemies : [enemies.reduce((best, e) => {
        const ab = TERRA_NOVA_CREATURES.find(cr => cr.id === best.id);
        const ae = TERRA_NOVA_CREATURES.find(cr => cr.id === e.id);
        return (ae?.threat ?? 0) > (ab?.threat ?? 0) ? e : best;
      }, enemies[0])];
      const saveResults = [];
      const updatedEnemies = enemies.map(e => ({...e}));
      for (const target of targets) {
        const cr = TERRA_NOVA_CREATURES.find(c => c.id === target.id);
        const enemyLv = target._rolled_level ?? cr?.level_min ?? 1;
        const saveMod = Math.floor(enemyLv / 4);
        const d20sv = rollD20();
        const roll = d20sv + saveMod;
        const dc = skill.saveCheck.dc;
        const failed = roll < dc;
        const eName = CREATURE_IMAGES[target.id]?.ko ?? target.id;
        const modStr = saveMod >= 0 ? `+${saveMod}` : `${saveMod}`;
        if (failed) {
          const idx = updatedEnemies.findIndex(e => e.id === target.id);
          if (idx >= 0) {
            const existing = updatedEnemies[idx]._statusEffects ?? [];
            updatedEnemies[idx] = {...updatedEnemies[idx], _statusEffects: [
              ...existing.filter(s => s.type !== eff.type),
              { type: eff.type, turnsLeft: eff.turns }
            ]};
          }
          saveResults.push(`${eName} d20(${d20sv})${modStr}=${roll} vs DC${dc} → 저항 실패 → ${eff.type} ${eff.turns}턴`);
        } else {
          saveResults.push(`${eName} d20(${d20sv})${modStr}=${roll} vs DC${dc} → 저항 성공`);
        }
      }
      combatEnemiesRef.current = updatedEnemies;
      playerHitMsgVerbose = saveResults.join(' | ');
      playerHitMsg = `${skill.name} — ${saveResults.map(r => r.includes('실패') ? '저항 실패' : '저항 성공').join(', ')}`;
    } else if (!isAttackSkill) {
      playerHitMsg = `${skill.name} 시전`;
    } else {
      playerHitMsg = `${skill.name} 사용 (적 없음)`;
    }

    // ── 2. 오버라이드 저장 (적 반격은 적의 서브턴에서 별도 처리) ────────
    const isSaveSkill = !!(skill.saveCheck && skill.onFailEffect && !isAttackSkill && !isHealSkill);
    if (isAttackSkill) {
      pendingCombatOverridesRef.current = { hp_delta: (skill.healAmount ?? 0) + buffRegen - hpCost, mp_delta: -mpCost, companion_damages: [], nextActiveBuffs };
    } else if (isHealSkill) {
      pendingCombatOverridesRef.current = { hp_delta: (skill.healAmount ?? 0) + buffRegen - hpCost, mp_delta: -mpCost, companion_damages: [], nextActiveBuffs };
    } else {
      pendingCombatOverridesRef.current = { mp_delta_only: -mpCost, companion_damages: [], buffRegen, hpCost, nextActiveBuffs };
    }

    // ── 3. AI 메시지 구성 ────────────────────────────────────────────────
    const costStr = mpCost > 0 ? ` (MP ${mpCost})` : hpCost > 0 ? ` (HP ${hpCost})` : '';
    const statePart = enemyStateMsg ? ` [적 상태: ${enemyStateMsg}].` : '';

    const engineDetails = [
      playerHitMsgVerbose,
      buffRegen > 0 ? `버프회복:+${buffRegen}HP` : null,
    ].filter(Boolean).join(' | ');
    if (engineDetails) {
      const et = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      setDebugLog(prev => [...prev, { type: 'engine', content: engineDetails, time: et }]);
    }

    const engNote = (isAttackSkill || isHealSkill || isSaveSkill)
      ? 'hp_delta/mp_delta는 엔진이 처리.'
      : 'mp_delta는 엔진이 처리. 스킬 효과에 따른 hp_delta는 자유롭게 반환.';
    const round = combatTurnsRef.current + 1;
    const msg = `[전투 ${round}회 차례, ${jobName}의 행동] '${skill.name}'${costStr} — [엔진 판정] ${playerHitMsg}.${statePart} ${jobName}의 행동만 서술. enemy_attack:"". ${engNote}`;
    isSubTurnActionRef.current = true;
    callGM(msg);
  }

  // ── 기절 중 턴 넘기기 ──────────────────────────────────────────────
  function handleSkipTurn() {
    if (loadingRef.current) return;
    isSubTurnActionRef.current = true;
    pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };
    const round = combatTurnsRef.current + 1;
    callGM(`[전투 ${round}회 차례, 플레이어 기절] HP 0, 행동 불가. 기절 상태를 짧게 서술. enemy_attack:"". hp_delta=0, mp_delta=0.`);
  }

  // ── 도주 시도 (d20 + 민첩 보정 vs DC 12) ──────────────────────────
  function handleFlee() {
    if (loadingRef.current) return;
    const dex = getPlayerDex(charRef.current.stats);
    const dexMod = Math.floor((dex - 10) / 2);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const roll = d20 + dexMod;
    const dc = 12;
    const dexModStr = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`;
    if (roll >= dc) {
      inCombatRef.current = false;
      setInCombat(false);
      combatTurnsRef.current = 0;
      setCombatTurns(0);
      clearAdvanceTimer(); setPendingAdvance(false);
      callGM(`[도주 성공 — d20(${d20})${dexModStr}=${roll} ≥ DC${dc}] 전장에서 빠져나왔습니다. enemies:[] 전투 종료. 이후 상황을 서술해 주세요.`);
    } else {
      isSubTurnActionRef.current = true;
      pendingCombatOverridesRef.current = { hp_delta: 0, mp_delta: 0, companion_damages: [] };
      const round = combatTurnsRef.current + 1;
      callGM(`[도주 실패 — d20(${d20})${dexModStr}=${roll} < DC${dc}, 전투 ${round}회 차례] 도주를 시도했으나 실패. 이 행동만 서술. enemy_attack:"". hp_delta=0, mp_delta=0.`);
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

      {/* 재료·제작 버튼 바 */}
      <div className="craft-bar">
        <button className={`craft-btn${showInventory?' active':''}`}
          onClick={() => { setShowInventory(v => !v); setShowCrafting(false); }}>
          재료
        </button>
        <button className={`craft-btn${showCrafting?' active':''}`}
          onClick={() => { setShowCrafting(v => !v); setShowInventory(false); }}>
          제작
        </button>
      </div>

      {/* 재료 인벤토리 패널 */}
      {showInventory && (
        <div className="inventory-panel">
          <div className="inv-title">보유 재료</div>
          {Object.keys(char.materials ?? {}).length === 0
            ? <div className="inv-empty">재료 없음</div>
            : MATERIALS.filter(m => (char.materials?.[m.id] ?? 0) > 0).map(m => (
              <div key={m.id} className="inv-row">
                <span className={`inv-rarity rarity-${m.rarity}`}>{m.rarity}</span>
                <span className="inv-name">{m.name.ko}</span>
                <span className="inv-qty">×{char.materials[m.id]}</span>
              </div>
            ))
          }
        </div>
      )}

      {/* 제작 화면 */}
      {showCrafting && (
        <div className="crafting-panel">
          <div className="inv-title">전초기지 제작</div>
          {RECIPES.map(recipe => {
            const item = CRAFTABLE_ITEMS.find(it => it.id === recipe.item_id);
            if (!item) return null;
            const canCraft = recipe.materials.every(
              m => (char.materials?.[m.id] ?? 0) >= m.qty
            );
            return (
              <div key={recipe.id} className={`recipe-row${canCraft?' craftable':''}`}>
                <div className="recipe-header">
                  <span className={`inv-rarity rarity-${item.tier}`}>{item.tier}</span>
                  <span className="recipe-name">{item.name}</span>
                  <span className="recipe-slot">{item.slot}</span>
                  {canCraft && (
                    <button className="craft-exec-btn" onClick={() => executeCraft(recipe)}>제작</button>
                  )}
                </div>
                <div className="recipe-mats">
                  {recipe.materials.map(m => {
                    const mat = getMaterial(m.id);
                    const have = char.materials?.[m.id] ?? 0;
                    return (
                      <span key={m.id} className={`recipe-mat${have >= m.qty ? ' have' : ' need'}`}>
                        {mat?.name.ko ?? m.id} {have}/{m.qty}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
              if (item.type === 'drops') return <p key={i} className="drops-notice">{item.text}</p>;
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
                      {s.combat&&<><br/>
                        {s.unitHps?.length > 0
                          ? s.unitHps.length <= 3
                            ? `체력 ${s.unitHps.map(u=>`${u.hp}/${u.maxHp}`).join(' · ')}`
                            : `체력 ${Math.min(...s.unitHps.map(u=>u.hp))}~${Math.max(...s.unitHps.map(u=>u.hp))}/${s.combat.hp} ×${s.unitHps.length}`
                          : `체력 ${s.combat.hp}`
                        } · 마나 {s.combat.mp??0} · ATK {s.combat.atk} · AC {s.combat.ac??'?'}
                      </> }
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
      {inCombat && (() => {
        const isPlayerTurn = turnStripOrder[subTurnIdx]?.type === 'player';
        const currentName = turnStripOrder[subTurnIdx]?.name ?? '...';
        return (
          <div className="combat-panel">
            <div className="combat-turn-info">
              <span>⚔ 전투 {combatTurns + 1}회 차례 — {isPlayerTurn ? '플레이어 행동' : `${currentName} 행동 중`}</span>
              {combatTurns >= 9 && <span className="combat-warn"> (10회 차례 후 강제 도주 굴림)</span>}
              <button className="companion-mode-btn" onClick={toggleCompanionMode}>
                동료: {companionAutoMode ? 'AI 자동' : '수동 조종'}
              </button>
            </div>
            {pendingAdvance ? (
              <div className="combat-advance">
                <button className="combat-advance-btn" onClick={handleAdvanceNow}>
                  다음 ▶ <span className="advance-countdown">{countdownSec}초</span>
                </button>
              </div>
            ) : isPlayerTurn ? (
              char.hp <= 0 ? (
                <div className="combat-unconscious">
                  <div className="combat-unconscious-msg">⚠ 기절 상태 — 행동 불가</div>
                  <button className="skill-btn unconscious" disabled={isLoading} onClick={handleSkipTurn}>
                    턴 넘기기 (기절 중)
                  </button>
                </div>
              ) : (
                <div className="combat-skills">
                  {JOB_BASIC_ATTACK[char.job] && (() => {
                    const ba = JOB_BASIC_ATTACK[char.job];
                    return (
                      <button key="basic" className="skill-btn basic"
                        disabled={isLoading} onClick={() => handleCombatSkill(ba)} title={ba.effect}>
                        <span className="skill-name">⚔ {ba.name}</span>
                      </button>
                    );
                  })()}
                  {getAvailableSkills(char.job, char.level).filter(s => !s.passive).map(s => {
                    const mpCost = s.cost?.mp ?? 0;
                    const hpCost = s.cost?.hp ?? 0;
                    const noMp = mpCost > 0 && char.mp < mpCost;
                    const noHp = hpCost > 0 && char.hp <= hpCost;
                    return (
                      <button key={s.name}
                        className={`skill-btn${noMp || noHp ? ' disabled' : ''}`}
                        disabled={isLoading || noMp || noHp}
                        onClick={() => handleCombatSkill(s)} title={s.effect}>
                        <span className="skill-name">{s.name}</span>
                        {mpCost > 0 && <span className="skill-cost">MP {mpCost}</span>}
                        {hpCost > 0 && <span className="skill-cost">HP {hpCost}</span>}
                      </button>
                    );
                  })}
                  {(char.items ?? []).flatMap(item =>
                    item.skill && !item.skill.passive ? [item.skill] : []
                  ).map(s => {
                    const mpCost = s.cost?.mp ?? 0;
                    const hpCost = s.cost?.hp ?? 0;
                    const noMp = mpCost > 0 && char.mp < mpCost;
                    const noHp = hpCost > 0 && char.hp <= hpCost;
                    return (
                      <button key={`item-${s.name}`}
                        className={`skill-btn item${noMp || noHp ? ' disabled' : ''}`}
                        disabled={isLoading || noMp || noHp}
                        onClick={() => handleCombatSkill(s)} title={s.effect}>
                        <span className="skill-name">◈ {s.name}</span>
                        {mpCost > 0 && <span className="skill-cost">MP {mpCost}</span>}
                        {hpCost > 0 && <span className="skill-cost">HP {hpCost}</span>}
                      </button>
                    );
                  })}
                  <button className="skill-btn flee" disabled={isLoading} onClick={handleFlee}>
                    🏃 도주
                  </button>
                </div>
              )
            ) : pendingCompanionTurn ? (
              <div className="combat-companion-turn">
                <div className="combat-companion-header">{pendingCompanionTurn.name}의 행동 선택</div>
                <div className="combat-skills">
                  <button className="skill-btn basic" disabled={isLoading} onClick={handleCompanionManualAttack}>
                    <span className="skill-name">⚔ 기본 공격</span>
                  </button>
                  <button className="skill-btn flee" disabled={isLoading} onClick={handleCompanionManualSkip}>
                    <span className="skill-name">🛡 방어 (턴 넘기기)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="combat-npc-turn">
                <div className="combat-npc-msg">{isLoading ? `${currentName}의 행동 처리 중...` : `${currentName}의 차례`}</div>
              </div>
            )}
            <div className="combat-hint">스킬을 클릭하거나 아래 입력창에 직접 행동을 입력하세요</div>
          </div>
        );
      })()}

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

      {/* 게임 오버 오버레이 */}
      {gameOver && (
        <div className="ending-overlay show">
          <div className="ending-ascii">{`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░   G A M E   O V E R                  ░░
░░   FIVE CONTINENTS CHRONICLES         ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</div>
          <div className="ending-title">게임 오버</div>
          <div className="ending-sub">GAME OVER</div>
          <div className="ending-text">{gameOverReason}</div>
          <button className="ending-btn" onClick={onRestart}>처음부터</button>
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

      {/* 임시 AI 통신 로그 패널 */}
      <div className="debug-panel">
        <div className="debug-header">
          <span>AI 통신 로그</span>
          <button className="debug-clear" onClick={() => setDebugLog([])}>지우기</button>
        </div>
        <div className="debug-scroll" ref={debugScrollRef}>
          {debugLog.map((e, i) => (
            <div key={i} className={`debug-entry debug-${e.type}`}>
              <div className="debug-meta">
                <span className="debug-time">{e.time}</span>
                <span className="debug-dir">{e.type === 'sent' ? '▶ 송신' : e.type === 'engine' ? '⚙ 엔진' : '◀ 수신'}</span>
              </div>
              <pre className="debug-content">{e.content}</pre>
            </div>
          ))}
          {debugLog.length === 0 && <div className="debug-empty">대화 없음</div>}
        </div>
      </div>
    </div>
  );
}
