// ENEM Turbo — conteúdo da trilha. Em cada questão, a PRIMEIRA alternativa é a correta (o app embaralha na tela).
window.AREAS = {
  geral: { n: 'ENEM', c: 'var(--hum)' },
  red: { n: 'Redação', c: 'var(--red)' },
  lin: { n: 'Linguagens', c: 'var(--lin)' },
  hum: { n: 'Humanas', c: 'var(--hum)' },
  mat: { n: 'Matemática', c: 'var(--mat)' },
  nat: { n: 'Natureza', c: 'var(--nat)' }
};

window.Q = {
  // Como funciona
  int1: { q: 'Quantas questões objetivas o ENEM tem, somando os dois domingos?', o: ['180', '90', '200', '120'], e: 'São 45 por área (Linguagens, Humanas, Natureza e Matemática) = 180, mais a redação.' },
  int2: { q: 'Faltam 5 minutos e sobraram 6 questões. O melhor a fazer é:', o: ['Marcar uma resposta em todas', 'Deixar em branco para não perder ponto', 'Entregar a prova assim mesmo', 'Marcar duas alternativas em cada'], e: 'O ENEM não desconta ponto por erro. Questão em branco é ponto perdido na certa.' },
  int3: { q: 'No domingo, 08/11, caem:', o: ['Linguagens, Humanas e Redação', 'Matemática e Natureza', 'Só a Redação', 'Todas as matérias'], e: '1º domingo: Linguagens, Humanas e Redação. 2º domingo (15/11): Natureza e Matemática.' },
  int4: { q: 'Os portões fecham às:', o: ['13h', '12h', '13h30', '14h'], e: 'Portões abrem 12h e fecham 13h (horário de Brasília). A prova começa 13h30.' },

  // Redação
  red1: { q: 'Na redação do ENEM, cada competência vale no máximo:', o: ['200 pontos', '100 pontos', '250 pontos', '500 pontos'], e: 'São 5 competências de 200 pontos, total de 1000.' },
  red2: { q: 'A proposta de intervenção é avaliada na:', o: ['Competência 5', 'Competência 1', 'Competência 2', 'Competência 4'], e: 'A C5 avalia a proposta: agente, ação, modo/meio, finalidade e detalhamento.' },
  red3: { q: 'Qual destes ZERA a redação?', o: ['Escrever só 7 linhas', 'Repetir um conectivo', 'Não citar nenhum autor', 'Não colocar título'], e: 'Texto com até 7 linhas é insuficiente e recebe zero. O título é opcional.' },
  red4: { q: 'O tipo de texto exigido é:', o: ['Dissertativo-argumentativo', 'Narrativo', 'Carta argumentativa', 'Poema'], e: 'Você defende um ponto de vista com argumentos e termina com uma proposta.' },
  red5: { q: 'A Competência 4 avalia principalmente:', o: ['Coesão: o uso de conectivos', 'Ortografia', 'A proposta de intervenção', 'A letra bonita'], e: 'C4 = ligar bem frases e parágrafos com conectivos (além disso, portanto, entretanto…).' },
  red6: { q: 'Qual NÃO é um elemento da proposta de intervenção?', o: ['Título', 'Agente', 'Finalidade', 'Detalhamento'], e: 'Os 5 elementos: agente, ação, modo/meio, finalidade e detalhamento.' },
  red7: { q: 'Na introdução, a ordem mais segura é:', o: ['Repertório → problema → tese → anunciar os 2 argumentos', 'Proposta → tese → repertório', 'Só a opinião pessoal', 'Uma pergunta e nada mais'], e: 'Abra com um repertório, apresente o problema, diga sua tese e anuncie os argumentos.' },

  // ---- redação: tema, introdução, desenvolvimento, conclusão ----
  rt1: { q: 'Tema: "Caminhos para combater a evasão escolar no Brasil". Qual tese está DENTRO do tema?', o: ['A evasão escolar persiste por causa do trabalho precoce dos jovens e da falta de acolhimento nas escolas', 'A educação é muito importante para a vida de todos', 'O desemprego no Brasil é muito alto', 'As escolas particulares são melhores que as públicas'], e: 'Só a primeira trata do recorte (evasão escolar no Brasil) e já anuncia as causas. As outras tangenciam ou fogem.' },
  rt2: { q: 'O tema pede "o estigma associado às doenças mentais", e a redação fala só de doenças mentais em geral. Isso é:', o: ['Tangenciar o tema: perde muitos pontos', 'Seguir o tema perfeitamente', 'Fugir do tema: zera', 'O que o corretor espera'], e: 'Falar do assunto geral sem o recorte (o preconceito) é tangenciar.' },
  rt3: { q: 'O que acontece com trechos copiados dos textos motivadores?', o: ['São desconsiderados', 'Valem pontos extras', 'Garantem nota 1000', 'São obrigatórios'], e: 'Cópia não conta. Se o texto for quase todo cópia, zera.' },
  rt4: { q: 'Quase todos os temas do ENEM pedem para discutir:', o: ['Um problema social do Brasil', 'Um problema de outro país', 'A sua vida pessoal', 'Uma história inventada'], e: 'Por isso funciona a estrutura problema → causas → proposta de solução.' },
  rt5: { q: 'Qual a melhor atitude ao ler o tema?', o: ['Sublinhar as palavras-chave e repeti-las na introdução e na conclusão', 'Começar a escrever sem ler os textos motivadores', 'Trocar por um tema parecido de que você goste mais', 'Ignorar o "no Brasil"'], e: 'Usar as palavras-chave mostra ao corretor que você está dentro do tema.' },
  in1: { q: 'Qual destas frases é uma TESE?', o: ['A desinformação persiste no Brasil devido à baixa educação midiática e à omissão das plataformas digitais', 'A internet surgiu no século XX', 'Desde os primórdios, o ser humano se comunica', 'O que é desinformação?'], e: 'Tese é o seu ponto de vista sobre o problema, já com as causas que você vai defender.' },
  in2: { q: 'Qual repertório é legitimado e pertinente para um tema sobre educação?', o: ['O artigo 205 da Constituição, que define a educação como direito de todos e dever do Estado e da família', 'Meu primo largou a escola', 'Um meme que vi ontem', 'Uma frase sem autor da internet'], e: 'Legitimado = fonte reconhecida. Pertinente = tem relação com o tema.' },
  in3: { q: 'Por que evitar começar com "Desde os primórdios da humanidade..."?', o: ['É genérico e não mostra conhecimento sobre o tema', 'É proibido e zera a redação', 'Deixa o texto curto demais', 'É uma gíria'], e: 'Começos vazios gastam linhas. Prefira um repertório concreto.' },
  de1: { q: 'O tópico frasal é:', o: ['A primeira frase do parágrafo, que apresenta o argumento', 'A última frase da redação', 'O título', 'Uma citação no meio do parágrafo'], e: 'Ele diz ao corretor qual é o argumento daquele parágrafo.' },
  de2: { q: 'Qual conectivo começa melhor o 2º argumento? "______, a falta de fiscalização agrava o problema."', o: ['Além disso', 'Portanto', 'Entretanto', 'Em suma'], e: '"Além disso" soma um novo argumento. "Portanto" e "Em suma" concluem. "Entretanto" opõe.' },
  de3: { q: 'Para tirar nota alta na C3, um argumento precisa:', o: ['Ser explicado (causa e consequência) e comprovado com exemplo ou repertório', 'Só ser citado rapidamente', 'Ter muitas palavras difíceis', 'Ser uma opinião pessoal sem explicação'], e: 'O corretor quer ver o argumento desenvolvido, não só mencionado.' },
  de4: { q: 'Qual conectivo introduz uma explicação (causa)?', o: ['Isso ocorre porque', 'Em contrapartida', 'Por fim', 'Além disso'], e: '"Isso ocorre porque" apresenta a causa do que você afirmou.' },
  de5: { q: 'Qual frase está adequada à norma formal?', o: ['As pessoas compartilham notícias sem verificar a fonte.', 'A gente compartilha as notícia sem ver a fonte.', 'Tipo, todo mundo compartilha fake news, né?', 'Eu acho que geral compartilha sem ver.'], e: 'Evite "a gente", "tipo", "né", "geral" e erros de concordância.' },
  co1: { q: 'Na proposta "O Ministério da Saúde deve criar campanhas, por meio das redes sociais, a fim de reduzir o preconceito", falta o:', o: ['Detalhamento', 'Agente', 'Ação', 'Finalidade'], e: 'Tem agente, ação, meio e finalidade. Falta detalhar um elemento (ex.: campanhas feitas com psicólogos).' },
  co2: { q: 'Qual é o agente mais adequado para uma proposta?', o: ['O Ministério da Educação', 'Alguém', 'Eles', 'Todo mundo'], e: 'O agente precisa ser específico: quem vai executar a ação.' },
  co3: { q: 'Qual proposta perde pontos por desrespeitar direitos humanos?', o: ['Punir com violência quem espalha notícias falsas', 'Criar oficinas de checagem de fatos nas escolas', 'Aprovar leis que responsabilizem as plataformas', 'Fazer campanhas educativas na TV'], e: 'Violência, tortura ou pena de morte desrespeitam direitos humanos e tiram pontos na C5.' },
  co4: { q: 'A proposta de intervenção deve:', o: ['Resolver as causas que você discutiu no desenvolvimento', 'Trazer um problema novo', 'Ser uma pergunta ao leitor', 'Ficar na introdução'], e: 'Ligar a solução aos argumentos mostra coerência.' },

  // Português
  por1: { q: 'Um texto em 1ª pessoa que expressa saudade e tristeza tem função predominante:', o: ['Emotiva', 'Referencial', 'Conativa', 'Fática'], e: 'Foco no emissor e em seus sentimentos = função emotiva (expressiva).' },
  por2: { q: 'Um verbete de dicionário que explica a palavra "palavra" usa a função:', o: ['Metalinguística', 'Poética', 'Fática', 'Conativa'], e: 'A língua falando da própria língua = metalinguística.' },
  por3: { q: 'Uma propaganda com "Compre já!" e "Você merece!" usa a função:', o: ['Conativa (apelativa)', 'Referencial', 'Emotiva', 'Metalinguística'], e: 'Imperativo e foco no leitor para convencer = conativa.' },
  por4: { q: 'Em "Estudou muito, mas não passou", o "mas" indica:', o: ['Oposição', 'Conclusão', 'Causa', 'Tempo'], e: '"Mas" é conjunção adversativa: liga ideias que se opõem.' },
  por5: { q: 'Texto que traz a opinião do próprio jornal sobre um fato, sem assinatura, é:', o: ['Editorial', 'Notícia', 'Crônica', 'Reportagem'], e: 'O editorial expressa a opinião do veículo. A notícia só informa.' },
  por6: { q: 'Uma placa diz: "Ligue já e garanta sua vaga!". O objetivo principal é:', o: ['Convencer o leitor a agir', 'Informar uma notícia', 'Expressar sentimentos do autor', 'Explicar o significado de uma palavra'], e: 'Leia o objetivo do texto: o verbo no imperativo chama o leitor para agir.' },
  fig1: { q: 'Em "Aquele zagueiro é uma muralha", a figura é:', o: ['Metáfora', 'Hipérbole', 'Antítese', 'Metonímia'], e: 'Comparação direta, sem "como" = metáfora.' },
  fig2: { q: '"Que ótimo, choveu justo no dia da praia!" é um exemplo de:', o: ['Ironia', 'Comparação', 'Metonímia', 'Personificação'], e: 'Diz o contrário do que sente = ironia.' },
  fig3: { q: '"Já te falei um milhão de vezes!" é:', o: ['Hipérbole', 'Ironia', 'Antítese', 'Metáfora'], e: 'Exagero proposital = hipérbole.' },
  fig4: { q: '"Li Machado de Assis nas férias" (lendo os livros dele) é:', o: ['Metonímia', 'Metáfora', 'Hipérbole', 'Antítese'], e: 'Troca a obra pelo autor = metonímia.' },
  fig5: { q: 'Para o ENEM, "Cê vai na festa?" numa conversa entre amigos é:', o: ['Adequado ao contexto informal', 'Um erro de português', 'Proibido em qualquer situação', 'Variação histórica'], e: 'A prova valoriza a adequação ao contexto e combate o preconceito linguístico.' },
  fig6: { q: 'Uma alternativa que diz que o jeito de falar do interior é "errado" geralmente está:', o: ['Errada, por ser preconceito linguístico', 'Certa, pela norma culta', 'Certa, se for formal', 'Fora da matéria'], e: 'Variação regional é legítima. O ENEM cobra respeito às variedades.' },

  // Literatura
  lit1: { q: 'Machado de Assis é o maior nome do:', o: ['Realismo', 'Romantismo', 'Arcadismo', 'Modernismo'], e: 'Machado (Dom Casmurro, Memórias Póstumas) é realista: ironia e crítica social.' },
  lit2: { q: 'A Semana de Arte Moderna aconteceu em:', o: ['1922', '1888', '1945', '1964'], e: 'Semana de 1922, em São Paulo, marco do Modernismo.' },
  lit3: { q: 'Idealização do indígena como herói nacional (como em "Iracema") é marca do:', o: ['Romantismo', 'Realismo', 'Modernismo', 'Barroco'], e: 'O indianismo de José de Alencar é romântico.' },
  lit4: { q: 'Verso livre, linguagem coloquial e humor são marcas do:', o: ['Modernismo', 'Parnasianismo', 'Arcadismo', 'Romantismo'], e: 'Os modernistas romperam com as regras formais da poesia.' },
  lit5: { q: 'Em "O Cortiço", o comportamento dos personagens é determinado pelo meio. Isso é do:', o: ['Naturalismo', 'Romantismo', 'Modernismo', 'Barroco'], e: 'O Naturalismo mostra o ser humano moldado pelo ambiente e pela biologia.' },
  lit6: { q: 'A poesia concreta valoriza principalmente:', o: ['A forma visual das palavras na página', 'A rima rica', 'O soneto clássico', 'A narrativa longa'], e: 'No concretismo, o desenho do poema faz parte do sentido.' },

  // Língua estrangeira
  lem1: { q: 'Em inglês, "pretend" significa:', o: ['Fingir', 'Pretender', 'Prender', 'Apresentar'], e: 'Falso cognato. "Pretender" em inglês é "intend".' },
  lem2: { q: 'Em espanhol, "exquisito" significa:', o: ['Delicioso', 'Esquisito', 'Estranho', 'Caro'], e: 'Falso cognato. "Esquisito" em espanhol é "raro".' },
  lem3: { q: 'Em inglês, "however" indica:', o: ['Oposição (porém)', 'Conclusão', 'Adição', 'Tempo'], e: '"However" = porém, no entanto.' },
  lem4: { q: 'Em espanhol, "embarazada" significa:', o: ['Grávida', 'Envergonhada', 'Embaraçada', 'Cansada'], e: 'Falso cognato clássico. "Envergonhada" é "avergonzada".' },
  lem5: { q: 'Em "Although it rained, we went out", "although" significa:', o: ['Embora', 'Porque', 'Então', 'Quando'], e: '"Although" = embora, apesar de.' },
  lem6: { q: 'A melhor estratégia na prova de língua estrangeira é:', o: ['Ler o enunciado primeiro e buscar o trecho da resposta', 'Traduzir o texto inteiro palavra por palavra', 'Pular todas', 'Escolher a alternativa mais longa'], e: 'Leia a pergunta, ache palavras parecidas com o português e foque no trecho que responde.' },

  // História
  his1: { q: 'A CLT (leis trabalhistas) foi criada em 1943, no governo de:', o: ['Getúlio Vargas', 'Juscelino Kubitschek', 'Dom Pedro II', 'Fernando Henrique'], e: 'A CLT é da Era Vargas, no Estado Novo.' },
  his2: { q: 'O AI-5, de 1968, ficou marcado por:', o: ['Endurecer a ditadura, com censura e fechamento do Congresso', 'Acabar com a escravidão', 'Ampliar a liberdade de imprensa', 'Criar o voto feminino'], e: 'O AI-5 foi o ato mais duro da Ditadura Militar.' },
  his3: { q: 'A Lei Áurea, que aboliu a escravidão, é de:', o: ['1888', '1822', '1889', '1930'], e: '13/05/1888. 1822 é a Independência e 1889 a República.' },
  his4: { q: 'O maior quilombo do Brasil colonial, liderado por Zumbi, foi:', o: ['Palmares', 'Canudos', 'Contestado', 'Farroupilha'], e: 'Palmares, na Serra da Barriga (atual Alagoas).' },
  his5: { q: 'A Revolução Industrial começou no século XVIII na:', o: ['Inglaterra', 'França', 'Estados Unidos', 'Portugal'], e: 'Máquina a vapor, fábricas têxteis e êxodo rural na Inglaterra.' },
  his6: { q: 'O lema "Liberdade, Igualdade, Fraternidade" é da:', o: ['Revolução Francesa', 'Revolução Russa', 'Independência do Brasil', 'Revolução Industrial'], e: 'Revolução Francesa (1789), inspirada no Iluminismo.' },
  his7: { q: 'A Constituição de 1988 é chamada de "Cidadã" porque:', o: ['Ampliou direitos sociais após a ditadura', 'Criou a monarquia', 'Instituiu o AI-5', 'Foi escrita por militares'], e: 'Veio com a redemocratização e garantiu direitos como saúde e educação.' },
  his8: { q: 'O "milagre econômico" (1968–1973) teve como efeito colateral:', o: ['Aumento da dívida externa e da desigualdade', 'Fim da inflação para sempre', 'Reforma agrária ampla', 'Distribuição igual da renda'], e: 'O país cresceu, mas concentrou renda e se endividou.' },

  // Geografia
  geo1: { q: 'A principal causa da destruição da camada de ozônio é:', o: ['O gás CFC', 'O desmatamento', 'O esgoto', 'A energia solar'], e: 'CFC destrói o ozônio. Efeito estufa é outro problema, ligado ao CO₂.' },
  geo2: { q: 'O crescimento de favelas nas grandes cidades está ligado a:', o: ['Urbanização rápida e sem planejamento', 'Baixa natalidade', 'Clima tropical', 'Fim da indústria'], e: 'Êxodo rural + falta de política de moradia = urbanização desordenada.' },
  geo3: { q: 'Êxodo rural é:', o: ['A migração do campo para a cidade', 'A migração da cidade para o campo', 'A saída de brasileiros do país', 'A volta para a cidade natal'], e: 'Muito forte no Brasil entre 1950 e 1980.' },
  geo4: { q: 'O bioma do litoral brasileiro que restou só em pequena parte da área original é:', o: ['Mata Atlântica', 'Amazônia', 'Pantanal', 'Pampa'], e: 'A Mata Atlântica foi a primeira a ser explorada e é a mais devastada.' },
  geo5: { q: '"Ilha de calor" acontece porque:', o: ['Asfalto, concreto e pouca vegetação deixam a cidade mais quente', 'O mar esquenta a cidade', 'Há muitas árvores', 'Chove mais no centro'], e: 'Materiais urbanos guardam calor, e falta área verde.' },
  geo6: { q: 'O Cerrado é chamado de "berço das águas" e sofre muito com:', o: ['Expansão da soja e da pecuária', 'Neve', 'Vulcões', 'Pesca predatória'], e: 'Nascem lá rios de grandes bacias. O agronegócio avança sobre ele.' },
  geo7: { q: 'Globalização é:', o: ['Integração econômica, cultural e de informação entre países', 'Isolamento comercial', 'Volta ao feudalismo', 'Fim do comércio exterior'], e: 'Multinacionais, internet e fluxo de capitais conectam o mundo.' },

  // Filosofia
  fil1: { q: 'A divisão em Executivo, Legislativo e Judiciário foi proposta por:', o: ['Montesquieu', 'Marx', 'Platão', 'Descartes'], e: 'Montesquieu, iluminista, em "O Espírito das Leis".' },
  fil2: { q: 'O "Mito da Caverna" é de:', o: ['Platão', 'Aristóteles', 'Kant', 'Nietzsche'], e: 'Sair da caverna = sair das aparências e buscar o conhecimento verdadeiro.' },
  fil3: { q: '"Penso, logo existo" é de:', o: ['Descartes', 'Sócrates', 'Hobbes', 'Rousseau'], e: 'Descartes, racionalista: a dúvida leva à certeza de que penso.' },
  fil4: { q: '"Só sei que nada sei" é associado a:', o: ['Sócrates', 'Platão', 'Kant', 'Marx'], e: 'Sócrates reconhecia a própria ignorância como início do saber.' },
  fil5: { q: 'Para Hobbes, "o homem é o lobo do homem", por isso é preciso:', o: ['Um Estado forte (o Leviatã)', 'Acabar com o Estado', 'Voltar à natureza', 'Viver sem leis'], e: 'Sem Estado, haveria guerra de todos contra todos.' },
  fil6: { q: 'Para Aristóteles, a virtude está:', o: ['No meio-termo entre dois extremos', 'No prazer máximo', 'Na obediência cega', 'No excesso'], e: 'Coragem fica entre a covardia e a imprudência.' },
  fil7: { q: 'Para Kant, agir moralmente é agir de forma que sua ação possa virar:', o: ['Uma lei universal', 'Um lucro', 'Um costume local', 'Uma vontade individual'], e: 'É o imperativo categórico.' },

  // Sociologia
  soc1: { q: 'O conceito de "fato social" é de:', o: ['Émile Durkheim', 'Max Weber', 'Karl Marx', 'Zygmunt Bauman'], e: 'Durkheim: fato social. Weber: ação social. Marx: luta de classes.' },
  soc2: { q: 'Para Marx, o valor produzido pelo trabalhador e não pago a ele é a:', o: ['Mais-valia', 'Ação social', 'Anomia', 'Modernidade líquida'], e: 'A mais-valia é a base do lucro na crítica marxista.' },
  soc3: { q: 'Para Weber, a sociologia deve entender:', o: ['A ação social e seu sentido', 'Só os números da economia', 'A luta de classes', 'O instinto animal'], e: 'Weber estuda o sentido que as pessoas dão às próprias ações.' },
  soc4: { q: '"Modernidade líquida" (relações frágeis e passageiras) é de:', o: ['Zygmunt Bauman', 'Durkheim', 'Platão', 'Montesquieu'], e: 'Bauman é ótimo repertório para temas de tecnologia e consumo.' },
  soc5: { q: 'Julgar outra cultura usando a sua como "a certa" é:', o: ['Etnocentrismo', 'Relativismo cultural', 'Aculturação', 'Democracia'], e: 'O oposto é o relativismo: entender cada cultura no próprio contexto.' },
  soc6: { q: 'O conceito de "indústria cultural" é da Escola de Frankfurt, de:', o: ['Adorno e Horkheimer', 'Marx e Engels', 'Platão e Aristóteles', 'Durkheim e Weber'], e: 'A cultura vira mercadoria produzida em massa.' },

  // Matemática
  mat1: { q: 'Um tênis de R$ 150 está com 20% de desconto. Quanto custa?', o: ['R$ 120', 'R$ 130', 'R$ 30', 'R$ 125'], e: '20% de 150 = 30. 150 − 30 = 120. Ou 150 × 0,8.' },
  mat2: { q: 'A mediana de 3, 7, 2, 9 e 5 é:', o: ['5', '5,2', '7', '3'], e: 'Ordene: 2, 3, 5, 7, 9. O do meio é 5. (5,2 é a média.)' },
  mat3: { q: 'A média de 6, 8 e 10 é:', o: ['8', '24', '6', '9'], e: '(6 + 8 + 10) ÷ 3 = 24 ÷ 3 = 8.' },
  mat4: { q: '3 kg de arroz custam R$ 12. Quanto custam 5 kg?', o: ['R$ 20', 'R$ 15', 'R$ 18', 'R$ 25'], e: 'Cada kg custa 12 ÷ 3 = 4. 5 × 4 = 20.' },
  mat5: { q: 'Um produto de R$ 100 sobe 10% e depois cai 10%. Fica:', o: ['R$ 99', 'R$ 100', 'R$ 101', 'R$ 90'], e: '100 × 1,1 = 110. 110 × 0,9 = 99. Não volta ao valor inicial!' },
  mat6: { q: 'Num grupo, as notas foram 7, 8, 8, 9, 10. A moda é:', o: ['8', '7', '9', '8,4'], e: 'Moda é o valor que mais se repete: 8 aparece duas vezes.' },
  geom1: { q: 'Um terreno retangular de 12 m por 8 m tem área de:', o: ['96 m²', '40 m²', '20 m²', '48 m²'], e: 'Área do retângulo = base × altura = 12 × 8.' },
  geom2: { q: 'No mapa com escala 1:50.000, 4 cm equivalem a:', o: ['2 km', '200 m', '20 km', '50 km'], e: '4 × 50.000 = 200.000 cm = 2.000 m = 2 km.' },
  geom3: { q: 'Uma caixa de 2 m × 3 m × 4 m tem volume de:', o: ['24 m³', '9 m³', '12 m³', '20 m³'], e: 'Volume = comprimento × largura × altura.' },
  geom4: { q: 'Ao lançar um dado, a chance de sair número par é:', o: ['1/2', '1/6', '1/3', '2/3'], e: 'Pares: 2, 4, 6 → 3 de 6 = 1/2.' },
  geom5: { q: 'Numa urna com 3 bolas azuis e 7 vermelhas, a chance de tirar azul é:', o: ['30%', '3%', '70%', '10%'], e: '3 favoráveis em 10 possíveis = 3/10 = 30%.' },
  geom6: { q: 'Um triângulo com base 10 cm e altura 6 cm tem área de:', o: ['30 cm²', '60 cm²', '16 cm²', '36 cm²'], e: 'Área = base × altura ÷ 2 = 60 ÷ 2.' },

  // Biologia
  bio1: { q: 'Cruzando Aa × Aa, a chance de nascer aa é:', o: ['25%', '0%', '50%', '75%'], e: 'AA, Aa, Aa, aa → 1 em 4 = 25%.' },
  bio2: { q: 'Numa cadeia alimentar, as plantas são:', o: ['Produtores', 'Decompositores', 'Consumidores primários', 'Consumidores secundários'], e: 'Fazem fotossíntese e produzem o próprio alimento.' },
  bio3: { q: 'A organela responsável pela respiração celular é a:', o: ['Mitocôndria', 'Ribossomo', 'Cloroplasto', 'Parede celular'], e: 'A mitocôndria produz energia (ATP) a partir da glicose.' },
  bio4: { q: 'Na fotossíntese, a planta libera:', o: ['Oxigênio', 'Gás carbônico', 'Nitrogênio', 'Metano'], e: 'CO₂ + água + luz → glicose + O₂.' },
  bio5: { q: 'Antibióticos servem para combater:', o: ['Bactérias', 'Vírus', 'Fungos de qualquer tipo', 'Vermes'], e: 'Antibiótico não funciona contra vírus, como gripe e dengue.' },
  bio6: { q: 'A vacina protege porque:', o: ['Estimula o corpo a criar memória imunológica', 'Mata todos os vírus do ambiente', 'É um antibiótico', 'Substitui o sangue'], e: 'O corpo aprende a reconhecer o agente e reage rápido depois.' },
  bio7: { q: 'A dengue é transmitida pelo:', o: ['Mosquito Aedes aegypti', 'Barbeiro', 'Caramujo', 'Rato'], e: 'Combate: eliminar água parada. O barbeiro transmite a doença de Chagas.' },

  // Química
  qui1: { q: 'Uma substância com pH 3 é:', o: ['Ácida', 'Básica', 'Neutra', 'Salina'], e: 'pH menor que 7 = ácido. 7 = neutro. Maior que 7 = básico.' },
  qui2: { q: 'Para separar areia da água, o método mais simples é:', o: ['Filtração', 'Destilação', 'Fusão', 'Evaporação total'], e: 'O filtro segura o sólido e deixa o líquido passar.' },
  qui3: { q: 'Para obter água pura a partir da água do mar, usa-se:', o: ['Destilação', 'Filtração', 'Peneiração', 'Decantação'], e: 'Evapora a água e condensa o vapor. O sal fica para trás.' },
  qui4: { q: 'A ferrugem é resultado da:', o: ['Oxidação do ferro', 'Fusão do ferro', 'Evaporação', 'Neutralização'], e: 'Ferro + oxigênio + umidade = óxido de ferro.' },
  qui5: { q: 'A queima de combustíveis fósseis libera principalmente:', o: ['Gás carbônico (CO₂) e água', 'Oxigênio puro', 'Ozônio', 'Hélio'], e: 'O CO₂ intensifica o efeito estufa.' },
  qui6: { q: 'A passagem do gelo para a água líquida se chama:', o: ['Fusão', 'Solidificação', 'Condensação', 'Sublimação'], e: 'Sólido → líquido = fusão. Líquido → gás = vaporização.' },

  // Física
  fis1: { q: 'Um carro percorre 120 km em 2 horas. A velocidade média é:', o: ['60 km/h', '240 km/h', '120 km/h', '30 km/h'], e: 'v = distância ÷ tempo = 120 ÷ 2.' },
  fis2: { q: 'Um chuveiro de 5.000 W ligado por 2 horas consome:', o: ['10 kWh', '2,5 kWh', '5 kWh', '10.000 kWh'], e: 'Energia = potência × tempo = 5 kW × 2 h = 10 kWh.' },
  fis3: { q: 'A unidade de potência é o:', o: ['Watt (W)', 'Volt (V)', 'Ampère (A)', 'Newton (N)'], e: 'Volt é tensão, ampère é corrente, newton é força.' },
  fis4: { q: 'Numa hidrelétrica, a energia transformada em elétrica vem:', o: ['Da queda da água (energia potencial)', 'Da queima de carvão', 'Do vento', 'Do sol direto'], e: 'Potencial gravitacional → cinética → elétrica na turbina.' },
  fis5: { q: 'O som NÃO se propaga no:', o: ['Vácuo', 'Ar', 'Água', 'Metal'], e: 'O som precisa de um meio material para se propagar.' },
  // ---- questões extras (variedade para as rodadas de revisão) ----
  red8: { q: 'O uso de repertório sociocultural (leis, autores, fatos) é avaliado principalmente na:', o: ['Competência 2', 'Competência 1', 'Competência 4', 'Competência 5'], e: 'A C2 avalia se você entendeu o tema e trouxe repertório pertinente.' },
  por7: { q: 'Uma notícia que apenas relata um fato, sem opinião, tem função predominante:', o: ['Referencial', 'Emotiva', 'Poética', 'Conativa'], e: 'Foco na informação = função referencial.' },
  por8: { q: '"Alô? Tá me ouvindo?" é exemplo da função:', o: ['Fática', 'Metalinguística', 'Referencial', 'Poética'], e: 'Testar se o canal de comunicação funciona = função fática.' },
  fig7: { q: '"O vento sussurrava na janela" é:', o: ['Personificação', 'Hipérbole', 'Metonímia', 'Ironia'], e: 'Vento não sussurra: é uma ação humana dada a algo não humano.' },
  fig8: { q: '"Era o riso e o choro na mesma noite" traz uma:', o: ['Antítese', 'Metáfora', 'Metonímia', 'Hipérbole'], e: 'Ideias opostas lado a lado = antítese.' },
  lit7: { q: '"Dom Casmurro", com a dúvida sobre Capitu, é de:', o: ['Machado de Assis', 'José de Alencar', 'Aluísio Azevedo', 'Carlos Drummond'], e: 'Machado de Assis, Realismo (1899).' },
  lit8: { q: 'Carlos Drummond de Andrade é um poeta do:', o: ['Modernismo', 'Romantismo', 'Realismo', 'Arcadismo'], e: 'Drummond é da segunda fase modernista ("No meio do caminho tinha uma pedra").' },
  lem7: { q: 'Em inglês, "actually" significa:', o: ['Na verdade', 'Atualmente', 'Ativamente', 'Exatamente'], e: 'Falso cognato. "Atualmente" em inglês é "currently" ou "nowadays".' },
  lem8: { q: 'Em espanhol, "oficina" significa:', o: ['Escritório', 'Oficina mecânica', 'Fábrica', 'Loja'], e: 'Falso cognato. Oficina mecânica é "taller".' },
  his9: { q: 'A Independência do Brasil (1822) foi proclamada por:', o: ['Dom Pedro I', 'Dom Pedro II', 'Tiradentes', 'Getúlio Vargas'], e: 'O "Grito do Ipiranga", em 7 de setembro de 1822.' },
  his10: { q: 'O movimento Diretas Já (1984) pedia:', o: ['Eleição direta para presidente', 'A volta da monarquia', 'O fim da CLT', 'O AI-5'], e: 'Foi uma grande mobilização pelo fim da ditadura e pelo voto direto.' },
  geo8: { q: 'O efeito estufa é intensificado principalmente por:', o: ['CO₂ da queima de combustíveis fósseis e do desmatamento', 'CFC dos aerossóis', 'Excesso de chuvas', 'Energia eólica'], e: 'Mais CO₂ na atmosfera prende mais calor. O CFC é o vilão do ozônio.' },
  geo9: { q: 'A maior planície alagável do mundo, no Centro-Oeste, é o:', o: ['Pantanal', 'Cerrado', 'Pampa', 'Caatinga'], e: 'O Pantanal alterna cheias e secas ao longo do ano.' },
  fil8: { q: '"O homem nasce bom, a sociedade o corrompe" é de:', o: ['Rousseau', 'Hobbes', 'Descartes', 'Platão'], e: 'Rousseau, contratualista, pensava o oposto de Hobbes.' },
  fil9: { q: 'A frase "Deus está morto" é associada a:', o: ['Nietzsche', 'Kant', 'Sócrates', 'Montesquieu'], e: 'Nietzsche criticava os valores tradicionais da sociedade ocidental.' },
  soc7: { q: 'Para Durkheim, "anomia" é:', o: ['A falta ou enfraquecimento das normas sociais', 'A luta de classes', 'O lucro do patrão', 'A ação com sentido'], e: 'Quando as regras perdem força, a sociedade fica desorganizada.' },
  soc8: { q: 'Mobilidade social é:', o: ['A mudança de posição de uma pessoa na estrutura social', 'A migração entre cidades', 'O uso de transporte público', 'A mudança de emprego no mesmo cargo'], e: 'Ex.: alguém de família pobre que sobe de classe pela educação.' },
  mat7: { q: '25% de 80 é:', o: ['20', '25', '32', '40'], e: '25% = 1/4. 80 ÷ 4 = 20.' },
  mat8: { q: '4 pedreiros fazem um muro em 6 dias. 8 pedreiros, no mesmo ritmo, fazem em:', o: ['3 dias', '12 dias', '6 dias', '4 dias'], e: 'Grandeza inversa: dobrou a equipe, cai pela metade o tempo.' },
  geom7: { q: 'A área de um círculo de raio 3 cm (use π = 3) é:', o: ['27 cm²', '9 cm²', '18 cm²', '36 cm²'], e: 'A = π r² = 3 × 3² = 3 × 9 = 27.' },
  geom8: { q: 'Ao lançar uma moeda, a chance de sair cara é:', o: ['50%', '25%', '100%', '33%'], e: '1 caso favorável em 2 possíveis = 1/2.' },
  bio8: { q: 'Qual destas doenças é causada por bactéria?', o: ['Tuberculose', 'Gripe', 'Dengue', 'Covid-19'], e: 'Tuberculose é bacteriana (tratada com antibiótico). As outras são virais.' },
  bio9: { q: 'Nas células com núcleo (eucariontes), o DNA fica principalmente no:', o: ['Núcleo', 'Ribossomo', 'Membrana', 'Vacúolo'], e: 'O núcleo guarda o material genético.' },
  qui8: { q: 'Para separar água e óleo, usa-se:', o: ['Decantação (funil de separação)', 'Filtração', 'Destilação', 'Peneiração'], e: 'Líquidos que não se misturam separam por densidade.' },
  qui9: { q: 'Uma solução com pH 10 é:', o: ['Básica', 'Ácida', 'Neutra', 'Impossível'], e: 'Acima de 7 é básico (ou alcalino).' },
  fis7: { q: 'A unidade de corrente elétrica é o:', o: ['Ampère (A)', 'Watt (W)', 'Volt (V)', 'Ohm (Ω)'], e: 'Ampère mede corrente. Ohm mede resistência.' },
  fis8: { q: 'Sem resistência do ar, uma pena e uma pedra soltas da mesma altura:', o: ['Chegam juntas ao chão', 'A pedra chega antes', 'A pena chega antes', 'A pena não cai'], e: 'Na queda livre, todos os corpos têm a mesma aceleração (gravidade).' },
  fis6: { q: 'Resistor de 10 Ω com corrente de 2 A. A tensão é:', o: ['20 V', '5 V', '12 V', '0,2 V'], e: 'Lei de Ohm: U = R × i = 10 × 2.' }
};

// A trilha. Cada passo: aprender (cartões) → praticar (questões) → resultado.
// type 'lesson' (padrão), 'mission-redacao', 'mission-kit', 'sim' (simulado).
window.TRAIL = [
  { day: 'Sexta, 06/11', sub: 'Redação e Linguagens', items: [
    { id: 'l-intro', area: 'geral', title: 'Como o ENEM funciona', min: 5,
      learn: [
        { h: 'Dois domingos', b: ['<b>08/11</b>: Linguagens (45), Humanas (45) e Redação.', '<b>15/11</b>: Natureza (45) e Matemática (45).', 'Portões: abrem 12h, <b>fecham 13h</b>. A prova começa 13h30.'] },
        { h: 'A regra de ouro', b: ['<b>Nunca deixe questão em branco.</b> Erro não desconta.', 'Faça primeiro as fáceis. Travou mais de 3 min? Pule e volte depois.', 'A redação vale até 1000 pontos e pesa muito. Por isso começamos por ela.'] }
      ],
      qs: ['int1', 'int2', 'int3', 'int4'] },
    { id: 'l-red1', area: 'red', title: 'Redação 1: como a nota funciona', min: 12,
      learn: [
        { h: 'O que o corretor avalia', b: ['<b>C1</b>: norma culta (ortografia, acentos, concordância).', '<b>C2</b>: entender o tema e usar repertório, no tipo dissertativo-argumentativo.', '<b>C3</b>: organizar e defender um ponto de vista.', '<b>C4</b>: coesão, com conectivos ligando as ideias.', '<b>C5</b>: proposta de intervenção completa.', 'Cada competência vale até <b>200</b> pontos. Total: <b>1000</b>.'] },
        { h: 'O que zera', b: ['Fugir totalmente do tema.', 'Não ser dissertativo-argumentativo (poema, narração, carta).', 'Escrever 7 linhas ou menos.', 'Copiar os textos motivadores, deixar em branco ou se identificar (assinar).', 'Desrespeitar direitos humanos não zera, mas tira pontos na C5.'] },
        { h: 'As regras de ouro', b: ['<b>Impessoal</b>: evite "eu acho", "na minha opinião".', '<b>Formal</b>: nada de "a gente", "tipo", "né", "pra".', '<b>Tamanho</b>: entre 25 e 30 linhas, em 4 parágrafos.', '<b>Título</b>: é opcional. Pode deixar sem.', '<b>Caneta preta</b> na folha definitiva. Rascunho não vale nota.'] }
      ],
      qs: ['red1', 'red2', 'red3', 'red4', 'red5', 'red8'] },
    { id: 'l-red2', area: 'red', title: 'Redação 2: entender o tema', min: 12,
      learn: [
        { h: 'Todo tema tem um recorte', b: ['O tema nunca é só um assunto. Em 2020, "O estigma associado às doenças mentais na sociedade brasileira" não pedia doenças mentais em geral, e sim o <b>preconceito</b> contra quem as tem.', 'Sublinhe as <b>palavras-chave</b> e repita-as na introdução e na conclusão.', '<b>Tangenciar</b>: falar do assunto geral sem o recorte. Tira muitos pontos.', '<b>Fugir</b>: falar de outra coisa. Zera.'] },
        { h: 'Temas dos últimos anos', b: ['2019: Democratização do acesso ao cinema no Brasil.', '2020: O estigma associado às doenças mentais na sociedade brasileira.', '2021: Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil.', '2022: Desafios para a valorização de comunidades e povos tradicionais no Brasil.', '2023: Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil.', '2024: Desafios para a valorização da herança africana no Brasil.', '2025: Perspectivas acerca do envelhecimento na sociedade brasileira.', 'Perceba o padrão: quase sempre é um <b>problema social brasileiro</b>.'] },
        { h: 'Os textos motivadores', b: ['Leia todos antes de escrever: eles mostram o recorte e dão ideias de causas.', '<b>Não copie</b> trechos deles. Cópia é desconsiderada.', 'Anote no rascunho: qual é o problema? Quais são 2 causas? Quem pode resolver?'] }
      ],
      qs: ['rt1', 'rt2', 'rt3', 'rt4', 'rt5'] },
    { id: 'l-red3', area: 'red', title: 'Redação 3: a introdução', min: 20, write: ['intro'], model: 'intro',
      learn: [
        { h: 'A introdução em 3 frases', b: ['<b>1. Repertório</b>: um fato, lei, livro, filme ou autor que contextualiza o tema.', '<b>2. Problema</b>: ligue o repertório ao Brasil de hoje ("No entanto, no Brasil...").', '<b>3. Tese</b>: seu ponto de vista + os 2 argumentos ("seja pela..., seja pela...").', 'Tamanho: 5 a 7 linhas.'] },
        { h: 'Repertório que pontua', b: ['<b>Legitimado</b>: fonte reconhecida (lei, livro, pensador, dado oficial).', '<b>Pertinente</b>: tem a ver com o tema.', '<b>Produtivo</b>: você explica a relação dele com o tema, não só cita.', 'Evite começos vazios como "Desde os primórdios da humanidade...".'] },
        { h: 'Repertórios coringa', b: ['<b>Constituição de 1988</b>: art. 5º (direitos fundamentais) e art. 6º (educação, saúde, moradia, segurança).', '<b>Paulo Freire</b>: educação como prática da liberdade.', '<b>Bauman</b>: "modernidade líquida", relações frágeis (tecnologia, redes, consumo).', '<b>Abolição de 1888</b> sem integração dos libertos: raiz de desigualdades.', '<b>George Orwell, "1984"</b>: controle da informação.', '<b>Hannah Arendt</b>: "banalidade do mal".'] }
      ],
      qs: ['in1', 'in2', 'in3', 'red7'] },
    { id: 'l-red4', area: 'red', title: 'Redação 4: o desenvolvimento', min: 25, write: ['d1', 'd2'], model: 'd1',
      learn: [
        { h: 'Cada parágrafo em 4 frases', b: ['<b>Tópico frasal</b>: a primeira frase, que diz qual é o argumento.', '<b>Explicação</b>: por que isso acontece? Causa e consequência.', '<b>Prova</b>: repertório, exemplo ou dado que comprova.', '<b>Fechamento</b>: amarra o argumento à tese.', 'Tamanho: 6 a 8 linhas cada parágrafo.'] },
        { h: 'Conectivos para decorar', b: ['Começar o D1: <i>Em primeira análise, Inicialmente,</i>', 'Começar o D2: <i>Além disso, Ademais, Outrossim,</i>', 'Explicar: <i>Isso ocorre porque, Nesse sentido,</i>', 'Opor: <i>Entretanto, No entanto, Contudo,</i>', 'Fechar: <i>Dessa forma, Assim, Logo,</i>'] }
      ],
      qs: ['de1', 'de2', 'de3', 'de4', 'de5'] },
    { id: 'l-red5', area: 'red', title: 'Redação 5: conclusão e proposta', min: 20, write: ['concl'], model: 'concl',
      learn: [
        { h: 'A conclusão', b: ['<b>Retome a tese</b>: "Portanto, ..."', '<b>Proposta de intervenção</b> com os 5 elementos.', '<b>Frase final</b>: feche retomando o repertório da introdução.', 'Duas propostas completas é ainda melhor.'] },
        { h: 'Os 5 elementos da proposta', b: ['<b>Agente</b>: quem faz. Seja específico: Ministério da Educação, escolas, mídia, ONGs.', '<b>Ação</b>: o que fazer (um verbo: criar, ampliar, fiscalizar).', '<b>Modo/meio</b>: como ("por meio de...").', '<b>Finalidade</b>: para quê ("a fim de...").', '<b>Detalhamento</b>: explique um elemento (quem conduz, com que recurso, com que frequência).'] },
        { h: 'Cuidados', b: ['A proposta precisa resolver as <b>causas</b> que você discutiu.', 'Respeite os direitos humanos: nada de violência, tortura ou pena de morte.', 'Nada de "todos nós devemos fazer a nossa parte": isso não tem agente nem meio.'] }
      ],
      qs: ['co1', 'co2', 'co3', 'co4', 'red6'] },
    { id: 'r-final', area: 'red', title: 'Redação 6: modelo nota alta e a sua', min: 20, type: 'red-final' },
    { id: 'm-redacao', area: 'red', title: 'Missão: redação no papel', min: 80, type: 'mission-redacao' },
    { id: 'l-por', area: 'lin', title: 'Interpretação e funções da linguagem', min: 15,
      learn: [
        { h: 'Funções da linguagem', b: ['<b>Referencial</b>: informa (notícia).', '<b>Emotiva</b>: sentimentos do emissor, 1ª pessoa.', '<b>Conativa</b>: convence o leitor (propaganda, imperativo).', '<b>Fática</b>: testa o canal ("Alô?").', '<b>Metalinguística</b>: a língua falando de si (dicionário).', '<b>Poética</b>: foco na forma (poema, ritmo).'] },
        { h: 'Truque de interpretação', b: ['Leia o <b>comando</b> da questão antes do texto.', 'Pergunte: qual é o <b>objetivo</b> deste texto?', 'Desconfie de alternativas com "sempre", "nunca", "apenas".', 'A resposta está no texto, não na sua opinião.'] }
      ],
      qs: ['por1', 'por2', 'por3', 'por4', 'por5', 'por6', 'por7', 'por8'] },
    { id: 'l-fig', area: 'lin', title: 'Figuras de linguagem e variação', min: 12,
      learn: [
        { h: 'Figuras que mais caem', b: ['<b>Metáfora</b>: comparação sem "como".', '<b>Ironia</b>: diz o contrário.', '<b>Hipérbole</b>: exagero.', '<b>Metonímia</b>: troca (autor pela obra, parte pelo todo).', '<b>Antítese</b>: ideias opostas. <b>Personificação</b>: coisa age como gente.'] },
        { h: 'Variação linguística', b: ['Para o ENEM não existe "certo e errado", existe <b>adequado ao contexto</b>.', 'Tipos: regional, social, histórica, situacional (formal × informal).', 'Alternativa com preconceito linguístico quase sempre está errada.'] }
      ],
      qs: ['fig1', 'fig2', 'fig3', 'fig4', 'fig5', 'fig6', 'fig7', 'fig8'] },
    { id: 'l-lit', area: 'lin', title: 'Literatura', min: 12,
      learn: [
        { h: 'Linha do tempo rápida', b: ['<b>Romantismo</b>: emoção, nacionalismo, indianismo (José de Alencar).', '<b>Realismo</b>: crítica social e ironia (Machado de Assis).', '<b>Naturalismo</b>: o meio determina a pessoa ("O Cortiço").', '<b>Modernismo</b> (Semana de 1922): verso livre, coloquial, identidade brasileira.', '<b>Concretismo</b>: o desenho do poema na página.'] }
      ],
      qs: ['lit1', 'lit2', 'lit3', 'lit4', 'lit5', 'lit6', 'lit7', 'lit8'] },
    { id: 'l-lem', area: 'lin', title: 'Inglês ou Espanhol', min: 10,
      learn: [
        { h: 'Como gabaritar as 5', b: ['Leia o <b>enunciado</b> e as alternativas antes do texto.', 'Ache palavras parecidas com o português (cognatos).', 'Não traduza tudo. Ache só o trecho que responde.'] },
        { h: 'Cuidado com os falsos amigos', b: ['Inglês: <i>pretend</i> = fingir · <i>actually</i> = na verdade · <i>however</i> = porém · <i>although</i> = embora.', 'Espanhol: <i>exquisito</i> = delicioso · <i>embarazada</i> = grávida · <i>oficina</i> = escritório · <i>rato</i> = momento.'] }
      ],
      qs: ['lem1', 'lem2', 'lem3', 'lem4', 'lem5', 'lem6', 'lem7', 'lem8'] }
  ]},
  { day: 'Sábado, 07/11', sub: 'Ciências Humanas e véspera', items: [
    { id: 'l-his', area: 'hum', title: 'História', min: 18,
      learn: [
        { h: 'Brasil', b: ['<b>Colônia</b>: açúcar no Nordeste, ouro em Minas, trabalho escravizado. Resistência: <b>Palmares</b> (Zumbi).', '<b>1822</b> Independência · <b>1888</b> Lei Áurea · <b>1889</b> República.', '<b>Era Vargas (1930–45)</b>: CLT (1943), salário mínimo, Estado Novo com censura.', '<b>Ditadura (1964–85)</b>: AI-5 (1968), censura, "milagre econômico" com dívida.', '<b>1988</b>: Constituição Cidadã.'] },
        { h: 'Mundo', b: ['<b>Revolução Industrial</b> (Inglaterra, séc. XVIII): fábricas, êxodo rural.', '<b>Revolução Francesa</b> (1789): Liberdade, Igualdade, Fraternidade.', '<b>Iluminismo</b>: razão contra o absolutismo.'] }
      ],
      qs: ['his1', 'his2', 'his3', 'his4', 'his5', 'his6', 'his7', 'his8', 'his9', 'his10'] },
    { id: 'l-geo', area: 'hum', title: 'Geografia', min: 15,
      learn: [
        { h: 'Cidade e população', b: ['<b>Êxodo rural</b>: campo → cidade.', '<b>Urbanização desordenada</b>: favelas, falta de saneamento, trânsito.', '<b>Ilha de calor</b>: asfalto e concreto esquentam a cidade.'] },
        { h: 'Meio ambiente', b: ['<b>Efeito estufa</b>: CO₂ prende calor → aquecimento global.', '<b>Camada de ozônio</b>: destruída por CFC (é outra coisa!).', '<b>Mata Atlântica</b>: bioma mais devastado. <b>Cerrado</b>: avanço da soja.', '<b>Globalização</b>: multinacionais, internet, fluxo de capital.', 'Mapa ou gráfico? Leia título e legenda primeiro.'] }
      ],
      qs: ['geo1', 'geo2', 'geo3', 'geo4', 'geo5', 'geo6', 'geo7', 'geo8', 'geo9'] },
    { id: 'l-fil', area: 'hum', title: 'Filosofia', min: 12,
      learn: [
        { h: 'Autor → ideia', b: ['<b>Sócrates</b>: "Só sei que nada sei".', '<b>Platão</b>: Mito da Caverna, mundo das ideias.', '<b>Aristóteles</b>: virtude é o meio-termo.', '<b>Descartes</b>: "Penso, logo existo".', '<b>Hobbes</b>: "o homem é o lobo do homem", Estado forte.', '<b>Montesquieu</b>: três poderes.', '<b>Kant</b>: agir como se fosse lei universal.'] }
      ],
      qs: ['fil1', 'fil2', 'fil3', 'fil4', 'fil5', 'fil6', 'fil7', 'fil8', 'fil9'] },
    { id: 'l-soc', area: 'hum', title: 'Sociologia', min: 10,
      learn: [
        { h: 'Autor → conceito', b: ['<b>Durkheim</b>: fato social.', '<b>Weber</b>: ação social.', '<b>Marx</b>: luta de classes, mais-valia.', '<b>Bauman</b>: modernidade líquida.', '<b>Adorno e Horkheimer</b>: indústria cultural.', '<b>Etnocentrismo</b>: julgar outra cultura pela sua.'] }
      ],
      qs: ['soc1', 'soc2', 'soc3', 'soc4', 'soc5', 'soc6', 'soc7', 'soc8'] },
    { id: 'm-redacao2', area: 'red', title: 'Missão: 2ª redação no papel', min: 80, type: 'mission-redacao' },
    { id: 's-dia1', area: 'geral', title: 'Simulado do 1º domingo', min: 20, type: 'sim', n: 15, from: ['red', 'por', 'fig', 'lit', 'lem', 'his', 'geo', 'fil', 'soc'] },
    { id: 'm-kit', area: 'geral', title: 'Véspera: kit da prova', min: 5, type: 'mission-kit' }
  ]},
  { day: 'Semana 09 a 14/11', sub: 'Matemática e Natureza (2º domingo)', items: [
    { id: 'l-mat', area: 'mat', title: 'Porcentagem e estatística', min: 15,
      learn: [
        { h: 'Porcentagem', b: ['20% de 150 = 0,2 × 150 = 30.', 'Aumento de 10% → × 1,1. Desconto de 10% → × 0,9.', 'Sobe 10% e cai 10% <b>não</b> volta ao início.', '<b>Regra de três</b>: ache o valor de 1 e multiplique.'] },
        { h: 'Estatística', b: ['<b>Média</b>: soma ÷ quantidade.', '<b>Mediana</b>: o valor do meio, com tudo ordenado.', '<b>Moda</b>: o que mais se repete.'] }
      ],
      qs: ['mat1', 'mat2', 'mat3', 'mat4', 'mat5', 'mat6', 'mat7', 'mat8'] },
    { id: 'l-geom', area: 'mat', title: 'Geometria, escala e probabilidade', min: 15,
      learn: [
        { h: 'Fórmulas que bastam', b: ['Retângulo: <b>b × h</b> · Triângulo: <b>b × h ÷ 2</b> · Círculo: <b>π r²</b>.', 'Caixa: <b>c × l × a</b> · Cilindro: <b>π r² × h</b>.', 'Escala 1:50.000 → 1 cm = 50.000 cm = 500 m.', '<b>Probabilidade</b> = favoráveis ÷ possíveis.', 'Sempre desenhe a figura no rascunho.'] }
      ],
      qs: ['geom1', 'geom2', 'geom3', 'geom4', 'geom5', 'geom6', 'geom7', 'geom8'] },
    { id: 'l-bio', area: 'nat', title: 'Biologia', min: 15,
      learn: [
        { h: 'O essencial', b: ['<b>Ecologia</b>: produtores → consumidores → decompositores.', '<b>Fotossíntese</b>: CO₂ + água + luz → glicose + O₂.', '<b>Mitocôndria</b>: respiração celular, energia.', '<b>Genética</b>: Aa × Aa → 25% AA, 50% Aa, 25% aa.', 'Antibiótico mata <b>bactéria</b>, não vírus. Vacina cria memória imunológica.', 'Dengue: mosquito <i>Aedes aegypti</i>, combata a água parada.'] }
      ],
      qs: ['bio1', 'bio2', 'bio3', 'bio4', 'bio5', 'bio6', 'bio7', 'bio8', 'bio9'] },
    { id: 'l-qui', area: 'nat', title: 'Química', min: 12,
      learn: [
        { h: 'O essencial', b: ['<b>pH</b>: < 7 ácido · 7 neutro · > 7 básico.', 'Separar sólido de líquido: <b>filtração</b>. Água pura do mar: <b>destilação</b>.', 'Estados: fusão (sólido→líquido), vaporização (líquido→gás).', 'Ferrugem = <b>oxidação</b>. Queimar combustível fóssil = CO₂ + água.'] }
      ],
      qs: ['qui1', 'qui2', 'qui3', 'qui4', 'qui5', 'qui6', 'qui8', 'qui9'] },
    { id: 'l-fis', area: 'nat', title: 'Física', min: 12,
      learn: [
        { h: 'O essencial', b: ['<b>Velocidade média</b> = distância ÷ tempo.', '<b>Energia elétrica</b> = potência (kW) × tempo (h) = kWh.', '<b>Lei de Ohm</b>: U = R × i.', 'Hidrelétrica: queda d\'água → turbina → eletricidade.', 'Som não se propaga no vácuo.'] }
      ],
      qs: ['fis1', 'fis2', 'fis3', 'fis4', 'fis5', 'fis6', 'fis7', 'fis8'] },
    { id: 's-dia2', area: 'geral', title: 'Simulado do 2º domingo', min: 20, type: 'sim', n: 15, from: ['mat', 'geom', 'bio', 'qui', 'fis'] }
  ]}
];

window.BAG = ['Documento oficial com foto (original)', 'Caneta esferográfica preta de tubo transparente', 'Cartão de Confirmação impresso (recomendado)', 'Água em garrafa transparente sem rótulo', 'Lanche leve (fruta, barrinha, sanduíche)', 'Casaco (a sala pode ser gelada)', 'Sair de casa cedo: portão fecha às 13h'];
window.TIPS = ['Não deixe nada em branco: erro não desconta.', 'Faça primeiro as fáceis. Travou mais de 3 min? Pule.', 'Reserve cerca de 1h30 para a redação e 15 min para passar a limpo.', 'Preencha o cartão-resposta a cada bloco, não tudo no fim.', 'Leia o comando antes do texto.', 'Hoje à noite: nada de matéria nova. Janta leve e cama cedo.'];
