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
    { id: 'l-red1', area: 'red', title: 'Redação: as 5 competências', min: 10,
      learn: [
        { h: 'O que o corretor avalia', b: ['<b>C1</b> Norma culta: ortografia, acentos, concordância.', '<b>C2</b> Entender o tema e usar repertório, no tipo dissertativo-argumentativo.', '<b>C3</b> Organizar e defender um ponto de vista.', '<b>C4</b> Coesão: conectivos ligando as ideias.', '<b>C5</b> Proposta de intervenção completa.', 'Cada uma vale até <b>200</b> pontos.'] },
        { h: 'O que zera', b: ['Fugir totalmente do tema.', 'Não ser dissertativo-argumentativo (poema, narração, carta).', 'Escrever 7 linhas ou menos.', 'Copiar os textos motivadores, deixar em branco ou se identificar.', 'Desrespeitar direitos humanos não zera, mas tira pontos na C5.'] }
      ],
      qs: ['red1', 'red2', 'red3', 'red4', 'red5'] },
    { id: 'l-red2', area: 'red', title: 'Redação: a estrutura pronta', min: 15, builder: true,
      learn: [
        { h: 'A planta em 4 parágrafos', b: ['<b>1. Introdução</b>: repertório → problema → tese → anuncia 2 argumentos.', '<b>2. Desenvolvimento 1</b>: argumento 1 → explica → exemplo/repertório.', '<b>3. Desenvolvimento 2</b>: "Além disso," + argumento 2, no mesmo esquema.', '<b>4. Conclusão</b>: "Portanto," + proposta de intervenção.', 'Total entre 25 e 30 linhas.'] },
        { h: 'Repertórios coringa', b: ['<b>Constituição de 1988, art. 6º</b>: educação, saúde, moradia e segurança são direitos sociais.', '<b>Bauman</b>: "modernidade líquida", relações frágeis. Tecnologia, redes, consumo.', '<b>Paulo Freire</b>: educação como prática da liberdade.', '<b>Abolição de 1888</b> sem integração dos libertos: raiz de desigualdades.', '<b>Hannah Arendt</b>: "banalidade do mal", quando a violência vira rotina.'] },
        { h: 'Conectivos para decorar', b: ['Começar: <i>Em primeira análise, Sob essa ótica,</i>', 'Somar: <i>Além disso, Ademais, Outrossim,</i>', 'Opor: <i>Entretanto, No entanto, Contudo,</i>', 'Explicar: <i>Isso ocorre porque, Nesse sentido,</i>', 'Concluir: <i>Portanto, Dessa forma, Em suma,</i>'] }
      ],
      qs: ['red6', 'red7'] },
    { id: 'm-redacao', area: 'red', title: 'Missão: escrever uma redação', min: 80, type: 'mission-redacao' },
    { id: 'l-por', area: 'lin', title: 'Interpretação e funções da linguagem', min: 15,
      learn: [
        { h: 'Funções da linguagem', b: ['<b>Referencial</b>: informa (notícia).', '<b>Emotiva</b>: sentimentos do emissor, 1ª pessoa.', '<b>Conativa</b>: convence o leitor (propaganda, imperativo).', '<b>Fática</b>: testa o canal ("Alô?").', '<b>Metalinguística</b>: a língua falando de si (dicionário).', '<b>Poética</b>: foco na forma (poema, ritmo).'] },
        { h: 'Truque de interpretação', b: ['Leia o <b>comando</b> da questão antes do texto.', 'Pergunte: qual é o <b>objetivo</b> deste texto?', 'Desconfie de alternativas com "sempre", "nunca", "apenas".', 'A resposta está no texto, não na sua opinião.'] }
      ],
      qs: ['por1', 'por2', 'por3', 'por4', 'por5', 'por6'] },
    { id: 'l-fig', area: 'lin', title: 'Figuras de linguagem e variação', min: 12,
      learn: [
        { h: 'Figuras que mais caem', b: ['<b>Metáfora</b>: comparação sem "como".', '<b>Ironia</b>: diz o contrário.', '<b>Hipérbole</b>: exagero.', '<b>Metonímia</b>: troca (autor pela obra, parte pelo todo).', '<b>Antítese</b>: ideias opostas. <b>Personificação</b>: coisa age como gente.'] },
        { h: 'Variação linguística', b: ['Para o ENEM não existe "certo e errado", existe <b>adequado ao contexto</b>.', 'Tipos: regional, social, histórica, situacional (formal × informal).', 'Alternativa com preconceito linguístico quase sempre está errada.'] }
      ],
      qs: ['fig1', 'fig2', 'fig3', 'fig4', 'fig5', 'fig6'] },
    { id: 'l-lit', area: 'lin', title: 'Literatura', min: 12,
      learn: [
        { h: 'Linha do tempo rápida', b: ['<b>Romantismo</b>: emoção, nacionalismo, indianismo (José de Alencar).', '<b>Realismo</b>: crítica social e ironia (Machado de Assis).', '<b>Naturalismo</b>: o meio determina a pessoa ("O Cortiço").', '<b>Modernismo</b> (Semana de 1922): verso livre, coloquial, identidade brasileira.', '<b>Concretismo</b>: o desenho do poema na página.'] }
      ],
      qs: ['lit1', 'lit2', 'lit3', 'lit4', 'lit5', 'lit6'] },
    { id: 'l-lem', area: 'lin', title: 'Inglês ou Espanhol', min: 10,
      learn: [
        { h: 'Como gabaritar as 5', b: ['Leia o <b>enunciado</b> e as alternativas antes do texto.', 'Ache palavras parecidas com o português (cognatos).', 'Não traduza tudo. Ache só o trecho que responde.'] },
        { h: 'Cuidado com os falsos amigos', b: ['Inglês: <i>pretend</i> = fingir · <i>actually</i> = na verdade · <i>however</i> = porém · <i>although</i> = embora.', 'Espanhol: <i>exquisito</i> = delicioso · <i>embarazada</i> = grávida · <i>oficina</i> = escritório · <i>rato</i> = momento.'] }
      ],
      qs: ['lem1', 'lem2', 'lem3', 'lem4', 'lem5', 'lem6'] }
  ]},
  { day: 'Sábado, 07/11', sub: 'Ciências Humanas e véspera', items: [
    { id: 'l-his', area: 'hum', title: 'História', min: 18,
      learn: [
        { h: 'Brasil', b: ['<b>Colônia</b>: açúcar no Nordeste, ouro em Minas, trabalho escravizado. Resistência: <b>Palmares</b> (Zumbi).', '<b>1822</b> Independência · <b>1888</b> Lei Áurea · <b>1889</b> República.', '<b>Era Vargas (1930–45)</b>: CLT (1943), salário mínimo, Estado Novo com censura.', '<b>Ditadura (1964–85)</b>: AI-5 (1968), censura, "milagre econômico" com dívida.', '<b>1988</b>: Constituição Cidadã.'] },
        { h: 'Mundo', b: ['<b>Revolução Industrial</b> (Inglaterra, séc. XVIII): fábricas, êxodo rural.', '<b>Revolução Francesa</b> (1789): Liberdade, Igualdade, Fraternidade.', '<b>Iluminismo</b>: razão contra o absolutismo.'] }
      ],
      qs: ['his1', 'his2', 'his3', 'his4', 'his5', 'his6', 'his7', 'his8'] },
    { id: 'l-geo', area: 'hum', title: 'Geografia', min: 15,
      learn: [
        { h: 'Cidade e população', b: ['<b>Êxodo rural</b>: campo → cidade.', '<b>Urbanização desordenada</b>: favelas, falta de saneamento, trânsito.', '<b>Ilha de calor</b>: asfalto e concreto esquentam a cidade.'] },
        { h: 'Meio ambiente', b: ['<b>Efeito estufa</b>: CO₂ prende calor → aquecimento global.', '<b>Camada de ozônio</b>: destruída por CFC (é outra coisa!).', '<b>Mata Atlântica</b>: bioma mais devastado. <b>Cerrado</b>: avanço da soja.', '<b>Globalização</b>: multinacionais, internet, fluxo de capital.', 'Mapa ou gráfico? Leia título e legenda primeiro.'] }
      ],
      qs: ['geo1', 'geo2', 'geo3', 'geo4', 'geo5', 'geo6', 'geo7'] },
    { id: 'l-fil', area: 'hum', title: 'Filosofia', min: 12,
      learn: [
        { h: 'Autor → ideia', b: ['<b>Sócrates</b>: "Só sei que nada sei".', '<b>Platão</b>: Mito da Caverna, mundo das ideias.', '<b>Aristóteles</b>: virtude é o meio-termo.', '<b>Descartes</b>: "Penso, logo existo".', '<b>Hobbes</b>: "o homem é o lobo do homem", Estado forte.', '<b>Montesquieu</b>: três poderes.', '<b>Kant</b>: agir como se fosse lei universal.'] }
      ],
      qs: ['fil1', 'fil2', 'fil3', 'fil4', 'fil5', 'fil6', 'fil7'] },
    { id: 'l-soc', area: 'hum', title: 'Sociologia', min: 10,
      learn: [
        { h: 'Autor → conceito', b: ['<b>Durkheim</b>: fato social.', '<b>Weber</b>: ação social.', '<b>Marx</b>: luta de classes, mais-valia.', '<b>Bauman</b>: modernidade líquida.', '<b>Adorno e Horkheimer</b>: indústria cultural.', '<b>Etnocentrismo</b>: julgar outra cultura pela sua.'] }
      ],
      qs: ['soc1', 'soc2', 'soc3', 'soc4', 'soc5', 'soc6'] },
    { id: 's-dia1', area: 'geral', title: 'Simulado do 1º domingo', min: 20, type: 'sim', n: 15, from: ['red', 'por', 'fig', 'lit', 'lem', 'his', 'geo', 'fil', 'soc'] },
    { id: 'm-kit', area: 'geral', title: 'Véspera: kit da prova', min: 5, type: 'mission-kit' }
  ]},
  { day: 'Semana 09 a 14/11', sub: 'Matemática e Natureza (2º domingo)', items: [
    { id: 'l-mat', area: 'mat', title: 'Porcentagem e estatística', min: 15,
      learn: [
        { h: 'Porcentagem', b: ['20% de 150 = 0,2 × 150 = 30.', 'Aumento de 10% → × 1,1. Desconto de 10% → × 0,9.', 'Sobe 10% e cai 10% <b>não</b> volta ao início.', '<b>Regra de três</b>: ache o valor de 1 e multiplique.'] },
        { h: 'Estatística', b: ['<b>Média</b>: soma ÷ quantidade.', '<b>Mediana</b>: o valor do meio, com tudo ordenado.', '<b>Moda</b>: o que mais se repete.'] }
      ],
      qs: ['mat1', 'mat2', 'mat3', 'mat4', 'mat5', 'mat6'] },
    { id: 'l-geom', area: 'mat', title: 'Geometria, escala e probabilidade', min: 15,
      learn: [
        { h: 'Fórmulas que bastam', b: ['Retângulo: <b>b × h</b> · Triângulo: <b>b × h ÷ 2</b> · Círculo: <b>π r²</b>.', 'Caixa: <b>c × l × a</b> · Cilindro: <b>π r² × h</b>.', 'Escala 1:50.000 → 1 cm = 50.000 cm = 500 m.', '<b>Probabilidade</b> = favoráveis ÷ possíveis.', 'Sempre desenhe a figura no rascunho.'] }
      ],
      qs: ['geom1', 'geom2', 'geom3', 'geom4', 'geom5', 'geom6'] },
    { id: 'l-bio', area: 'nat', title: 'Biologia', min: 15,
      learn: [
        { h: 'O essencial', b: ['<b>Ecologia</b>: produtores → consumidores → decompositores.', '<b>Fotossíntese</b>: CO₂ + água + luz → glicose + O₂.', '<b>Mitocôndria</b>: respiração celular, energia.', '<b>Genética</b>: Aa × Aa → 25% AA, 50% Aa, 25% aa.', 'Antibiótico mata <b>bactéria</b>, não vírus. Vacina cria memória imunológica.', 'Dengue: mosquito <i>Aedes aegypti</i>, combata a água parada.'] }
      ],
      qs: ['bio1', 'bio2', 'bio3', 'bio4', 'bio5', 'bio6', 'bio7'] },
    { id: 'l-qui', area: 'nat', title: 'Química', min: 12,
      learn: [
        { h: 'O essencial', b: ['<b>pH</b>: < 7 ácido · 7 neutro · > 7 básico.', 'Separar sólido de líquido: <b>filtração</b>. Água pura do mar: <b>destilação</b>.', 'Estados: fusão (sólido→líquido), vaporização (líquido→gás).', 'Ferrugem = <b>oxidação</b>. Queimar combustível fóssil = CO₂ + água.'] }
      ],
      qs: ['qui1', 'qui2', 'qui3', 'qui4', 'qui5', 'qui6'] },
    { id: 'l-fis', area: 'nat', title: 'Física', min: 12,
      learn: [
        { h: 'O essencial', b: ['<b>Velocidade média</b> = distância ÷ tempo.', '<b>Energia elétrica</b> = potência (kW) × tempo (h) = kWh.', '<b>Lei de Ohm</b>: U = R × i.', 'Hidrelétrica: queda d\'água → turbina → eletricidade.', 'Som não se propaga no vácuo.'] }
      ],
      qs: ['fis1', 'fis2', 'fis3', 'fis4', 'fis5', 'fis6'] },
    { id: 's-dia2', area: 'geral', title: 'Simulado do 2º domingo', min: 20, type: 'sim', n: 15, from: ['mat', 'geom', 'bio', 'qui', 'fis'] }
  ]}
];

window.BAG = ['Documento oficial com foto (original)', 'Caneta esferográfica preta de tubo transparente', 'Cartão de Confirmação impresso (recomendado)', 'Água em garrafa transparente sem rótulo', 'Lanche leve (fruta, barrinha, sanduíche)', 'Casaco (a sala pode ser gelada)', 'Sair de casa cedo: portão fecha às 13h'];
window.TIPS = ['Não deixe nada em branco: erro não desconta.', 'Faça primeiro as fáceis. Travou mais de 3 min? Pule.', 'Reserve cerca de 1h30 para a redação e 15 min para passar a limpo.', 'Preencha o cartão-resposta a cada bloco, não tudo no fim.', 'Leia o comando antes do texto.', 'Hoje à noite: nada de matéria nova. Janta leve e cama cedo.'];
