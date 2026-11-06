// ENEM Turbo — módulo de redação: modelo comentado, escrita guiada e corretor automático
(function () {
const S = (c, t) => `<span class="h-${c}">${t}</span>`;

// Redação modelo (texto original, escrito para o app) — tema de treino
const MODEL_TEMA = 'Desafios para combater a desinformação no Brasil';
const MODEL = {
  intro: `${S('rep', 'Na obra "1984", de George Orwell, o governo manipula as informações para controlar o que a população pensa.')} ${S('con', 'Fora da ficção')}, o Brasil enfrenta um cenário semelhante: notícias falsas circulam com rapidez nas redes sociais e influenciam decisões sobre saúde, política e convivência. ${S('con', 'Nesse contexto')}, ${S('tese', 'o combate à desinformação ainda é um desafio')}, ${S('arg', 'seja pela baixa educação midiática da população')}, ${S('arg', 'seja pela falta de responsabilização das plataformas digitais')}.`,
  d1: `${S('con', 'Em primeira análise')}, ${S('arg', 'a pouca educação midiática dificulta a identificação de conteúdos falsos')}. ${S('con', 'Isso ocorre porque')} a maior parte das escolas brasileiras não ensina os estudantes a checar fontes, comparar veículos e desconfiar de manchetes sensacionalistas. ${S('rep', 'Segundo o educador Paulo Freire, a educação deve formar sujeitos críticos, capazes de ler o mundo, e não apenas as palavras.')} Sem essa formação, muitos cidadãos compartilham mensagens sem verificar a origem, o que amplia o alcance das mentiras. ${S('con', 'Dessa forma')}, a carência de senso crítico torna a população vulnerável à desinformação.`,
  d2: `${S('con', 'Além disso')}, ${S('arg', 'a falta de responsabilização das plataformas digitais agrava o problema')}. As empresas que administram as redes sociais lucram com o engajamento, e conteúdos chocantes, verdadeiros ou não, geram mais cliques. ${S('con', 'Assim')}, os algoritmos tendem a priorizar publicações polêmicas, enquanto a remoção de notícias falsas costuma ser lenta. ${S('rep', 'Essa lógica contraria a Constituição Federal de 1988, que assegura a todos o acesso à informação')}, já que um conteúdo distorcido não cumpre esse papel. ${S('con', 'Logo')}, sem regras claras para as plataformas, a desinformação continua a se espalhar.`,
  concl: `${S('con', 'Portanto')}, é necessário enfrentar a desinformação no Brasil. Para isso, ${S('ag', 'o Ministério da Educação')} deve ${S('ac', 'incluir a educação midiática no currículo das escolas públicas')}, ${S('mo', 'por meio de oficinas semanais de checagem de fatos')}, ${S('de', 'conduzidas por professores capacitados e jornalistas convidados')}, ${S('fi', 'a fim de formar cidadãos capazes de reconhecer notícias falsas')}. ${S('con', 'Além disso')}, o Congresso Nacional deve aprovar leis que obriguem as plataformas a remover rapidamente os conteúdos falsos denunciados. ${S('con', 'Assim')}, ${S('rep', 'o Brasil se afastará do cenário descrito por Orwell')}.`
};
const LEGEND = [['rep', 'Repertório'], ['tese', 'Tese'], ['arg', 'Argumento'], ['con', 'Conectivo'], ['ag', 'Agente'], ['ac', 'Ação'], ['mo', 'Modo/meio'], ['de', 'Detalhamento'], ['fi', 'Finalidade']];
const WHY = [
  '<b>C2</b>: dois repertórios legitimados (Orwell e Paulo Freire) mais a Constituição, todos ligados ao tema.',
  '<b>C3</b>: a tese anuncia dois argumentos, e cada parágrafo desenvolve um deles com explicação e prova.',
  '<b>C4</b>: todo parágrafo começa com conectivo, e há conectivos dentro dos parágrafos.',
  '<b>C5</b>: a proposta tem os 5 elementos, e ainda há uma segunda proposta.',
  'A conclusão retoma o repertório da introdução (Orwell). Isso amarra o texto.'
];

// A redação que ela escreve no app (tema diferente do modelo, para não copiar)
const MY_TEMA = 'Caminhos para combater a evasão escolar no Brasil';
const PARTS = {
  intro: { title: 'Sua introdução', fields: [
    { k: 'rep', l: '1. Repertório', ph: 'Ex.: A Constituição de 1988 garante, no artigo 205, que a educação é direito de todos e dever do Estado.' },
    { k: 'prob', l: '2. O problema no Brasil de hoje', ph: 'Ex.: No entanto, no Brasil, muitos jovens abandonam a escola antes de concluir o ensino médio.' },
    { k: 'tese', l: '3. Tese + os 2 argumentos', ph: 'Ex.: Nesse contexto, a evasão persiste, seja pela necessidade de trabalhar cedo, seja pela falta de acolhimento nas escolas.' }
  ], join: v => [v.rep, v.prob, v.tese] },
  d1: { title: 'Seu 1º parágrafo de desenvolvimento', fields: [
    { k: 'top', l: 'Tópico frasal (argumento 1)', ph: 'Ex.: Em primeira análise, a necessidade de trabalhar afasta muitos jovens da sala de aula.' },
    { k: 'exp', l: 'Explicação: por que isso acontece?', ph: 'Ex.: Isso ocorre porque famílias de baixa renda dependem da ajuda financeira dos filhos.' },
    { k: 'prova', l: 'Prova: repertório, exemplo ou dado', ph: 'Ex.: Segundo Paulo Freire, a educação liberta, mas ela só cumpre esse papel se o aluno puder permanecer na escola.' },
    { k: 'fech', l: 'Fechamento: ligue à tese', ph: 'Ex.: Dessa forma, a pobreza obriga o jovem a escolher entre estudar e sobreviver.' }
  ], join: v => [v.top, v.exp, v.prova, v.fech] },
  d2: { title: 'Seu 2º parágrafo de desenvolvimento', fields: [
    { k: 'top', l: 'Tópico frasal (argumento 2)', ph: 'Ex.: Além disso, a falta de acolhimento nas escolas contribui para o abandono.' },
    { k: 'exp', l: 'Explicação', ph: 'Ex.: Isso acontece porque muitas instituições não oferecem apoio a alunos com dificuldades.' },
    { k: 'prova', l: 'Prova: repertório, exemplo ou dado', ph: 'Ex.: Prova disso é que turmas lotadas impedem o professor de perceber quem está ficando para trás.' },
    { k: 'fech', l: 'Fechamento', ph: 'Ex.: Logo, o estudante se sente invisível e desiste.' }
  ], join: v => [v.top, v.exp, v.prova, v.fech] },
  concl: { title: 'Sua conclusão com proposta', fields: [
    { k: 'ret', l: 'Retome a tese', ph: 'Ex.: Portanto, é preciso combater as causas da evasão escolar no país.' },
    { k: 'ag', l: 'Agente: quem faz?', ph: 'Ex.: o Ministério da Educação' },
    { k: 'ac', l: 'Ação: o que faz? (verbo)', ph: 'Ex.: ampliar as bolsas de permanência para estudantes de baixa renda' },
    { k: 'mo', l: 'Modo/meio: como?', pre: 'por meio de', ph: 'Ex.: parcerias com as secretarias estaduais' },
    { k: 'de', l: 'Detalhamento: explique um elemento', ph: 'Ex.: com pagamento mensal vinculado à frequência' },
    { k: 'fi', l: 'Finalidade: para quê?', pre: 'a fim de', ph: 'Ex.: garantir que o jovem não precise abandonar os estudos' },
    { k: 'fim', l: 'Frase final', ph: 'Ex.: Assim, o direito previsto na Constituição será, de fato, para todos.' }
  ], join: v => [v.ret, `Para isso, ${v.ag || '…'} deve ${v.ac || '…'}, por meio de ${v.mo || '…'}, ${v.de || '…'}, a fim de ${v.fi || '…'}.`, v.fim] }
};
function partText(part, v) { return PARTS[part].join(v || {}).filter(Boolean).map(t => t.trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').replace(/\.\./g, '.') }

// Temas de treino para as missões
const TEMAS = [
  'Caminhos para combater a evasão escolar no Brasil',
  'Os impactos do uso excessivo de celulares entre jovens no Brasil',
  'Desafios para garantir a segurança alimentar no Brasil',
  'A importância da saúde mental no ambiente escolar brasileiro',
  'Caminhos para combater o racismo estrutural no Brasil',
  'Desafios da mobilidade urbana nas grandes cidades brasileiras',
  'O desafio de reduzir a violência contra a mulher no Brasil',
  'Desafios para combater a desinformação no Brasil',
  'Perspectivas acerca do envelhecimento na sociedade brasileira (tema do ENEM 2025)',
  'Desafios para a valorização da herança africana no Brasil (tema do ENEM 2024)'
];

// Corretor automático (não substitui um corretor humano, mas pega os erros mais comuns)
const CONECTIVOS = ['além disso', 'ademais', 'outrossim', 'em primeira análise', 'inicialmente', 'nesse sentido', 'nesse contexto', 'isso ocorre porque', 'isso acontece porque', 'dessa forma', 'desse modo', 'assim', 'logo', 'portanto', 'em suma', 'entretanto', 'no entanto', 'contudo', 'todavia', 'por conseguinte', 'sob essa ótica', 'diante disso', 'por fim', 'prova disso', 'consequentemente', 'com isso', 'visto que', 'uma vez que', 'por isso'];
function norm(t) { return ' ' + t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ') + ' ' }
function check(text) {
  const out = [], raw = (text || '').trim();
  const paras = raw.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  const words = raw ? raw.split(/\s+/).length : 0, lines = Math.round(words / 11.5);
  const n = norm(raw), add = (ok, l, d) => out.push({ ok, l, d });
  add(paras.length === 4 || paras.length === 5, `${paras.length} parágrafo${paras.length === 1 ? '' : 's'}`, paras.length < 4 ? 'O ideal são 4: introdução, 2 de desenvolvimento e conclusão. Pule uma linha entre eles.' : paras.length > 5 ? 'Muitos parágrafos. Junte ideias: o ideal são 4.' : 'Estrutura certinha.');
  add(words >= 250 && words <= 380, `${words} palavras (≈ ${lines} linha${lines === 1 ? "" : "s"} no papel)`, words < 100 ? 'Muito curto. Menos de 8 linhas zera.' : words < 250 ? 'Está curto. Desenvolva mais a explicação e a prova dos argumentos.' : words > 380 ? 'Pode passar de 30 linhas. Corte repetições.' : 'Tamanho ideal: 25 a 30 linhas.');
  const used = CONECTIVOS.filter(c => n.includes(' ' + norm(c).trim() + ' '));
  add(used.length >= 5, `${used.length} conectivos diferentes`, used.length >= 5 ? 'Boa coesão (C4): ' + used.slice(0, 6).join(', ') + '.' : 'Use pelo menos 5 diferentes. Comece cada parágrafo com um.');
  const startOk = paras.slice(1).filter(p => CONECTIVOS.some(c => norm(p).trimStart().startsWith(norm(c).trim()))).length;
  if (paras.length >= 3) add(startOk >= paras.length - 1, `${startOk} de ${paras.length - 1} parágrafos começam com conectivo`, startOk >= paras.length - 1 ? 'Ótimo para a C4.' : 'Comece o 2º, 3º e 4º parágrafos com conectivo (Em primeira análise, Além disso, Portanto).');
  const rep = /(segundo|de acordo com|conforme|constituicao|lei |artigo|obra|livro|filme|filosof|sociolog|pensador|autor|ibge|pesquisa|dados|estatuto|declaracao)/.test(norm(paras[0] || ''));
  add(rep, rep ? 'Repertório na introdução' : 'Sem repertório claro na introdução', rep ? 'Boa (C2). Confira se ele tem relação com o tema.' : 'Comece com uma lei, livro, autor ou dado (C2).');
  const last = norm(paras[paras.length - 1] || '');
  const pe = { agente: / (deve|devem|cabe|compete) /.test(last), meio: /(por meio|atraves|mediante|com o auxilio|por intermedio)/.test(last), finalidade: /(a fim de|para que|com o objetivo|com a finalidade|visando|com o intuito)/.test(last) };
  const miss = Object.keys(pe).filter(k => !pe[k]);
  add(!miss.length, miss.length ? 'Proposta incompleta' : 'Proposta com agente, meio e finalidade', miss.length ? 'Faltou na conclusão: ' + miss.join(', ') + '. Use "deve", "por meio de" e "a fim de".' : 'Confira também a ação e o detalhamento (C5).');
  const inf = [' a gente ', ' ne ', ' pra ', ' pro ', ' ta ', ' to ', ' vc ', ' voce ', ' voces ', ' coisa ', ' coisas ', ' muito top '].filter(w => n.includes(w));
  if (/ tipo (?!de |do |da |dos |das )/.test(n)) inf.push(' tipo ');
  add(!inf.length, inf.length ? 'Linguagem informal' : 'Linguagem formal', inf.length ? 'Troque: ' + inf.map(w => '"' + w.trim() + '"').join(', ') + '.' : 'Nada de gíria encontrada (C1).');
  const pes = [' eu ', ' acho ', ' meu ', ' minha ', ' nosso ', ' nossa ', ' nossos ', ' nossas '].filter(w => n.includes(w));
  add(!pes.length, pes.length ? '1ª pessoa no texto' : 'Texto impessoal', pes.length ? 'Evite: ' + pes.map(w => '"' + w.trim() + '"').join(', ') + '. Escreva de forma impessoal.' : 'Ótimo.');
  const longs = raw.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 55).length;
  add(!longs, longs ? `${longs} frase${longs > 1 ? 's' : ''} longa${longs > 1 ? 's' : ''} demais` : 'Frases com bom tamanho', longs ? 'Divida frases com mais de 55 palavras. Frase longa demais gera erro de pontuação.' : 'Fácil de ler.');
  if (/(pena de morte|matar|tortur|linch|castra|espancar)/.test(n)) add(false, 'Possível desrespeito aos direitos humanos', 'Propostas violentas tiram pontos na C5.');
  return out;
}

window.REDACAO = { MODEL, MODEL_TEMA, LEGEND, WHY, MY_TEMA, PARTS, partText, TEMAS, check };
})();
