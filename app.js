(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = { get(k, d) { try { const v = localStorage.getItem('enemturbo:' + k); return v ? JSON.parse(v) : d } catch (e) { return d } },
             set(k, v) { try { localStorage.setItem('enemturbo:' + k, JSON.stringify(v)) } catch (e) {} } };
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800) }
function show(id) { ['loading', 'auth'].forEach(x => $('#' + x).hidden = x !== id); if (id === 'home') PRO.showShell(); else PRO.hideShell() }
const PRO = window.PRO || { showShell() { $('#home').hidden = false }, hideShell() { $('#home').hidden = true }, init() {}, onStart() {}, onPlan() {}, homeExtras() { return '' } };

const BANKMAP = {}; (window.BANK || []).forEach(b => BANKMAP[b.id] = b);
const QALL = Object.assign({}, Q, BANKMAP);
const PREF = [['int', 'geral'], ['red', 'red'], ['rt', 'red'], ['in', 'red'], ['de', 'red'], ['co', 'red'], ['por', 'por'], ['fig', 'por'], ['lit', 'lit'], ['lem', 'lem'], ['his', 'his'], ['geom', 'mat'], ['geo', 'geo'], ['fil', 'fil'], ['soc', 'soc'], ['mat', 'mat'], ['bio', 'bio'], ['qui', 'qui'], ['fis', 'fis']];
function subjOf(id) { if (BANKMAP[id]) return BANKMAP[id].m; const p = PREF.find(x => id.startsWith(x[0])); return p ? p[1] : 'geral' }
function difOf(id) { return BANKMAP[id] ? BANKMAP[id].d : 'f' }
function provaOf(id) { return BANKMAP[id] ? BANKMAP[id].p : 'ambos' }
function dayKey(t) { const d = new Date(t || Date.now()); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
function track(id, ok) {
  S.agg = S.agg || { m: {}, d: {} }; S.days = S.days || {};
  const m = subjOf(id), d = difOf(id), k = dayKey();
  const inc = (o, key) => { o[key] = o[key] || { a: 0, o: 0 }; o[key].a++; if (ok) o[key].o++ };
  inc(S.agg.m, m); inc(S.agg.d, d);
  S.days[k] = S.days[k] || { a: 0, o: 0, ms: 0 }; S.days[k].a++; if (ok) S.days[k].o++;
}
function addTime() { if (!L || !L.t0) return; const k = dayKey(); S.days = S.days || {}; S.days[k] = S.days[k] || { a: 0, o: 0, ms: 0 }; S.days[k].ms += Math.min(Date.now() - L.t0, 90 * 60e3); L.t0 = Date.now() }
const FLAT = []; TRAIL.forEach((d, di) => d.items.forEach(it => { it.day = di; FLAT.push(it) }));
const blank = () => ({ name: '', done: {}, bag: {}, pi: {}, checks: {}, wrong: {}, red: {}, mt: {}, stats: { ans: 0, ok: 0 }, updatedAt: 0 });

/* ================= armazenamento: nuvem (Firebase) ou local ================= */
const CFG = window.FIREBASE_CONFIG || {};
const CLOUD = !!(CFG.apiKey && CFG.projectId);
let S = blank(), USER = null, saveTimer = null, fb = null, PLAN = {};

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
    await Promise.all([loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-auth-compat.js`), loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore-compat.js`), loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-functions-compat.js`)]);
  } catch (e) {
    // sem internet na primeira abertura: usa o último usuário salvo
    const last = ls.get('lastUser', null);
    if (last) { USER = last; S = Object.assign(blank(), ls.get('cache:' + last.id, {})); startApp(); setSync('Sem internet: usando o progresso salvo no aparelho'); return }
    show('auth'); $('#cloudform').hidden = false; authErr('Sem internet. Conecte-se para entrar a primeira vez.'); return;
  }
  firebase.initializeApp(CFG);
  fb = { auth: firebase.auth(), db: firebase.firestore(), fn: firebase.app().functions('southamerica-east1') };
  let planUnsub = null;
  fb.auth.onAuthStateChanged(async u => {
    if (!u) { USER = null; PLAN = {}; if (planUnsub) { planUnsub(); planUnsub = null } show('auth'); $('#cloudform').hidden = false; return }
    if (planUnsub) planUnsub();
    planUnsub = fb.db.collection('plans').doc(u.uid).onSnapshot(sn => { PLAN = sn.exists ? sn.data() : {}; PRO.onPlan() }, () => {});
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
    startApp(); checarAdmin();
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

function sair() { if (CLOUD && fb) { fb.auth.signOut(); ls.set('lastUser', null); $('#cfg-sheet').hidden = true; $('#adm-btn').hidden = true; ADMIN = false } else { ls.set('current', null); location.reload() } }

/* --- administradora: o servidor confere o e-mail (ADMIN_EMAILS) --- */
let ADMIN = false;
async function checarAdmin() {
  if (!CLOUD || !fb || !fb.auth.currentUser) return;
  try { const r = await fb.fn.httpsCallable('souAdmin')(); ADMIN = !!(r.data && r.data.admin) } catch (e) { ADMIN = false }
  $('#adm-btn').hidden = !ADMIN;
}
$('#adm-btn').onclick = () => { location.href = 'admin.html' };

/* --- configurações da conta --- */
function abrirConfig() {
  const sh = $('#cfg-sheet'), u = CLOUD && fb && fb.auth.currentUser;
  const ate = PLAN && PLAN.ate && PLAN.ate.toMillis ? PLAN.ate.toMillis() : 0, pro = ate > Date.now();
  sh.querySelector('.sheet').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 class="logo" style="font-size:1.5rem">Configurações</h3><button class="link" id="cfg-x" aria-label="Fechar">✕</button></div>
    <form id="cfg-f" style="display:flex;flex-direction:column;gap:12px">
      <label class="f" for="cfg-nome">Seu nome<input type="text" id="cfg-nome" maxlength="40" value="${esc(S.name || USER.name || '')}" autocomplete="name"></label>
      ${u ? `<label class="f" for="cfg-mail">E-mail da conta<input type="email" id="cfg-mail" value="${esc(u.email || '')}" disabled></label>` : ''}
      <button class="btn primary" type="submit">Salvar</button>
    </form>
    ${u ? `<div class="payer"><span class="lbl">Senha</span><p class="muted" style="margin:0">Enviamos um link para ${esc(u.email || '')} para você criar uma senha nova.</p><button class="btn" id="cfg-senha">Trocar minha senha</button></div>` : ''}
    <div class="payer"><span class="lbl">Plano</span>
      <p style="margin:0">${pro ? `⭐ <b>Pro</b> até ${new Date(ate).toLocaleDateString('pt-BR')}` : 'Plano grátis'}</p>
      <button class="btn" id="cfg-pro">${pro ? 'Renovar o Pro' : 'Conhecer o Pro'}</button></div>
    ${ADMIN ? `<div class="payer"><span class="lbl">Administração</span><p class="muted" style="margin:0">Cupons de desconto e Pro de cortesia.</p><a class="btn" href="admin.html" style="text-align:center;text-decoration:none">🛠️ Abrir a área de administração</a></div>` : ''}
    <button class="btn" id="cfg-sair">Sair da conta</button>
    <p class="muted" id="syncinfo2" style="margin:0;font-size:.82rem;text-align:center">${esc(($('#syncinfo') && $('#syncinfo').textContent) || '')}</p>`;
  $('#cfg-x').onclick = () => sh.hidden = true;
  $('#cfg-f').onsubmit = async e => {
    e.preventDefault(); const n = $('#cfg-nome').value.trim(); if (!n) return toast('Escreva seu nome.');
    S.name = n; USER.name = n; save(); renderHome();
    if (u) { try { await u.updateProfile({ displayName: n }); ls.set('lastUser', USER) } catch (er) {} }
    else { const ps = ls.get('profiles', []), cur = ps.find(p => 'u:' + p.id === USER.id); if (cur) { cur.name = n; ls.set('profiles', ps) } }
    toast('Pronto, salvo!'); sh.hidden = true;
  };
  if ($('#cfg-senha')) $('#cfg-senha').onclick = async () => { try { await fb.auth.sendPasswordResetEmail(u.email); toast('Enviei o link para ' + u.email) } catch (er) { toast(AUTH_MSG[er.code] || 'Não consegui enviar agora.') } };
  $('#cfg-pro').onclick = () => { sh.hidden = true; $('#pro-btn').click() };
  $('#cfg-sair').onclick = sair;
  sh.hidden = false; sh.onclick = e => { if (e.target === sh) sh.hidden = true };
}
$('#cfg-btn').onclick = abrirConfig;

/* ================= progresso: rodadas de revisão espaçada ================= */
// Cada assunto com exercícios passa por 3 rodadas: Aprender (60%) → Revisão após 1h (70%) → Fixação após 8h (80%).
const MIN = 60e3, HOUR = 3600e3;
const WAIT = [0, 1 * HOUR, 8 * HOUR];
const PASSR = [.6, .7, .8];
const RNAME = ['Aprender', 'Revisão', 'Fixação'];
const now = () => Date.now();
const hasRounds = it => !it.type && it.qs && it.qs.length;
const rounds = it => hasRounds(it) ? 3 : 1;
const rec = it => S.done[it.id];
const lvl = it => (rec(it) && rec(it).r) || 0;
const closed = it => lvl(it) >= 1 || !!(rec(it) && rec(it).skipped);
function dueAt(it) { const d = rec(it), L = lvl(it); if (!d || L < 1 || L >= rounds(it) || !d.at || !d.at[L - 1]) return null; return d.at[L - 1] + WAIT[L] }
const isDue = it => { const t = dueAt(it); return t !== null && now() >= t };
const needed = (n, round) => Math.ceil(n * PASSR[round - 1]);
function hhmm(t) { const d = new Date(t), td = new Date(); const h = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); return d.toDateString() === td.toDateString() ? 'às ' + h : (d.getDate() === new Date(td.getTime() + 864e5).getDate() ? 'amanhã às ' + h : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + h) }
function inTime(ms) { const m = Math.round(ms / MIN); return m < 60 ? `em ${m} min` : `em ${Math.round(m / 60)} h` }

function migrate() {
  ['wrong', 'red', 'stats', 'mt', 'checks', 'bag', 'pi'].forEach(k => { if (!S[k] || typeof S[k] !== 'object') S[k] = k === 'stats' ? { ans: 0, ok: 0 } : {} });
  if (S.stats.ans == null) S.stats = { ans: 0, ok: 0 };
  FLAT.forEach(it => {
    const d = S.done[it.id]; if (!d || d.r != null || d.skipped || d.mission) { if (d && d.mission && d.r == null) d.r = 1; return }
    const n = it.qs ? it.qs.length : it.n || 0;
    d.b = [d.best || 0]; d.at = [d.at || now()]; d.r = (d.best || 0) >= needed(n, 1) ? 1 : 0;
  });
}
function nextAction() {
  const dues = FLAT.filter(isDue).sort((a, b) => dueAt(a) - dueAt(b));
  if (dues.length) return { it: dues[0], round: lvl(dues[0]) + 1, kind: 'review', more: dues.length - 1 };
  const n = FLAT.find(it => !closed(it));
  if (n) return { it: n, round: 1, kind: 'new' };
  const pend = FLAT.filter(it => dueAt(it) !== null).sort((a, b) => dueAt(a) - dueAt(b));
  if (pend.length) return { it: pend[0], round: lvl(pend[0]) + 1, kind: 'early' };
  return null;
}
function unlocked(i) { return i === 0 || closed(FLAT[i - 1]) || !!rec(FLAT[i]) }
function mastery() { let t = 0, d = 0; FLAT.forEach(it => { t += rounds(it); d += Math.min(lvl(it), rounds(it)) }); return { t, d, pct: Math.round(d / t * 100) } }
const LEVELS = ['Aquecendo', 'Embalando', 'Focada', 'Imparável', 'Pronta pro ENEM'];
function renderXP() {
  const m = mastery(), lv = Math.min(4, Math.floor(m.pct / 20.01)), acc = S.stats.ans ? Math.round(S.stats.ok / S.stats.ans * 100) : 0;
  $('#xpb').style.width = m.pct + '%';
  $('#lvl').textContent = `Domínio ${m.pct}% · ${LEVELS[lv]}`;
  $('#xpn').textContent = S.stats.ans ? `${acc}% de acertos` : 'Nenhum exercício ainda';
}
function qCount(it) { return it.type === 'sim' ? it.n : it.qs ? it.qs.length : 0 }
function metaLine(it) {
  if (it.type === 'mission-redacao') return 'Missão · ≈ 1h20 no papel';
  if (it.type === 'mission-kit') return 'Checklist · 5 min';
  if (it.type === 'red-final') return 'Modelo comentado + corretor da sua redação';
  return `≈ ${it.min} min · ${qCount(it)} exercícios` + (hasRounds(it) ? ' · 3 rodadas' : '');
}
function stars(L, R) { return `<span class="s-on">${'★'.repeat(L)}</span><span class="s-off">${'★'.repeat(Math.max(0, R - L))}</span>` }

/* ================= início ================= */
function renderHome() {
  $('#who').innerHTML = `${USER.emoji ? USER.emoji + ' ' : '👋 '}Oi, <b>${esc(S.name || USER.name)}</b>`;
  renderXP();
  const na = nextAction(), nb = $('#next');
  const wrongN = Object.keys(S.wrong).filter(k => QALL[k]).length;
  const cadernoBtn = wrongN ? `<button class="btn" id="caderno" style="width:100%">📕 Caderno de erros · ${wrongN} ${wrongN === 1 ? 'questão' : 'questões'}</button>` : '';
  if (na) {
    const it = na.it, idx = FLAT.indexOf(it), A = AREAS[it.area], d = rec(it);
    let eyebrow, extra = '', label;
    if (na.kind === 'review') {
      eyebrow = `Revisão na hora certa · rodada ${na.round} de 3`;
      extra = `<p style="margin:0;font-weight:700">Você estudou isso ${hhmm(d.at[na.round - 2])}. Revisar agora é o que fixa na memória.${na.more ? ` <span class="muted">+${na.more} ${na.more > 1 ? 'revisões' : 'revisão'} esperando.</span>` : ''}</p>`;
      label = 'Revisar agora ↻';
    } else if (na.kind === 'new') {
      eyebrow = `Seu próximo passo · ${idx + 1} de ${FLAT.length}`;
      if (d && !closed(it)) extra = `<p style="margin:0;font-weight:800;color:var(--bad)">Você acertou ${(d.b && d.b[0]) || 0} de ${qCount(it)}. Precisa de ${needed(qCount(it), 1)} para concluir.</p>`;
      label = d ? 'Tentar de novo →' : idx === 0 ? 'Começar agora →' : 'Continuar →';
    } else {
      eyebrow = 'Tudo em dia ✓';
      extra = `<p style="margin:0;font-weight:700">A próxima revisão é ${hhmm(dueAt(it))}. Descanse, ou adiante se quiser.</p>`;
      label = 'Revisar antes da hora';
    }
    nb.innerHTML = `<div class="eyebrow">${eyebrow}</div><div class="title">${it.title}</div>
      <div class="meta"><span class="tag" style="background:${A.c}">${A.n}</span><span>${na.kind === 'new' ? metaLine(it) : RNAME[na.round - 1] + ' · ' + qCount(it) + ' exercícios · precisa de ' + Math.round(PASSR[na.round - 1] * 100) + '%'}</span></div>
      ${extra}<button class="btn primary big" id="go">${label}</button>${cadernoBtn}`;
    $('#go').onclick = () => openItem(it, na.round);
  } else {
    nb.innerHTML = `<div class="eyebrow">Trilha dominada</div><div class="title">Você fez as 3 rodadas de tudo! 🎉</div><p style="margin:0" class="muted">Agora é treinar redação no papel e refazer os simulados.</p>${cadernoBtn}`;
  }
  if ($('#caderno')) $('#caderno').onclick = openCaderno;
  if (PRO.renderHomeExtra) PRO.renderHomeExtra();

  const tr = $('#trail'); tr.innerHTML = '';
  TRAIL.forEach(dd => {
    const sec = document.createElement('div'); sec.className = 'day';
    const ok = dd.items.filter(closed).length;
    sec.innerHTML = `<div><div class="eyebrow">${dd.day} · ${ok}/${dd.items.length}</div><h2>${dd.sub}</h2></div><div class="path"></div>`;
    const path = sec.querySelector('.path');
    dd.items.forEach(it => {
      const i = FLAT.indexOf(it), d = rec(it), L = lvl(it), R = rounds(it), open = unlocked(i), due = isDue(it), cur = na && na.it === it;
      const full = L >= R && !(d && d.skipped);
      const b = document.createElement('button');
      b.className = 'step' + (full ? ' done full' : L >= 1 ? ' done' : d && d.skipped ? ' skip' : '') + (cur || due ? ' cur' : '') + (!open ? ' lock' : '');
      const dot = full ? (R > 1 ? '★' : '✓') : due ? '↻' : L >= 1 ? '✓' : d && d.skipped ? '↷' : open ? (i + 1) : '🔒';
      let sub;
      if (!d) sub = metaLine(it);
      else if (d.skipped) sub = 'Pulado · toque para fazer';
      else if (R === 1) sub = L ? 'Feito ✓ · toque para refazer' : `${(d.b && d.b[0]) || 0}/${qCount(it)} · precisa de ${needed(qCount(it), 1)}`;
      else if (L === 0) sub = `${(d.b && d.b[0]) || 0}/${qCount(it)} acertos · precisa de ${needed(qCount(it), 1)} para concluir`;
      else if (L >= R) sub = `<span class="st">${stars(3, 3)}</span> Dominado · 3 rodadas feitas`;
      else sub = `<span class="st">${stars(L, R)}</span> Rodada ${L}/3 · ${due ? '<b style="color:var(--ink)">revisão disponível agora</b>' : 'próxima revisão ' + hhmm(dueAt(it))}`;
      b.innerHTML = `<span class="dot">${dot}</span><span class="txt"><b>${it.title}</b><small>${sub}</small></span>`;
      b.onclick = () => {
        if (!open) return toast('Termine o passo ' + i + ' primeiro 😉');
        const round = L >= 1 && L < R ? L + 1 : L >= R ? R : 1;
        openItem(it, round);
      };
      path.appendChild(b);
    });
    tr.appendChild(sec);
  });
}

/* ================= lição (player) ================= */
let L = null; // { it, round, steps, i, score }
let sinceBreak = 0;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
const qStep = id => ({ t: 'q', id, opts: shuffle(QALL[id].o.map((o, k) => ({ o, ok: k === 0 }))) });
function flashFrom(it) {
  const out = [];
  (it.learn || []).forEach(c => c.b.forEach(x => { const m = x.match(/^<b>([^<]{2,30})<\/b>\s*[:–-]?\s*(.{6,})$/); if (m && !/[.!]$/.test(m[1].trim())) out.push({ f: m[1].replace(/[:.]$/, ''), back: m[2], h: c.h }) }));
  return shuffle(out).slice(0, 4);
}
function buildSteps(it, round) {
  if (it.type === 'mission-redacao') return [{ t: 'redacao' }];
  if (it.type === 'mission-kit') return [{ t: 'kit' }];
  if (it.type === 'red-final') return [{ t: 'rfintro' }, { t: 'model', part: 'all' }, { t: 'review' }];
  if (it.type === 'sim') { const pool = Object.keys(Q).filter(k => it.from.some(p => k.startsWith(p))); return [{ t: 'intro' }].concat(shuffle(pool).slice(0, it.n).map(qStep)) }
  const st = [];
  if (round === 1) {
    (it.learn || []).forEach((c, k) => st.push({ t: 'learn', c, k }));
    if (it.model) st.push({ t: 'model', part: it.model });
    (it.write || []).forEach(p => st.push({ t: 'write', part: p }));
    st.push({ t: 'ready' });
    shuffle(it.qs).forEach(id => st.push(qStep(id)));
  } else {
    st.push({ t: 'rintro' });
    if (round === 2) flashFrom(it).forEach(f => st.push({ t: 'flash', f }));
    const wrongFirst = it.qs.filter(id => S.wrong[id]), rest = shuffle(it.qs.filter(id => !S.wrong[id]));
    let qs = wrongFirst.concat(rest);
    if (round === 3) { // mistura 2 questões de assuntos anteriores (intercalar ajuda a lembrar)
      const others = FLAT.filter(x => x !== it && hasRounds(x) && closed(x)).flatMap(x => x.qs);
      qs = shuffle(qs.concat(shuffle(others).slice(0, 2)));
    }
    qs.forEach(id => st.push(qStep(id)));
  }
  return st;
}
function sessionQ() { return L.steps.filter(s => s.t === 'q').length }
function openItem(it, round) {
  L = { it, round: round || 1, steps: buildSteps(it, round || 1), i: 0, score: 0, t0: Date.now() };
  $('#player').hidden = false; document.body.style.overflow = 'hidden';
  try { history.pushState({ lesson: 1 }, '') } catch (e) {}
  drawStep();
}
function openReplace(it, round) { clearInterval(tmr); tmr = null; addTime(); stopSimTimer(); L = { it, round: round || 1, steps: buildSteps(it, round || 1), i: 0, score: 0, t0: Date.now() }; drawStep() }
// sessões do Pro (treino livre, simulados): cfg = { title, area, ids, label, intro, timerSec, onDone(L) }
let simTmr = null;
function stopSimTimer() { clearInterval(simTmr); simTmr = null; const el = $('#p-timer'); if (el) el.hidden = true }
function openCustom(cfg) {
  if (!cfg.ids.length) return toast('Nenhuma questão com esses filtros.');
  L = { it: { id: 'custom', title: cfg.title, area: cfg.area || 'geral' }, round: 1, custom: cfg, steps: (cfg.intro ? [{ t: 'xintro' }] : []).concat(cfg.ids.map(qStep)), i: 0, score: 0, t0: Date.now(), ans: [] };
  $('#player').hidden = false; document.body.style.overflow = 'hidden';
  try { history.pushState({ lesson: 1 }, '') } catch (e) {}
  drawStep();
}
function startSimTimer(sec) {
  const el = $('#p-timer'); el.hidden = false; L.deadline = Date.now() + sec * 1000;
  const upd = () => { if (!L) return stopSimTimer(); const left = Math.max(0, Math.round((L.deadline - Date.now()) / 1000)); el.textContent = '⏱ ' + (left >= 3600 ? Math.floor(left / 3600) + 'h' + String(Math.floor(left % 3600 / 60)).padStart(2, '0') : fmt(left)); el.classList.toggle('late', left < 300); if (!left) { stopSimTimer(); toast('Tempo esgotado!'); L.timeout = true; L.i = L.steps.length; drawStep() } };
  clearInterval(simTmr); simTmr = setInterval(upd, 1000); upd();
}
function openCaderno() {
  const ids = shuffle(Object.keys(S.wrong).filter(k => QALL[k])).slice(0, 12);
  if (!ids.length) return toast('Caderno vazio! 🎉');
  L = { it: { id: 'caderno', title: 'Caderno de erros', area: 'geral' }, round: 1, caderno: true, steps: [{ t: 'cintro', n: ids.length }].concat(ids.map(qStep)), i: 0, score: 0, before: Object.keys(S.wrong).length, t0: Date.now() };
  $('#player').hidden = false; document.body.style.overflow = 'hidden';
  try { history.pushState({ lesson: 1 }, '') } catch (e) {}
  drawStep();
}
function closePlayer(fromPop) {
  if (!L) return; addTime(); save(); L = null; clearInterval(tmr); tmr = null; stopSimTimer();
  $('#player').hidden = true; document.body.style.overflow = '';
  if (!fromPop) { try { history.back() } catch (e) {} }
  renderHome(); PRO.refresh && PRO.refresh(); window.scrollTo(0, 0);
}
addEventListener('popstate', () => { if (L) closePlayer(true) });
$('#p-close').onclick = () => closePlayer(false);

function foot(html) { $('#pfoot').innerHTML = html }
function setBar() { $('#p-bar').style.width = Math.round(L.i / (L.steps.length + 1) * 100) + '%' }
function adv() { L.i++; drawStep() }
function drawStep() {
  setBar(); $('#pbody').scrollTop = 0;
  const P = $('#pinner'), st = L.steps[L.i], it = L.it, A = AREAS[it.area];
  if (!st) { if (L.custom) { stopSimTimer(); addTime(); save(); $('#p-bar').style.width = '100%'; return L.custom.onDone(L) } return L.caderno ? drawCadernoResult() : drawResult() }
  const T = {
    xintro() {
      P.innerHTML = L.custom.intro;
      foot(`<button class="btn primary big" id="nx">${L.custom.startLabel || 'Começar →'}</button>`);
      $('#nx').onclick = () => { if (L.custom.onBegin) L.custom.onBegin(); if (L.custom.timerSec) startSimTimer(L.custom.timerSec); adv() };
    },
    intro() {
      P.innerHTML = `<div class="box sticker"><span class="eyebrow">Simulado</span><h2 style="font-size:1.6rem">${it.title}</h2>
        <p style="margin:0">${it.n} questões sorteadas de tudo o que você estudou. Faça sem consultar, como na prova.</p>
        <p style="margin:0" class="muted">Dica: conte uns 3 minutos por questão.</p></div>`;
      foot(`<button class="btn primary big" id="nx">Começar simulado →</button>`); $('#nx').onclick = adv;
    },
    cintro() {
      P.innerHTML = `<div class="result sticker"><div style="font-size:3.4rem">📕</div><h2 style="font-size:1.6rem">Caderno de erros</h2>
        <p style="margin:0">Aqui ficam as questões que você errou. Cada uma sai do caderno quando você acertar <b>2 vezes</b>.</p>
        <p style="margin:0" class="muted">Hoje: ${st.n} questões.</p></div>`;
      foot(`<button class="btn primary big" id="nx">Começar →</button>`); $('#nx').onclick = adv;
    },
    rintro() {
      const d = rec(it), when = d.at[L.round - 2];
      P.innerHTML = `<div class="result sticker"><div class="stars" style="color:var(--hum)">${stars(L.round - 1, 3)}</div>
        <span class="eyebrow">Rodada ${L.round} de 3 · ${RNAME[L.round - 1]}</span><h2 style="font-size:1.6rem">${it.title}</h2>
        <p style="margin:0">${L.round === 2 ? 'Você estudou isso há pouco. Primeiro tente lembrar sem olhar, depois responda os exercícios.' : 'Última rodada, sem resumo, como na prova. Tem também questões de outros assuntos misturadas.'}</p>
        <p style="margin:0;font-weight:800">Para concluir: ${Math.round(PASSR[L.round - 1] * 100)}% de acerto.</p>
        <p style="margin:0" class="muted">Primeira vez: ${hhmm(when)}.</p></div>`;
      foot(`<button class="btn primary big" id="nx">Começar rodada ${L.round} →</button><button class="link" id="bk">Prefiro reler o resumo antes</button>`);
      $('#nx').onclick = adv; $('#bk').onclick = () => { L.steps.splice(L.i + 1, 0, ...(it.learn || []).map((c, k) => ({ t: 'learn', c, k, re: true }))); adv() };
    },
    learn() {
      const n = (it.learn || []).length;
      P.innerHTML = `<div class="eyebrow">${st.re ? 'Releitura' : 'Passo 1 · Aprenda'} ${n > 1 ? `(${st.k + 1} de ${n})` : ''}</div>
        <article class="learn sticker"><header style="background:${A.c}"><h2>${st.c.h}</h2></header><ul>${st.c.b.map(x => `<li>${x}</li>`).join('')}</ul></article>
        <p class="muted" style="margin:0;font-weight:700">Leia com calma. Depois feche os olhos e tente explicar em voz alta.</p>`;
      foot(`<button class="btn primary big" id="nx">${st.k + 1 < n ? 'Próximo →' : 'Entendi →'}</button>`); $('#nx').onclick = adv;
    },
    flash() {
      const f = st.f;
      P.innerHTML = `<div class="eyebrow">Lembra? · sem olhar</div>
        <div class="box sticker flash"><span class="muted" style="font-weight:800">${esc(f.h)}</span>
        <div style="font-family:var(--display);font-size:1.8rem;font-weight:800">${f.f}</div>
        <p style="margin:0" class="muted">Diga em voz alta o que você lembra. Depois toque para conferir.</p>
        <div id="back" hidden class="preview" style="font-size:1.05rem">${f.back}</div></div>`;
      foot(`<button class="btn primary big" id="nx">Mostrar resposta</button>`);
      $('#nx').onclick = () => {
        $('#back').hidden = false;
        foot(`<div style="display:flex;gap:10px;width:100%"><button class="btn big" id="no" style="flex:1">Não lembrei</button><button class="btn primary big" id="yes" style="flex:1">Lembrei ✓</button></div>`);
        $('#yes').onclick = adv; $('#no').onclick = () => { toast('Sem problema: ela volta na próxima rodada.'); adv() };
      };
    },
    ready() {
      P.innerHTML = `<div class="result"><div style="font-size:3.4rem">🎯</div><h2 style="font-size:1.7rem">Agora é praticar</h2>
        <p style="margin:0" class="muted">${sessionQ()} exercícios sobre o que você acabou de ver. Errou? A explicação aparece na hora, e a questão vai para o seu caderno de erros.</p></div>`;
      foot(`<button class="btn primary big" id="nx">Bora! →</button><button class="link" id="bk">Reler o resumo</button>`);
      $('#nx').onclick = adv; $('#bk').onclick = () => { L.i = 0; drawStep() };
    },
    q() { drawQ(P, st) },
    model() { drawModel(P, st.part) },
    write() { drawWrite(P, st.part) },
    rfintro() {
      P.innerHTML = `<div class="result sticker"><div style="font-size:3.4rem">✍️</div><h2 style="font-size:1.6rem">Juntando tudo</h2>
        <p style="margin:0">Primeiro você vê uma redação modelo inteira, com cada parte marcada. Depois o app junta os parágrafos que <b>você</b> escreveu e confere com o corretor automático.</p></div>`;
      foot(`<button class="btn primary big" id="nx">Ver a redação modelo →</button>`); $('#nx').onclick = adv;
    },
    review() { drawReview(P) },
    redacao() { drawRedacao(P) },
    kit() { drawKit(P) }
  };
  T[st.t]();
}

function drawQ(P, st) {
  const q = QALL[st.id], all = L.steps.filter(s => s.t === 'q'), qi = all.indexOf(st), qt = all.length;
  let sel = null;
  const label = L.custom ? L.custom.label : L.caderno ? 'Caderno de erros' : L.it.type === 'sim' ? 'Simulado' : L.round > 1 ? `Rodada ${L.round} · ${RNAME[L.round - 1]}` : 'Passo 2 · Pratique';
  P.innerHTML = `<div class="eyebrow">${label} · questão ${qi + 1} de ${qt}</div>
    <div class="qtext">${q.q}</div>
    <div class="opts">${st.opts.map((o, i) => `<button class="opt" data-i="${i}"><b>${'ABCDE'[i]}</b><span>${o.o}</span></button>`).join('')}</div>
    <div id="fb"></div>`;
  foot(`<button class="btn primary big" id="nx" disabled>Confirmar</button>`);
  const opts = P.querySelectorAll('.opt');
  opts.forEach(b => b.onclick = () => { sel = +b.dataset.i; opts.forEach(x => x.classList.toggle('sel', x === b)); $('#nx').disabled = false });
  $('#nx').onclick = () => {
    if (sel === null) return;
    const ok = st.opts[sel].ok; if (ok) L.score++;
    S.stats.ans++; if (ok) S.stats.ok++; track(st.id, ok); if (L.ans) L.ans.push({ id: st.id, ok });
    if (!ok) S.wrong[st.id] = 2; else if (S.wrong[st.id]) { S.wrong[st.id]--; if (S.wrong[st.id] <= 0) delete S.wrong[st.id] }
    save();
    opts.forEach((x, i) => { x.disabled = true; x.classList.remove('sel'); if (st.opts[i].ok) x.classList.add('right'); else if (i === sel) x.classList.add('wrong') });
    $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b>${ok ? 'Isso aí! ✅' : 'Quase! A certa está em verde. Ela foi para o caderno de erros.'}</b><br>${q.e}</div>`;
    $('#fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    foot(`<button class="btn primary big" id="nx2">${qi + 1 < qt ? 'Próxima →' : 'Ver resultado →'}</button>`); $('#nx2').onclick = adv; $('#nx2').focus();
  };
}

function record(it, round, score, total, pass, extra) {
  const d = S.done[it.id] || { r: 0, at: [], b: [], tries: 0 };
  d.tries = (d.tries || 0) + 1; d.b = d.b || []; d.at = d.at || [];
  d.b[round - 1] = Math.max(d.b[round - 1] || 0, score); d.total = total;
  if (d.skipped) delete d.skipped;
  if (pass && round > (d.r || 0)) { d.r = round; d.at[round - 1] = now() }
  Object.assign(d, extra || {});
  S.done[it.id] = d; save(); sinceBreak++;
}
function nextButton() {
  const na = nextAction(); if (!na || na.kind === 'early') return '';
  return `<button class="btn primary big" id="nxa">${na.kind === 'review' ? 'Revisão: ' : 'Próximo passo: '}${na.it.title} →</button>`;
}
function bindNext() { const b = $('#nxa'); if (b) b.onclick = () => { const na = nextAction(); openReplace(na.it, na.round) } }
function drawResult() {
  const it = L.it, tot = sessionQ(), sc = L.score, round = it.type === 'sim' ? 1 : L.round;
  const need = Math.ceil(tot * (it.type === 'sim' ? .6 : PASSR[round - 1])), pass = sc >= need;
  record(it, round, sc, tot, pass); $('#p-bar').style.width = '100%';
  if (pass) confetti();
  let msg, tag;
  if (!pass) { msg = `Para concluir a rodada ${round}, acerte pelo menos ${need} de ${tot}. As que você errou foram para o caderno de erros.`; tag = `<span class="tag" style="background:var(--bad)">Ainda não concluída</span>` }
  else if (rounds(it) > 1 && round < 3) { const t = now() + WAIT[round]; msg = `Rodada ${round} de 3 concluída! A próxima revisão abre ${inTime(WAIT[round])} (${hhmm(t)}). Enquanto isso, siga a trilha.`; tag = `<span class="tag" style="background:var(--ok)">✓ ${RNAME[round - 1]}</span>` }
  else if (rounds(it) > 1) { msg = 'Assunto dominado! Você passou pelas 3 rodadas. 🧠'; tag = `<span class="tag" style="background:var(--hum)">★★★ Dominado</span>` }
  else { msg = sc / tot >= .9 ? 'Arrasou! 🔥' : 'Passo concluído! Leia as explicações das que errou.'; tag = `<span class="tag" style="background:var(--ok)">✓ Concluído</span>` }
  const pause = pass && sinceBreak >= 2;
  $('#pinner').innerHTML = `<div class="result sticker"><div class="eyebrow">${it.title}${rounds(it) > 1 ? ' · rodada ' + round : ''}</div>
    ${rounds(it) > 1 ? `<div class="stars" style="color:var(--hum)">${stars(lvl(it), 3)}</div>` : ''}
    <div class="big">${sc}/${tot}</div><p style="margin:0;font-weight:800">${msg}</p>${tag}</div>
    ${pause ? `<div class="box sticker"><h3>Hora da pausa ☕</h3><p style="margin:0">Você fez ${sinceBreak} passos seguidos. Levante, beba água e fique 5 minutos longe da tela. Pausa também ajuda a memória.</p><div class="clock" id="pclock">05:00</div><button class="btn" id="pstart">Iniciar pausa de 5 min</button></div>` : ''}`;
  foot(`${!pass ? `<button class="btn primary big" id="redo">${it.learn ? 'Reler o resumo e refazer' : 'Refazer'} ↻</button>` : nextButton() || '<button class="btn primary big" id="home">Voltar ao início</button>'}
    <button class="link" id="tohome">Voltar ao início</button>`);
  bindNext();
  if ($('#home')) $('#home').onclick = () => closePlayer(false);
  $('#tohome').onclick = () => closePlayer(false);
  if ($('#redo')) $('#redo').onclick = () => { if (round > 1) { openReplace(it, round); L.steps.splice(1, 0, ...(it.learn || []).map((c, k) => ({ t: 'learn', c, k, re: true }))); drawStep() } else openReplace(it, 1) };
  if ($('#pstart')) $('#pstart').onclick = () => { sinceBreak = 0; startTimer(300, $('#pclock'), () => { beep(); toast('Pausa acabou! Bora 💪') }); $('#pstart').hidden = true };
}
function drawCadernoResult() {
  const tot = sessionQ(), sc = L.score, left = Object.keys(S.wrong).length, out = Math.max(0, L.before - left);
  $('#p-bar').style.width = '100%'; if (sc / tot >= .7) confetti();
  $('#pinner').innerHTML = `<div class="result sticker"><div style="font-size:3rem">📕</div><div class="big">${sc}/${tot}</div>
    <p style="margin:0;font-weight:800">${out ? `${out} ${out === 1 ? 'questão saiu' : 'questões saíram'} do caderno!` : 'Continue: cada questão sai quando você acertar 2 vezes.'}</p>
    <p style="margin:0" class="muted">Ainda no caderno: ${left}.</p></div>`;
  foot(`${left ? '<button class="btn primary big" id="again">Treinar de novo ↻</button>' : ''}${nextButton()}<button class="link" id="tohome">Voltar ao início</button>`);
  if ($('#again')) $('#again').onclick = () => { closePlayer(false); setTimeout(openCaderno, 50) };
  bindNext(); $('#tohome').onclick = () => closePlayer(false);
}

/* --- timer --- */
let tmr = null;
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function startTimer(sec, el, done) { clearInterval(tmr); let left = sec; el.textContent = fmt(left); tmr = setInterval(() => { left--; if (!el.isConnected) { clearInterval(tmr); return } el.textContent = fmt(Math.max(0, left)); if (left <= 0) { clearInterval(tmr); tmr = null; done && done() } }, 1000) }
function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)();[0, .3, .6].forEach(t => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.15, a.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + t + .25); o.start(a.currentTime + t); o.stop(a.currentTime + t + .25) }) } catch (e) {} }

/* ================= redação ================= */
const R = window.REDACAO;
function legendHTML(parts) {
  const keys = parts === 'concl' ? ['con', 'rep', 'ag', 'ac', 'mo', 'de', 'fi'] : parts === 'all' ? R.LEGEND.map(x => x[0]) : ['rep', 'tese', 'arg', 'con'];
  return `<div class="legend">${R.LEGEND.filter(x => keys.includes(x[0])).map(([k, n]) => `<span class="h-${k}">${n}</span>`).join('')}</div>`;
}
function modelHTML(part) {
  const ps = part === 'all' ? ['intro', 'd1', 'd2', 'concl'] : [part];
  return `<div class="essay marks">${ps.map(p => `<p>${R.MODEL[p]}</p>`).join('')}</div>`;
}
function drawModel(P, part) {
  const names = { intro: 'a introdução', d1: 'o 1º parágrafo de desenvolvimento', concl: 'a conclusão', all: 'a redação inteira' };
  P.innerHTML = `<div class="eyebrow">Veja um modelo</div>
    <div class="box sticker"><h2 style="font-size:1.3rem">Como fica ${names[part]}</h2>
    <p style="margin:0" class="muted">Tema: "${R.MODEL_TEMA}"</p>
    ${legendHTML(part)}${modelHTML(part)}
    <label class="check" style="background:none;padding:0"><input type="checkbox" id="mk" checked><span>Mostrar marcações</span></label></div>
    ${part === 'all' ? `<div class="box sticker"><h3>Por que essa redação vai bem</h3><ul>${R.WHY.map(w => `<li>${w}</li>`).join('')}</ul></div>` : `<p class="muted" style="margin:0;font-weight:700">Repare nas cores: cada parte tem uma função. Agora é a sua vez, com outro tema.</p>`}`;
  $('#mk').onchange = e => P.querySelector('.essay').classList.toggle('marks', e.target.checked);
  foot(`<button class="btn primary big" id="nx">${part === 'all' ? 'Agora a minha redação →' : 'Escrever a minha →'}</button>`); $('#nx').onclick = adv;
}
function drawWrite(P, part) {
  const def = R.PARTS[part], v = S.red[part] = S.red[part] || {};
  P.innerHTML = `<div class="eyebrow">Sua vez · escreva</div>
    <div class="box sticker"><h2 style="font-size:1.3rem">${def.title}</h2>
    <p style="margin:0"><b>Tema da sua redação:</b> "${R.MY_TEMA}"</p>
    <p style="margin:0" class="muted">Escreva uma frase em cada campo. O exemplo cinza é só uma ideia: escreva com suas palavras.</p></div>
    ${def.fields.map(f => `<label class="f wfield" for="w-${f.k}">${f.l}${f.pre ? `<span class="pre">começa com "${f.pre} ..."</span>` : ''}<textarea id="w-${f.k}" rows="${f.k === 'ag' ? 1 : 3}" placeholder="${esc(f.ph)}">${esc(v[f.k] || '')}</textarea></label>`).join('')}
    <div class="box sticker"><span class="eyebrow">Seu parágrafo até agora</span><div class="essay" id="wprev"></div></div>
    <button class="link" id="wex" style="align-self:flex-start">Ver como ficou no modelo</button><div id="wmodel" hidden></div>`;
  const min = 8;
  const upd = () => {
    def.fields.forEach(f => v[f.k] = $('#w-' + f.k).value.trim());
    $('#wprev').textContent = R.partText(part, v) || '…';
    const ok = def.fields.filter(f => (v[f.k] || '').length >= (f.k === 'ag' ? 3 : min)).length;
    $('#nx').disabled = ok < def.fields.length;
    $('#nx').textContent = ok < def.fields.length ? `Preencha todos (${ok}/${def.fields.length})` : 'Pronto, salvar →';
  };
  foot(`<button class="btn primary big" id="nx" disabled></button>`);
  def.fields.forEach(f => $('#w-' + f.k).addEventListener('input', () => { upd(); clearTimeout(drawWrite.t); drawWrite.t = setTimeout(save, 800) }));
  $('#wex').onclick = () => { const m = $('#wmodel'); m.hidden = !m.hidden; if (!m.hidden) m.innerHTML = `<div class="box sticker">${legendHTML(part === 'd2' ? 'd1' : part)}${modelHTML(part)}</div>` };
  upd();
  $('#nx').onclick = () => { save(); toast('Parágrafo salvo ✍️'); adv() };
}
function essayFromParts() { return ['intro', 'd1', 'd2', 'concl'].map(p => R.partText(p, S.red[p] || {})).filter(Boolean).join('\n\n') }
function checksHTML(text) {
  const c = R.check(text), okN = c.filter(x => x.ok).length;
  return `<div class="eyebrow">Corretor automático · ${okN} de ${c.length} itens ok</div><div class="checks">${c.map(x => `<div class="ck ${x.ok ? 'ok' : 'no'}"><span>${x.ok ? '✓' : '!'}</span><div><b>${x.l}</b><small>${x.d}</small></div></div>`).join('')}</div>`;
}
function copyText(text, btn) {
  const done = () => { const o = btn.textContent; btn.textContent = 'Copiado ✓'; setTimeout(() => btn.textContent = o, 1400) };
  try { navigator.clipboard.writeText(text).then(done, done) } catch (e) { done() }
}
function drawReview(P) {
  const text = S.red.full || essayFromParts();
  P.innerHTML = `<div class="eyebrow">A sua redação</div>
    <div class="box sticker"><h2 style="font-size:1.3rem">"${R.MY_TEMA}"</h2>
    <p style="margin:0" class="muted">O app juntou seus parágrafos. Melhore o texto aqui mesmo: o corretor confere enquanto você digita. Deixe uma linha em branco entre os parágrafos.</p>
    <textarea id="full" rows="16">${esc(text)}</textarea>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" id="cp">Copiar texto</button><button class="btn small" id="rs">Juntar de novo os parágrafos</button></div></div>
    <div class="box sticker" id="cks"></div>
    <p class="muted" style="margin:0;font-weight:700">O corretor pega erros comuns, mas não dá nota. Para treinar de verdade, passe a limpo no papel em até 30 linhas.</p>`;
  const upd = () => { $('#cks').innerHTML = checksHTML($('#full').value) };
  $('#full').addEventListener('input', () => { S.red.full = $('#full').value; upd(); clearTimeout(drawReview.t); drawReview.t = setTimeout(save, 800) });
  $('#cp').onclick = e => copyText($('#full').value, e.target);
  $('#rs').onclick = () => { delete S.red.full; $('#full').value = essayFromParts(); upd(); save() };
  upd();
  foot(`<button class="btn primary big" id="nx">Concluir ✓</button>`);
  $('#nx').onclick = () => { save(); missionDone('Você escreveu sua primeira redação completa no método! Agora é treinar no papel. ✍️') };
}
function drawRedacao(P) {
  const C = ['Tem entre 25 e 30 linhas', 'Introdução com repertório e tese', 'Dois parágrafos de argumento, cada um com explicação e prova', 'Conectivo no começo de cada parágrafo', 'Conclusão com agente, ação, meio, detalhamento e finalidade', 'Reli e corrigi acentos e concordância'];
  const id = L.it.id, ck = S.checks[id] = S.checks[id] || {};
  if (S.mt[id] == null) S.mt[id] = id === 'm-redacao' ? 7 : 1;
  const draw = () => {
    P.innerHTML = `<div class="eyebrow">Missão · no papel, como na prova</div>
      <div class="box sticker"><span class="muted" style="font-weight:800">Seu tema:</span>
        <p style="margin:0;font-family:var(--display);font-size:1.3rem;font-weight:700">"${R.TEMAS[S.mt[id]]}"</p>
        <button class="link" id="sort" style="align-self:flex-start">🎲 Sortear outro tema</button>
        <ol><li>Papel e caneta. Celular só para o cronômetro.</li><li>15 min: sublinhe as palavras-chave e faça o rascunho (problema, 2 causas, proposta).</li><li>50 min: escreva os 4 parágrafos.</li><li>15 min: passe a limpo e confira.</li></ol>
        <div class="clock" id="rclock">80:00</div><button class="btn primary" id="rstart">Iniciar cronômetro de 1h20</button></div>
      <div class="box sticker"><h3>Quer o corretor automático?</h3><p style="margin:0" class="muted">Digite sua redação aqui (opcional). Pule uma linha entre os parágrafos.</p>
        <textarea id="mtext" rows="10" placeholder="Digite ou cole aqui…">${esc((S.red.m && S.red.m[id]) || '')}</textarea><div id="mcks"></div></div>
      <div class="box sticker"><h3>Confira antes de terminar</h3><div style="display:flex;flex-direction:column;gap:8px">
        ${C.map((c, i) => `<label class="check"><input type="checkbox" id="rc-${i}" ${ck[i] ? 'checked' : ''}><span>${c}</span></label>`).join('')}</div></div>`;
    $('#sort').onclick = () => { let n; do { n = Math.floor(Math.random() * R.TEMAS.length) } while (n === S.mt[id]); S.mt[id] = n; save(); draw() };
    $('#rstart').onclick = () => { startTimer(80 * 60, $('#rclock'), () => { beep(); toast('Tempo! Hora de conferir a redação.') }); $('#rstart').hidden = true };
    const mu = () => { const t = $('#mtext').value; $('#mcks').innerHTML = t.trim().length > 30 ? '<div style="margin-top:10px">' + checksHTML(t) + '</div>' : '' };
    $('#mtext').addEventListener('input', () => { S.red.m = S.red.m || {}; S.red.m[id] = $('#mtext').value; mu(); clearTimeout(drawRedacao.t); drawRedacao.t = setTimeout(save, 800) }); mu();
    C.forEach((_, i) => $('#rc-' + i).onchange = e => { ck[i] = e.target.checked; save() });
  };
  draw();
  foot(`<button class="btn primary big" id="nx">Terminei a redação ✓</button><button class="link" id="sk">Fazer depois (pular por agora)</button>`);
  $('#nx').onclick = () => missionDone('Redação feita! É o treino que mais sobe a nota. ✍️');
  $('#sk').onclick = () => { S.done[L.it.id] = { skipped: true, at: [now()], r: 0 }; save(); toast('Pulado. A missão continua na trilha.'); const na = nextAction(); na && na.it !== L.it ? openReplace(na.it, na.round) : closePlayer(false) };
}
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
  record(L.it, 1, 0, 0, true, { mission: true }); confetti(); $('#p-bar').style.width = '100%'; clearInterval(tmr);
  $('#pinner').innerHTML = `<div class="result sticker"><div style="font-size:3.4rem">🏅</div><div class="big" style="font-size:2.4rem">Missão cumprida</div><p style="margin:0;font-weight:800">${msg}</p><span class="tag" style="background:var(--ok)">✓ Concluído</span></div>`;
  foot(`${nextButton()}<button class="link" id="tohome">Voltar ao início</button>`);
  bindNext(); $('#tohome').onclick = () => closePlayer(false);
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


/* ================= API usada pelo pro.js ================= */
window.ET = {
  get S() { return S }, get USER() { return USER }, get PLAN() { return PLAN }, get fb() { return fb }, CLOUD,
  QALL, BANKMAP, subjOf, difOf, provaOf, dayKey, FLAT, closed: it => closed(it), lvl: it => lvl(it), nextAction: () => nextAction(),
  save, toast, esc, confetti: () => confetti(), shuffle: a => shuffle(a), openItem: (it, r) => openItem(it, r), openCustom, openCaderno: () => openCaderno(),
  closePlayer: () => closePlayer(false), foot: h => foot(h), renderHome: () => renderHome(), qStep: id => qStep(id), startSimTimer
};
PRO.init(window.ET);

/* ================= iniciar ================= */
let ticking = null;
function startApp() { migrate(); if (!S.first) { S.first = Date.now(); save() } show('home'); renderHome(); PRO.onStart(); tick(); if (!ticking) ticking = setInterval(tick, 1000) }
CLOUD ? bootCloud() : bootLocal();
})();
