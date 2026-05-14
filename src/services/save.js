import { saveToFirestore, loadFromFirestore } from './firebase.js';

export const SAVE_VERSION = 1;

function lsKey(cont, job) { return `fcc_save_${cont}_${job}`; }

function saveLocal(cont, job, data) {
  try { localStorage.setItem(lsKey(cont, job), JSON.stringify(data)); } catch(e) {}
}

function loadLocal(cont, job) {
  try {
    const r = localStorage.getItem(lsKey(cont, job));
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}

// 구버전 세이브 → 현재 스키마로 변환
// 새 버전 추가 시: if (v < N) { ... } 블록만 append
function migrate(data) {
  if (!data) return null;
  const v = data.saveVersion ?? 0;

  if (v < 1) {
    // v0(버전 필드 없음) → v1: 누락 가능한 필드에 안전한 기본값 보장
    const gs = data.gameState ?? {};
    gs.storyChapter  ??= 1;
    gs.chapterTurns  ??= 0;
    gs.companions    ??= [];
    gs.status        ??= [];
    gs.mp            ??= gs.maxMp ?? 0;
    data.gameState    = gs;
    data.saveVersion  = 1;
  }

  return data;
}

export async function saveGame(uid, char, history, chapterLabel) {
  const data = {
    saveVersion: SAVE_VERSION,
    character: { lang: char.lang, cont: char.cont, job: char.job, stats: char.stats },
    gameState: {
      hp: char.hp, maxHp: char.maxHp, mp: char.mp, maxMp: char.maxMp,
      level: char.level, xp: char.xp, status: char.status, companions: char.companions,
      storyChapter: char.storyChapter, chapterTurns: char.chapterTurns,
    },
    chapter:  chapterLabel,
    history:  history.slice(-10),
    savedAt:  Date.now(),
    turns:    history.length,
  };
  saveLocal(char.cont, char.job, data);
  if (uid) {
    await saveToFirestore(uid, data);
  }
  return data;
}

export async function loadSave(uid, cont, job) {
  if (uid) {
    try {
      const d = await loadFromFirestore(uid);
      if (d) return migrate(d);
    } catch(e) {}
  }
  return migrate(loadLocal(cont, job));
}
