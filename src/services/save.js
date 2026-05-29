import { saveToFirestore, loadFromFirestore, loadSaveListFromFirestore } from './firebase.js';

export const SAVE_VERSION = 1;

// 고유 게임 ID 생성 (예: "1K3MABC4")
export function generateGameId() {
  return Date.now().toString(36).toUpperCase().slice(-4) +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

// ── localStorage 헬퍼 ─────────────────────────────────────────────────
function lsIndexKey()       { return 'fcc_saves_index'; }
function lsSlotKey(gameId)  { return `fcc_save_${gameId}`; }

function loadIndex() {
  try { return JSON.parse(localStorage.getItem(lsIndexKey()) || '[]'); } catch { return []; }
}

function upsertIndex(meta) {
  const idx = loadIndex().filter(x => x.gameId !== meta.gameId);
  idx.unshift(meta);
  try { localStorage.setItem(lsIndexKey(), JSON.stringify(idx.slice(0, 30))); } catch {}
}

function saveLocalSlot(gameId, data) {
  try { localStorage.setItem(lsSlotKey(gameId), JSON.stringify(data)); } catch {}
}

function loadLocalSlot(gameId) {
  try {
    const r = localStorage.getItem(lsSlotKey(gameId));
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

// ── 마이그레이션 ──────────────────────────────────────────────────────
// 새 버전 추가 시: if (v < N) { ... } 블록만 append
function migrate(data) {
  if (!data) return null;
  const v = data.saveVersion ?? 0;

  if (v < 1) {
    const gs = data.gameState ?? {};
    gs.storyChapter ??= 1;
    gs.chapterTurns ??= 0;
    gs.companions   ??= [];
    gs.status       ??= [];
    gs.mp           ??= gs.maxMp ?? 0;
    gs.materials    ??= {};
    data.gameState   = gs;
    data.saveVersion = 1;
  }

  return data;
}

// ── 공개 API ──────────────────────────────────────────────────────────

export async function saveGame(uid, gameId, char, history, chapterLabel) {
  const data = {
    saveVersion: SAVE_VERSION,
    gameId,
    character: { lang: char.lang, cont: char.cont, job: char.job, stats: char.stats },
    gameState: {
      hp: char.hp, maxHp: char.maxHp, mp: char.mp, maxMp: char.maxMp,
      level: char.level, xp: char.xp, status: char.status, companions: char.companions,
      storyChapter: char.storyChapter, chapterTurns: char.chapterTurns,
      materials: char.materials ?? {},
      activeBuffs: char.activeBuffs ?? [],
    },
    chapter: chapterLabel,
    history: history.slice(-10),
    savedAt: Date.now(),
    turns:   history.length,
  };

  const meta = {
    gameId,
    cont:    char.cont,
    job:     char.job,
    chapter: chapterLabel,
    level:   char.level,
    turns:   history.length,
    savedAt: data.savedAt,
  };

  saveLocalSlot(gameId, data);
  upsertIndex(meta);

  if (uid) await saveToFirestore(uid, gameId, data);
  return data;
}

export async function loadSave(uid, gameId) {
  if (uid && gameId) {
    try {
      const d = await loadFromFirestore(uid, gameId);
      if (d) return migrate(d);
    } catch {}
  }
  return migrate(loadLocalSlot(gameId));
}

// 저장된 게임 목록 반환 (최신순)
export async function loadSaveList(uid) {
  if (uid) {
    try {
      const list = await loadSaveListFromFirestore(uid);
      return list.sort((a, b) => {
        const ta = a.savedAt?.seconds ? a.savedAt.seconds * 1000 : (a.savedAt ?? 0);
        const tb = b.savedAt?.seconds ? b.savedAt.seconds * 1000 : (b.savedAt ?? 0);
        return tb - ta;
      });
    } catch {}
  }
  return loadIndex();
}
