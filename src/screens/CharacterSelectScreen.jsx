import React, { useState, useEffect } from 'react';
import { LANGS, CONTS, JOBS, JOB_IMAGES, SN, SL, INIT_POOL, MAX_D, getUI, scaleBase, jobBase } from '../data/constants.js';
import { onAuthChange, signInWithGoogle, signOutUser } from '../services/firebase.js';
import { loadSaveList, loadSave } from '../services/save.js';

function L(obj, lang) {
  return typeof obj === 'object' ? (obj[lang] || obj.ko || obj.en || Object.values(obj)[0]) : obj;
}

function finalVal(base, delta, bonus) {
  return Math.min(20, Math.max(1, base + delta + (bonus || 0)));
}

function barColor(fv) {
  return fv >= 15 ? '#c8b97a' : fv >= 12 ? '#8a7e52' : '#4a4428';
}

export default function CharacterSelectScreen({ onStart }) {
  const [screen, setScreen] = useState(0);
  const [lang, setLang]     = useState('ko');
  const [cont, setCont]     = useState(null);
  const [job, setJob]       = useState(null);
  const [pool, setPool]     = useState(INIT_POOL);
  const [delta, setDelta]   = useState(() => { const d = {}; SN.forEach(s => d[s] = 0); return d; });

  const [uid, setUid]                     = useState(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveList, setSaveList]           = useState([]);

  useEffect(() => {
    const unsub = onAuthChange(user => setUid(user?.uid || null));
    return unsub;
  }, []);

  const t = getUI(lang);

  async function handleOpenLoad() {
    const list = await loadSaveList(uid);
    setSaveList(list);
    setShowLoadModal(true);
  }

  async function handleSelectSave(meta) {
    const save = await loadSave(uid, meta.gameId);
    if (!save?.character) return;
    setShowLoadModal(false);
    onStart({ ...save.character, _resume: save, _gameId: save.gameId });
  }

  function resetStat() {
    const d = {}; SN.forEach(s => d[s] = 0);
    setDelta(d);
    setPool(INIT_POOL);
  }

  function handleCont(id) { setCont(id); setJob(null); resetStat(); }
  function handleJob(id)  { setJob(id);  resetStat(); }

  function handleUp(s) {
    if (delta[s] >= MAX_D || pool <= 0) return;
    setDelta(d => ({...d, [s]: d[s] + 1}));
    setPool(p => p - 1);
  }
  function handleDn(s) {
    if (delta[s] <= -MAX_D) return;
    setDelta(d => ({...d, [s]: d[s] - 1}));
    setPool(p => p + 1);
  }

  function handleStart() {
    const cb = CONTS.find(c => c.id === cont)?.bonus || {};
    const base = jobBase(cont, job) || {};
    const statStr = SN.map(s => {
      const fv = finalVal(base[s] || 10, delta[s], cb[s] || 0);
      return `${s} ${fv}`;
    }).join(', ');
    onStart({ lang, cont, job, stats: statStr });
  }

  // ── 화면 0: 언어 선택 ────────────────────────────────────────────────
  if (screen === 0) return (
    <div className="root">
      <div className="lang-screen">
        <div className="game-logo">오 대 륙 전 기</div>
        <div className="game-sub">{t.langSel.toUpperCase()}</div>
        <div className="lang-grid">
          {LANGS.map(l => (
            <div
              key={l.code}
              className={`lcard${l.builtin ? ' builtin' : ''}${lang === l.code ? ' sel' : ''}`}
              onClick={() => setLang(l.code)}
            >
              <div className="lflag">{l.flag}</div>
              <div className="lnative">{l.native}</div>
              <div className="lname-small">{l.name}</div>
              <div><span className={`lbadge ${l.builtin ? 'badge-b' : 'badge-a'}`}>{l.builtin ? '✓' : 'AI'}</span></div>
            </div>
          ))}
        </div>
        <div className="lang-notice">✓ 내장 — UI 완전 번역 | AI — 게임 스토리만 해당 언어로</div>
        <div className="nav">
          <span />
          <button className="nbtn p" onClick={() => setScreen(1)}>{t.langConfirm}</button>
        </div>
      </div>
    </div>
  );

  // ── 화면 1: 인트로 ───────────────────────────────────────────────────
  if (screen === 1) return (
    <div className="root">
      <div className="intro-screen">
        <pre className="ascii-art">{`    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░  ~~~~  다섯 땅, 하나의 운명  ~~~~  ░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

          /\\  *  /\\
         /  \\/\\/  \\
        /   TERRA   \\
    ~~~/ ___NOVA___ \\~~~
       |✦ |⚙|彡|◎|
       |MA|SC|WX|PS|
        ~~~~~~~~~~~~~~`}</pre>
        <div className="intro-title">{t.title}</div>
        <div className="intro-sub">{t.sub}</div>
        <div className="intro-divider" />
        <div className="intro-lore" dangerouslySetInnerHTML={{__html: t.lore.replace(/\n/g,'<br>')}} />
        <div style={{display:'flex', gap:'12px', justifyContent:'center'}}>
          <button className="intro-btn" onClick={() => setScreen(2)}>{t.startBtn}</button>
          <button className="intro-btn" onClick={handleOpenLoad}>불러오기</button>
        </div>

        <div className="intro-auth">
          {uid
            ? <>
                <span className="intro-auth-name">✓ 로그인됨</span>
                <button className="auth-btn" onClick={() => signOutUser()}>로그아웃</button>
              </>
            : <>
                <span className="intro-auth-hint">로그인하면 다른 기기에서도 이어서 플레이할 수 있습니다</span>
                <button className="auth-btn" onClick={() => signInWithGoogle()}>Google 로그인</button>
              </>
          }
        </div>
      </div>

      {showLoadModal && (
        <div className="load-modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="load-modal" onClick={e => e.stopPropagation()}>
            <div className="load-modal-title">저장된 게임 목록</div>
            {saveList.length === 0
              ? <div className="load-modal-empty">저장된 게임이 없습니다.</div>
              : <div className="load-modal-list">
                  {saveList.map(s => {
                    const savedAt = s.savedAt?.seconds
                      ? new Date(s.savedAt.seconds * 1000)
                      : new Date(s.savedAt ?? 0);
                    const dateStr = savedAt.toLocaleDateString('ko-KR', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
                    return (
                      <div key={s.gameId} className="load-slot" onClick={() => handleSelectSave(s)}>
                        <div className="load-slot-id">#{s.gameId}</div>
                        <div className="load-slot-info">
                          <span className="load-slot-chapter">{s.chapter || '진행 중'}</span>
                          <span className="load-slot-meta">Lv.{s.level ?? '?'} · {s.turns ?? 0}턴</span>
                        </div>
                        <div className="load-slot-date">{dateStr}</div>
                      </div>
                    );
                  })}
                </div>
            }
            <button className="load-modal-close" onClick={() => setShowLoadModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );

  // ── 화면 2: 대륙 선택 ───────────────────────────────────────────────
  if (screen === 2) return (
    <div className="root">
      <div className="char-screen">
        <div className="step-header">
          <div className="step-label">STEP 1 / 3</div>
          <div className="step-title">{t.s1}</div>
          <div className="dots">
            {[0,1,2].map(i => <div key={i} className={`dot${i===0?' on':''}`} />)}
          </div>
        </div>
        <div className="cont-wrap">
          {CONTS.map(c => (
            <div
              key={c.id}
              className={`card${cont === c.id ? ' sel' : ''}`}
              onClick={() => handleCont(c.id)}
            >
              <div className="ci">{c.icon}</div>
              <div className="cn">{L(c.name, lang)}</div>
              <div className="cf">{c.flavor}</div>
              <div className="cd">{L(c.desc, lang)}</div>
              <div className="ctags">
                {L(c.tags, lang).map((tag, i) => <span key={i} className="ctag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="nav">
          <button className="nbtn" onClick={() => setScreen(1)}>{t.back}</button>
          <button className={`nbtn p${!cont ? ' off' : ''}`} onClick={() => cont && setScreen(3)}>{t.next}</button>
        </div>
      </div>
    </div>
  );

  // ── 화면 3: 직업 선택 ───────────────────────────────────────────────
  if (screen === 3) {
    const selJ = job ? (JOBS[cont] || []).find(j => j.id === job) : null;
    return (
      <div className="root">
        <div className="char-screen">
          <div className="step-header">
            <div className="step-label">STEP 2 / 3</div>
            <div className="step-title">{t.s2}</div>
            <div className="dots">
              {[0,1,2].map(i => <div key={i} className={`dot${i===1?' on':i<1?' done':''}`} />)}
            </div>
          </div>
          <div className="job-wrap">
            {(JOBS[cont] || []).map(j => {
              const mini = Object.entries(j.s).slice(0,4).map(([k,v]) => (
                <div key={k} className="smr">
                  <span className="sml">{k}</span>
                  <div className="smt"><div className="smf" style={{width:`${v}%`}} /></div>
                </div>
              ));
              return (
                <div
                  key={j.id}
                  className={`card${job === j.id ? ' sel' : ''}`}
                  onClick={() => handleJob(j.id)}
                >
                  <div className="jasc">{j.asc}</div>
                  <div>
                    {j.sp ? <div className="sp-badge">✦ {L({ko:'특수',en:'Special',zh:'特殊',ja:'特殊',vi:'Đặc biệt'}, lang)}</div> : null}
                    <div className="jr">{L(j.role, lang)}</div>
                    <div className="jn">{L(j.name, lang)}</div>
                    <div className="jd">{L(j.desc, lang)}</div>
                  </div>
                  <div>{mini}</div>
                </div>
              );
            })}
          </div>

          {selJ && (() => {
            const imgSrc = JOB_IMAGES[selJ.id];
            const topStats = Object.entries(selJ.s).sort((a,b)=>b[1]-a[1]).slice(0,3)
              .map(([k,v]) => <span key={k} className="jp-stat-tag">{k} {scaleBase(v)}</span>);
            return (
              <div className="job-preview">
                <div className="jp-img">
                  {imgSrc
                    ? <img src={`/${imgSrc}`} alt={L(selJ.name,lang)} style={{width:'110px',height:'150px',objectFit:'cover',objectPosition:'top center',display:'block'}} onError={e=>e.target.style.opacity='0'} />
                    : <div className="jp-asc" dangerouslySetInnerHTML={{__html:selJ.asc.replace(/\n/g,'<br>')}} />
                  }
                </div>
                <div className="jp-info">
                  <div className="jp-role-tag">{L(selJ.role,lang)}</div>
                  <div className="jp-name">{L(selJ.name,lang)}</div>
                  <div className="jp-desc">{L(selJ.desc,lang)}</div>
                  <div className="jp-topstats">{topStats}</div>
                </div>
              </div>
            );
          })()}

          <div className="nav">
            <button className="nbtn" onClick={() => setScreen(2)}>{t.back}</button>
            <button className={`nbtn p${!job ? ' off' : ''}`} onClick={() => { if(job) { resetStat(); setScreen(4); } }}>{t.next}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 화면 4: 능력치 조정 ─────────────────────────────────────────────
  const cb = CONTS.find(c => c.id === cont)?.bonus || {};
  const base = jobBase(cont, job) || {};
  const cobj = CONTS.find(c => c.id === cont);
  const jobj = JOBS[cont]?.find(j => j.id === job);

  return (
    <div className="root">
      <div className="char-screen">
        <div className="step-header">
          <div className="step-label">STEP 3 / 3</div>
          <div className="step-title">{t.s3}</div>
          <div className="dots">
            {[0,1,2].map(i => <div key={i} className={`dot${i===2?' on':' done'}`} />)}
          </div>
        </div>
        <div className="pool-banner">
          <div>
            <div className="pool-num">{pool}</div>
            <div className="pool-lbl">{t.pool}</div>
          </div>
          <div className="pool-rule">{t.maxDelta} <b>±{MAX_D}</b><br />{t.poolRule}</div>
        </div>
        <div className="stat-rows">
          {SN.map(s => {
            const d = delta[s];
            const bv = base[s] || 10;
            const bon = cb[s] || 0;
            const fv = finalVal(bv, d, bon);
            const mod = Math.floor((fv-10)/2);
            const ms = mod >= 0 ? `+${mod}` : `${mod}`;
            const barPct = Math.round((fv/20)*100);
            const canUp = d < MAX_D && pool > 0;
            const canDn = d > -MAX_D;
            return (
              <div key={s} className="srow">
                <div className="srow-name">{s}<span className="srow-eng">{SL[s]}</span></div>
                <div className="srow-bar-wrap">
                  <div className="srow-bar-fill" style={{width:`${barPct}%`,background:barColor(fv)}} />
                </div>
                <button className="srow-btn" onClick={() => handleDn(s)} disabled={!canDn}>−</button>
                <div className="srow-mid">
                  <div className="srow-val">
                    {fv}
                    {d > 0 && <span className="srow-delta delta-up"> +{d}</span>}
                    {d < 0 && <span className="srow-delta delta-dn"> {d}</span>}
                  </div>
                  <div className="srow-base">기본 {bv}</div>
                </div>
                <button className="srow-btn" onClick={() => handleUp(s)} disabled={!canUp}>+</button>
                <div className="srow-right">
                  <span className="tag-mod">{t.modLabel} {ms}</span>
                  {bon > 0 && <span className="tag-bon">{t.bonLabel} +{bon}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="summary-box">
          대륙: <b>{L(cobj?.name, lang)}</b> | 직업: <b>{L(jobj?.name, lang)}</b><br />
          {pool > 0 ? `${t.sumMore} ${pool}${t.sumLeft}` : t.sumDone}
        </div>
        <div className="nav">
          <button className="nbtn" onClick={() => setScreen(3)}>{t.back}</button>
          <button className="nbtn p" onClick={handleStart}>{t.statStart}</button>
        </div>
      </div>
    </div>
  );
}
