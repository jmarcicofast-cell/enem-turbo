// ENEM Turbo Pro — assinatura, treino livre, simulados, redação com IA, cronograma e painel de desempenho
(function () {
'use strict';
const $ = s => document.querySelector(s);
let ET = null;
const S = () => ET.S;
const DAY = 864e5;
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = (o, a) => a ? Math.round(o / a * 100) : 0;
const fmtDate = t => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Preços exibidos (o valor cobrado de verdade fica no servidor: functions/index.js)
const PLANOS = [
  { id: 'mensal', nome: '1 mês', preco: 19.9, sub: 'Para experimentar' },
  { id: 'semestral', nome: '6 meses', preco: 79.9, sub: 'R$ 13,32 por mês' },
  { id: 'anual', nome: '12 meses', preco: 119.9, sub: 'R$ 9,99 por mês · melhor preço', top: true }
];
// Degustação grátis
const FREE = { treinoDia: 15, simulados: 1, painelDias: 3, cronoDias: 2 };

function isPro() { const a = ET.PLAN && ET.PLAN.ate; return !!(a && a.toMillis && a.toMillis() > Date.now()) }
function proAte() { const a = ET.PLAN && ET.PLAN.ate; return a && a.toMillis ? a.toMillis() : 0 }
function trial() { const s = S(); s.trial = s.trial || { sim: 0, td: { d: '', n: 0 } }; return s.trial }
function treinoRestante() { if (isPro()) return Infinity; const t = trial(), k = ET.dayKey(); if (t.td.d !== k) t.td = { d: k, n: 0 }; return Math.max(0, FREE.treinoDia - t.td.n) }
function painelLivre() { return isPro() || Date.now() - (S().first || Date.now()) < FREE.painelDias * DAY }

/* ======================= navegação ======================= */
const VIEWS = [
  { id: 'inicio', el: '#home', ic: '🏠', n: 'Início' },
  { id: 'treinar', el: '#v-treinar', ic: '🎯', n: 'Treinar', render: renderTreinar },
  { id: 'redacao', el: '#v-redacao', ic: '✍️', n: 'Redação', render: renderRedacao },
  { id: 'crono', el: '#v-crono', ic: '🗓️', n: 'Cronograma', render: renderCrono },
  { id: 'painel', el: '#v-painel', ic: '📊', n: 'Desempenho', render: renderPainel }
];
let view = 'inicio', shell = false;
function setView(id, keepScroll) {
  view = id;
  VIEWS.forEach(v => { $(v.el).hidden = !shell || v.id !== id });
  document.querySelectorAll('#nav button').forEach(b => b.setAttribute('aria-current', b.dataset.v === id ? 'page' : 'false'));
  const v = VIEWS.find(x => x.id === id);
  if (v.render) v.render(); else ET.renderHome();
  if (!keepScroll) window.scrollTo(0, 0);
}
function buildNav() {
  $('#nav').innerHTML = VIEWS.map(v => `<button data-v="${v.id}"><span class="ic" aria-hidden="true">${v.ic}</span><span>${v.n}</span></button>`).join('');
  $('#nav').onclick = e => { const b = e.target.closest('button'); if (b) setView(b.dataset.v) };
}

/* ======================= assinatura ======================= */
function proBadge() {
  const b = $('#pro-btn'); if (!b) return;
  if (isPro()) { b.textContent = '⭐ PRO'; b.classList.add('is-pro') } else { b.textContent = '⭐ Seja Pro'; b.classList.remove('is-pro') }
}
function openPro(motivo) {
  const sh = $('#pro-sheet'), pro = isPro();
  let sel = 'anual';
  const draw = () => {
    sh.querySelector('.sheet').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 class="logo" style="font-size:1.5rem">ENEM <span>Turbo</span> Pro</h3><button class="link" id="pro-x" aria-label="Fechar">✕</button></div>
      ${motivo ? `<p class="feedback no" style="margin:0">${motivo}</p>` : ''}
      ${pro ? `<p class="feedback ok" style="margin:0">Seu Pro vale até <b>${fmtDate(proAte())}</b>. Se renovar agora, os dias se somam.</p>` : ''}
      <ul class="benef">
        <li>✍️ <b>Correção de redação com IA</b>: nota por competência, ENEM ou UERJ, até 5 por dia</li>
        <li>🎯 <b>Banco completo de questões</b> com filtros de matéria, nível e prova, sem limite diário</li>
        <li>⏱ <b>Simulados cronometrados</b> do ENEM e da Qualificação da UERJ</li>
        <li>🗓️ <b>Cronograma completo</b> até o dia da prova, montado para o seu curso</li>
        <li>📊 <b>Painel de desempenho</b> com pontos fracos e evolução</li>
      </ul>
      <div class="plans">${PLANOS.map(p => `<button class="plan ${p.id === sel ? 'sel' : ''} ${p.top ? 'top' : ''}" data-p="${p.id}">${p.top ? '<span class="ribbon">Mais escolhido</span>' : ''}<b>${p.nome}</b><span class="price">${brl(p.preco)}</span><small>${p.sub}</small></button>`).join('')}</div>
      ${!ET.CLOUD ? '<p class="err">Para assinar, o app precisa estar com login por e-mail ativado.</p>' : ''}
      <button class="btn primary big" id="pay" ${!ET.CLOUD ? 'disabled' : ''}>Pagar com Mercado Pago · Pix ou cartão</button>
      <p class="muted" style="margin:0;font-size:.82rem;text-align:center">Pagamento único, sem renovação automática. O Pro é liberado assim que o pagamento é aprovado.</p>`;
    sh.querySelectorAll('.plan').forEach(b => b.onclick = () => { sel = b.dataset.p; draw() });
    $('#pro-x').onclick = () => sh.hidden = true;
    $('#pay').onclick = async () => {
      const btn = $('#pay'); btn.disabled = true; btn.textContent = 'Abrindo o Mercado Pago…';
      try {
        const r = await ET.fb.fn.httpsCallable('criarPagamento')({ plano: sel });
        location.href = r.data.url;
      } catch (e) { btn.disabled = false; btn.textContent = 'Pagar com Mercado Pago · Pix ou cartão'; ET.toast(erroFn(e, 'Não consegui abrir o pagamento.')) }
    };
  };
  draw(); sh.hidden = false;
  sh.onclick = e => { if (e.target === sh) sh.hidden = true };
}
function erroFn(e, padrao) {
  const c = (e && e.code) || '';
  if (/not-found|internal|unimplemented/.test(c) && !/Não achei/.test(e.message || '')) return 'Esse recurso ainda não foi ativado no servidor. Fale com a administradora.';
  if (/unauthenticated/.test(c)) return 'Entre na sua conta para usar.';
  return (e && e.message && !/^internal$/i.test(e.message)) ? e.message : padrao;
}
function lockCard(txt) { return `<div class="lock"><div><b>🔒 ${txt}</b><button class="btn primary" data-pro="1">Conhecer o Pro</button></div></div>` }
function bindPro(root) { (root || document).querySelectorAll('[data-pro]').forEach(b => b.onclick = () => openPro()) }

/* ======================= início: cartões extras ======================= */
function renderHomeExtra() {
  proBadge();
  const el = $('#home-extra'); if (!el) return;
  let h = '';
  const pl = S().plano;
  if (pl) {
    const hoje = cronoDia(new Date()), feitos = hoje ? hoje.blocos.filter((b, i) => doneBlock(hoje.key, i)).length : 0;
    h += `<div class="box sticker"><div class="eyebrow">Hoje no seu cronograma</div>
      ${hoje && hoje.blocos.length ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b style="font-size:1.1rem">${feitos} de ${hoje.blocos.length} blocos feitos</b><button class="btn small" id="go-crono">Ver hoje →</button></div><div class="bar"><i style="width:${pct(feitos, hoje.blocos.length)}%"></i></div>` : `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b>Hoje é dia de descanso 😌</b><button class="btn small" id="go-crono">Ver semana</button></div>`}</div>`;
  } else {
    h += `<button class="box sticker cta" id="go-crono"><span style="font-size:1.8rem">🗓️</span><span><b>Monte seu cronograma até a prova</b><small>Data, curso e horas por dia: o app distribui as matérias para você.</small></span></button>`;
  }
  if (!isPro()) h += `<button class="box sticker cta procta" data-pro="1"><span style="font-size:1.8rem">⭐</span><span><b>Conheça o Pro</b><small>Redação corrigida por IA, simulados ENEM e UERJ, banco completo e painel.</small></span></button>`;
  el.innerHTML = h;
  const g = $('#go-crono'); if (g) g.onclick = () => setView('crono');
  bindPro(el);
}

/* ======================= treinar ======================= */
const SUBJ = () => window.BANK_SUBJ;
const tf = { m: 'all', d: 'all', p: 'enem', n: 10, fraco: false };
function poolFor(f) {
  return Object.keys(ET.QALL).filter(id => {
    const m = ET.subjOf(id); if (m === 'geral') return false;
    if (f.m !== 'all' && m !== f.m) return false;
    if (f.d !== 'all' && ET.difOf(id) !== f.d) return false;
    const p = ET.provaOf(id); if (p !== 'ambos' && p !== f.p) return false;
    return true;
  });
}
function chips(group, opts, cur) { return `<div class="chips" data-g="${group}">${opts.map(([v, l]) => `<button class="chip" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join('')}</div>` }
function renderTreinar() {
  const el = $('#v-treinar'), rest = treinoRestante(), wrongN = Object.keys(S().wrong || {}).filter(k => ET.QALL[k]).length;
  const subj = [['all', 'Todas']].concat(Object.entries(SUBJ()).map(([k, v]) => [k, v.n]));
  const pool = poolFor(tf);
  el.innerHTML = `<div class="vhead"><h1>Treinar</h1><p class="muted">Questões por matéria, simulados cronometrados e o seu caderno de erros.</p></div>
  <div class="box sticker"><h2>Treino livre</h2>
    <span class="lbl">Prova</span>${chips('p', [['enem', 'ENEM'], ['uerj', 'UERJ']], tf.p)}
    <span class="lbl">Matéria</span>${chips('m', subj, tf.m)}
    <span class="lbl">Nível</span>${chips('d', [['all', 'Todos'], ['f', 'Fácil'], ['m', 'Médio'], ['d', 'Difícil']], tf.d)}
    <span class="lbl">Quantidade</span>${chips('n', [[10, '10'], [20, '20'], [30, '30']], tf.n)}
    <label class="check" style="background:none;padding:0"><input type="checkbox" id="t-fraco" ${tf.fraco ? 'checked' : ''}><span>Priorizar o que eu mais erro ${isPro() ? '' : '<span class="pill">PRO</span>'}</span></label>
    <p class="muted" style="margin:0;font-weight:700">${pool.length} questões disponíveis com esses filtros.${isPro() ? '' : ` Grátis: ${FREE.treinoDia} por dia · restam <b>${rest}</b> hoje.`}</p>
    <button class="btn primary big" id="t-go">Começar treino →</button>
  </div>
  <div class="box sticker"><h2>Simulados</h2>
    <p class="muted" style="margin:0">Cronometrados, sem consulta, com resultado por área e por nível. ${isPro() ? '' : `<b>${Math.max(0, FREE.simulados - trial().sim)} simulado grátis</b> para experimentar.`}</p>
    <div class="simlist">${SIMS.map(sm => `<button class="sim" data-s="${sm.id}"><span class="tag" style="background:${sm.cor}">${sm.prova}</span><b>${sm.nome}</b><small>${sm.desc}</small>${sm.free || isPro() ? '' : '<span class="pill">PRO</span>'}</button>`).join('')}</div>
  </div>
  <div class="box sticker"><h2>📕 Caderno de erros</h2><p class="muted" style="margin:0">${wrongN ? `${wrongN} questões esperando. Cada uma sai quando você acertar 2 vezes.` : 'Vazio por enquanto. As questões que você errar aparecem aqui.'}</p>
    ${wrongN ? '<button class="btn" id="t-cad">Treinar meus erros</button>' : ''}</div>`;
  el.querySelectorAll('.chips').forEach(c => c.onclick = e => { const b = e.target.closest('.chip'); if (!b) return; const g = c.dataset.g; tf[g] = g === 'n' ? +b.dataset.v : b.dataset.v; renderTreinar() });
  $('#t-fraco').onchange = e => { if (!isPro()) { e.target.checked = false; return openPro('Priorizar seus pontos fracos é um recurso Pro.') } tf.fraco = e.target.checked };
  $('#t-go').onclick = startTreino;
  el.querySelectorAll('.sim').forEach(b => b.onclick = () => startSim(b.dataset.s));
  if ($('#t-cad')) $('#t-cad').onclick = () => ET.openCaderno();
}
function weakness(m) { const a = (S().agg && S().agg.m[m]) || { a: 0, o: 0 }; return a.a < 3 ? 0.5 : 1 - a.o / a.a }
function startTreino() {
  let ids = poolFor(tf);
  if (!ids.length) return ET.toast('Nenhuma questão com esses filtros.');
  const rest = treinoRestante();
  if (rest <= 0) return openPro(`Você já fez as ${FREE.treinoDia} questões grátis de hoje. No Pro o treino é ilimitado.`);
  const wrong = S().wrong || {};
  ids = ET.shuffle(ids);
  if (tf.fraco) ids.sort((a, b) => (wrong[b] ? 1 : 0) - (wrong[a] ? 1 : 0) || weakness(ET.subjOf(b)) - weakness(ET.subjOf(a)));
  ids = ids.slice(0, Math.min(tf.n, rest));
  if (!isPro()) { trial().td.n += ids.length; ET.save() }
  const nome = tf.m === 'all' ? 'Treino misto' : 'Treino de ' + SUBJ()[tf.m].n;
  ET.openCustom({ title: nome, area: tf.m === 'all' ? 'geral' : (SUBJ()[tf.m].area === 'red' ? 'red' : SUBJ()[tf.m].area), ids, label: nome, onDone: L => resultado(L, { nome, tipo: 'treino' }) });
}

/* ---------- simulados ---------- */
const AREA_OF = m => (SUBJ()[m] || {}).area || 'geral';
const SIMS = [
  { id: 'mini', prova: 'Misto', cor: 'var(--hum)', nome: 'Mini-simulado', desc: '15 questões de todas as áreas · 45 min', free: true, n: { lin: 4, hum: 4, mat: 4, nat: 3 }, p: 'enem', min: 45 },
  { id: 'enem1', prova: 'ENEM', cor: 'var(--lin)', nome: '1º dia: Linguagens e Humanas', desc: '30 questões · 1h30', n: { lin: 15, hum: 15 }, p: 'enem', min: 90 },
  { id: 'enem2', prova: 'ENEM', cor: 'var(--mat)', nome: '2º dia: Natureza e Matemática', desc: '30 questões · 1h45', n: { nat: 15, mat: 15 }, p: 'enem', min: 105 },
  { id: 'uerj', prova: 'UERJ', cor: 'var(--nat)', nome: 'Exame de Qualificação', desc: '60 questões das 4 áreas, no formato da 1ª fase · 3h', n: { lin: 15, hum: 15, nat: 15, mat: 15 }, p: 'uerj', min: 180 }
];
function startSim(id) {
  const sm = SIMS.find(x => x.id === id);
  if (!sm.free && !isPro()) {
    if (trial().sim >= FREE.simulados) return openPro('Você já usou seu simulado grátis. No Pro os simulados são ilimitados.');
  }
  const ids = [];
  Object.entries(sm.n).forEach(([area, q]) => {
    const pool = ET.shuffle(Object.keys(ET.QALL).filter(k => { const m = ET.subjOf(k); if (m === 'geral' || m === 'red') return false; const p = ET.provaOf(k); return AREA_OF(m) === area && (p === 'ambos' || p === sm.p) }));
    // mistura níveis como numa prova real: ~25% fáceis, ~50% médias, ~25% difíceis
    const g = { f: pool.filter(k => ET.difOf(k) === 'f'), m: pool.filter(k => ET.difOf(k) === 'm'), d: pool.filter(k => ET.difOf(k) === 'd') };
    const want = { f: Math.round(q * .25), d: Math.round(q * .25) }; want.m = q - want.f - want.d;
    const pick = []; ['f', 'm', 'd'].forEach(k => pick.push(...g[k].splice(0, want[k])));
    const rest = ET.shuffle(g.f.concat(g.m, g.d)); while (pick.length < q && rest.length) pick.push(rest.pop());
    ids.push(...ET.shuffle(pick));
  });
  const intro = `<div class="box sticker"><span class="eyebrow">Simulado ${sm.prova}</span><h2 style="font-size:1.6rem">${sm.nome}</h2>
    <p style="margin:0">${ids.length} questões. O cronômetro começa quando você tocar em Começar. Quando o tempo acabar, a prova fecha sozinha.</p>
    <ul><li>Sem consulta, como na prova.</li><li>Não deixe nada em branco: erro não desconta.</li><li>Travou? Responda o mais provável e siga.</li></ul></div>`;
  ET.openCustom({ title: sm.nome, area: 'geral', ids, label: 'Simulado ' + sm.prova, intro, startLabel: 'Começar · ' + (sm.min >= 60 ? Math.floor(sm.min / 60) + 'h' + (sm.min % 60 ? String(sm.min % 60).padStart(2, '0') : '') : sm.min + ' min'), timerSec: sm.min * 60, onBegin: () => { if (!sm.free && !isPro()) { trial().sim++; ET.save() } }, onDone: L => resultado(L, { nome: sm.nome, tipo: 'sim', sim: sm }) });
}

/* ---------- resultado de treino / simulado ---------- */
function resultado(L, info) {
  const ans = L.ans || [], tot = L.steps.filter(s => s.t === 'q').length, ok = ans.filter(a => a.ok).length, branco = tot - ans.length;
  const by = (fn) => { const o = {}; ans.forEach(a => { const k = fn(a.id); o[k] = o[k] || { a: 0, o: 0 }; o[k].a++; if (a.ok) o[k].o++ }); return o };
  const porArea = by(id => AREA_OF(ET.subjOf(id))), porDif = by(id => ET.difOf(id)), porMat = by(id => ET.subjOf(id));
  const facilErr = ans.filter(a => !a.ok && ET.difOf(a.id) === 'f').length, dificilOk = ans.filter(a => a.ok && ET.difOf(a.id) === 'd').length;
  const p = pct(ok, tot);
  if (info.tipo === 'sim') { const s = S(); s.sims = s.sims || []; s.sims.push({ t: Date.now(), id: info.sim.id, nome: info.nome, ok, n: tot, area: Object.fromEntries(Object.entries(porArea).map(([k, v]) => [k, pct(v.o, v.a)])) }); s.sims = s.sims.slice(-30); ET.save() }
  if (p >= 70) ET.confetti();
  const AN = { lin: 'Linguagens', hum: 'Humanas', nat: 'Natureza', mat: 'Matemática', red: 'Redação' }, DN = { f: 'Fácil', m: 'Médio', d: 'Difícil' };
  const bars = (o, names) => Object.entries(o).map(([k, v]) => `<div class="hbar"><span>${names[k] || (SUBJ()[k] || {}).n || k}</span><div class="track"><i style="width:${pct(v.o, v.a)}%"></i></div><b>${v.o}/${v.a}</b></div>`).join('');
  const piores = Object.entries(porMat).filter(([, v]) => v.a >= 2).sort((a, b) => a[1].o / a[1].a - b[1].o / b[1].a).slice(0, 2);
  $('#pinner').innerHTML = `<div class="result sticker"><div class="eyebrow">${info.nome}</div><div class="big">${ok}/${tot}</div>
      <p style="margin:0;font-weight:800">${p >= 80 ? 'Excelente! 🔥' : p >= 60 ? 'Bom resultado. Revise os erros.' : 'Treino é isso: agora você sabe onde focar.'}</p>
      <span class="tag" style="background:${p >= 60 ? 'var(--ok)' : 'var(--hum)'}">${p}% de acertos</span>
      ${L.timeout ? '<p class="err" style="margin:0">O tempo acabou.' + (branco ? ` ${branco} ficaram em branco.` : '') + '</p>' : ''}</div>
    ${info.tipo === 'sim' ? `<div class="box sticker"><h3>Por área</h3>${bars(porArea, AN)}</div>` : ''}
    <div class="box sticker"><h3>Por nível</h3>${bars(porDif, DN)}
      ${facilErr >= 2 ? `<p class="feedback no" style="margin:0">Você errou ${facilErr} questões fáceis. No ENEM (TRI), errar fácil e acertar difícil derruba a nota. Revise com calma as fáceis.</p>` : dificilOk ? `<p class="feedback ok" style="margin:0">Você acertou ${dificilOk} ${dificilOk > 1 ? 'difíceis' : 'difícil'}. Mantenha a atenção nas fáceis para a nota render.</p>` : ''}</div>
    ${piores.length ? `<div class="box sticker"><h3>Onde focar</h3><ul>${piores.map(([m, v]) => `<li><b>${(SUBJ()[m] || {}).n || m}</b>: ${v.o} de ${v.a}</li>`).join('')}</ul><p class="muted" style="margin:0">As que você errou já estão no caderno de erros.</p></div>` : ''}`;
  ET.foot(`<button class="btn primary big" id="r-home">Concluir</button>${(S().wrong && Object.keys(S().wrong).length) ? '<button class="link" id="r-cad">Treinar meus erros agora</button>' : ''}`);
  $('#r-home').onclick = () => ET.closePlayer();
  if ($('#r-cad')) $('#r-cad').onclick = () => { ET.closePlayer(); setTimeout(() => ET.openCaderno(), 60) };
}

/* ======================= redação com IA ======================= */
let iaHist = null, iaBusy = false, iaRes = null;
function rd() { const s = S(); s.ia = s.ia || { prova: 'enem', tema: 0, outro: '', titulo: '', texto: '' }; return s.ia }
function temaAtual() { const r = rd(); return r.tema === -1 ? r.outro : window.REDACAO.TEMAS[r.tema] }
function renderRedacao() {
  const el = $('#v-redacao'), r = rd(), R = window.REDACAO, pro = isPro(), P = ET.PLAN || {};
  const gratis = Math.max(0, 1 - (P.iaGratisUsadas || 0)), hojeUsadas = P.iaDia === new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10) ? (P.iaHoje || 0) : 0;
  const status = !ET.CLOUD ? 'A correção com IA precisa de login por e-mail.' : pro ? `Pro: ${Math.max(0, 5 - hojeUsadas)} de 5 correções disponíveis hoje.` : gratis ? 'Você tem <b>1 correção grátis</b> para experimentar.' : 'Sua correção grátis já foi usada. No Pro são até 5 por dia.';
  el.innerHTML = `<div class="vhead"><h1>Redação</h1><p class="muted">Escreva e receba nota por competência, com comentários e o que melhorar.</p></div>
  <div class="box sticker">
    <h2>Corretor com IA ${pro ? '' : '<span class="pill">PRO</span>'}</h2>
    <p class="muted" style="margin:0">${status}</p>
    <span class="lbl">Prova</span>${chips('prova', [['enem', 'ENEM (0 a 1000)'], ['uerj', 'UERJ (0 a 20)']], r.prova)}
    <p class="muted" style="margin:0;font-size:.88rem">${r.prova === 'uerj' ? 'UERJ: dissertativo-argumentativo de 20 a 30 linhas, com título. Não precisa de proposta de intervenção.' : 'ENEM: dissertativo-argumentativo de até 30 linhas, com proposta de intervenção completa.'}</p>
    <label class="f" for="ia-tema">Tema<select id="ia-tema">${R.TEMAS.map((t, i) => `<option value="${i}" ${r.tema === i ? 'selected' : ''}>${ET.esc(t)}</option>`).join('')}<option value="-1" ${r.tema === -1 ? 'selected' : ''}>Outro tema…</option></select></label>
    <label class="f" for="ia-outro" ${r.tema === -1 ? '' : 'hidden'}>Escreva o tema<input type="text" id="ia-outro" value="${ET.esc(r.outro)}" placeholder="Ex.: Desafios para..."></label>
    <label class="f" for="ia-tit" ${r.prova === 'uerj' ? '' : 'hidden'}>Título<input type="text" id="ia-tit" value="${ET.esc(r.titulo)}" placeholder="Um título curto e ligado à sua tese"></label>
    <label class="f" for="ia-txt">Sua redação <span class="muted" id="ia-count" style="font-weight:700"></span><textarea id="ia-txt" rows="16" placeholder="Digite ou cole sua redação. Pule uma linha entre os parágrafos.">${ET.esc(r.texto)}</textarea></label>
    <div id="ia-quick"></div>
    <button class="btn primary big" id="ia-go">${iaBusy ? 'Corrigindo…' : 'Corrigir com IA'}</button>
  </div>
  <div id="ia-res">${iaRes ? resHTML(iaRes) : ''}</div>
  <div class="box sticker"><h2>Treine a estrutura</h2><p class="muted" style="margin:0">O curso de redação passo a passo e as missões no papel estão na trilha do Início.</p><button class="btn" id="ia-trilha">Ir para a trilha</button></div>
  <div class="box sticker" id="ia-hist"><h2>Suas correções</h2><p class="muted" style="margin:0">Carregando…</p></div>`;
  el.querySelector('.chips').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; r.prova = b.dataset.v; ET.save(); renderRedacao() };
  $('#ia-tema').onchange = e => { r.tema = +e.target.value; ET.save(); renderRedacao() };
  const inp = (id, k) => { const x = $(id); if (x) x.addEventListener('input', () => { r[k] = x.value; clearTimeout(renderRedacao.t); renderRedacao.t = setTimeout(ET.save, 800); if (k === 'texto') quick() }) };
  inp('#ia-outro', 'outro'); inp('#ia-tit', 'titulo'); inp('#ia-txt', 'texto');
  const quick = () => {
    const t = $('#ia-txt').value.trim(), w = t ? t.split(/\s+/).length : 0;
    $('#ia-count').textContent = w ? `· ${w} palavras (≈ ${Math.round(w / 11.5)} linhas)` : '';
    const c = t.length > 80 ? R.check(t).filter(x => !x.ok) : [];
    $('#ia-quick').innerHTML = c.length ? `<details class="quick"><summary>Corretor rápido: ${c.length} ponto${c.length > 1 ? 's' : ''} para revisar antes de enviar</summary>${c.map(x => `<p><b>${x.l}</b><br><small>${x.d}</small></p>`).join('')}</details>` : '';
  };
  quick();
  $('#ia-go').onclick = corrigir;
  $('#ia-trilha').onclick = () => setView('inicio');
  bindRes(); loadHist();
}
async function corrigir() {
  if (iaBusy) return;
  const r = rd();
  if (!ET.CLOUD || !ET.fb) return ET.toast('A correção com IA precisa de login por e-mail.');
  const P = ET.PLAN || {};
  if (!isPro() && (P.iaGratisUsadas || 0) >= 1) return openPro('Sua correção grátis já foi usada. No Pro você corrige até 5 redações por dia.');
  if ((r.texto || '').trim().split(/\s+/).length < 60) return ET.toast('Escreva a redação completa antes de enviar.');
  if (r.prova === 'uerj' && !r.titulo.trim()) return ET.toast('A UERJ pede título. Dê um título ao seu texto.');
  iaBusy = true; const b = $('#ia-go'); b.disabled = true; b.innerHTML = '<span class="spin"></span> Corrigindo… leva cerca de 30 segundos';
  try {
    const out = await ET.fb.fn.httpsCallable('corrigirRedacao', { timeout: 150000 })({ prova: r.prova, tema: temaAtual(), titulo: r.titulo, texto: r.texto });
    iaRes = out.data.resultado; iaRes._tema = temaAtual();
    const s = S(); s.iaNotas = s.iaNotas || []; s.iaNotas.push({ t: Date.now(), nota: iaRes.nota_total, max: iaRes.nota_max, prova: iaRes.prova }); ET.save();
    iaHist = null; ET.confetti();
  } catch (e) {
    if (e && /SEM_GRATIS/.test(e.message || '')) openPro('Sua correção grátis já foi usada. No Pro você corrige até 5 redações por dia.');
    else ET.toast(erroFn(e, 'A correção falhou. Tente de novo.'));
  }
  iaBusy = false;
  if (view === 'redacao') { renderRedacao(); const x = $('#ia-res'); if (x && iaRes) x.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
}
function resHTML(res) {
  const max = res.nota_max, frac = res.nota_total / max;
  return `<div class="box sticker iares">
    <div class="eyebrow">Correção por IA · ${res.prova === 'uerj' ? 'UERJ' : 'ENEM'}${res._tema ? ' · ' + ET.esc(res._tema) : ''}</div>
    <div class="nota"><b>${String(res.nota_total).replace('.', ',')}</b><span>/ ${max}</span></div>
    <div class="bar big"><i style="width:${Math.round(frac * 100)}%"></i></div>
    ${res.zerada ? `<p class="feedback no" style="margin:0"><b>Essa redação seria zerada:</b> ${ET.esc(res.motivo_zero || '')}</p>` : ''}
    ${(res.itens || []).map(it => `<details class="comp" open><summary><span>${ET.esc(it.titulo)}</span><b>${String(it.nota).replace('.', ',')}/${it.max}</b></summary><div class="track"><i style="width:${Math.round(it.nota / it.max * 100)}%"></i></div><p>${ET.esc(it.comentario)}</p><p class="melhor">💡 ${ET.esc(it.melhorar)}</p></details>`).join('')}
    ${res.pontos_fortes && res.pontos_fortes.length ? `<h3>Pontos fortes</h3><ul>${res.pontos_fortes.map(x => `<li>${ET.esc(x)}</li>`).join('')}</ul>` : ''}
    ${res.prioridades && res.prioridades.length ? `<h3>O que corrigir primeiro</h3><ol>${res.prioridades.map(x => `<li>${ET.esc(x)}</li>`).join('')}</ol>` : ''}
    ${res.reescrita && res.reescrita.original ? `<h3>Reescrevendo um trecho</h3><div class="rew"><p class="antes">${ET.esc(res.reescrita.original)}</p><p class="depois">${ET.esc(res.reescrita.sugestao)}</p></div>` : ''}
    <p class="muted" style="margin:0;font-size:.82rem">Estimativa feita por inteligência artificial com base nos critérios oficiais. A nota real da banca pode variar.</p>
  </div>`;
}
function bindRes() {}
async function loadHist() {
  const box = $('#ia-hist'); if (!box) return;
  if (!ET.CLOUD || !ET.fb || !ET.USER) { box.querySelector('p').textContent = 'Entre na sua conta para ver o histórico.'; return }
  try {
    if (!iaHist) { const q = await ET.fb.db.collection('enemTurbo').doc(ET.USER.id).collection('correcoes').orderBy('criadoEm', 'desc').limit(10).get(); iaHist = q.docs.map(d => ({ id: d.id, ...d.data() })) }
    if (view !== 'redacao' || !$('#ia-hist')) return;
    $('#ia-hist').innerHTML = `<h2>Suas correções</h2>${iaHist.length ? iaHist.map((h, i) => `<button class="histrow" data-i="${i}"><span><b>${ET.esc(h.tema || 'Sem tema')}</b><small>${h.criadoEm && h.criadoEm.toDate ? h.criadoEm.toDate().toLocaleDateString('pt-BR') : ''} · ${h.prova === 'uerj' ? 'UERJ' : 'ENEM'}</small></span><b>${String(h.resultado.nota_total).replace('.', ',')}/${h.resultado.nota_max}</b></button>`).join('') : '<p class="muted" style="margin:0">Nenhuma correção ainda.</p>'}`;
    document.querySelectorAll('.histrow').forEach(b => b.onclick = () => { const h = iaHist[+b.dataset.i]; iaRes = Object.assign({}, h.resultado, { _tema: h.tema }); $('#ia-res').innerHTML = resHTML(iaRes); $('#ia-res').scrollIntoView({ behavior: 'smooth' }) });
  } catch (e) { const p = box.querySelector('p'); if (p) p.textContent = 'Não consegui carregar o histórico agora.' }
}

/* ======================= cronograma ======================= */
const CURSOS = [['saude', 'Medicina e Saúde'], ['exatas', 'Engenharias e Exatas'], ['humanas', 'Direito e Humanas'], ['licenc', 'Licenciaturas'], ['comunic', 'Comunicação e Artes'], ['indef', 'Ainda não sei']];
const AREA_W = {
  saude: { lin: 1, hum: 1, mat: 1.5, nat: 2.2, red: 1.6 }, exatas: { lin: 1, hum: .9, mat: 2.4, nat: 1.8, red: 1.4 },
  humanas: { lin: 1.8, hum: 2.2, mat: 1, nat: .9, red: 1.8 }, licenc: { lin: 1.4, hum: 1.4, mat: 1.3, nat: 1.3, red: 1.5 },
  comunic: { lin: 2, hum: 1.6, mat: 1, nat: .9, red: 1.8 }, indef: { lin: 1.3, hum: 1.3, mat: 1.4, nat: 1.3, red: 1.5 }
};
const SUBJ_F = { por: 1.4, lit: .7, lem: .5, art: .35, his: 1, geo: 1, fil: .6, soc: .6, mat: 2.2, bio: .9, qui: .8, fis: .8 };
const LESSON_OF = { por: ['l-por', 'l-fig'], lit: ['l-lit'], lem: ['l-lem'], his: ['l-his'], geo: ['l-geo'], fil: ['l-fil'], soc: ['l-soc'], mat: ['l-mat', 'l-geom'], bio: ['l-bio'], qui: ['l-qui'], fis: ['l-fis'] };
let cronoEdit = false;
function assuntos(m) { return [...new Set((window.BANK || []).filter(b => b.m === m).map(b => b.a))] }
function cronoGerar(pl) {
  // gera todos os dias do início do plano até a véspera da prova (determinístico)
  const w = {}; Object.keys(SUBJ_F).forEach(m => { w[m] = (AREA_W[pl.curso] || AREA_W.indef)[AREA_OF(m)] * SUBJ_F[m] * (pl.fracas.includes(m) ? 1.6 : 1) });
  const cnt = {}; Object.keys(w).forEach(m => cnt[m] = 0);
  const out = [], start = new Date(pl.inicio), end = new Date(pl.data + 'T00:00:00');
  let sd = 0; const B = Math.max(2, Math.round(pl.horas * 2));
  for (let d = new Date(start.getFullYear(), start.getMonth(), start.getDate()); d < end && out.length < 800; d = new Date(d.getTime() + DAY)) {
    const key = ET.dayKey(d.getTime()), dow = d.getDay();
    if (!pl.dias.includes(dow)) { out.push({ key, date: d, blocos: [] }); continue }
    sd++; const left = Math.round((end - d) / DAY), final = left <= 10;
    const bl = [];
    if (sd % 10 === 0 && B >= 4) { const tipo = pl.prova === 'uerj' ? 'uerj' : pl.prova === 'ambos' && sd % 20 === 0 ? 'uerj' : (sd % 20 === 0 ? 'enem2' : 'enem1'); bl.push({ t: 'sim', s: tipo, n: 4 }) }
    else if (final && B >= 2 && sd % 3 === 0) bl.push({ t: 'sim', s: 'mini', n: 2 });
    if (sd % 3 === 1) bl.push({ t: 'red', n: B >= 4 && sd % 6 === 1 ? 2 : 1 });
    const used = () => bl.reduce((a, b) => a + b.n, 0);
    const revisao = B >= 3 || sd % 2 === 0;
    while (used() < B - (revisao ? 1 : 0)) {
      let best = null, bv = -1;
      Object.keys(w).forEach(m => { const v = w[m] / (cnt[m] + 1); if (v > bv && !(bl.length >= 1 && bl[bl.length - 1].m === m)) { bv = v; best = m } });
      cnt[best]++; const as = assuntos(best); bl.push({ t: 'mat', m: best, a: as.length ? as[(cnt[best] - 1) % as.length] : '', n: 1 });
      if (final && used() < B - 1) bl.push({ t: 'rev', n: 1 });
    }
    if (revisao) bl.push({ t: 'rev', n: 1 });
    out.push({ key, date: d, blocos: bl.slice(0, B) });
  }
  return out;
}
let cronoCache = null, cronoSig = '';
function cronoAll() { const pl = S().plano; if (!pl) return []; const sig = JSON.stringify(pl); if (sig !== cronoSig) { cronoCache = cronoGerar(pl); cronoSig = sig } return cronoCache }
function cronoDia(date) { const k = ET.dayKey(date.getTime()); return cronoAll().find(x => x.key === k) }
function doneBlock(key, i) { return !!(S().cronoFeito && S().cronoFeito[key + ':' + i]) }
function blocoInfo(b) {
  if (b.t === 'mat') { const s = SUBJ()[b.m]; return { ic: '📘', t: s.n, d: b.a || 'Revisão geral', cor: `var(--${s.area})` } }
  if (b.t === 'red') return b.n >= 2 ? { ic: '✍️', t: 'Redação completa', d: 'Escrever e corrigir com IA' } : { ic: '✍️', t: 'Redação', d: 'Treino de uma parte ou do curso' };
  if (b.t === 'sim') { const s = SIMS.find(x => x.id === b.s); return { ic: '⏱', t: 'Simulado', d: s ? s.nome : '' } }
  return { ic: '🔁', t: 'Revisão', d: 'Revisões da trilha e caderno de erros' };
}
function blocoAcao(b) {
  if (b.t === 'mat') {
    const l = (LESSON_OF[b.m] || []).map(id => ET.FLAT.find(x => x.id === id)).find(x => x && !ET.closed(x));
    if (l) return ET.openItem(l, 1);
    Object.assign(tf, { m: b.m, d: 'all', n: 10 }); return startTreino();
  }
  if (b.t === 'red') return setView('redacao');
  if (b.t === 'sim') return startSim(b.s);
  const na = ET.nextAction(); if (na && na.kind === 'review') return ET.openItem(na.it, na.round);
  if (Object.keys(S().wrong || {}).length) return ET.openCaderno();
  Object.assign(tf, { m: 'all', d: 'all', n: 10 }); startTreino();
}
function renderCrono() {
  const el = $('#v-crono'), pl = S().plano;
  if (!pl || cronoEdit) return renderCronoForm(el, pl);
  const all = cronoAll(), today = ET.dayKey(), idx = Math.max(0, all.findIndex(x => x.key >= today));
  const falta = Math.ceil((new Date(pl.data + 'T00:00:00') - Date.now()) / DAY);
  const pro = isPro();
  const dias = all.slice(idx, idx + (pro ? 14 : FREE.cronoDias + 2));
  const dayHTML = (d, i) => {
    const lock = !pro && i >= FREE.cronoDias;
    const head = `<div class="dayhead"><b>${i === 0 && d.key === today ? 'Hoje' : WD[d.date.getDay()] + ', ' + d.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</b><small>${d.blocos.length ? d.blocos.reduce((a, b) => a + b.n, 0) * 30 + ' min' : 'Descanso'}</small></div>`;
    if (lock) return `<div class="cday locked">${head}<div class="blur">${d.blocos.map(b => { const f = blocoInfo(b); return `<div class="blk"><span>${f.ic}</span><span><b>${f.t}</b></span></div>` }).join('')}</div></div>`;
    return `<div class="cday">${head}${d.blocos.map((b, j) => { const f = blocoInfo(b), done = doneBlock(d.key, j); return `<div class="blk ${done ? 'done' : ''}"><label class="cb"><input type="checkbox" data-k="${d.key}" data-j="${j}" ${done ? 'checked' : ''} aria-label="Feito"></label><span class="bic" style="${f.cor ? 'background:' + f.cor : ''}">${f.ic}</span><span class="bt"><b>${f.t}</b><small>${ET.esc(f.d)}${b.n > 1 ? ' · ' + b.n * 30 + ' min' : ''}</small></span>${d.key === today ? `<button class="btn small" data-go="${d.key}:${j}">Começar</button>` : ''}</div>` }).join('') || '<p class="muted" style="margin:0">Dia livre. Descanso também faz parte.</p>'}</div>`;
  };
  el.innerHTML = `<div class="vhead"><h1>Cronograma</h1><p class="muted">${pl.prova === 'uerj' ? 'UERJ' : pl.prova === 'ambos' ? 'ENEM e UERJ' : 'ENEM'} · ${CURSOS.find(c => c[0] === pl.curso)[1]} · ${pl.horas}h por dia</p></div>
    <div class="box sticker countbox"><b>${falta > 0 ? falta : 0}</b><span>dias até a prova (${new Date(pl.data + 'T00:00:00').toLocaleDateString('pt-BR')})${falta <= 10 && falta > 0 ? '<br><span class="pill">Reta final: mais revisão e simulados</span>' : ''}</span></div>
    ${dias.length ? dias.map(dayHTML).join('') : '<div class="box sticker"><p style="margin:0">A data da prova já passou. Edite o cronograma para a próxima.</p></div>'}
    ${!pro && dias.length > FREE.cronoDias ? `<div class="box sticker">${lockCard('O cronograma completo até a prova é do Pro')}</div>` : ''}
    <button class="btn" id="c-edit">Editar meu cronograma</button>`;
  el.querySelectorAll('input[data-k]').forEach(c => c.onchange = () => { const s = S(); s.cronoFeito = s.cronoFeito || {}; s.cronoFeito[c.dataset.k + ':' + c.dataset.j] = c.checked; ET.save(); if (c.checked) ET.toast('Bloco feito ✓'); renderCrono() });
  el.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const [k, j] = b.dataset.go.split(':'); const d = all.find(x => x.key === k); const s = S(); s.cronoFeito = s.cronoFeito || {}; s.cronoFeito[k + ':' + j] = true; ET.save(); blocoAcao(d.blocos[+j]) });
  $('#c-edit').onclick = () => { cronoEdit = true; renderCrono() };
  bindPro(el);
}
function renderCronoForm(el, pl) {
  const f = Object.assign({ prova: 'enem', data: '', curso: 'indef', horas: 2, dias: [1, 2, 3, 4, 5, 6], fracas: [] }, pl || {});
  el.innerHTML = `<div class="vhead"><h1>Cronograma</h1><p class="muted">Responda 6 perguntas e o app monta o seu plano de estudos até o dia da prova.</p></div>
  <form class="box sticker" id="c-form">
    <span class="lbl">1. Para qual prova?</span>${chips('prova', [['enem', 'ENEM'], ['uerj', 'UERJ'], ['ambos', 'As duas']], f.prova)}
    <label class="f" for="c-data">2. Data da prova<input type="date" id="c-data" value="${f.data}" min="${ET.dayKey()}"></label>
    <p class="muted" style="margin:-6px 0 0;font-size:.85rem">O ENEM costuma ser em novembro e a Qualificação da UERJ em junho e setembro. Confira a data no edital.</p>
    <label class="f" for="c-curso">3. Curso que você quer<select id="c-curso">${CURSOS.map(([v, n]) => `<option value="${v}" ${f.curso === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <span class="lbl">4. Horas por dia</span>${chips('horas', [[1, '1h'], [2, '2h'], [3, '3h'], [4, '4h'], [5, '5h'], [6, '6h']], f.horas)}
    <span class="lbl">5. Dias da semana</span><div class="chips" data-g="dias">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button type="button" class="chip" data-v="${d}" aria-pressed="${f.dias.includes(d)}">${WD[d]}</button>`).join('')}</div>
    <span class="lbl">6. Matérias em que você tem mais dificuldade</span><div class="chips" data-g="fracas">${Object.entries(SUBJ()).filter(([k]) => k !== 'red').map(([k, v]) => `<button type="button" class="chip" data-v="${k}" aria-pressed="${f.fracas.includes(k)}">${v.n}</button>`).join('')}</div>
    <p class="err" id="c-err" hidden></p>
    <button class="btn primary big" type="submit">${pl ? 'Salvar e refazer o cronograma' : 'Montar meu cronograma'}</button>
    ${pl ? '<button class="link" type="button" id="c-cancel">Cancelar</button>' : ''}
  </form>`;
  el.querySelectorAll('.chips').forEach(c => c.onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return; e.preventDefault(); const g = c.dataset.g;
    if (g === 'dias' || g === 'fracas') { const v = g === 'dias' ? +b.dataset.v : b.dataset.v; const a = f[g]; const i = a.indexOf(v); i >= 0 ? a.splice(i, 1) : a.push(v); b.setAttribute('aria-pressed', i < 0) }
    else { f[g] = g === 'horas' ? +b.dataset.v : b.dataset.v; c.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)) }
  });
  $('#c-curso').onchange = e => f.curso = e.target.value;
  $('#c-data').onchange = e => f.data = e.target.value;
  if ($('#c-cancel')) $('#c-cancel').onclick = () => { cronoEdit = false; renderCrono() };
  $('#c-form').onsubmit = e => {
    e.preventDefault(); const er = $('#c-err');
    f.data = $('#c-data').value;
    if (!f.data || new Date(f.data + 'T00:00:00') <= new Date()) { er.textContent = 'Escolha uma data de prova no futuro.'; er.hidden = false; return }
    if (!f.dias.length) { er.textContent = 'Escolha pelo menos um dia da semana.'; er.hidden = false; return }
    const s = S(); s.plano = Object.assign(f, { inicio: (pl && pl.inicio && pl.data === f.data) ? pl.inicio : Date.now() }); ET.save();
    cronoEdit = false; ET.toast('Cronograma pronto! 🗓️'); renderCrono();
  };
}

/* ======================= painel de desempenho ======================= */
function streak() { const d = S().days || {}; let n = 0, t = Date.now(); if (!d[ET.dayKey(t)]) t -= DAY; while (d[ET.dayKey(t)] && d[ET.dayKey(t)].a) { n++; t -= DAY } return n }
function renderPainel() {
  const el = $('#v-painel'), s = S(), agg = s.agg || { m: {}, d: {} }, days = s.days || {};
  const tot = Object.values(agg.m).reduce((a, v) => ({ a: a.a + v.a, o: a.o + v.o }), { a: 0, o: 0 });
  const ms = Object.values(days).reduce((a, v) => a + (v.ms || 0), 0);
  const livre = painelLivre();
  const mats = Object.entries(agg.m).filter(([k]) => SUBJ()[k]).map(([k, v]) => ({ k, n: SUBJ()[k].n, a: v.a, o: v.o, p: pct(v.o, v.a) }));
  const fracos = mats.filter(x => x.a >= 4).sort((a, b) => a.p - b.p);
  const areas = {}; mats.forEach(x => { const ar = AREA_OF(x.k); areas[ar] = areas[ar] || { a: 0, o: 0 }; areas[ar].a += x.a; areas[ar].o += x.o });
  const AN = { lin: 'Linguagens', hum: 'Humanas', nat: 'Natureza', mat: 'Matemática', red: 'Redação' };
  // últimos 14 dias
  const last = []; for (let i = 13; i >= 0; i--) { const k = ET.dayKey(Date.now() - i * DAY); last.push({ k, d: new Date(Date.now() - i * DAY), v: days[k] || { a: 0, o: 0 } }) }
  const maxA = Math.max(5, ...last.map(x => x.v.a));
  const W = 320, H = 130, bw = W / 14;
  const chart = `<svg viewBox="0 0 ${W} ${H + 22}" class="chart" role="img" aria-label="Questões por dia nos últimos 14 dias">
    <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="axis"/>
    ${last.map((x, i) => { const h = x.v.a / maxA * (H - 10), ho = x.v.o / maxA * (H - 10); return `<rect x="${i * bw + 3}" y="${H - h}" width="${bw - 6}" height="${h}" rx="3" class="b-all"/><rect x="${i * bw + 3}" y="${H - ho}" width="${bw - 6}" height="${ho}" rx="3" class="b-ok"/>${i % 2 === 1 ? `<text x="${i * bw + bw / 2}" y="${H + 15}" text-anchor="middle" class="tick">${x.d.getDate()}/${x.d.getMonth() + 1}</text>` : ''}` }).join('')}
    <text x="2" y="10" class="tick">${maxA}</text></svg>`;
  const bars = rows => rows.map(r => `<div class="hbar"><span>${r.n}</span><div class="track"><i style="width:${r.p}%;background:${r.p >= 70 ? 'var(--ok)' : r.p >= 50 ? 'var(--hum)' : 'var(--bad)'}"></i></div><b>${r.p}%</b></div>`).join('');
  const sims = (s.sims || []).slice(-6).reverse();
  const notas = (s.iaNotas || []).slice(-8);
  el.innerHTML = `<div class="vhead"><h1>Desempenho</h1><p class="muted">Tudo o que você respondeu na trilha, nos treinos e nos simulados.</p></div>
  <div class="tiles">
    <div class="tile sticker"><b>${tot.a}</b><span>questões feitas</span></div>
    <div class="tile sticker"><b>${pct(tot.o, tot.a)}%</b><span>de acertos</span></div>
    <div class="tile sticker"><b>${streak()}</b><span>${streak() === 1 ? 'dia seguido' : 'dias seguidos'} 🔥</span></div>
    <div class="tile sticker"><b>${ms >= 3600e3 ? (ms / 3600e3).toFixed(1).replace('.', ',') + 'h' : Math.round(ms / 60e3) + ' min'}</b><span>de estudo</span></div>
  </div>
  <div class="box sticker"><h2>Seus pontos fracos</h2>
    ${fracos.length ? `${fracos.slice(0, livre ? 3 : 1).map(x => `<div class="weak"><span><b>${x.n}</b><small>${x.o} de ${x.a} · ${x.p}%</small></span><button class="btn small" data-tm="${x.k}">Treinar</button></div>`).join('')}${!livre && fracos.length > 1 ? '<p class="muted" style="margin:0">Veja todos os pontos fracos no Pro.</p>' : ''}` : '<p class="muted" style="margin:0">Responda pelo menos 4 questões de uma matéria para aparecer aqui.</p>'}
  </div>
  <div class="painel-pro ${livre ? '' : 'is-locked'}">
    ${!livre ? lockCard('Painel completo no Pro (grátis nos 3 primeiros dias)') : ''}
    <div class="box sticker"><h2>Últimos 14 dias</h2>${chart}<p class="legend2"><span class="sw ok"></span>acertos <span class="sw all"></span>respondidas</p></div>
    <div class="box sticker"><h2>Por área</h2>${Object.keys(areas).length ? bars(Object.entries(areas).map(([k, v]) => ({ n: AN[k] || k, p: pct(v.o, v.a) }))) : '<p class="muted" style="margin:0">Sem dados ainda.</p>'}</div>
    <div class="box sticker"><h2>Por matéria</h2>${mats.length ? bars(mats.sort((a, b) => a.p - b.p)) : '<p class="muted" style="margin:0">Sem dados ainda.</p>'}</div>
    <div class="box sticker"><h2>Por nível</h2>${bars(['f', 'm', 'd'].filter(k => agg.d[k]).map(k => ({ n: { f: 'Fácil', m: 'Médio', d: 'Difícil' }[k], p: pct(agg.d[k].o, agg.d[k].a) })))}</div>
    <div class="box sticker"><h2>Simulados</h2>${sims.length ? sims.map(x => `<div class="weak"><span><b>${x.nome}</b><small>${new Date(x.t).toLocaleDateString('pt-BR')}</small></span><b>${x.ok}/${x.n}</b></div>`).join('') : '<p class="muted" style="margin:0">Faça um simulado na aba Treinar.</p>'}</div>
    <div class="box sticker"><h2>Notas de redação (IA)</h2>${notas.length ? `<div class="spark">${notas.map(x => `<div style="height:${Math.max(6, Math.round(x.nota / x.max * 100))}%" title="${x.nota}/${x.max}"><span>${x.nota}</span></div>`).join('')}</div>` : '<p class="muted" style="margin:0">Corrija uma redação na aba Redação.</p>'}</div>
  </div>`;
  el.querySelectorAll('[data-tm]').forEach(b => b.onclick = () => { Object.assign(tf, { m: b.dataset.tm, d: 'all', n: 10 }); startTreino() });
  bindPro(el);
}

/* ======================= retorno do pagamento ======================= */
function retornoPagamento() {
  const q = new URLSearchParams(location.search), st = q.get('pago');
  if (!st) return;
  try { history.replaceState(null, '', location.pathname) } catch (e) {}
  setTimeout(() => ET.toast(st === 'ok' ? 'Pagamento aprovado! Seu Pro é ativado em instantes ⭐' : st === 'pendente' ? 'Pagamento pendente. Assim que for confirmado, o Pro ativa sozinho.' : 'O pagamento não foi concluído. Você pode tentar de novo.'), 600);
}

/* ======================= integração com o app ======================= */
window.PRO = {
  init(api) { ET = api; buildNav(); const b = $('#pro-btn'); if (b) b.onclick = () => openPro(); retornoPagamento() },
  showShell() { shell = true; $('#nav').hidden = false; setView(view, true) },
  hideShell() { shell = false; $('#nav').hidden = true; VIEWS.forEach(v => $(v.el).hidden = true) },
  onStart() { proBadge() },
  onPlan() { proBadge(); if (shell && view !== 'inicio') setView(view, true); else if (shell) renderHomeExtra() },
  refresh() { if (shell && view !== 'inicio') setView(view, true) },
  renderHomeExtra,
  open: openPro
};
})();
