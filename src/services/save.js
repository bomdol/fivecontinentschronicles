import { saveToFirestore, loadFromFirestore } from './firebase.js';

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

export async function saveGame(uid, char, history, chapterLabel) {
  const data = {
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
      if (d) return d;
    } catch(e) {}
  }
  return loadLocal(cont, job);
}
