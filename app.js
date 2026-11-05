(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = { get(k, d) { try { const v = localStorage.getItem('enemturbo:' + k); return v ? JSON.parse(v) : d } catch (e) { return d } },
             set(k, v) { try { localStorage.setItem('enemturbo:' + k, JSON.stringify(v)) } catch (e) {} } };
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800) }
function show(id) { ['loading', 'auth', 'home'].forEach(x => $('#' + x).hidden = x !== id) }

const FLAT = []; TRAIL.forEach((d, di) => d.items.forEach(it => { it.day = di; FLAT.push(it) }));
const blank = () => ({ name: '', done: {}, bag: {}, pi: {}, checks: {}, updatedAt: 0 });

/* ================= armazenamento: nuvem (Firebase) ou local ================= */
const CFG = window.FIREBASE_CONFIG || {};
const CLOUD = !!(CFG.apiKey && CFG.projectId);
let S = blank(), USER = null, saveTimer = null, fb = null;

function loadScript(src) { return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s) }) }

function save() {
  S.updatedAt = Date.now();
  ls.set('cache:' + USER.id, S);
  if (!CLOUD) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fb.db.collection('enemTurbo').doc(USER.id).set(S).then(() => setSync('Progresso salvo na nuvem ☁️'))
      .catch(() => setSync('Sem internet: salvo no aparelho, sincroniza depois'));
  }, 700);
}
function setSync(t) { const el = $('#syncinfo'); if (el) el.textContent = t }

async function bootCloud() {
  const V = '10.12.2';
  try {
    await loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-app-compat.js`);
    await Promise.all([loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-auth-compat.js`), loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore-compat.js`)]);
  } catch (e) {
    // sem internet na primeira abertura: usa o último usuário salvo
    const last = ls.get('lastUser', null);
    if (last) { USER = last; S = Object.assign(blank(), ls.get('cache:' + last.id, {})); startApp(); setSync('Sem internet: usando o progresso salvo no aparelho'); return }
    show('auth'); $('#cloudform').hidden = false; authErr('Sem internet. Conecte-se para entrar a primeira vez.'); return;
  }
  firebase.initializeApp(CFG);
  fb = { auth: firebase.auth(), db: firebase.firestore() };
  fb.auth.onAuthStateChanged(async u => {
    if (!u) { USER = null; show('auth'); $('#cloudform').hidden = false; return }
    USER = { id: u.uid, name: u.displayName || (u.email || '').split('@')[0] };
    ls.set('lastUser', USER);
    const local = Object.assign(blank(), ls.get('cache:' + u.uid, {}));
    let remote = null;
    try { const snap = await fb.db.collection('enemTurbo').doc(u.uid).get(); if (snap.exists) remote = Object.assign(blank(), snap.data()) } catch (e) {}
    S = remote && remote.updatedAt >= local.updatedAt ? remote : local;
    if (!S.name) S.name = USER.name;
    if (pendingName) { S.name = pendingName; pendingName = null }
    USER.name = S.name;
    ls.set('cache:' + u.uid, S);
    if (!remote || local.updatedAt > remote.updatedAt) save();
    startApp();
    setSync(remote ? 'Progresso sincronizado ☁️' : 'Conta pronta. Seu progresso fica salvo na nuvem ☁️');
  });
}

/* --- formulário de login (nuvem) --- */
let mode = 'in', pendingName = null;
function authErr(m) { const e = $('#a-err'); e.textContent = m; e.hidden = !m }
function setMode(m) {
  mode = m; $('#seg-in').setAttribute('aria-pressed', m === 'in'); $('#seg-up').setAttribute('aria-pressed', m === 'up');
  $('#a-name-wrap').hidden = m === 'in'; $('#a-go').textContent = m === 'in' ? 'Entrar' : 'Criar conta e começar';
  $('#a-pass').autocomplete = m === 'in' ? 'current-password' : 'new-password'; $('#a-forgot').hidden = m === 'up'; authErr('');
}
const AUTH_MSG = {
  'auth/invalid-credential': 'E-mail ou senha errados.', 'auth/wrong-password': 'Senha errada.', 'auth/user-not-found': 'Não achei conta com esse e-mail. Toque em "Criar conta".',
  'auth/email-already-in-use': 'Esse e-mail já tem conta. Toque em "Entrar".', 'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'Esse e-mail não parece certo. Confira.', 'auth/network-request-failed': 'Sem internet. Tente de novo.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco e tente de novo.', 'auth/operation-not-allowed': 'O login por e-mail ainda não foi ativado no Firebase.'
};
$('#seg-in').onclick = () => setMode('in'); $('#seg-up').onclick = () => setMode('up');
$('#cloudform').onsubmit = async e => {
  e.preventDefault(); if (!fb) return;
  const email = $('#a-email').value.trim(), pass = $('#a-pass').value, name = $('#a-name').value.trim();
  if (mode === 'up' && !name) return authErr('Escreva seu nome.');
  if (!email || !pass) return authErr('Preencha e-mail e senha.');
  $('#a-go').disabled = true; authErr('');
  try {
    if (mode === 'up') { pendingName = name; const c = await fb.auth.createUserWithEmailAndPassword(email, pass); await c.user.updateProfile({ displayName: name }) }
    else await fb.auth.signInWithEmailAndPassword(email, pass);
  } catch (err) { pendingName = null; authErr(AUTH_MSG[err.code] || 'Não deu certo. Tente de novo.') }
  $('#a-go').disabled = false;
};
$('#a-forgot').onclick = async () => {
  const email = $('#a-email').value.trim(); if (!email) return authErr('Escreva seu e-mail acima e toque de novo em "Esqueci minha senha".');
  try { await fb.auth.sendPasswordResetEmail(email); authErr(''); toast('Enviei um link para ' + email) } catch (err) { authErr(AUTH_MSG[err.code] || 'Não consegui enviar. Confira o e-mail.') }
};

/* --- modo local (sem Firebase) --- */
function bootLocal() {
  let profiles = ls.get('profiles', []);
  const cur = profiles.find(p => p.id === ls.get('current', null));
  if (cur) { USER = { id: 'u:' + cur.id, name: cur.name, emoji: cur.emoji }; S = Object.assign(blank(), ls.get('cache:' + USER.id, {})); S.name = cur.name; startApp(); setSync('Modo local: progresso salvo só neste aparelho'); return }
  show('auth'); $('#localbox').hidden = false;
  const EMO = ['🦄', '🌻', '🚀', '🐱', '🔥', '🌈', '🎧', '🦋']; let pick = EMO[profiles.length % EMO.length], sel = null;
  const enter = p => { ls.set('current', p.id); location.reload() };
  function draw() {
    $('#plist').innerHTML = profiles.length ? profiles.map(p => `<button class="prof sticker" data-id="${p.id}"><span class="pe">${p.emoji}</span><span>${esc(p.name)}</span>${p.pin ? '<small>🔒</small>' : ''}</button>`).join('') : '<p class="muted" style="margin:0;font-weight:700">Ninguém por aqui ainda. Crie o primeiro perfil abaixo.</p>';
    document.querySelectorAll('.prof').forEach(b => b.onclick = () => { const p = profiles.find(x => x.id === b.dataset.id); if (!p.pin) return enter(p); sel = p; $('#pinbox').hidden = false; $('#pin-name').textContent = p.name; $('#pin-in').value = ''; $('#pin-err').hidden = true; $('#pin-in').focus() });
    $('#emos').innerHTML = EMO.map(e => `<button type="button" class="emo" aria-pressed="${e === pick}">${e}</button>`).join('');
    document.querySelectorAll('.emo').forEach(b => b.onclick = () => { pick = b.textContent; draw() });
  }
  $('#pin-go').onclick = () => { if ($('#pin-in').value === sel.pin) enter(sel); else { $('#pin-err').hidden = false; $('#pin-in').value = '' } };
  $('#pin-in').onkeydown = e => { if (e.key === 'Enter') $('#pin-go').click() };
  $('#pin-cancel').onclick = () => $('#pinbox').hidden = true;
  $('#newform').onsubmit = e => {
    e.preventDefault(); const name = $('#np-name').value.trim(), pin = $('#np-pin').value.trim(), er = $('#np-err');
    if (!name) { er.textContent = 'Escreva um nome.'; er.hidden = false; return }
    if (pin && !/^\d{4}$/.test(pin)) { er.textContent = 'A senha precisa ter 4 números (ou deixe em branco).'; er.hidden = false; return }
    const p = { id: Date.now().toString(36), name: name.slice(0, 20), emoji: pick, pin: pin || null }; profiles.push(p); ls.set('profiles', profiles); enter(p);
  };
  draw();
}

$('#logout').onclick = () => { if (CLOUD && fb) { fb.auth.signOut(); ls.set('lastUser', null) } else { ls.set('current', null); location.reload() } };

/* ================= progresso / XP ================= */
const isDone = it => !!(S.done[it.id] && !S.done[it.id].skipped);
const PASS = .6;
const needed = it => Math.ceil(qCount(it) * PASS);
const passed = it => { const d = S.done[it.id]; if (!d) return false; if (d.skipped || d.mission) return true; return (d.best || 0) >= needed(it) };
const isClosed = it => passed(it);
function nextItem() { return FLAT.find(it => !isClosed(it)) }
function unlocked(i) { return i === 0 || isClosed(FLAT[i - 1]) || !!S.done[FLAT[i].id] }
// Progresso = acertos (melhor tentativa de cada passo) sobre o total de exercícios da trilha
function progress() {
  let tot = 0, ok = 0, feitos = 0;
  FLAT.forEach(it => { const n = qCount(it); if (!n) return; tot += n; const d = S.done[it.id]; if (d && !d.skipped) { ok += d.best || 0; feitos += d.total || 0 } });
  return { tot, ok, feitos };
}
const LEVELS = ['Aquecendo', 'Embalando', 'Focada', 'Imparável', 'Pronta pro ENEM'];
function renderXP() {
  const p = progress(), pct = p.tot ? Math.round(p.ok / p.tot * 100) : 0, lv = Math.min(4, Math.floor(pct / 20.01));
  $('#xpb').style.width = pct + '%'; $('#xpn').textContent = `${p.ok}/${p.tot} acertos · ${pct}%`;
  $('#lvl').textContent = 'Nível ' + (lv + 1) + ' · ' + LEVELS[lv];
}
function qCount(it) { return it.type === 'sim' ? it.n : it.qs ? it.qs.length : 0 }
function metaLine(it) {
  if (it.type === 'mission-redacao') return 'Missão · ≈ 1h20 no papel';
  if (it.type === 'mission-kit') return 'Checklist · 5 min';
  return `≈ ${it.min} min · ${qCount(it)} exercícios`;
}

/* ================= início ================= */
function renderHome() {
  $('#who').innerHTML = `${USER.emoji ? USER.emoji + ' ' : '👋 '}Oi, <b>${esc(S.name || USER.name)}</b>`;
  renderXP();
  const nx = nextItem(), nb = $('#next');
  if (nx) {
    const idx = FLAT.indexOf(nx), A = AREAS[nx.area];
    nb.innerHTML = `<div class="eyebrow">Seu próximo passo · ${idx + 1} de ${FLAT.length}</div>
      <div class="title">${nx.title}</div>
      <div class="meta"><span class="tag" style="background:${A.c}">${A.n}</span><span>${metaLine(nx)}</span><span>· ${TRAIL[nx.day].day}</span></div>
      ${S.done[nx.id] && !S.done[nx.id].skipped ? `<p style="margin:0;font-weight:800;color:var(--bad)">Você acertou ${S.done[nx.id].best} de ${qCount(nx)}. Precisa de ${needed(nx)} para concluir.</p>` : ''}
      <button class="btn primary big" id="go">${S.done[nx.id] ? 'Tentar de novo' : idx === 0 ? 'Começar agora' : 'Continuar'} →</button>`;
    $('#go').onclick = () => openItem(nx);
  } else {
    nb.innerHTML = `<div class="eyebrow">Trilha completa</div><div class="title">Você fez tudo! 🎉</div><p style="margin:0" class="muted">Refaça os passos em que ganhou menos estrelas. E durma bem antes da prova.</p>`;
  }
  const tr = $('#trail'); tr.innerHTML = '';
  TRAIL.forEach((d) => {
    const sec = document.createElement('div'); sec.className = 'day';
    const closed = d.items.filter(isClosed).length;
    sec.innerHTML = `<div><div class="eyebrow">${d.day} · ${closed}/${d.items.length}</div><h2>${d.sub}</h2></div><div class="path"></div>`;
    const path = sec.querySelector('.path');
    d.items.forEach(it => {
      const i = FLAT.indexOf(it), dn = S.done[it.id], cur = it === nx, open = unlocked(i), pz = passed(it);
      const b = document.createElement('button'); b.className = 'step' + (pz ? (dn.skipped ? ' skip' : ' done') : '') + (cur ? ' cur' : '') + (!open ? ' lock' : '');
      const dot = pz ? (dn.skipped ? '↷' : '✓') : (open ? (i + 1) : '🔒');
      const n = qCount(it), pass = passed(it);
      const sub = !dn ? metaLine(it) : dn.skipped ? 'Pulado · toque para fazer' : !n ? 'Feito ✓' : pass ? `${stars(dn.best, n)} ${dn.best}/${n} acertos · toque para refazer` : `${dn.best}/${n} acertos · precisa de ${needed(it)} para concluir`;
      b.innerHTML = `<span class="dot">${dot}</span><span class="txt"><b>${it.title}</b><small>${sub}</small></span>`;
      b.onclick = () => open ? openItem(it) : toast('Termine o passo ' + i + ' primeiro 😉');
      path.appendChild(b);
    });
    tr.appendChild(sec);
  });
}
function stars(b, t) { const p = t ? b / t : 1; const n = p >= .9 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0; return '★'.repeat(n) + '☆'.repeat(3 - n) }

/* ================= lição (player) ================= */
let L = null; // { it, steps, i, score, answers }
let sinceBreak = 0;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
function buildSteps(it) {
  if (it.type === 'mission-redacao') return [{ t: 'redacao' }];
  if (it.type === 'mission-kit') return [{ t: 'kit' }];
  let qs = it.qs;
  if (it.type === 'sim') { const pool = Object.keys(Q).filter(k => it.from.some(p => k.startsWith(p))); qs = shuffle(pool).slice(0, it.n) }
  const st = [];
  if (it.type === 'sim') st.push({ t: 'intro' });
  (it.learn || []).forEach((c, k) => st.push({ t: 'learn', c, k }));
  if (it.builder) st.push({ t: 'builder' });
  if (it.learn) st.push({ t: 'ready' });
  qs.forEach(id => st.push({ t: 'q', id, opts: shuffle(Q[id].o.map((o, k) => ({ o, ok: k === 0 }))) }));
  return st;
}
function openItem(it) {
  L = { it, steps: buildSteps(it), i: 0, score: 0, answered: false };
  $('#player').hidden = false; document.body.style.overflow = 'hidden';
  try { history.pushState({ lesson: 1 }, '') } catch (e) {}
  drawStep();
}
function closePlayer(fromPop) {
  if (!L) return; L = null; clearInterval(tmr); tmr = null;
  $('#player').hidden = true; document.body.style.overflow = '';
  if (!fromPop) { try { history.back() } catch (e) {} }
  renderHome(); window.scrollTo(0, 0);
}
addEventListener('popstate', () => { if (L) closePlayer(true) });
$('#p-close').onclick = () => closePlayer(false);

function foot(html) { $('#pfoot').innerHTML = html }
function setBar() { const tot = L.steps.length + 1; $('#p-bar').style.width = Math.round(L.i / tot * 100) + '%' }
function drawStep() {
  setBar(); $('#pbody').scrollTop = 0;
  const P = $('#pinner'), st = L.steps[L.i], it = L.it, A = AREAS[it.area];
  if (!st) return drawResult();
  if (st.t === 'intro') {
    P.innerHTML = `<div class="box sticker"><span class="eyebrow">Simulado</span><h2 style="font-size:1.6rem">${it.title}</h2>
      <p style="margin:0">${it.n} questões sorteadas de tudo o que você estudou. Faça sem consultar, como na prova.</p>
      <p style="margin:0" class="muted">Dica: conte uns 3 minutos por questão.</p></div>`;
    foot(`<button class="btn primary big" id="nx">Começar simulado →</button>`); $('#nx').onclick = adv;
  }
  else if (st.t === 'learn') {
    const n = (it.learn || []).length;
    P.innerHTML = `<div class="eyebrow">Passo 1 · Aprenda ${n > 1 ? `(${st.k + 1} de ${n})` : ''}</div>
      <article class="learn sticker"><header style="background:${A.c}"><h2>${st.c.h}</h2></header><ul>${st.c.b.map(x => `<li>${x}</li>`).join('')}</ul></article>
      <p class="muted" style="margin:0;font-weight:700">Leia com calma. Se der, explique em voz alta sem olhar.</p>`;
    foot(`<button class="btn primary big" id="nx">${st.k + 1 < n || it.builder ? 'Próximo →' : 'Entendi →'}</button>`); $('#nx').onclick = adv;
  }
  else if (st.t === 'builder') drawBuilder(P);
  else if (st.t === 'ready') {
    P.innerHTML = `<div class="result"><div style="font-size:3.4rem">🎯</div><h2 style="font-size:1.7rem">Agora é praticar</h2>
      <p style="margin:0" class="muted">${qCount(it)} exercícios sobre o que você acabou de ler. Errou? Tudo bem: a explicação aparece na hora.</p></div>`;
    foot(`<button class="btn primary big" id="nx">Bora! →</button><button class="link" id="bk">Reler o resumo</button>`);
    $('#nx').onclick = adv; $('#bk').onclick = () => { L.i = 0; drawStep() };
  }
  else if (st.t === 'q') drawQ(P, st);
  else if (st.t === 'redacao') drawRedacao(P);
  else if (st.t === 'kit') drawKit(P);
}
function adv() { L.i++; drawStep() }

function drawQ(P, st) {
  const q = Q[st.id], qi = L.steps.filter(s => s.t === 'q').indexOf(st), qt = qCount(L.it);
  let sel = null;
  P.innerHTML = `<div class="eyebrow">${L.it.type === 'sim' ? 'Simulado' : 'Passo 2 · Pratique'} · questão ${qi + 1} de ${qt}</div>
    <div class="qtext">${q.q}</div>
    <div class="opts">${st.opts.map((o, i) => `<button class="opt" data-i="${i}"><b>${'ABCD'[i]}</b><span>${o.o}</span></button>`).join('')}</div>
    <div id="fb"></div>`;
  foot(`<button class="btn primary big" id="nx" disabled>Confirmar</button>`);
  const opts = P.querySelectorAll('.opt');
  opts.forEach(b => b.onclick = () => { sel = +b.dataset.i; opts.forEach(x => x.classList.toggle('sel', x === b)); $('#nx').disabled = false });
  $('#nx').onclick = () => {
    if (sel === null) return;
    const ok = st.opts[sel].ok; if (ok) L.score++;
    opts.forEach((x, i) => { x.disabled = true; x.classList.remove('sel'); if (st.opts[i].ok) x.classList.add('right'); else if (i === sel) x.classList.add('wrong') });
    $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b>${ok ? 'Isso aí! ✅' : 'Quase! A certa está em verde.'}</b><br>${q.e}</div>`;
    $('#fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    foot(`<button class="btn primary big" id="nx2">${qi + 1 < qt ? 'Próxima →' : 'Ver resultado →'}</button>`); $('#nx2').onclick = adv; $('#nx2').focus();
  };
}

function finish(best, total, extra) {
  const prev = S.done[L.it.id];
  const rec = { best: Math.max(best, prev && !prev.skipped ? prev.best || 0 : 0), total, last: best, tries: ((prev && prev.tries) || 0) + 1, at: Date.now() };
  S.done[L.it.id] = Object.assign(rec, extra || {}); save(); sinceBreak++;
}
function drawResult() {
  const it = L.it, tot = qCount(it), sc = L.score, pct = tot ? sc / tot : 1, need = needed(it), ok = sc >= need;
  finish(sc, tot); $('#p-bar').style.width = '100%';
  if (ok) confetti();
  const nx = ok ? nextItem() : null;
  const msg = !ok ? `Para concluir este passo, acerte pelo menos ${need} de ${tot}. Releia o resumo e tente de novo: você consegue!` : pct >= .9 ? 'Arrasou! Passo concluído. 🔥' : 'Passo concluído! Leia as explicações das que errou.';
  const pause = sinceBreak >= 2 && nx;
  $('#pinner').innerHTML = `<div class="result sticker"><div class="eyebrow">${it.title}</div><div class="stars">${stars(sc, tot)}</div>
    <div class="big">${sc}/${tot}</div><p style="margin:0;font-weight:800">${msg}</p><span class="tag" style="background:${ok ? 'var(--ok)' : 'var(--bad)'}">${ok ? '✓ Concluído' : 'Ainda não concluído'}</span></div>
    ${pause ? `<div class="box sticker" id="pausebox"><h3>Hora da pausa ☕</h3><p style="margin:0">Você já fez ${sinceBreak} passos seguidos. Levante, beba água e fique 5 minutos longe da tela.</p><div class="clock" id="pclock">05:00</div><button class="btn" id="pstart">Iniciar pausa de 5 min</button></div>` : ''}`;
  foot(`${!ok ? `<button class="btn primary big" id="redo">${it.learn ? 'Reler o resumo e refazer' : 'Refazer'} ↻</button>` : nx ? `<button class="btn primary big" id="nx">Próximo passo: ${nx.title} →</button>` : `<button class="btn primary big" id="home">Voltar ao início</button>`}
    <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${ok ? '<button class="link" id="redo">Refazer para melhorar</button>' : ''}<button class="link" id="tohome">Voltar ao início</button></div>`);
  if ($('#nx')) $('#nx').onclick = () => { clearInterval(tmr); openReplace(nx) };
  if ($('#home')) $('#home').onclick = () => closePlayer(false);
  $('#tohome').onclick = () => closePlayer(false);
  if ($('#redo')) $('#redo').onclick = () => openReplace(it);
  if ($('#pstart')) $('#pstart').onclick = () => { sinceBreak = 0; startTimer(300, $('#pclock'), () => { beep(); toast('Pausa acabou! Bora pro próximo 💪') }); $('#pstart').hidden = true };
}
function openReplace(it) { L = { it, steps: buildSteps(it), i: 0, score: 0 }; drawStep() }

/* --- timer --- */
let tmr = null;
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function startTimer(sec, el, done) { clearInterval(tmr); let left = sec; el.textContent = fmt(left); tmr = setInterval(() => { left--; el.textContent = fmt(Math.max(0, left)); if (left <= 0) { clearInterval(tmr); tmr = null; done && done() } }, 1000) }
function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)();[0, .3, .6].forEach(t => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.15, a.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + t + .25); o.start(a.currentTime + t); o.stop(a.currentTime + t + .25) }) } catch (e) {} }

/* --- montador da proposta de intervenção --- */
function drawBuilder(P) {
  const F = [['ag', 'Agente (quem faz?)', 'o Ministério da Educação'], ['ac', 'Ação (o que faz?)', 'criar campanhas de conscientização nas escolas'], ['mo', 'Modo/meio (como?)', 'por meio de palestras e oficinas mensais'], ['de', 'Detalhamento (explique um item)', 'conduzidas por psicólogos e assistentes sociais'], ['fi', 'Finalidade (para quê?)', 'reduzir o problema entre os jovens']];
  const v = Object.assign({}, S.pi);
  P.innerHTML = `<div class="eyebrow">Passo 1 · Monte sua proposta</div>
    <div class="box sticker"><h2 style="font-size:1.35rem">A proposta de intervenção</h2>
    <p style="margin:0" class="muted">É o fim da conclusão e vale até 200 pontos. Ela tem 5 peças. Troque os exemplos e veja a frase se montar.</p>
    ${F.map(([k, l, ex]) => `<label class="f" for="pi-${k}">${l}<input type="text" id="pi-${k}" value="${esc(v[k] != null ? v[k] : ex)}"></label>`).join('')}
    <div class="preview" id="pi-out"></div></div>`;
  const out = () => {
    const g = k => esc(($('#pi-' + k).value || '…').trim());
    $('#pi-out').innerHTML = `Portanto, cabe a <mark>${g('ag')}</mark> <mark>${g('ac')}</mark>, <mark>${g('mo')}</mark>, <mark>${g('de')}</mark>, a fim de <mark>${g('fi')}</mark>.`;
    F.forEach(([k]) => S.pi[k] = $('#pi-' + k).value);
  };
  F.forEach(([k]) => $('#pi-' + k).addEventListener('input', out)); out();
  foot(`<button class="btn primary big" id="nx">Ficou pronta →</button>`); $('#nx').onclick = () => { save(); adv() };
}

/* --- missão: redação --- */
function drawRedacao(P) {
  const C = ['Tem entre 25 e 30 linhas', 'Introdução com repertório e tese', 'Dois parágrafos de argumento, cada um com um exemplo', 'Conectivos no começo dos parágrafos', 'Conclusão com os 5 elementos da proposta', 'Reli e corrigi acentos e concordância'];
  const ck = S.checks['red'] || {};
  P.innerHTML = `<div class="eyebrow">Missão · no papel</div>
    <div class="box sticker"><h2 style="font-size:1.4rem">Escreva uma redação completa</h2>
      <p style="margin:0">Tema de treino:</p>
      <p style="margin:0;font-family:var(--display);font-size:1.25rem;font-weight:700">"Desafios para combater a desinformação no Brasil"</p>
      <ol><li>Pegue papel e caneta. Celular só para o cronômetro.</li><li>15 min de rascunho com a planta de 4 parágrafos.</li><li>Escreva em 1h e passe a limpo.</li></ol>
      <div class="clock" id="rclock">80:00</div>
      <button class="btn primary" id="rstart">Iniciar cronômetro de 1h20</button>
    </div>
    <div class="box sticker"><h3>Quando terminar, confira:</h3><div id="rchecks" style="display:flex;flex-direction:column;gap:8px">
      ${C.map((c, i) => `<label class="check"><input type="checkbox" id="rc-${i}" ${ck[i] ? 'checked' : ''}><span>${c}</span></label>`).join('')}</div></div>`;
  $('#rstart').onclick = () => { startTimer(80 * 60, $('#rclock'), () => { beep(); toast('Tempo! Hora de conferir a redação.') }); $('#rstart').hidden = true };
  C.forEach((_, i) => $('#rc-' + i).onchange = e => { ck[i] = e.target.checked; S.checks['red'] = ck; save() });
  foot(`<button class="btn primary big" id="nx">Terminei a redação ✓</button><button class="link" id="sk">Fazer depois (pular por agora)</button>`);
  $('#nx').onclick = () => missionDone('Redação feita! Isso é o treino que mais sobe a nota. ✍️');
  $('#sk').onclick = () => { S.done[L.it.id] = { skipped: true, at: Date.now() }; save(); toast('Pulado. A missão continua na trilha.'); const nx = nextItem(); nx ? openReplace(nx) : closePlayer(false) };
}
/* --- missão: kit da prova --- */
function drawKit(P) {
  P.innerHTML = `<div class="eyebrow">Véspera · checklist</div>
    <div class="box sticker"><h2 style="font-size:1.4rem">Arrume a mochila agora</h2><div style="display:flex;flex-direction:column;gap:8px">
      ${BAG.map((b, i) => `<label class="check"><input type="checkbox" id="bg-${i}" ${S.bag[i] ? 'checked' : ''}><span>${b}</span></label>`).join('')}</div></div>
    <div class="box sticker"><h3>Na hora da prova</h3><ul>${TIPS.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  const all = () => BAG.every((_, i) => S.bag[i]);
  const upd = () => { $('#nx').disabled = !all(); $('#nx').textContent = all() ? 'Tudo pronto ✓' : `Marque tudo (${BAG.filter((_, i) => S.bag[i]).length}/${BAG.length})` };
  foot(`<button class="btn primary big" id="nx"></button>`);
  BAG.forEach((_, i) => $('#bg-' + i).onchange = e => { S.bag[i] = e.target.checked; save(); upd() }); upd();
  $('#nx').onclick = () => missionDone('Mochila pronta! Agora janta leve e cama cedo. 😴');
}
function missionDone(msg) {
  finish(0, 0, { mission: true }); confetti(); $('#p-bar').style.width = '100%'; clearInterval(tmr);
  const nx = nextItem();
  $('#pinner').innerHTML = `<div class="result sticker"><div style="font-size:3.4rem">🏅</div><div class="big" style="font-size:2.4rem">Missão cumprida</div><p style="margin:0;font-weight:800">${msg}</p><span class="tag" style="background:var(--ok)">✓ Concluído</span></div>`;
  foot(`${nx ? `<button class="btn primary big" id="nx">Próximo passo: ${nx.title} →</button>` : ''}<button class="link" id="tohome">Voltar ao início</button>`);
  if (nx) $('#nx').onclick = () => openReplace(nx);
  $('#tohome').onclick = () => closePlayer(false);
}

/* ================= contagem ================= */
const D1 = new Date('2026-11-08T13:30:00-03:00').getTime(), D2 = new Date('2026-11-15T13:30:00-03:00').getTime();
function tick() {
  const now = Date.now(), t = now < D1 ? D1 : D2; $('#cd-label').textContent = now < D1 ? 'Falta para 08/11 · 13h30' : 'Falta para 15/11 · 13h30';
  const d = Math.max(0, t - now) / 1000;
  $('#cd-d').textContent = Math.floor(d / 86400); $('#cd-h').textContent = Math.floor(d % 86400 / 3600); $('#cd-m').textContent = Math.floor(d % 3600 / 60); $('#cd-s').textContent = Math.floor(d % 60);
}

/* ================= confete ================= */
const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], raf = null;
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; cv.width = innerWidth; cv.height = innerHeight;
  const cs = getComputedStyle(document.documentElement), cols = ['--lin', '--hum', '--nat', '--mat', '--red'].map(c => cs.getPropertyValue(c).trim());
  for (let i = 0; i < 140; i++) parts.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: Math.random() * -12 - 3, s: Math.random() * 8 + 5, c: cols[i % 5], r: Math.random() * 6, life: 120 });
  if (!raf) loop();
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .1; p.life--; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore() });
  parts = parts.filter(p => p.life > 0 && p.y < cv.height + 20); raf = parts.length ? requestAnimationFrame(loop) : (cx.clearRect(0, 0, cv.width, cv.height), null);
}

/* ================= instalar (PWA) ================= */
const inst = $('#install'), ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let deferred = null;
function showInstall() { if (standalone || ls.get('installDismissed', false)) return; inst.hidden = false }
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; showInstall() });
if (isIOS) showInstall();
if (/android/i.test(ua)) setTimeout(showInstall, 2500);
$('#install-btn').onclick = async () => {
  if (deferred) { deferred.prompt(); const r = await deferred.userChoice.catch(() => null); deferred = null; if (r && r.outcome === 'accepted') inst.hidden = true }
  else if (isIOS) { $('#ios-sheet').hidden = false }
  else toast('Use o menu do navegador ⋮ → "Instalar app"');
};
$('#install-x').onclick = () => { inst.hidden = true; ls.set('installDismissed', true) };
$('#ios-ok').onclick = () => $('#ios-sheet').hidden = true;
$('#ios-sheet').onclick = e => { if (e.target.id === 'ios-sheet') $('#ios-sheet').hidden = true };
addEventListener('appinstalled', () => { inst.hidden = true; confetti(); toast('App instalado! Bons estudos 💛') });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

/* ================= iniciar ================= */
let ticking = null;
function startApp() { show('home'); renderHome(); tick(); if (!ticking) ticking = setInterval(tick, 1000) }
CLOUD ? bootCloud() : bootLocal();
})();
