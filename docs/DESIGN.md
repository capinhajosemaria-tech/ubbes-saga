# Ubbe's Saga — Documento de Design

Nov 10, 2026 · @zé

## Visão e pilares

Ubbe's Saga é um city builder viking isométrico para telemóvel: levas uma aldeia costeira de 11 pessoas a reino, gerindo recursos, estações, linhagens e raids pelo mar. Joga-se no browser, em inglês, e guarda o progresso no aparelho.

**Pilares** (usados para decidir qualquer dúvida de design):

- **Sangue**: pessoas com nome, família, talento herdado, armas herdadas. Linhagem de Ubbe (Ubbe I, II, III…).
- **Estações**: verão é para atacar, trocar e colher; inverno é para sobreviver e treinar.
- **Mar**: navios caros e preciosos, a porta para o mundo.
- **Planear e poupar**: vibe calma de Timberborn; cada decisão de mão de obra tem consequência no inverno.

**Referências**: TheoTown (construção e tiles), Clash of Clans (progressão por Centro de Vila, edifícios com níveis), Timberborn (gestão sazonal e escassez), Manor Lords (realismo medieval), Bad North (direção de arte), Crusader Kings (linhagem).

**Controlo**: tudo se gere por painéis. As pessoas no mapa são decorativas.

## Modos, tempo e estações

Um ano de jogo dura 20 minutos reais (verão + inverno) e o jogo só avança com a app aberta.

| Modo | Regras |
| --- | --- |
| Sandbox | Recursos infinitos, tudo desbloqueado, painel de testes |
| Relaxado (default) | Sem mortes por fome (só saídas), criminosos desligados, ira de Odin leve |
| Desafio | Invernos duros, mortes, Jarl pode morrer, revolta = derrota. Ubbe começa com 1 filho; se a linhagem se extinguir, perdes |

**Tempo**

- Velocidades: pausa, x0.5, x1, x2, x4. Raids, treino e construção de navios aceleram com a velocidade.
- Pausa automática em momentos importantes (raid regressa, ataque, morte do Jarl, aviso de revolta), desligável.
- 3 espaços de save, com exportar/importar como código.

**Estações**

- Verão: raids, comércio, colheitas, crescimento de árvores e bagas.
- Inverno: navios não saem; bagas, hortas e linho param; pesca no rio reduzida (gelo), no mar mais lenta; minas e lenhadores mais lentos; lenha e comida gastam-se mais. Trabalhadores sazonais ficam livres para lenha, água e treino.
- Previsão do inverno (suave ou duro) no fim do verão, dada pela Völva.
- Gráficos mudam: neve nos telhados e árvores, rio gelado.

## Mapa da vila

O mapa é fixo, desenhado a partir de um esboço teu: costa de um lado, montanhas no limite oposto (não construíveis), rio, floresta e arbustos de bagas. É maior que um mapa de CoC, mas a área construível máxima tem proporção semelhante.

- **Zonas de recurso**: floresta (madeira, regenera na mesma zona), base das montanhas (ferro), rio (água infinita, pesca), costa (pesca, sal, âmbar), arbustos de bagas.
- **Terras**: a área construível desbloqueia-se em blocos de 6×6 com nome editável (ex.: "Colina dos Corvos"), pagos com fama. Zonas bloqueadas veem-se escurecidas.
- **Estradas**: terra batida, finas e naturais, grátis e sem limite. Obrigatórias para todos os locais de trabalho; casas, altar e decorações não precisam.
- **Construção**: instantânea (exceto navios). Edifícios rodam e têm tamanhos diferentes (casa 2×2, Centro de Vila 4×4). Mudar de sítio é grátis; demolir devolve 50%.
- **Raio de trabalho**: extração produz menos se o recurso estiver longe; o círculo aparece ao colocar.
- **Água**: contamina-se se houver enterros perto do rio.
- Edifícios mostram estado no mapa (fumo quando trabalham, ícone quando falta matéria-prima ou trabalhadores).

## Pessoas, linhagem e o Jarl

Cada pessoa existe na simulação com nome nórdico, idade, pais, filhos, traço, equipamento e saúde, visível numa ficha no painel Povo.

**Início**: Ubbe, mulher, um filho, 8 aldeões, 2 porcos, 2 ovelhas, tábuas e comida para o primeiro inverno, Centro de Vila nível 1.

**Vida**

- Criança até aos 14, adulto trabalha, idoso a partir dos \~50 trabalha menos, morte natural entre 50 e 70.
- Esperança de vida e idade útil sobem com abundância, xamã, atratividade e bónus.
- Casais formam-se nas casas; nascimentos dependem de comida, espaço e moral.
- Crianças e idosos comem meia comida.
- Imigrantes chegam com atratividade e podem trazer traços úteis.

**Traços** (\~1 em 4 pessoas, herdáveis parcialmente): Mão Firme, Olho de Falcão, Forte, Paciente, Marinheiro, Frágil, Preguiçoso, Sangue Quente. Linhagens de guerreiros têm mais hipótese de ter guerreiros, e melhores. Mulheres podem ser shieldmaidens.

**Experiência nos ofícios**: sistema simples e indicativo (ex.: Aprendiz, Experiente, Mestre) com efeito equilibrado na produtividade. Filhos tendem a seguir o ofício dos pais.

**O Jarl**

- O jogador escolhe o herdeiro. Os filhos mais velhos chamam-se Ubbe (II, III…), mas se morrerem ou por escolha pode herdar outro filho. No standard, sem filhos vivos, pode ser escolhido o herói. Filhas também podem herdar (ligeira penalização de fama no desafio). Passar à frente do mais velho custa moral e cria rivalidade entre irmãos. A família vive na Casa do Jarl.
- Cada Ubbe nasce com 1–2 traços (Ambicioso, Cruel, Sábio, Devoto…) e pode ter um deus patrono.
- Pode ir em raids (bónus, risco de morte). Morte = funeral viking (navio em chamas) e sucessão, com penalização temporária.
- Revolta por derrotas seguidas ou moral baixa (com aviso antes): no desafio perdes; no standard o Jarl é deposto e o filho assume com debuff forte.
- No desafio, se Ubbe e o herdeiro morrerem sem descendência, a saga acaba.

**Saúde e doenças**: febre de inverno, disenteria por água suja, feridas infetadas; contagiosas dentro das casas, piores em vilas densas. Doenças dos animais são separadas. Feridos ficam parados e podem morrer sem tratamento; o xamã reduz risco e tempo.

**Thralls**

- Vêm de raids (táctica "fazer prisioneiros") e compram-se/vendem-se no comércio. Vivem no Thrall Pen.
- Trabalham sem moral, não podem ser guerreiros, podem fugir.
- Política de tratamento duro (mais produção, mais fugas) ou brando (menos fugas, ganham pequena poupança).
- Pop-ups de libertação: o Jarl aceita ou não; um thrall pode oferecer prata pela liberdade.

**Criminosos** (desligável): desempregados prolongados ou imigrantes podem tornar-se vagabundos que consomem e baixam a atratividade. A política de expulsão precisa de um vigia no Centro de Vila.

**Moral** (das pessoas, 0 a 100, separada em três grupos: guerreiros, trabalhadores, thralls). Acima de 70: +produção e nascimentos; 40–70 normal; abaixo de 40 a produção cai; abaixo de 20 aviso de revolta.

| Sobe com | Desce com |
| --- | --- |
| Comida suficiente e variada | Fome, racionamento |
| Casas quentes (lenha, roupa) | Frio, falta de lenha |
| Raids vitoriosos, saque partilhado | Derrotas, mortes em batalha |
| Banquetes e festas | Impostos altos, trabalho infantil |
| Favor dos deuses, altar perto | Doenças, mortes de familiares |
| Lagertha, Mead Hall | Herdeiro preterido, thralls em revolta |

**Atratividade** (da vila, 0 a 100): traz imigrantes (alguns com traços úteis); muito baixa faz pessoas sair.

| Sobe com | Desce com |
| --- | --- |
| Mercado, Grande Salão, Casa do Jarl/Rei | Criminosos, vagabundos |
| Fama | Água contaminada |
| Casas boas, decorações | Casas junto a ferreiro e fumeiro |
| Esperança de vida alta, xamã | Ataques sofridos recentemente |
| Impostos baixos ou zero | Fronteiras fechadas |

O painel Vila mostra a moral e a atratividade com a lista do que está a subir e a descer (ex.: "+8 banquete recente, −12 frio").

**Decorações**: variedade realista e histórica (postes rúnicos, estátuas de madeira, jardins, fogueiras comunitárias, etc.), semi-baratas, com ligeiro bónus de atratividade, desbloqueadas aos poucos com os níveis do Centro de Vila.

| Nível | Decorações |
| --- | --- |
| 1 | Fogueira comunitária, bancos de madeira, cercas de vime |
| 2 | Poste rúnico simples, jardim de ervas |
| 3 | Proa esculpida em exposição, redes a secar |
| 4 | Estátua de madeira de um deus (5 variantes), poço decorado |
| 5 | Pedra com imagens (estilo Gotland), estandartes do corvo |
| 6 | Jardim de pedras, totem de crânios de animais |
| 7 | Arco de entrada esculpido com dragões |
| 8 | Estátua de Ubbe, troféus de raids |
| 9 | Tapeçarias exteriores, fonte de pedra |
| 10 | Monumento ao herói-lenda (um por lenda) |

**Troféus**: alvos importantes vencidos dão uma decoração única (ex.: Sino de Lindisfarne, Portão de Paris).

## Economia

A produção de cada edifício é trabalhadores × eficiência; a eficiência sobe com ferramentas, moral, saúde, nível do edifício, vizinhança, conselheiro e deuses.

**Barra de recursos**: Comida (total), Madeira, Tábuas, Ferro, Aço, Lã, Prata, Ouro, Diversos · Mão de obra, Guerreiros, Fama. Tocar num valor mostra o detalhe.

**Comida em "comidas"**: cada alimento vale X comidas; a barra mostra só o total, agrupado em Fresco / Conservado / Bebida. Frescos estragam; conservados valem mais e não estragam (ex.: peixe fresco 1, peixe seco 2, salsicha 3). Variedade de dieta dá moral e saúde.

**Diversos** (subprodutos agrupados): escória, âmbar, peles, ossos, armas partidas, cordas velhas. Usados sobretudo como ofertas aos deuses e algumas trocas.

**Cadeias de produção**

| Origem | Edifício | Produto |
| --- | --- | --- |
| Árvores | Lenhador → Carpinteiro | Madeira → Tábuas |
| Montanha | Mina → Ferreiro | Ferro → Aço, ferramentas, armas, armaduras |
| Rio/mar | Pescador → Conservador / Fumeiro | Peixe → peixe seco / fumado |
| Arbustos | Coletor de bagas → Conservador | Bagas → compota |
| Hortas | Hortas → Conservador | Vegetais → pickles (com sal) |
| Costa | Salina (lenha) | Sal |
| Curral | Curral → Fumeiro | Carne → fumados, salsichas (Fumeiro nv. 2); Lã → Tecelão (velas), Alfaiate (roupa) |
| Campos | Cereal → Padaria / Cervejaria | Pão, cerveja |
| Colmeias | Cervejaria | Hidromel |
| Linho | Linho | Corda, tecido |
| Floresta | Caçador | Carne, peles |

**Ferramentas** (gastam-se em \~1 ano de trabalho)

- Ferreiro sem bigorna não funciona. A bigorna é reposta automaticamente com ferro; sem ferro, quando parte, compra-se (prata ou troca). O painel mostra a vida da bigorna e se há ferro de reserva.
- Agricultura sem enxada: 10%. Caça sem lanças/flechas: 25%. Outros ofícios sem ferramenta: muito mais lentos.

**Reservas**: em cada recurso podes marcar "reservar X"; a produção nunca gasta a reserva.

**Armazéns**: Celeiro (comida), Armazém (materiais), Arsenal (armas e armaduras). Sem raio, só capacidade. Prata e ouro ficam no Centro de Vila e na Casa do Jarl.

**Inverno e provisões**

- Cada casa queima lenha no inverno; casas variante A gastam menos.
- Água: aguadeiros levam do rio; mais tarde poços. Rio gelado torna a recolha mais lenta.
- Animais comem feno no inverno (Prado de feno). Abate automático com limite "manter X pares". Animais de géneros diferentes reproduzem-se.
- Roupa de lã reduz o efeito do frio.
- **Painel de provisões**: quantos dias de inverno aguentam comida, lenha e água ao consumo atual, com aviso.
- Manutenção: edifícios gastam madeira/tábuas por ano e degradam-se sem ela.

**Comércio**

- Desbloqueia com o primeiro navio, porto e casa de comércio. Ouro e prata vêm de raids e comércio.
- Troca direta por qualquer coisa: bens básicos a preço justo, bens raros (bigornas, armas, luxo) muito acima do valor.
- Preços variam por porto e estação; não se troca com vilas que atacaste.
- Rotas regulares (exportações e compras em duas entregas por verão) a partir de um nível do porto e da casa de comércio.
- Acordos de comércio: trocas fixas e regulares, renegociáveis, com melhor preço para o que a outra vila não produz.
- Mercado dinâmico: destruir um fornecedor (ex.: vila da seda) tira-o do mercado por um tempo e sobe o preço.
- Usos internos: prata para mercenários, upgrades altos e armaduras; ouro para heróis, mapas, Gods Favour e título de rei.

## Progressão do Centro de Vila

O Centro de Vila vai do nível 1 ao 10 (expansível até 15 no futuro) e define o que se pode construir e até que nível.

**Regras dos edifícios**

- Edifícios vão de 5 a 10 níveis: os específicos ficam em 5, os principais acompanham o Centro de Vila. Nenhum ultrapassa o que o Centro permite.
- Níveis ímpares dão +1 vaga de trabalho; níveis pares dão +eficiência.
- Casas: 3 estilos visuais por nível. Até ao nível 6 sobem capacidade (4 → 8 pessoas); depois há variantes A (isolamento, menos lenha) e B (capacidade). Podes subir a outra variante pagando a diferença, até ter o máximo nas duas.
- Subir o Centro exige população mínima, fama, edifícios no nível anterior e invernos sobrevividos (ex.: nível 3 = 40 pessoas, armazém nível 2, 2 invernos).
- O nível 1 desbloqueia aos poucos por marcos da saga ("constrói abrigo", "prepara o primeiro inverno", "forja ferramentas"), em 20–30 minutos.

**Início do jogo** (ano 865, chegada do Grande Exército Pagão; vila chamada Kaldstrand; calendário mostra o ano real e o ano da saga, ex.: "865 · Ano 1 de Kaldstrand"; poucos eventos históricos fixos alteram alvos temporariamente, ex.: 878 Edington fortalece Wessex, 885 cerco de Paris)

1. **Abertura** narrada (Ragnar caiu; Ubbe parte para uma costa nova) e escolha do primeiro conselheiro.
2. **Abrigo**: 2 casas ligadas ao Centro de Vila por estrada.
3. **Comida**: pescador e coletor de bagas; aparece o painel de provisões.
4. **Madeira**: lenhador e carpinteiro; mais casas.
5. **Ferro**: mina e ferreiro; primeiras ferramentas.
6. **Preparar o inverno**: conservador, celeiro, armazém, reserva de lenha.
7. **Primeiro inverno**, sempre suave: tutorial mínimo de racionamento e trabalhadores livres.
8. **Primeira primavera**: resumo do ano, mercado e restantes edifícios; a saga regista o Ano 1.

| Nível | Pop. máx. | Guerreiros | Navios | Desbloqueia |
| --- | --- | --- | --- | --- |
| 1 · Chegada | 24 | 0 | 0 | 6 casas, Centro de Vila, Casa do Jarl, Pira funerária, Lenhador ×2, Carpinteiro, Mina, Ferreiro (ferramentas), Aguadeiro, Pescador ×2, Coletor de bagas ×2, Conservador, Celeiro, Armazém, Mercado |
| 2 · Raízes | 50 | 5 | 0 | 10 casas, Altar, Treino de guerreiros (skirmishers), Arsenal, Curral, Prado de feno, Hortas (enxadas), Salina, pickles, Fumeiro (nv. 2: salsichas) |
| 3 · O Mar | 70 | 12 | 1 guerra + 1 carga | 14 casas, Estaleiro (Karvi, Knarr), Porto, Casa de comércio, arqueiros, guerreiros, lanceiros, arcos/flechas/escudos, Cereais, Padaria, Linho, Tecelão (velas), Caçador, Thrall Pen, primeiros raids |
| 4 · Saque | 108 | 20 | 2 | 18 casas, Vikings, Mercenários, Snekkja, Cervejaria, Colmeias, mais extração (Lenhador ×4, Mina ×2) |
| 5 · Fama | 132 | 30 | 3 | 22 casas, Viajante (Inglaterra), Berserker, Alfaiate, Muros 1, Torres ×2, Portão, Hof (templo), avisos de ataque |
| 6 · Ameaça | 175 | 40 | 4 | 25 casas, Engenheiro de batalha, Casa do Xamã, Skeid (2 tamanhos), Mead Hall, ataques reais à vila, acordos de comércio |
| 7 · Heróis | 189 | 50 | 4 | 27 casas, Herói + Casa do herói, Muros 2, Torres ×4, Viajante (Frância), rixas geracionais |
| 8 · Reino | 232 (até \~350 com título) | 60 | 5 + Drakkar | 29 casas, Settlements, Artesão, Rei Ubbe, Casa do Rei, Grande Templo, Viajante (Espanha), ataques de reinos não escandinavos após o título |
| 9 · Oriente | 240+ | 70 | 5 + Drakkar | 30 casas, Viajante (Médio Oriente), seda, Huscarls, Gods Favour |
| 10 · Era das Sagas | \~450 com título | \~130 | 6 + Drakkar | 31+ casas, Danegeld, Miklagard e Guarda Varangiana, Thing, Cristianismo, cerco a Wessex |

**Título de Rei** (nível 8, fama alta, 3 settlements): mais terras e casas, Casa do Rei com grande atratividade, Drakkar com grande bónus. Abre ataques de reinos de fora da Escandinávia, com risco real de matar o rei numa vila mal defendida. Se o rei morrer, o herdeiro sobe mas o título fica contestado até reconquistares fama.

**Bónus de vizinhança** (visíveis ao colocar)

- Ferreiro perto de mina, Carpinteiro perto de lenhador, Conservador/Fumeiro perto de pescador ou caçador: +15%
- Casas perto do mercado: +atratividade; perto de ferreiro ou fumeiro: −atratividade
- Perto do altar: +moral

**Maravilhas** (uma de cada, muito caras, 2 a 5 anos de construção conforme a maravilha)

| Maravilha | Nível | Custo principal | Bónus único |
| --- | --- | --- | --- |
| Túmulo-navio de Ragnar | 4 | Um navio sacrificado, ouro, armas | Favor de Odin nunca abaixo de 30; +fama permanente |
| Grande Salão de Kaldstrand | 7 | Madeira, tábuas, ferro, prata | Banquetes mais baratos, +moral e +atratividade na vila toda, extra nas casas próximas |
| Pedra Rúnica de Ubbe | 10 | Pedra, ouro, prata, mestre artesão | +fama por cada lenda e conquista registada |

Só as maravilhas exigem mão de obra dedicada: o Centro de Vila tem um posto de construtores (até 5 trabalhadores) que trabalham nelas temporariamente.

## Guerra: tropas, armas e navios

Guerreiros saem da população residente, são recrutados e treinados no Treino de guerreiros em levas (\~5 minutos por leva; 10 a 18 de uma vez conforme o nível do edifício, um regimento completo), consomem mais recursos e deixam de trabalhar, exceto no inverno.

**Tropas**

| Tropa | Nível | Equipamento | Papel |
| --- | --- | --- | --- |
| Skirmisher | 2 | Dardos/lança leve | Básico, barato |
| Lanceiro | 3 | Lança, escudo | Bom custo-benefício |
| Arqueiro | 3 | Arco, flechas | Alcance, guarnece torres |
| Guerreiro | 3 | Espada, escudo | Linha de combate |
| Mercenário | 4 | Variado | Pago em prata, precisa de fama |
| Viking | 4 | Machado, escudo | Tropa principal de raid |
| Berserker | 5 | Machado, escudo, armadura | Alto dano, cara |
| Engenheiro de batalha | 6 | Armas de cerco (bónus, sem custo de recursos) | Permite atacar cidades fortificadas |
| Xamã | 6 | — | Cura feridos no regresso e em batalha |
| Herói | 7 | Melhor equipamento | Grande bónus às tropas e ao navio; custa ouro |
| Huscarl | 9 | Elite pesada | Guarda de elite |
| Guarda Varangiana | 10 | Armas de elite | Servem em Miklagard, rendem ouro |

- Experiência individual, 3 patentes: Drengr, Huscarl, Berserker.
- Herói: só 1 ativo de cada vez, com bónus alto. Promove-se com ouro um guerreiro experiente de linhagem guerreira que tenha participado num raid bem-sucedido. Dorme na Casa do herói. Se morrer em batalha torna-se lenda: ganha uma entrada na saga com bónus permanente (as únicas entradas da saga que dão bónus). O herói não pode ser substituído; depois da morte, é preciso esperar 1 ano para promover outro.
- Guerreiros podem trabalhar no inverno: 100% se já fizeram esse trabalho, com penalização se não, até um limite definido.
- Equipar automático (melhores armas para os melhores), com opção de reservar armas de família.

**Armas e armaduras** (feitas no ferreiro com ferro, aço e madeira; guardadas no Arsenal)

- Espadas, machados, lanças, flechas, escudos, armaduras. Têm dano e durabilidade; perdem durabilidade a cada raid e partem-se.
- Armaduras são caras e duram gerações se não forem destruídas.
- Armas que sobrevivem a 3+ raids ganham nome, história e contagem de mortes, e passam de pais para filhos.

**Navios** (únicos que não se constroem instantaneamente)

| Navio | Nível | Uso |
| --- | --- | --- |
| Karvi | 3 | Pequeno, primeiros raids |
| Knarr | 3 | Carga e comércio |
| Snekkja | 4 | Raids rápidos |
| Skeid (2 tamanhos) | 6 | Grande de guerra |
| Drakkar | 8 (com título de Rei) | Navio do rei, grande bónus |

- Custam tábuas, ferro (rebites), velas de lã tecida e corda de linho. O primeiro Karvi leva um verão inteiro; um navio de cada vez por estaleiro.
- Nível do estaleiro dá mais espaço, alcance, resistência.
- Navios de carga em batalha têm grande penalização; de guerra no comércio, menor.
- Têm nome (escolhido ou gerado) e registo de viagens e batalhas; não ganham experiência (a força vem da tripulação).
- Podem ser destruídos em raids difíceis demais ou, raramente, em tempestades.

## Raids, mundo e diplomacia

Raids organizam-se no Centro de Vila depois de existir um navio, decorrem em background (\~2 min base, mais com a distância) e só no verão.

**Raid**

- Escolhes alvo, navio(s), tripulação e táctica: ataque rápido e furtivo, assalto total, ou cerco longo (mais recursos e armas de cerco).
- Opção "fazer prisioneiros" para trazer thralls.
- Estimativa antes de enviar: Fácil / Arriscado / Suicida.
- Resultado calculado por força (número, tipo, armas, experiência, heróis, navio, deuses, conselheiros, banquetes) contra a defesa do alvo, com fator de sorte.
- Relatório de regresso: mortos, feridos, saque, armas partidas, prisioneiros, navio perdido.
- Com fama muito alta, possibilidade de raids sem baixas.
- Valhalla: mortos com honra dão favor a Odin; com Freyja alta, parte vai para Fólkvangr e dá favor a ela.

**Tributo** (desde o início): ao chegar ao alvo, a vila pode oferecer tributo para evitar o raid quando o raid é de dificuldade baixa, o alvo já foi derrotado antes, ou há Gods Favour ativo. O tributo vale sempre menos que o saque potencial. Aceitar: sem baixas nem prisioneiros, menos fama, menos rancor. Recusar: o raid segue. Regatear: uma tentativa de pedir mais, com risco de recusarem e reforçarem a defesa. A oferta pausa o jogo. Aceitar tributo várias vezes da mesma vila torna-a mais disposta a pagar, até ao Danegeld recorrente no nível 10.

**Detalhes do raid**

- Mínimo de um navio por raid; vários raids em simultâneo, limitados por navios e guerreiros.
- Eventos raros durante a viagem, com escolha (ex.: tempestade à vista).
- Não há regresso para defender a vila. Retirada só a meio do raid: depois de perdas numa tempestade antes de chegar, ou num combate/cerco que corre mal. Falhar e retirar é possível.
- Cercos demoram mais que raids normais e têm opções de estratégia (ex.: foco nas armas de cerco para um cerco mais rápido).
- Saque misto consoante o alvo (mosteiro: ouro e prata; aldeia agrícola: comida e gado). Raids pequenos são pacíficos e fáceis; vilas e cidades muralhadas são muito difíceis com recompensas muito altas.
- Slider de carga no regresso: proporção entre prisioneiros e saque (ex.: 2/3 prisioneiros, 1/3 saque).
- Relatório narrado curto mais tabela de números.

**Ritmo dos raids**: o risco e a recompensa devem tornar difícil fazer muitos raids de uma vez, sobretudo no início, para não virar farm. Stats de tropas e combate equilibrados na base e afinados depois da versão jogável.

**Fases do raid**

1. **Viagem**: possível evento; se houver perdas, escolhes continuar ou regressar.
2. **Chegada**: oferta de tributo, se as condições se cumprirem: aceitar, regatear ou atacar.
3. **Combate**: 1 ronda em raids normais; 3 a 5 em cercos. Após cada ronda de cerco: continuar, mudar de estratégia ou retirar.
4. **Regresso**: slider prisioneiros/saque e relatório.

**Estratégias de cerco**: engenhos de cerco (rápido, depende dos engenheiros), bloqueio (lento, poucas baixas, gasta muitas provisões), escalada noturna (rápido e arriscado, bom com berserkers e heróis), exigir rendição (se enfraquecidos, oferecem tributo grande).

- Cercos exigem provisões levadas no navio, que ocupam espaço; se acabarem, a tripulação enfraquece.
- Cercos longos permitem aos defensores receber reforços de vilas vizinhas, só se forem aliadas do alvo.
- Retirar custa fama e moral dos guerreiros, mas menos que uma derrota total.

**Mapa do mundo** (estilizado, com locais históricos reais)

- Começa pela Escandinávia, com outposts pequenos para farmar recursos.
- Inglaterra, Frância, Espanha e Médio Oriente abrem com mapas comprados a viajantes (ouro). Miklagard no nível 10.
- Alvos atacados ficam empobrecidos e mais defendidos durante um tempo. Vilas atacadas deixam de comerciar contigo.
- Jarls nórdicos vizinhos (3–4, com personalidade) como rivais ou aliados.

| Região | Desbloqueio | Exemplos de alvos |
| --- | --- | --- |
| Escandinávia | Nível 3 | Outposts, vilas de pescadores, Jarls rivais, Hedeby, Birka |
| Ilhas do Norte | Nível 4 | Orkney, Shetland, Hébridas |
| Inglaterra | Viajante, nível 5 | Lindisfarne (793), Iona, Iorque, Londres, Wessex |
| Irlanda | Com Inglaterra | Dublin, mosteiros |
| Rus | Viajante, nível 9 | Rotas fluviais até Kiev |
| Frância | Viajante, nível 7 | Rouen, Nantes, Paris (845, 885) |
| Espanha e Portugal | Viajante, nível 8 | Lisboa (844, com destaque), Sevilha (844), Galiza |
| Médio Oriente | Viajante, nível 9 | Rotas da seda, cidades do califado |
| Miklagard | Nível 10 | Constantinopla |

- Cada região desbloqueada traz alvos cada vez melhores, equilibrados com a evolução esperada da vila do jogador.
- Cada alvo tem ficha: tipo (mosteiro, aldeia, cidade, fortaleza), riqueza, defesa, aliados, rancor, se comercia contigo. Saque varia com o alvo.
- Os alvos são constantes (não crescem nem mudam). Só os settlements evoluem, com stats que o jogador melhora (defesa, produção, etc.). Há sempre alvos pequenos e alvos muralhados.
- Alvos distantes têm mais risco de tempestade e exigem navios de maior alcance.
- Settlements podem receber defesas para serem menos atacados.

**Rixas**: vilas atacadas guardam rancor; algumas tornam-se inimigas de sangue e atacam-te durante gerações, até as derrotares de vez ou fazeres paz. Com fama muito alta (ex.: depois de vencer Paris), as pequenas deixam de atacar por medo.

**Diplomacia**: casamentos políticos do herdeiro com filhas de outros Jarls dão alianças (paz, comércio melhor, tropas emprestadas) e direitos de herança.

**Settlements** (nível 8)

- Fundam-se em vilas derrotadas 5+ vezes (Paris 15, Médio Oriente 20), custam recursos e pessoas enviadas.
- Não se veem; gerem-se num painel com upgrades. Produzem recursos brutos (não transformados) e enviam-nos passivamente.
- Lealdade a manter; podem revoltar-se ou ser reconquistados.
- Política por settlement: opressivo (mais produção, mais revoltas e contra-ataques) ou cooperativo (menos produção, muito estável).
- Rotas comerciais automáticas a partir daqui também.

**Gestão do settlement**

- Painel com nível (1 a 5), população enviada, 3 a 4 terrenos onde escolhes o que produz, lealdade, defesas e tratamento.
- As pessoas enviadas ficam lá e fazem família; o settlement cresce sozinho.
- Chefe nomeado da linhagem de Ubbe (filhos não herdeiros) ou um herói; dá bónus, mas pode rebelar-se se for ambicioso.
- Cada settlement exige um navio associado para transporte. Enquanto associado, o navio sai da frota e não conta para o limite máximo.
- **Abandonar settlement**: o navio associado volta e traz 50% das pessoas (a outra metade fica, assimilada). Reforça a mão de obra, mas perdes fama e o settlement. O navio associado só se perde se o settlement for tomado.
- Efeitos temporários nos alvos atacados mantêm-se: ficam empobrecidos e mais defendidos durante um tempo, depois voltam ao estado base.

**Nível 10**: Danegeld recorrente (vilas muito derrotadas pagam tributo regular e passivo em vez de serem saqueadas), Guarda Varangiana em Miklagard, cerco a Wessex (grande desafio, não é o fim do jogo). Vinland e Pedras Rúnicas ficam para níveis futuros.

## Defesa da vila

A vila recebe avisos a partir do nível 5 e ataques reais a partir do 6; edifícios nunca são destruídos por ataques (exceto pela ira de Odin), mas morrem pessoas e perdem-se recursos.

**Ataques**

- Inimigos chegam por mar; cena curta visível com torres a disparar e defensores a lutar.
- O Centro de Vila tem capacidade crescente de guerreiros em defesa. Com maioria de bons guerreiros ou o herói em casa, defesa quase garantida com perdas mínimas.
- Guerreiros em raid não defendem: dilema de deixar os melhores para trás.
- Mobilização e título de Rei aumentam a frequência de ataques.

**Muros** (só contam fechados)

- Constroem-se segmento a segmento, com custo por segmento (madeira no nível 1, pedra/ferro depois).
- Têm de circundar a vila toda; precisam de pelo menos um portão, e estradas só atravessam portões.
- Mar e montanhas contam como barreira natural, mas o lado do mar exige paliçada de praia.
- Fechados: ataques fracos e sem cerco quase não entram; com máquinas de cerco o bónus reduz-se.
- Segmentos danificados abrem o anel até serem reparados.
- Edifícios de extração fora do muro ficam vulneráveis.

**Torres de vigia**: 2 no nível 5, 4 no nível 7, com novos níveis; precisam de 2 arqueiros cada. Rendem mais em cima ou junto ao muro.

**Outros bónus de defesa**: fronteiras fechadas (ligeiro), Thor com favor alto, bênção de Thor (vila protegida por uma estação).

## Deuses e altar

Cada deus tem uma barra de favor de 0 a 100 que desce devagar; 50+ dá bónus passivo, 80+ permite pedir uma bênção ativa (custa favor), abaixo de 20 há maldições ocasionais.

| Deus | Gosta de | Ofertas preferidas | Bónus passivo | Bênção ativa |
| --- | --- | --- | --- | --- |
| Odin | Fama, heróis, sacrifícios | Armas partidas, cavalos, ouro | +fama, +experiência | Raid seguinte com moral máxima |
| Thor | Vitórias, defesa | Bodes, escória, cerveja | +combate e defesa | Vila protegida uma estação |
| Freyja | Colheitas, nascimentos | Mel, flores, lã em excesso | +fertilidade, agricultura, saúde | Colheita farta |
| Njord | Navios, pesca, comércio | Peixe miúdo, âmbar, cordas velhas | +pesca, menos tempestades | Viagem segura e rápida |
| Loki | Caos, astúcia | Qualquer coisa (efeito aleatório) | Eventos imprevisíveis | Aposta: dobra ou perde o saque |

- Ofertas usam sobretudo recursos secundários ou menos eficientes, para dar uso a tudo.
- Ações também contam: vitórias (Thor, Odin), nascimentos (Freyja), navios que regressam (Njord).
- Rivalidade só entre Thor e Loki.
- Loki é o recurso dos desesperados.
- Festas: Blót (início do inverno, todos), Sigrblót (início do verão, Odin), Jól (meio do inverno). Podes saltar num ano.
- Presságios (corvos, eclipse, aurora boreal) interpretados pela Völva.

**Progressão**: Altar (nível 2, bónus temporários pagos: saúde ou produção) → Hof (nível 5) → Grande Templo inspirado em Uppsala (nível 8). Cada fase permite mais deuses ativos, mais bênçãos e um Gothi (sacerdote) como trabalhador.

**Gods Favour** (nível 9): sacrifício de um residente, enche a barra de um deus e dá enorme bónus na próxima batalha. Poucas vezes por ano.

**Ira de Odin**: Odin a 0 e média dos outros abaixo de 25. Uma de três: raid perdido numa tempestade (navio e tripulação), praga que mata 20%, ou incêndio que mata 15% e destrói 2 casas e 2 edifícios de produção de valor médio (nunca o Centro de Vila). Com aviso prévio (presságios negros), tempo mínimo entre iras, versão leve no relaxado.

**Cristianismo** (nível 10): missionários pressionam a conversão. Converter abre comércio com reinos cristãos, mas congela ou apaga o favor dos deuses e irrita parte da população.

## Conselheiros, políticas e banquetes

Escolhes 1 conselheiro no início e desbloqueias até 6; Ragnar aparece como o pai lendário na abertura da saga.

| Conselheiro | Papel | Bónus |
| --- | --- | --- |
| Floki | Mestre de Navios | Navios mais baratos e resistentes |
| Lagertha | Lagman | Moral e defesa |
| Bjorn | Senhor da Guerra | Tropas mais fortes |
| Athelstan | Mercador e letrado | Melhores preços |
| Thorbjörg | Völva | Favor dos deuses, previsão do inverno, presságios |
| Egil | Skald | Mais fama |

**Políticas** (no Centro de Vila, desbloqueiam com os níveis)

| Política | Efeito |
| --- | --- |
| Racionamento | Normal / Reduzido (−consumo, −moral) / Severo (muito −consumo, moral cai, risco de doença) |
| Impostos (só Rei) | Prata dos cidadãos; aumentos graduais; alto baixa moral, zero dá grande atratividade |
| Expulsão de vagabundos | Expulsa criminosos; precisa de um vigia |
| Mobilização | +20% guerreiros durante um verão; mais ataques à vila |
| Rito funerário | Cremação (lenha, +moral, sem contaminação) ou enterro (grátis, ocupa terreno, risco para a água) |
| Partilha do saque | Mais para os guerreiros (moral, recrutamento) ou para o Jarl (tesouro) |
| Tratamento dos thralls | Duro ou brando |
| Trabalho infantil | A partir dos 10 anos; mais mão de obra, −saúde, −talento, −moral, risco de revolta |
| Fronteiras | Abertas (mais imigrantes e criminosos) ou fechadas (ligeiro bónus de defesa) |
| Tratamento de settlement | Opressivo ou cooperativo, por settlement |
| Thing (nível 10) | Leis com prós e contras, ex.: Lei da Vingança, Lei do Comércio |

**Banquetes** (no Centro de Vila; mais tarde no Mead Hall, onde rendem mais)

- Pagos com salsichas e cerveja, a qualquer momento, com custo crescente se repetidos.
- Três tipos: Guerreiros (tripulações antes de raids), Povo (moral geral), Conselho (máx. 1 por estação, reforça ligeiramente os conselheiros).
- Festas sazonais (Blót, Sigrblót, Jól) são versões maiores e mais baratas na época certa.

## Interface e painéis

O jogo gere-se por painéis: uma barra de recursos em cima, cinco botões em baixo, e um painel próprio ao tocar num edifício.

**Barra de cima**: recursos, estação e ano, velocidades (pausa, x0.5, x1, x2, x4).

**Cinco painéis**

1. **Vila**: recursos, provisões de inverno, racionamento, reservas, armazéns, políticas.
2. **Povo**: lista com filtros (trabalhadores, guerreiros, crianças, feridos, thralls), mão de obra livre, prioridades de trabalho, árvore da linhagem de Ubbe.
3. **Guerra**: tropas, arsenal, navios, planear raids, defesa.
4. **Mundo**: mapa estilizado, alvos, comércio, acordos, settlements, rixas, diplomacia.
5. **Saga**: crónica escrita (só leitura), conselheiros, deuses e altar, estatísticas do save, conquistas.

**Painel de edifício**: nível e upgrade, trabalhadores (− / +), prioridade (alta / normal / baixa), produção, consumo, ferramentas, bónus de vizinhança.

**Atribuição de trabalho**: automática por prioridades, com ajuste manual fino. Equipamento automático, também ajustável.

**Registo de eventos**: faixa de notificações curtas (nascimentos, regressos, mortes) que se tocam para ver o detalhe.

**Eventos aleatórios** raros e com escolhas (tempestades, boas colheitas, lobos e ursos, doença, incêndios, viajantes, monges a pedir abrigo).

Eventos aparecem como texto curto com aviso e botões de ação; 1 ou 2 por estação. Relaxado tem mais eventos bons, desafio mais crises. Os traços do Jarl mudam as opções (ex.: Cruel pode executar, Sábio pode negociar). Algumas cadeias raras têm continuação anos depois. Cada evento tem variações de texto; os mais marcantes têm tempo mínimo de vários anos entre repetições. Tom: sóbrio, frases curtas e secas, à maneira das sagas islandesas.

| Tipo | Eventos |
| --- | --- |
| Natureza | Tempestade de inverno, verão seco, cardume na costa, lobos no curral, urso na floresta, aurora boreal / eclipse |
| Pessoas | Gémeos (favor de Freyja), duelo holmgang, feud entre famílias, bebedeira no Mead Hall, criança prodígio, velho guerreiro quer morrer em batalha |
| Visitantes | Monge pede abrigo, mercador ambulante, skald errante, refugiados, mensageiro de um Jarl |
| Mar | Naufrágio estrangeiro, baleia encalhada, âmbar na costa |
| Crises | Doença, incêndio, fuga de thralls, rumores de revolta |

**Resumo do ano**: no fim de cada inverno, nascimentos, mortes, saque, fama e a entrada da saga desse ano.

**Estatísticas do save**: população ao longo dos anos (gráfico), raids feitos e ganhos, saque total, mortes por causa, mortes em batalha (nossas e do inimigo), gerações de Ubbe, maior herói, ano da saga.

**Conquistas** ligadas a datas históricas (ex.: saquear Lindisfarne em 793) dão fama.

**Tutorial** curto e opcional, contado como o início da saga.

**Toque**: um toque seleciona, arrastar move o mapa, pinça faz zoom. Sem som por agora. Sem notificações com a app fechada.

## Arte e aspeto

Direção escolhida: opção A "Névoa do Norte" (isométrico low-poly à Bad North, sem contornos, paleta fria e nevoenta), com edifícios ornamentados: empenas cruzadas em cabeça de dragão, turfa, tábuas, vigas entalhadas, escudos, adereços. Tudo desenhado em código.

- Edifícios historicamente coerentes: madeira, telhados de colmo e relva, navios reconhecíveis pela proa.
- Verão em verdes e dourados; inverno azulado com neve nos telhados e árvores; mar escuro do Norte.
- Animações discretas: fumo nos edifícios a trabalhar, água, árvores a abanar, algumas pessoas a andar só como efeito. Personagens em dois níveis de detalhe: figuras simples no mapa; retratos detalhados nas fichas de pessoas, menus de treino, conselheiros e família do Jarl (rosto, cabelo, barba, roupa e equipamento visíveis, a mudar com o que a pessoa tem equipado). Low-poly detalhado sem exagero, cores comedidas. Só algumas personagens têm marcas próprias: rugas com a idade, cicatrizes de batalha, tatuagens, cabelo grisalho.
- Interface em painéis de madeira escura, letras com toque nórdico, ícones simples, estilo indie calmo e sleek.
- Gráficos separados da lógica, para poder trocar por sprites profissionais no futuro.
- Limite assumido: bonito e coerente, mas não ao nível de arte de estúdio como CoC.
  - Estado (10 nov 2026): estilo e nível de detalhe aprovados com base na arte provisória (logo, Centro de Vila, casa, navio, porto, árvores, pessoas, guerreiro, Ubbe). Navio e Centro de Vila são as referências mais fortes. Refinamento fica para mais tarde.

## Plano de construção

O jogo constrói-se em 8 fases, cada uma jogável no telemóvel, em cerca de 12 a 18 sessões de trabalho.

**Como funciona cada sessão**

- Começa numa conversa nova: eu leio este documento e o código do jogo publicado (o código fica guardado no próprio jogo, não se perde entre conversas).
- Construo a fase, publico a nova versão no mesmo link e atualizo este documento.
- Termino com uma lista curta do que deves testar.
- Entre sessões, jogas e dizes-me o que está partido, aborrecido, fácil ou difícil demais.

**Antes de começar**: o teu desenho do mapa de Kaldstrand (costa, montanhas, rio, floresta, bagas).

**Estado (10 nov 2026)**: a Fase 0 está publicada como primeira versão jogável ([Ubbe's Saga](https://claude.ai/artifact/Lihmiiuj1QifmHi9PnnPcm)). Mapa de 72×72 tiles em 12×12 terras de 6×6, com 3×3 terras desbloqueadas no início. Dimensionado para o nível 10 com título de rei (\~60 casas, \~60 edifícios de produção, maravilhas e estradas ≈ 1400 tiles necessários): tem \~2280 tiles de prado construível e montanhas reduzidas a \~590 tiles. Montanhas em maciço, com poucos picos largos e rochas soltas. Núcleo da vila num prado plano a oeste do rio: rio a leste, baía a sul e contraforte da montanha a norte fecham três lados, para que uma futura muralha só tenha de correr a oeste e a norte. Florestas ficam fora do núcleo (oeste, nordeste e um bosque na orla). Lenha empilhada desenhada em perspetiva isométrica. Langhús e 2 casas colocados. Arrastar, pinça, toque para ver info, velocidades e verão/inverno. O mapa será ajustado ao esboço do jogador.

**Estado (10 nov 2026, tarde)**: Fase 1 publicada no mesmo link. Mapa aumentado para 84×84 (14×14 terras; 9 iniciais). Inclui os 14 edifícios do nível 1 com os números aprovados (Mercado passou a Praça 4×4), estradas grátis desenhadas a arrastar com ligação ao Centro de Vila, recursos com capacidade de armazém, comida em unidades (frescos estragam 3%/dia), água, lenha de inverno, ferramentas com desgaste, bigorna do ferreiro, árvores que voltam a crescer em \~2 anos, bagas que voltam no verão, trabalhadores por prioridade com ajuste −/+, população simples (80% trabalha), 8 marcos da saga com fama e desbloqueio gradual de edifícios, terras compradas com fama (25×d²), gravação automática no browser e exportar/importar código. Fica para a Fase 2: famílias, idades, moral, doenças, racionamento e painel de provisões.

**Ajustes da Fase 1 (10 nov 2026)**

- Limites por tipo no nível 1, visíveis no menu: 6 casas; 2 lenhadores, pescadores, coletores e aguadeiros; 1 dos restantes.
- Alcances: lenhador 6, coletor 5, mina 4, aguadeiro e pescador 3.
- O primeiro coletor, lenhador e aguadeiro são grátis; aviso 3 dias antes de faltar água, comida ou lenha.
- Trabalhadores só manuais (−/+), sem prioridades; novos edifícios recebem os trabalhadores livres.
- Reserva de madeira (40 por defeito, ajustável): carpinteiro e ferreiro nunca a usam.
- Consumo: 0,5 refeições e 0,25 água por pessoa/dia; lenha de inverno 0,5 por casa + 1 no Centro de Vila.
- Produção por trabalhador/dia: madeira 3, tábuas 2 (4 madeira), ferro 2, água 6, peixe 4, bagas 4; ferramentas gastam-se em 60 dias.
- Início: 120 refeições, 80 madeira, 20 tábuas, 100 água, 6 ferramentas.
- Marcos do nível 1 por ordem: assentar (coletor, aguadeiro, lenhador) → tábuas (carpinteiro + 30 tábuas) → ferro (mina + 10 ferro) → ferramentas (ferreiro) → inverno (conservador, celeiro, armazém) → 4 casas, primeiro inverno, praça, 20 pessoas.

**Teste de equilíbrio (simulação de 2 anos, 10 nov 2026)**: cada árvore dá 20 madeira e volta a crescer em 60 dias; o ferreiro ignora a reserva de madeira; custos subiram (casa 20 madeira, mina 30 madeira + 10 tábuas, ferreiro 15 + 20 tábuas + 10 ferro, praça 40 + 40, Casa do Jarl 60 + 30); marcos pedem stock (40 tábuas, 20 ferro, 12 ferramentas, 40 conservas); crescimento 0,15/dia (+0,1 com praça); inverno mais duro (pesca 40% no mar e 25% no rio, lenha 1 por casa + 2 no Centro de Vila); pontes de madeira sobre o rio; aviso de árvores partilhadas entre lenhadores. Resultado: 11 → 23 pessoas em 2 anos, nível 1 completo em cerca de 1,5 anos de jogo (≈30 min a 1×), sem faltas, comida a baixar no inverno sem rutura.

| Fase | Conteúdo | Testas |
| --- | --- | --- |
| 0 · Mapa e estilo | Mapa isométrico de Kaldstrand, câmara por toque, estilo visual, verão e inverno | Aspeto, legibilidade, toque |
| 1 · Núcleo | Construção, estradas, terras, recursos, trabalhadores, painéis base, velocidades, save | Construir uma vila nível 1 |
| 2 · Pessoas e inverno | Famílias, idades, moral, atratividade, comida em unidades, provisões, racionamento, doenças, resumo do ano, saga, primeiros eventos | Sobreviver ao primeiro inverno |
| 3 · Níveis 2 e 3 | Ferramentas, ferreiro, arsenal, armas, treino em levas, curral, hortas, salina, fumeiro, altar e deuses, vizinhança | Economia em cadeia |
| 4 · O mar | Estaleiro, navios, raids em fases, tributo, mapa do mundo (Escandinávia), comércio, thralls | Primeiros raids e trocas |
| 5 · Níveis 4 a 6 | Novas tropas, muros e defesa, ataques à vila, conselheiros, políticas, banquetes, Mead Hall, Inglaterra | Guerra e defesa |
| 6 · Níveis 7 e 8 | Herói e lendas, rixas, diplomacia e casamentos, settlements, título de Rei, maravilhas, Frância e Espanha | Expansão e realeza |
| 7 · Níveis 9 e 10 | Médio Oriente, Rus, Miklagard, Danegeld, Thing, Cristianismo, Wessex, conquistas, estatísticas | Fim da progressão |
| 8 · Polimento | Equilíbrio dos números, eventos completos, modos de jogo, definições, decorações | Jogo completo |

## Questões em aberto

O próximo tema a afinar é o raid passo a passo e o relatório de regresso.

- [ ] Raid passo a passo: ecrã de preparação, cálculo, relatório
- [ ] Mapa do mundo: regiões, lista de alvos históricos, outposts
- [ ] Settlements em detalhe: painel, upgrades, lealdade
- [ ] Ecrã inicial e primeiro inverno: marcos da saga do nível 1
- [ ] Esboço do mapa da vila (desenho teu)
- [ ] Números de equilíbrio: custos, produção, consumo (proposta minha, afinada a jogar)
- [ ] Níveis 11 a 15: Vinland, Pedras Rúnicas e outros
- [ ] Ataques à vila: possibilidade de vilas atacadas te atacarem de volta já discutida; detalhar frequência
- [ ] Plano de construção por sessões (proposto, por confirmar)

## Estado — Centro de Vila 2 e 3 (Versão 9)

**Implementado:**

- Centro de Vila nível 2 (madeira 120, tábuas 80, ferro 20, 18 habitantes, 1 inverno) e nível 3 (madeira 180, tábuas 140, ferro 50, ferramentas 10, 32 habitantes, rebanho + 5 guerreiros + fumeiro). Limites por tipo de edifício crescem com o nível.
- Nível 2: curral (porcos/ovelhas que se reproduzem no verão e comem feno no inverno), campo de feno, horta, salina, fumeiro, altar (Freyja, Njord, Odin: +25% durante 15 dias), campo de treino (lotes de 5, 11 dias, gasta lanças), arsenal. O ferreiro alterna entre ferramentas e lanças.
- Nível 3: campo de cereal + padaria, linho + tecelão (pano e corda), caçador, estaleiro (Karvi e Knarr, construção lenta), porto, casa de comércio (comerciante no verão, a cada 12 dias, troca por prata).
- Melhorias de edifícios: nível 2 dá +20% produção; nível 3 dá +1 posto de trabalho; casas +1 família por nível; armazéns +150.
- Integração visual: estradas de terra em camadas (bordas suaves, sulcos de rodas, seixos, tufos), pátios pisados à volta dos edifícios, trilhos das portas até à estrada, campos com fileiras que crescem durante o verão, cercas, animais, espantalhos, barcos atracados no porto, bandeiras nos edifícios melhorados.

**Teste de equilíbrio (simulação de 7 anos):**

- Centro de Vila 2 ao dia 66 (\~1,5 anos), nível 3 ao dia 220 (\~5 anos). População 11 → 62.
- Karvi lançado \~3 meses depois do estaleiro, Knarr \~2 meses depois desse.
- Correções: espiral sem ferramentas (agora produz a 60% e aviso), bloqueio de armazém (ferramentas fora do limite), limite do rebanho abaixo da meta, custo do terreno, campos e porto sem precisar de estrada, navios demasiado rápidos.

**Em aberto:** a população estabiliza em \~62 no nível 3 por limite de casas (fica para o nível 4); o mundo, as incursões e a defesa ficam para fases seguintes.

## Estado — Jogo completo até ao Centro de Vila 3 (Versão 10)

A versão 10 junta as Fases 2, 3 e 4 até ao nível 3 e abre com um ecrã inicial e uma apresentação.

**Novo nesta versão**

- **Ecrã inicial:** Continuar, Nova saga e Carregar, com 3 espaços de save. Depois vem a escolha do modo (Relaxado, Desafio, Sandbox), 4 ecrãs de história (865 e a morte de Ragnar, Ubbe, Kaldstrand, como governar) e a escolha do primeiro conselheiro (Floki, Lagertha, Bjorn, Athelstan, Thorbjörg, Egil).
- **Pessoas:** cada pessoa tem nome, idade, pais, cônjuge e retrato gerado (rugas, cicatrizes, tatuagens, cabelo grisalho). Há casamentos, nascimentos, imigrantes, velhice, doenças (febre de inverno, água suja, contágio, feridos) e 8 traços com efeito.
- **Linhagem:** Ubbe com traços de Jarl, herdeiro escolhível (passar à frente do mais velho custa moral), morte e sucessão com funeral (navio em chamas, pira ou túmulo). No Desafio, sem herdeiro a saga acaba.
- **Moral e atratividade:** valores de 0 a 100 com a lista de razões visível. A moral muda a produção e os nascimentos; abaixo de 20 há aviso de revolta e o Jarl pode ser deposto. A atratividade traz imigrantes.
- **Provisões e racionamento:** dias de comida, lenha e água; previsão da Völva no fim do verão (certa 4 em 5 vezes; com Thorbjörg, sempre); invernos duros.
- **Políticas:** rito funerário, trabalho infantil, fronteiras, partilha do saque e tratamento dos thralls, desbloqueadas pelo nível.
- **Deuses:** Odin, Thor, Freyja, Njord e Loki com favor de 0 a 100, oferendas de recursos secundários, dom aos 50, bênção aos 80, maldições abaixo de 20 e ira de Odin com aviso. Festas Sigrblót, Blót e Jól.
- **Economia:** reservas por recurso, bónus de vizinhança de +15% visíveis ao colocar, subprodutos (Odds and ends) para as ofertas e 7 decorações dos níveis 1 a 3.
- **Guerra:** tropas skirmisher, lanceiro, arqueiro e guerreiro; o ferreiro faz escudos, arcos, flechas e espadas. As armas partem-se e os guerreiros ganham patente Drengr.
- **Raids:** mapa da Escandinávia com 8 alvos. Cada raid passa pela viagem (tempestade ou navio mercante), pelo tributo (aceitar, regatear ou atacar), pelo cerco por rondas nas vilas muralhadas e pelo regresso, com slider prisioneiros/saque e relatório. O Jarl pode ir. Os alvos ficam empobrecidos e as vilas de comércio deixam de negociar.
- **Thralls, comércio e eventos:** Thrall Pen, fugas, compra da liberdade; comerciantes de Skiringssal, Hedeby ou Birka com preços próprios. 24 eventos com escolhas (natureza, pessoas, visitantes, mar, crises), as opções cruéis só com um Jarl Cruel, e resumo no fim de cada ano.

**Teste de equilíbrio** (bots a jogar 7 anos em vários perfis: equilibrado, desafio, jogador lento, guerreiro com trabalho infantil, sandbox)

| Medida | Versão 9 | Versão 10 |
| --- | --- | --- |
| Centro de Vila 2 | dia 66 | dias 57–70 (média \~63) |
| Centro de Vila 3 | dia 220 | dias 152–188 (média \~172) |
| População ao fim de 2 anos | 23 | 24–31 |

Ajustes feitos: custos dos Centros de Vila 2 e 3 desceram \~15%, terras custam 40×distância, imigração regular em vez de aleatória, nascimentos mais lentos (as crianças só trabalham aos 14), curral e estaleiro sem estrada, saque ×1,4 e porões maiores (Karvi 120, Knarr 250).

**Pontos de atenção**

- Quem enche a baía de pescadores fica sem lugar para o estaleiro. O jogo avisa ao chegar ao nível 2.
- A fama fica curta no nível 3 para comprar terras perto do mar.
- Ainda não estão feitos: experiência nos ofícios, criminosos e vagabundos, banquetes no Centro de Vila e armas com nome.

## Estado — Pesca, fama e progressão (Versão 11)

A versão 11 alinha a progressão com este documento e torna possível comprar terra ao ritmo de cada nível.

**Pesca:** cada casa de pescador ocupa 2×1, tem 4 vagas (5 no nível 3) e há no máximo 2: uma no mar e outra no rio. A quantidade de peixe controla-se pelos trabalhadores.

**Fama e terra**

- As 9 terras iniciais têm cerca de 250 casas construíveis. O nível 1 cabe nelas, o nível 2 precisa de mais 3 a 4 terras e o nível 3 de mais 10 a 11.
- Uma terra custa agora 30×distância−10: 50 no segundo anel, 80 no terceiro e 110 no quarto.
- Novas fontes de fama: o canto do ano (10 + população/3), as festas (+5 cada) e marcos maiores para subir o Centro de Vila (80 e 100).
- Resultado nos testes: 15 terras ao fim de 2 anos, 19 a 23 ao chegar ao nível 3 e 24 a 29 ao fim de 7 anos.

**Progressão face ao documento**

| Nível | Pop. máx. (doc / jogo) | Guerreiros | Navios | Requisitos para subir |
| --- | --- | --- | --- | --- |
| 1 | 24 / 24 + Langhús | 0 | 0 | — |
| 2 | 50 / 50 | 5 | 0 | 17 pessoas, 150 de fama ganha, celeiro, 1 inverno, 2 marcos, materiais |
| 3 | 70 / 70 | 12 | 1 de guerra + 1 de carga | 32 pessoas, 450 de fama ganha, armazém nível 2, 2 invernos, 3 marcos, materiais |

Para bater a população máxima do documento, as casas têm 4 lugares no nível 1 e 5 no nível 2. O nível 3 isola a casa e gasta menos 25% de lenha. Os raids ficaram mais curtos (viagem ≈ 0,7 × distância, cerca de 2 minutos nos alvos perto), como o documento pede.

**Testes** (bots a jogar 7 anos em 4 perfis: equilibrado, desafio, lento, guerreiro): Centro de Vila 2 entre os dias 56 e 80 (a maioria por volta de 58) e Centro de Vila 3 entre os dias 164 e 192, contra 66 e 220 na versão 9.

**Versão 12:** qualquer edifício pode ser rodado para 4 lados antes de construir ou ao mover. Uma marca "door" no chão mostra onde fica a entrada, e o trilho da porta sai desse lado. As árvores de terras desbloqueadas podem ser cortadas para sempre: o jogador recebe metade da madeira e o terreno passa a prado construível. Os cortes ficam gravados no save.

## Estado — Afinação geral (Versão 13)

A versão 13 sai de uma simulação com três partes: produção e consumo por recurso, 4.000 combates por alvo e tática, e moral, deuses e eventos ao longo de 7 anos.

**Economia**

- A horta e o cereal produziam demais: a comida chegava a \~950 e os pickles a \~390 no ano 7. A horta desceu de 4 para 3 por trabalhador e o cereal de 5 para 4. Agora a comida fica em \~600.
- A madeira continua a ser o maior uso de mão de obra (25% a 30%), por causa da lenha de inverno.
- O ferro e as ferramentas ficaram estáveis.

**Raids** (lucro em prata equivalente, depois de provisões e mortos)

| Alvo | 12 guerreiros mistos | 12 guerreiros de elite |
| --- | --- | --- |
| Hvalsey, Sogn | ganham sempre, +48 | +53 a +61 |
| Ringsaker | ganham sempre, +26 | +38 |
| Skiringssal | 70%, +59 | ganham sempre, +167 |
| Hordaland | 45%, perde-se | 97%, +193 |
| Jutland | quase impossível | 65% a 84%, +70 a +90 |
| Birka (cerco) | impossível | 56%, empate |
| Hedeby (cerco) | impossível | 9% |

Regras novas:

- **Sorte:** passou de ±20% para ±35% e o ecrã do raid mostra a hipótese de ganhar em percentagem.
- **Ataque rápido:** em 3 de cada 10 vezes os vigias veem as velas e não há surpresa.
- **Muralhas:** contam ×1,25 mesmo durante o cerco.
- **Cerco:** cada ronda de bloqueio tira 10% à defesa.
- **Derrotas:** matam no máximo 60% da tripulação.
- **Alvos:** Ringsaker ficou mais perto e mais rico; o saque de Hedeby e Birka subiu.

**Moral e deuses**

- A moral média era 72, o que dava +10% de produção quase sempre. A base desceu de 57 para 52 e a média ficou em 60 a 68.
- O favor dos deuses subia até 100. Agora desce mais depressa quando está alto e fica em \~55 a 65 para quem faz oferendas.
- Há cerca de 3,5 eventos por ano, dentro do previsto (1 a 2 por estação).

**Progressão:** Centro de Vila 2 por volta do dia 58 (até 80) e Centro de Vila 3 entre os dias 163 e 207. Com trabalho infantil a moral cai e o nível 3 atrasa até ao dia \~275.

## Versions and changelog

The game stays in beta until Town Hall level 10. Numbering is **Beta 0.MINOR.PATCH**: a new minor number for each content round, a patch number for fixes. **1.0.0** is the semi-complete game at Town Hall 10.

### Beta 0.5.0

- **Installable game:** hosted on GitHub Pages (capinhajosemaria-tech/ubbes-saga), installs on iPhone (Add to Home Screen) and PC (Chrome/Edge). It works offline. Saves are kept per device; use Export/Import to move them.
- **Content up to Town Hall 5:**
  - New buildings: brewery, hives, tailor, hof, tower and Ragnar's ship-tomb (a wonder).
  - New troops: viking, berserk and mercenaries. New ship: the snekkja.
  - New regions: Northern Isles, and England (unlocked by buying the map).
- **Systems:**
  - The market has dynamic prices with five trading partners, which unlock gradually.
  - Resources with no use only appear once trade opens.
  - Banquets, a palisade with gates, a council of advisors, and levies.
- **Test mode:** choose Town Hall 1–5 and start with a full village, with tools and 8×/16× speed.
- **Visuals:**
  - New houses (5 levels × 3 variants) and a Town Hall plaza that changes with each level.
  - Feasts with a fire, a pig on a spit and dancers. Raid animations. A glow around the village that shows morale.
  - A larger map (108×108) with monolithic mountains.
  - A world map in Bad North style, opened by tapping a ship.
- **Balance fixes found by bots:**
  - The Town Hall can keep materials for its next level, so workshops stop consuming the wood, planks and iron it needs. This only starts once every other requirement is met.
  - If no shore is left for a shipyard, the jarl claims a coastal zone.
  - Shipyard and harbour may stand partly over water.
  - Market selling now saturates faster.
- **Bot results** (6 profiles, 1100 days):

| Town Hall | Day reached |
| --- | --- |
| 2 | 54–68 |
| 3 | 143–185 |
| 4 | 328–365 (one slow run 660) |
| 5 | 522–692 (heavy raiders up to 997) |

Population reaches 80–116.

### Beta 0.5.1 – 0.5.2

- The road and palisade tool locks the end point after the second click; Build road or Cancel.
- Build menu tabs wrap; the top bar scrolls with the mouse.
- Fixed a freeze when placing a house.

### Beta 0.6.0

- **Interface (PC):**
  - A bottom dock holds the panels, the build categories and roads.
  - The build tray shows a picture of each building.
  - The building inspector is docked on the left.
  - Buildings light up on hover.
  - A **To do** list of suggested actions jumps the camera to the place or opens the right panel.
- **Resource bar:** grouped by kind, with the daily change and a hover breakdown by producer. Full-screen world map, with locked lands under mist and their places still visible.
- **Map:**
  - 132×132, with islands and a tarn.
  - Mist at the edges.
  - Softer locked land with a faint grid.
  - Smoother ground shading.
  - Mountains are one low-poly massif with cliff bands and snow.
- **Art:**
  - Each building has its own walls (planks, logs, stone, timber frame), roof (turf, thatch, shingle) and colours.
  - Houses have six colour schemes, chosen per house or for the whole village.
  - New art for the brewery, beehives, tailor, hof, watchtower and ship-tomb.
  - Roads lie on the ground, bridges are continuous, and props stay off roads and other plots.
  - Test mode has a **Gallery** that shows every asset.
- **Rules and balance:**
  - The Town Hall no longer requires winters to have passed.
  - Limits and house capacity are rebalanced, so a full village at every level has 4–8 more workers than jobs, with every warrior place filled.
  - Fields and level 5 give output instead of extra worker slots.
  - Old saves don't carry over.
