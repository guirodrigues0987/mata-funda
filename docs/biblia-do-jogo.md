# Bíblia do Jogo — Mata Funda

> Documento de referência obrigatório para todos os agentes.
> O PO consulta antes de escrever qualquer história. O Arquiteto e o Dev consultam antes de implementar. O Revisor e o QA reprovam o que contrariar este documento.
> Mudanças nesta bíblia só com aprovação do Guilherme.

**Título provisório:** Mata Funda
**Gênero:** roguelike de ação top-down, em tempo real, com tempero souls
**Plataforma:** navegador (Phaser + TypeScript)
**Público:** 16+ anos. Sombrio, sério e misterioso, sem gore explícito.

---

## 1. Premissa

**Enzo** tem 12 anos, nasceu e cresceu em São Paulo e nunca pisou numa mata de verdade. Nas férias na casa da avó, no interior, ele leva o cachorro, o **Pipoca**, pra passear perto da cerca do sítio. Do nada, um redemoinho de folhas se forma, uma risada ecoa e, quando a poeira baixa, o Pipoca sumiu. No meio do redemoinho, Enzo vê um menino de uma perna só, de gorro vermelho, levando o cachorro mata adentro.

Era o **Saci**. Enzo vai atrás.

O que ele não sabe é que a Mata Funda está amaldiçoada. Uma queimada atravessou a floresta e, com a fumaça, veio uma maldição: as criaturas do folclore que protegiam a mata perderam o juízo. E a maldição obriga o Saci a levar tudo que entra na mata direto para o coração dela, onde está o **Boitatá**, a serpente de fogo que sempre defendeu a floresta contra incêndios, corrompida pelo próprio fogo.

Logo na entrada, no riacho da Borda da Mata, Enzo dá de cara com o **Boto cor-de-rosa**, o autoproclamado maior conquistador dos rios, que exige um "duelo de cavalheiros" antes de deixar qualquer um passar. O Boto vence o duelo com facilidade, mas gosta da coragem do menino: deixa ele passar, empresta um chapéu reserva e promete um duelo de verdade "quando você for digno". A partir daí, se declara "mentor" do Enzo e passa a aparecer pelo caminho, quer Enzo queira ou não.

Quanto mais fundo Enzo vai, pior a mata fica e mais perigosas são as criaturas. Pelo caminho, ele encontra os **guardiões que ainda resistem à maldição**, que ensinam as lendas pra esse menino da cidade que não sabe nada delas.

**Tema central:** a floresta não é a vilã. As criaturas são guardiãs feridas, inclusive o Saci. Derrotar um chefe é libertá-lo, não matá-lo, e cada chefe libertado passa a acompanhar o Enzo dentro de um amuleto, contando a história da mata. O menino da cidade aprende a respeitar a floresta.

---

## 2. Tom e regras de representação

- **Clima:** mistério, noite, sons da mata, luz de lanterna. Lembra história contada em volta do fogo.
- **Humor:** vem de dois lugares. O Enzo, peixe fora d'água ("isso aqui não tem sinal nenhum"), e o Boto, o alívio cômico oficial. Fora deles, o tom é de mistério.
- **Sombrio, mas sem gore explícito:** o jogo pode ser pesado, assustador e triste (a queimada, a mata morrendo, criaturas sofrendo com a maldição). Inimigos derrotados se desfazem em fumaça e brasas, sem sangue nem corpos.
- **Respeito às origens:** várias dessas lendas, e armas como arco, lança, borduna e zarabatana, vêm de povos indígenas e de tradições populares de várias regiões do Brasil (Saci, Curupira, Boitatá, Iara, Mapinguari, Anhangá, Cobra Norato, Pisadeira, Bradador, Romãozinho, Chibamba, Mão-Pelada, Pé-de-Garrafa, Batatão, Ipupiara, entre outras). Nada de caricatura, piada com estereótipo ou deboche de cultura. **O humor é sobre a personalidade dos personagens, nunca sobre as culturas de onde as lendas e as armas vêm.**
- **Sem religião:** não usar símbolos, rituais ou termos de religiões reais.
- **Elementos tradicionais das lendas são mantidos:** o Saci tem o **cachimbo**, que faz parte da lenda e da identidade dele. Ele aparece como traço do personagem e da cultura, não como algo a ser glamourizado. Álcool e fumo **não viram itens jogáveis** nem mecânicas para o Enzo, que tem 12 anos.
- **O Boto conquistador:** como na lenda, o Boto é um galanteador que se acha irresistível. Ele flerta, faz serenata, recita poesia e tira o chapéu (quase) para as personagens adultas do jogo. Regras fixas:
  - **Só com personagens adultos.** Nunca com o Enzo, nunca com qualquer personagem criança.
  - **Galanteio, não conteúdo sexual:** flores, poesia, dança, piscadinha, elogio exagerado. Nada de conteúdo sexual ou toque.
  - **Ele sempre leva um fora** e **aceita o "não" na hora**, de forma dramática ("Meu coração de água doce está em pedaços!") e segue em frente. Nunca insiste, nunca persegue.
  - A piada é a autoconfiança dele não combinar com o resultado.

---

## 3. Estrutura do jogo

Toda run começa na **Fogueira**, a base do jogo. Dali, a jornada alterna **áreas de mata** (perigosas, geradas proceduralmente) e **áreas de descanso** (seguras, feitas à mão, com um guardião):

```
FOGUEIRA (base: habilidades, arsenal, amuletos)
   ↓
Borda da Mata (tutorial + chefe Boto, só na primeira run)
   ↓
Área 1: Capoeira
   ↓
Descanso 1: Toca da Caipora            ← pode ir embora pra Fogueira
   ↓
Área 2: Mata Fechada  → chefe Mapinguari
   ↓
Descanso 2: Clareira da Matinta        ← pode ir embora pra Fogueira
   ↓
Área 3: Igapó  → chefe Iara
   ↓
Descanso 3: Lagoa da Vitória-Régia     ← pode ir embora pra Fogueira
   ↓
Área 4: Grotas  → chefe Cuca
   ↓
Descanso 4: Ninho do Uirapuru          ← pode ir embora pra Fogueira
   ↓
Área 5: Coração da Mata  → chefe final Boitatá
```

### Loop de uma run
1. Enzo começa na **Fogueira**: gasta brasas em habilidades e armas permanentes e escolhe o equipamento da run (arma principal, arma secundária e amuleto).
2. Entra na mata. Cada run gera **áreas novas**, então a mata nunca é igual.
3. Atravessa uma área de mata: explora, enfrenta criaturas, coleta itens e **brasas**. Em algum ponto da área, o **Saci aparece com o Pipoca** (seção 8).
4. Encontra a saída da área (ou derrota o chefe, nas áreas 2 a 5).
5. Chega à área de descanso seguinte: é curado, pode gastar brasas com o guardião em melhorias que valem só para essa run e **decide**:
   - **Seguir em frente**, arriscando as brasas que carrega por mais brasas, ou
   - **Ir embora** pra Fogueira, encerrando a run e **guardando todas as brasas** (seção 5).
6. Ao derrotar o Boitatá, a run é vencida: o Saci é libertado e devolve o Pipoca. Isso encerra a história principal e abre o pós-jogo, a Revanche do Boto (seção 10.2).
7. **Ao desmaiar, a run inteira acaba** e Enzo perde metade das brasas que carregava (seção 5).

---

## 4. Jogabilidade (fixa)

Ação em **tempo real**, câmera top-down, movimento livre. Referências de sensação: *Hades*, *Enter the Gungeon*, *The Binding of Isaac*, mas mais lento e mais legível, com ataques sempre anunciados.

### Controles
| Ação | Teclado + mouse | Controle (fase futura) |
|---|---|---|
| Mover (8 direções, livre) | WASD | Analógico esquerdo |
| Atacar com a arma principal | Clique esquerdo | X / Quadrado |
| Mirar | Posição do mouse | Analógico direito |
| Usar arma secundária | Clique direito | RT / R2 |
| Esquiva (rolamento) | Espaço | A / X |
| Usar amuleto | F | LT / L2 |
| Usar item rápido | Q | Y / Triângulo |
| Ligar / desligar a luz | L | Direcional para cima |
| Interagir / falar | E | B / Círculo |

### Atributos do Enzo
| Atributo | Inicial | Descrição |
|---|---|---|
| Vida | 10 | Chega a 0, Enzo desmaia |
| Velocidade | 5 tiles/s | Velocidade de movimento |
| Fonte de luz | Lanterna do celular | Define o raio de visão e quanto tempo a luz dura (seção 4.1) |
| Mochila | 4 espaços | Itens carregados |

O dano depende da arma equipada (seção 5.2). Na primeira run, Enzo tem só um **galho**, um **estilingue** improvisado e a **lanterna do celular**. Armas melhores e habilidades são compradas na Fogueira e ficam liberadas para sempre.

### Combate
- **Arma principal:** golpe corpo a corpo; alcance, arco e velocidade dependem da arma.
- **Arma secundária:** ataque à distância com mira.
- **Esquiva:** rolamento de 3 tiles em 0,25 s. Durante o rolamento, Enzo é **invulnerável**. Intervalo de 0,8 s entre esquivas.
- **Dano por contato:** encostar em criatura causa o dano de ataque dela. Depois de levar dano, Enzo fica 1 s invulnerável (piscando).
- **Telegrafia (tempero souls):** todo ataque forte é anunciado antes de acontecer, com a área marcada no chão em vermelho piscando.
  - Criaturas comuns: **0,8 s** de aviso.
  - Chefes: **1,0 s** de aviso.
  - Regra de ouro: **o jogador sempre tem tempo de sair se prestar atenção.** Ataque sem aviso é bug. (Única exceção: a fase verdadeira do Boto no tutorial, que é inescapável de propósito; ver seção 8.)
- **Janela de punição:** depois de um ataque forte, a criatura fica parada um instante (definido em cada ficha). É o momento de bater.

### Visão
- Tudo fora do raio de luz fica escuro.
- Partes do mapa já vistas ficam visíveis em tom apagado (memória do mapa).

### 4.1 Iluminação e bateria

Na mata é sempre noite, e **luz é recurso**. Toda fonte de luz tem uma **carga** que vai acabando enquanto está ligada.

**Como funciona**
- Enzo leva **1 fonte de luz** por run, escolhida na Fogueira (seção 5.4).
- Ligada, a carga cai de forma contínua. Desligada, não gasta nada.
- **Carga baixa (20% ou menos):** a luz começa a piscar e o ícone de carga pisca em vermelho no canto da tela. O Enzo reclama ("15% de bateria. Isso é pior que o Boitatá.").
- **Carga zerada:** a luz apaga e o raio de visão cai para **1,5 tile**, só o suficiente pra ver a própria silhueta e o que está colado nele.
- **Recarga:** chegar a uma área de descanso enche a carga para 100% (a fonte de cura recarrega a luz também). No meio da mata, só com itens de recarga (seção 11).

**Ligar e desligar (tecla L)**
- Desligar a luz economiza carga e deixa o Enzo **mais furtivo**: criaturas só o detectam a **metade da distância normal**.
- Mas, no escuro, ele só vê 1,5 tile em volta e as telegrafias de ataque continuam visíveis (são luminosas), o resto não.
- Ligar e desligar é instantâneo, mas tem intervalo de 0,5 s entre um e outro.

**O ambiente interfere**
- **Mata Fechada:** a neblina reduz o raio de qualquer luz em 1 tile.
- **Igapó:** a água reflete a luz; o raio aumenta em 1 tile sobre tiles de água.
- **Grotas:** correntes de vento **apagam lamparina e tocha** (precisa de 1 s parado para reacender). Lanternas elétricas não são afetadas.
- **Coração da Mata:** o fogo do chão ilumina sozinho; a fonte de luz gasta metade da carga.

**HUD**
- Ícone da fonte de luz com a porcentagem de carga, sempre visível.
- O ícone muda conforme a fonte: bateria (celular e lanterna de mão), gota de óleo (lamparina), chama (tocha), vagalume (pote).

### Mapa
- As áreas de mata são geradas proceduralmente: salas e corredores montados sobre uma grade de tiles (1 tile = 64 px, ver seção 12), mas **o movimento é livre** sobre ela.
- Cada run nova gera uma mata diferente. **Na história, isso é a maldição:** a Mata Funda está viva e muda de forma toda noite. Trilhas somem, árvores trocam de lugar, clareiras aparecem onde antes era mato fechado. Os guardiões comentam isso ("A mata se mexeu de novo essa noite. Não confie no caminho de ontem.").
- A Fogueira, a Borda da Mata e as áreas de descanso não são procedurais: o layout é fixo e definido em arquivo de dados.
- Internamente, toda geração usa uma **seed** (ver seção 15). A seed **não aparece para o jogador**: é ferramenta de desenvolvimento e teste.

---

## 5. Progressão: a Fogueira, as brasas e o risco

O jogo tem **dois tipos de progresso**, e essa separação é regra:

| | Na Fogueira | Com os guardiões |
|---|---|---|
| O que compra | Habilidades e armas | Melhorias rápidas, itens, cura |
| Dura quanto | **Para sempre** | **Só até o fim da run** |

### Brasas (moeda)
- Criaturas derrotadas deixam brasas. Chefes deixam muitas.
- A mesma moeda serve para a Fogueira e para os guardiões.
- Brasas carregadas durante a run **estão em risco** até Enzo chegar em casa.

### Ir embora ou seguir (a decisão central)
Em **toda área de descanso** existe uma trilha de volta pra Fogueira. Antes de seguir para a próxima área, o jogador escolhe:

| Escolha | O que acontece |
|---|---|
| **Seguir em frente** | Continua a run. As brasas continuam em risco, mas as próximas áreas dão mais brasas e têm chefes |
| **Ir embora** | A run termina com sucesso parcial. Enzo volta pra Fogueira com **100% das brasas** que carregava |

Essa é a tensão do jogo: arriscar tudo para ir mais longe ou garantir o que já conseguiu.

### Desmaio
- Quando a vida chega a 0, Enzo **desmaia** e acorda na Fogueira, sem saber como chegou lá (ver "Quem tira o Enzo da mata", abaixo).
- **Perde 50% das brasas** que carregava. Essa metade some para sempre: não existe rastro, não tem como recuperar.
- **A run inteira acaba:** melhorias dos guardiões, itens da mochila e progresso nas áreas se perdem. A próxima run começa da Capoeira, com uma mata nova.
- Habilidades, armas e amuletos **ficam**.

### Quem tira o Enzo da mata (segredo da história)

**O que o jogador vê:** quando Enzo desmaia, a tela escurece, um redemoinho de folhas passa por cima dele e se ouve, bem baixinho, uma risada. Ele acorda na Fogueira. Perto dele, uma folha ainda está girando no chão e um fiapo de fumaça de cachimbo se desfaz no ar. A Comadre Fulozinha só diz: "A mata te devolveu, menino. E cobrou o dela."

**A verdade (revelada aos poucos):** é **o Saci** quem tira o Enzo da mata toda vez. A maldição obriga ele a levar tudo que entra na mata para o coração dela, mas quando vê o menino caído, ele resiste e o arrasta pra fora num redemoinho. **A metade das brasas que some no desmaio fica com o Saci.**

**Como a verdade aparece:**
1. Primeiros desmaios: só a folha girando e a fumaça perto da Fogueira. Nada é explicado.
2. Segredos dos amuletos (seção 5.3): os chefes libertados vão soltando pistas ("Ninguém sai da mata sozinho, menino. Alguém te carrega.").
3. O Uirapuru, no Ninho, confirma: o Saci resiste à maldição para salvar o Enzo, e isso está consumindo as forças dele. É por isso que ele parece cada vez mais cansado.
4. No final, depois do Boitatá, o Saci confessa e devolve **todas as brasas que levou ao longo do jogo**. Ele usou o calor delas para manter o Pipoca aquecido no coração da mata.

**Regra para os agentes:** nenhum texto do jogo revela a verdade antes da hora. A ordem das pistas está em `src/data/lore/segredo-do-saci.json` e só avança conforme o progresso do jogador.

### A Fogueira (base)
- Lugar fixo, na beira da mata, atrás do sítio da avó: uma **cabana velha** de pau a pique com uma fogueira na frente. A fogueira é acesa e cuidada pela **Comadre Fulozinha**.
- Toda run começa e termina aqui.
- Sem inimigos, sem pressa. É o lugar de planejar.
- O que tem na Fogueira:
  - **Árvore de habilidades:** melhorias permanentes do Enzo (seção 5.1).
  - **Arsenal:** armas e fontes de luz compradas ficam liberadas para sempre; antes de cada run, Enzo escolhe **1 arma principal + 1 arma secundária + 1 fonte de luz** (seções 5.2 e 5.4).
  - **Altar dos amuletos:** os amuletos ganhos dos chefes ficam aqui; antes de cada run, Enzo equipa **1 amuleto** (seção 5.3).
- Conforme Enzo avança, a Fogueira ganha visitantes: guardiões já conhecidos aparecem sentados ali entre as runs, com falas novas. O Boto sai da chaleira.

### 5.1 Árvore de habilidades (permanentes)

Preços crescem a cada nível. Valores exatos ficam em `src/data/habilidades.json`.

| Habilidade | Níveis | Efeito |
|---|---|---|
| Fôlego | 3 | +2 de Vida máxima por nível |
| Bateria reforçada | 3 | +20% de duração de qualquer fonte de luz por nível |
| Luz forte | 2 | +1 tile no raio de qualquer fonte de luz por nível |
| Modo economia | 1 | Abaixo de 20% de carga, a fonte gasta 40% mais devagar |
| Pilha de reserva | 1 | Uma vez por run, quando a carga zera, recupera 25% sozinha |
| Mochila maior | 2 | +1 espaço na mochila por nível |
| Bolso da avó | 1 | Começa toda run com 1 Rapadura |
| Esquiva dupla | 1 | Permite 2 esquivas seguidas antes do intervalo |
| Esquiva perfeita | 1 | Esquivar no último instante antes de um golpe dá +50% de dano por 2 s |
| Golpe carregado | 1 | Segurar o botão da arma principal por 0,8 s solta um golpe com o dobro de dano |
| Ímã de brasas | 1 | Brasas no chão são puxadas até o Enzo num raio de 3 tiles |
| Pé leve | 2 | +10% de Velocidade por nível |
| Amuleto afinado | 2 | -20% no tempo de recarga do amuleto por nível |

### 5.2 Arsenal (armas permanentes)

Cada arma muda o jeito de jogar. Nenhuma é simplesmente "mais forte": cada uma tem um ponto fraco.

**Armas principais (corpo a corpo):**

| Arma | Dano | Intervalo | Alcance | Especial |
|---|---|---|---|---|
| Galho | 2 | 0,4 s | 1 tile, arco 90° | Arma inicial. Sem especial |
| Facão | 3 | 0,3 s | 1 tile, arco 90° | O mais rápido. Golpes seguidos no mesmo alvo dão +1 de dano a partir do 3º |
| Lança | 3 | 0,5 s | 2,5 tiles, em linha reta | Estocada longa: bate de longe, mas só na frente. Golpe carregado **arremessa a lança**, que atravessa criaturas e volta para a mão |
| Borduna | 5 | 0,9 s | 1,2 tile, arco 120° | Pesada e lenta. Atordoa criaturas por 0,5 s. Quebra pedras e troncos que bloqueiam salas secretas |
| Machadinhas | 2 + 2 | 0,45 s | 1 tile, arco 180° | Uma em cada mão, golpeia dos dois lados. Golpe carregado faz um giro que acerta tudo em volta |

**Armas secundárias (à distância, com mira):**

| Arma | Dano | Intervalo | Especial |
|---|---|---|---|
| Estilingue | 1 | 0,6 s | Arma inicial. Alcance de 6 tiles, munição infinita |
| Arco e flecha | 2 a 5 | 0,8 s | Segurar o botão estica a corda: quanto mais tempo (até 1 s), mais dano e alcance. Flecha carregada ao máximo **atravessa** várias criaturas |
| Boleadeira | 1 | 1,5 s | Enrola as pernas da criatura e a prende no lugar por 2 s. Não prende chefes |
| Zarabatana | 1 | 1,2 s | Dardo silencioso: criaturas que ainda não viram o Enzo ficam paradas por 3 s |

Valores exatos em `src/data/armas.json`.

### 5.4 Fontes de luz (permanentes)

Compradas na Fogueira e liberadas para sempre. Antes de cada run, Enzo escolhe **1 fonte de luz**. Como as armas, nenhuma é simplesmente melhor: cada uma tem um ponto fraco.

| Fonte | Raio | Formato | Duração base | Recarrega com | Especial |
|---|---|---|---|---|---|
| Lanterna do celular | 4 tiles | Círculo | 150 s | Bateria | Inicial. Quando a carga zera, o celular desliga com o barulhinho de desligar |
| Lanterna de mão | 7 tiles à frente + 2 em volta | Cone de 60° na direção da mira | 200 s | Pilhas | Enxerga longe, mas os lados ficam escuros |
| Lamparina a óleo | 5 tiles | Círculo, luz quente | 240 s | Óleo | A que mais dura. Apaga no vento das Grotas |
| Tocha | 6 tiles | Círculo, tremulando | 120 s | Tocha nova (troca inteira) | **Criaturas comuns não chegam a menos de 1,5 tile** de quem segura fogo, exceto a Mula sem Cabeça. Apaga no vento das Grotas |
| Pote de vagalumes | 3 tiles | Círculo, piscando | **Infinita** | — | Nunca acaba, mas é fraca e pisca, deixando o Enzo no escuro por instantes a cada 5 s. Vem da Naiá depois de derrotar a Iara |

Valores exatos em `src/data/luzes.json`. Habilidades de iluminação (seção 5.1) valem para todas as fontes.

### 5.3 Amuletos (habilidades dos chefes)

Cada chefe derrotado pela primeira vez deixa um **amuleto** com um pedaço da força dele (a exceção é o Boto, que dá o dele de presente depois de vencer o Enzo no tutorial). Ao equipar o amuleto, Enzo ganha uma **habilidade ativa do chefe**, usada com a tecla F e com tempo de recarga.

| Amuleto | Como ganha | Habilidade | Recarga |
|---|---|---|---|
| Chapéu do Boto | Presente do Boto ao fim do tutorial | **Mergulho:** Enzo afunda no chão e reaparece no ponto mirado (até 4 tiles), invulnerável durante o mergulho | 12 s |
| Pegada do Mapinguari | Derrotar o Mapinguari | **Pisão:** onda de choque em raio de 2 tiles, dano 4 e atordoa criaturas por 1,5 s | 20 s |
| Concha da Iara | Derrotar a Iara | **Canto:** puxa as criaturas num raio de 5 tiles para um ponto e as deixa encantadas, paradas, por 2 s | 25 s |
| Caldeirão da Cuca | Derrotar a Cuca | **Feitiço de sono:** área de raio 2 no ponto mirado; criaturas dentro dormem por 3 s (chefes: 1 s) | 25 s |
| Pedra do Romãozinho | Derrotar o Romãozinho no esconderijo dele | **Chuva de pedras:** Enzo arremessa 5 pedras em leque na direção da mira, 2 de dano cada | 15 s |
| Escama do Boitatá | Derrotar o Boitatá | **Rastro de fogo:** por 5 s, Enzo deixa fogo por onde passa, causando dano a criaturas que pisarem | 30 s |

#### O chefe fala quando o amuleto é usado

Cada amuleto carrega o **espírito do chefe libertado**. **Toda vez que Enzo usa o amuleto, o chefe fala**, numa legenda curta no canto da tela (não pausa o jogo, some sozinha em 4 s).

- **Segredos da lore em ordem:** cada chefe tem uma **sequência de segredos** sobre a história da mata (como era antes da queimada, quem começou o fogo, por que o Saci obedece, o que aconteceu com o Boitatá). A cada uso, o chefe conta o **próximo segredo da sequência**. O progresso dessa sequência é **permanente**: continua de onde parou nas runs seguintes.
- **Quando os segredos acabam:** o chefe passa a soltar **falas curtas de combate**, sorteadas de uma lista ("Pisa firme, menino!").
- **Reação ao contexto:** algumas falas especiais disparam quando o amuleto é usado em situações específicas: contra um chefe, com pouca vida, na área onde aquele chefe vivia.
- **O Boto é diferente:** os segredos dele são quase todos vaidade e besteira, mas escondido no meio tem **um segredo verdadeiro e importante** da lore.
- **Diário da Mata:** todo segredo ouvido fica registrado num diário que pode ser lido na Fogueira.
- Textos ficam em `src/data/amuletos/<chefe>.json`, com a sequência de segredos, as falas de combate e as falas especiais.

---

## 6. Áreas de mata — a degradação

**Regra de ouro: cada área é visivelmente pior que a anterior.** A mata vai perdendo cor, vida e som conforme Enzo avança.

| # | Área | Estado da mata | Mecânica do ambiente | Chefe |
|---|---|---|---|---|
| 1 | Capoeira | Quase intacta. Verde, grilos cantando, só um cheiro de fumaça no ar | Nenhuma | — |
| 2 | Mata Fechada | Folhas começando a secar, neblina de fumaça entre as árvores, menos sons | Corredores apertados; neblina reduz o raio de luz em 1 tile | Mapinguari |
| 3 | Igapó | Água turva e escura, árvores mortas em pé, silêncio | Água rasa: Enzo anda 50% mais devagar e não pode esquivar | Iara |
| 4 | Grotas | Pedras cobertas de cinza, vento carregando fuligem, quase sem verde | Correntes de vento empurram Enzo numa direção | Cuca |
| 5 | Coração da Mata | Tudo queimado, brasas no chão, céu vermelho | Chão em brasa causa 1 de dano por segundo | Boitatá |

### Degradação visual (paleta por área)
- **Capoeira:** paleta completa, predominância de verdes (`#4f7a3a`, `#8fb35a`).
- **Mata Fechada:** verdes escuros (`#2e4a32`, `#1b2a1f`) e cinza de neblina sobreposto.
- **Igapó:** azuis escuros da água (`#2c5d6b`) dominam; verdes quase somem.
- **Grotas:** terras e ossos (`#3a2a1e`, `#6b4a2e`, `#d9c9a3`); nenhum verde claro.
- **Coração da Mata:** escuro com fogo e brasa (`#ff8c2e`, `#ffd166`, `#c0392b`).
- Ao derrotar o Boitatá, a mata volta a ter as cores da Capoeira. No pós-jogo (seção 10.2), as cores voltam, mas com manchas de cinza onde os Ecos aparecem.

### Degradação sonora (fases futuras)
Os sons de ambiente vão sumindo de área em área: grilos e sapos → só vento → silêncio → só fogo crepitando.

---

## 7. Áreas de descanso e guardiões (NPCs)

Os guardiões são personagens do folclore que **resistiram à maldição**. São sempre aliados. Cada área de descanso tem **um guardião fixo** com uma função de jogo clara, uma **fonte de cura** (vida cheia ao chegar), a **saída** para a próxima área e a **trilha de volta** pra Fogueira.

**Tudo que se compra com os guardiões vale só até o fim da run.** O permanente é na Fogueira.

| Lugar | Guardião | Função no jogo | Papel na história |
|---|---|---|---|
| Fogueira (base) | **Comadre Fulozinha** | Cuida da Fogueira: árvore de habilidades, arsenal, altar dos amuletos, Diário da Mata. Na primeira run, conduz o tutorial na Borda da Mata e dá a primeira Peneira | Protetora da mata, vive nas bordas. Viu o Saci passar com o cachorro, explica a maldição e acolhe o Enzo entre as runs |
| Toca da Caipora | **Caipora** | **Ferreira:** afia a arma principal (+1 de dano nesta run) e reforça a secundária (+1 de dano nesta run) | Guardiã dos animais. Ficou furiosa ao saber que o Saci levou um bicho. Avisa sobre o Mapinguari |
| Clareira da Matinta | **Matinta Pereira** | **Mercadora:** vende itens por brasas. Estoque muda a cada visita | Misteriosa, aparece como um pássaro e vira uma senhora. Sempre pede algo em troca. Avisa sobre a Iara |
| Lagoa da Vitória-Régia | **Naiá** | **Curandeira:** +3 de Vida máxima nesta run e +1 espaço na mochila nesta run | A moça que virou a flor vitória-régia. Fala da lua e da água. Avisa sobre a Cuca |
| Ninho do Uirapuru | **Uirapuru** | **Bênção:** +1 tile no raio de luz e +30% de duração da carga nesta run, e uma bênção de 1 uso (levanta Enzo uma vez no Coração da Mata, com metade da vida) | O pássaro cujo canto silencia a floresta. Conta a história do Boitatá e revela que o Saci também é vítima da maldição |

### Regras dos guardiões
- **Falas curtas:** no máximo 3 frases por diálogo. Enzo pode responder com 1 frase.
- **Cada guardião explica as criaturas da próxima área** (o que fazem, como enfrentar). É o tutorial disfarçado de história.
- **Cada guardião comenta a decisão de ir embora ou seguir**, com base em quantas brasas Enzo carrega ("Tá com o bolso pesado, menino. Tem certeza que quer arriscar?").
- Os guardiões **reconhecem o progresso entre runs**: falas diferentes na primeira visita, nas runs seguintes ("Você de novo, menino?") e depois de derrotar o chefe anterior pela primeira vez.
- **Ficha de cada guardião** (aparência, personalidade, falas, tabela de preços) fica em `src/data/guardioes/<nome>.json`.
- Caipora e Curupira são lendas parecidas em algumas regiões. Neste jogo são **personagens distintos**: a Caipora é aliada (guardiã dos animais, monta um porco-do-mato), o Curupira é criatura comum amaldiçoada (pés virados para trás).

---

## 8. Personagens especiais

### Saci — o sequestrador do Pipoca

O Saci não é uma criatura comum: é **personagem da história**, presente em todas as áreas de mata.

- **Aparição por área:** em cada área de mata, em algum momento, o Saci surge à distância com o Pipoca, provoca o Enzo com uma fala curta e foge num redemoinho.
- **Perseguição opcional:** depois de provocar, o Saci corre pela área por 10 s, sempre mais rápido que o Enzo. Não dá pra alcançar correndo.
- **Peneira:** se Enzo arremessar uma **peneira** no redemoinho do Saci durante a perseguição, o Saci tropeça, derruba **brasas extras** e solta uma **dica** sobre a próxima área. Depois foge de novo. O Pipoca nunca é recuperado assim: só no final.
- **Não pode ser derrotado:** golpes, flechas e amuletos atravessam ele.
- **Arco do personagem:** começa debochado ("Quer o cachorro? Vem buscar, menino da cidade!"), vai ficando cansado e dividido ao longo das áreas e, no Coração da Mata, fica claro que ele não quer fazer aquilo. O cansaço tem motivo: ele está resistindo à maldição para tirar o Enzo da mata a cada desmaio (seção 5, "Quem tira o Enzo da mata"). Quando o Boitatá é libertado, o Saci se liberta junto, pede desculpa, devolve o Pipoca e as brasas que guardou.
- **Visual:** silhueta pequena de uma perna só, pulando em vez de andar, sempre envolta em folhas girando. Gorro vermelho sempre visível e **cachimbo** com a brasa acesa, que brilha laranja no escuro.
- **O cachimbo como pista:** onde o Saci passou fica um **fiapo de fumaça** no ar por alguns segundos. É assim que o jogador percebe que ele esteve por perto, inclusive na Fogueira depois de cada desmaio.

### Boto cor-de-rosa — chefe do tutorial e alívio cômico

Terno de linho branco impecável, chapéu branco inclinado, sapato bicolor, um sorriso que brilha no escuro (literalmente: é o único dente branco da mata). Completamente inadequado pra floresta, e completamente à vontade nela.

- **Personalidade:** o maior conquistador dos rios da Amazônia, segundo ele mesmo. Charmoso, confiante, dramático e muito estiloso. Dança carimbó como ninguém, toca violão quando ninguém pediu, tem uma frase de efeito pra toda situação. Se acha o maior conhecedor da mata e erra quase tudo com total elegância.
- **O chapéu:** nunca tira ("um cavalheiro não discute o chapéu"). Na lenda, o chapéu esconde o furo de respirar na cabeça; aqui vira piada recorrente, e um dos segredos do amuleto dele.
- **Conquistador (ver regras na seção 2):** tenta conquistar toda personagem adulta que encontra, sempre leva um fora e aceita na hora, com muito drama:
  - **Comadre Fulozinha:** dá uma bronca nele toda vez. Ele acha que é charme.
  - **Matinta Pereira:** cobra uma "taxa de paciência" em brasas a cada cantada. Ele paga, orgulhoso.
  - **Naiá:** acha graça e virou amiga dele; ele finge que é porque ela não resistiu.
  - **Iara:** a "grande rival e amor perdido" dele. Nunca respondeu as cartas que ele jogou no rio. Ele fica nervoso só de ouvir o nome dela.
  - **Cuca:** a única que ele não tenta conquistar. Morre de medo dela.
- **Ele não está amaldiçoado.** É só o Boto sendo o Boto.
- **Relação com o Enzo:** de "mentor" e "irmão mais velho" que ninguém pediu. Dá conselhos de estilo ("Primeira regra da mata, garoto: nunca entre numa luta com o cabelo bagunçado.").

**Como chefe do tutorial (Borda da Mata, primeira run):**
- O Boto está no riacho que separa a Borda da Mata da Capoeira e exige um "duelo de cavalheiros" para deixar Enzo passar.
- É uma luta **fácil e didática**: cada fase do Boto ensina uma mecânica do jogo.
  1. **Chapéu bumerangue:** arremessa o chapéu (segurando a aba, claro, sem tirar da cabeça de verdade, numa física que ninguém entende), que vai e volta. Telegrafado. Ensina a **esquivar**.
  2. **Mergulho de carimbó:** gira dançando, some na água e reaparece perto do Enzo, com o ponto de saída telegrafado. Ensina a **ler a telegrafia e punir** na janela de punição.
  3. **Serenata:** sobe numa pedra fora do alcance e canta uma serenata pra uma plateia de vagalumes encantados, que dançam em volta dele e atrapalham. Ensina a usar a **arma secundária**.
- Vida baixa, dano baixo. O objetivo é ensinar, não punir.
- **O Boto vence. Sempre.** Depois das três fases, quando a vida dele chega a um terço, ele para, ajeita o chapéu e diz: "Chega de aquecimento." Começa a **fase verdadeira**: uma onda d'água que cobre a arena inteira, telegrafada por 2 s, impossível de escapar. Enzo cai.
  - Essa é a **única exceção** à regra de que todo ataque pode ser evitado. Ela é intencional e só existe aqui.
  - Essa derrota **não conta como desmaio**: não perde brasas, não volta pra Fogueira e o Saci não aparece.
- Depois da derrota, cena curta: o Boto estende a mão pro Enzo levantar. "Você tem coragem, garoto. Falta todo o resto." Ele deixa o Enzo atravessar o riacho e **empresta o chapéu reserva**, o **Chapéu do Boto** (amuleto do Mergulho), ensinando na hora como usar (a primeira fala do amuleto é ele se gabando).
- Antes de mergulhar, faz a promessa que fecha o arco dele: "Quando você for forte de verdade, me procure no Encontro das Águas. Aí sim a gente duela."
- Nas runs seguintes, a Borda da Mata é pulada e o Boto não luta mais até a Revanche (seção 10.2).
- Ao longo do jogo, o Boto às vezes provoca: "Ainda não, garoto. Ainda não." Só na cabana, depois do Boitatá, ele muda o discurso.

**Como alívio cômico (depois do tutorial):**
- Aparece **sem ser convidado** nas áreas de descanso a partir da Clareira da Matinta e na Fogueira entre as runs.
- **Como surge:** de qualquer água disponível, por menor que seja. Na Lagoa da Vitória-Régia, faz sentido. Na Clareira da Matinta, sai de dentro de uma cuia. No Ninho do Uirapuru, de uma poça de chuva com 2 cm de profundidade. Na Fogueira, da chaleira.
- **"Conselho do Boto":** de graça, uma vez por visita, dá um conselho sorteado de uma lista. A maioria é inútil e engraçada ("Nunca enfrente um Lobisomem sem antes ajeitar o chapéu"). Cerca de 1 em cada 4 é um **segredo verdadeiro** (sala escondida, fraqueza de chefe). O jogador nunca sabe qual é qual até testar.
- **No Igapó:** aparece uma vez no meio da área e **carrega o Enzo nas costas** por um trecho de água funda, reclamando o caminho inteiro do peso e do terno molhado.
- **Uirapuru:** finge que não vê o Boto. O Boto acha que é inveja do estilo.
- **Limite:** o flerte segue as regras da seção 2. Só com adultos, sem conteúdo sexual, sempre leva um fora e aceita.

---

## 9. Criaturas comuns

Cada criatura tem **um comportamento claro e testável**. Não inventar comportamentos fora desta lista sem aprovação. Velocidades em tiles por segundo.

| Criatura | Áreas | Vida | Dano | Velocidade | Comportamento |
|---|---|---|---|---|---|
| Vagalume-fumaça | 1–2 | 1 | 1 | 2 | Vaga sem rumo; persegue se Enzo estiver a menos de 3 tiles |
| Porco-do-mato assombrado | 1–3 | 3 | 2 | 3 (investida: 8) | Ao ver Enzo, telegrafa (0,8 s) e faz investida em linha reta até bater em algo. Fica atordoado 1 s depois de bater |
| Curupira | 2–4 | 4 | 2 | 4 | Deixa pegadas viradas ao contrário que apontam pra longe dele. A cada 4 s, some e reaparece atrás do Enzo (o ponto de reaparição é telegrafado por 0,8 s) |
| Mula sem Cabeça | 2–5 | 5 | 3 | 3 (investida: 7) | Telegrafa e faz investida; deixa um rastro de fogo que dura 3 s e causa dano a quem pisar. Fica parada 1,2 s depois |
| Lobisomem | 3–5 | 6 | 3 | 6 | Parado até Enzo chegar a menos de 4 tiles. Depois persegue rápido por 3 s e para, ofegante, por 1,5 s |
| Corpo-seco | 3–5 | 4 | 2 | 1,5 | Lento e insistente, sempre vai em direção ao Enzo. Ao ser derrotado, se divide em 2 com metade da vida |
| Chibamba | 1–3 | 4 | 2 | 2 | Coberto de folhas de bananeira, fica **invisível no meio da folhagem**. Só dá pra localizar pelo ronco e pelas folhas se mexendo. Quando Enzo chega a 2 tiles, se revela e ataca girando (telegrafado) |
| Mão-Pelada | 2–4 | 3 | 2 | 5 | **Sempre em dupla:** um ataca pela frente enquanto o outro dá a volta pra atacar pelas costas. Deixa rastro de mão humana no chão, que avisa que a dupla está perto |
| Pé-de-Garrafa | 3–5 | 5 | 3 | 3 | Solta um grito que **parece vir do lado oposto** de onde ele está (o indicador visual do som aparece do lado errado). As pegadas redondas, como fundo de garrafa, mostram onde ele realmente está |
| Ipupiara | 3 | 4 | 3 | 4 (salto: 9) | Vive só na água funda do Igapó. Bolhas anunciam o salto (0,8 s); salta em linha reta, cai na margem e fica vulnerável 1,2 s antes de voltar pra água |
| Batatão | 4–5 | 2 | 2 (fogo) | 3 | Bola de fogo errante. **Persegue a fonte de luz do Enzo** enquanto ela estiver ligada. Com a luz desligada, se perde e vaga sem rumo. Explode em fogo ao encostar |

### Pisadeira (evento especial)

A Pisadeira não é uma criatura que patrulha: ela aparece quando o Enzo **fica parado**.
- Se Enzo ficar parado por **6 s** numa área de mata (áreas 2 a 5), uma sombra de mãos com unhas compridas começa a se formar sobre ele.
- Telegrafia de **1,5 s**: a sombra cresce e se ouve uma respiração pesada. Se ele se mover, ela some.
- Se não se mover a tempo, a Pisadeira cai sobre ele: Enzo fica **imobilizado por 2 s** e leva 2 de dano. Depois disso, ela fica visível e pode ser atacada (vida 3) antes de sumir no escuro.
- Não acontece nas áreas de descanso, na Fogueira nem durante luta com chefe.
- Objetivo de design: o jogador nunca pode "acampar" na mata.

### 9.1 Encontros especiais

Personagens do folclore menos conhecidos que aparecem como **mini-chefes** ou **encontros de história** no meio das áreas. Não substituem os chefes principais.

**Maria Caninana e Cobra Norato (mini-chefe do Igapó)**
Na lenda, os gêmeos nasceram cobras: Norato é bom, Caninana é cruel. Aqui, a maldição deixou a Caninana ainda mais violenta, e Norato tenta conter a irmã.
- No meio do Igapó, Caninana bloqueia a passagem. **Norato luta ao lado do Enzo** (controlado pelo jogo).
- Padrão da Caninana: bote em linha reta (telegrafado) → cospe veneno que deixa poças por 3 s → mergulha e reaparece em outro ponto.
- **A cada 15 s, Norato se enrola na irmã e a segura por 3 s:** é a grande janela de ataque.
- Ao ser derrotada, Norato leva a irmã para o fundo do rio. Antes de ir, conta um segredo da lore (vai para o Diário da Mata).
- Recompensa: brasas extras.

**Bradador (mini-chefe das Grotas)**
Lenda do interior de São Paulo: uma alma penada que vaga gritando pela mata à noite.
- Aparece num trecho das Grotas, flutuando no escuro.
- Padrão: puxa o ar (telegrafia de 1,0 s) → **grito em cone que apaga a fonte de luz do Enzo** por 4 s → some no escuro e reaparece em outro ponto.
- Ele só pode ser atacado logo **depois de gritar**, quando brilha por 2 s.
- Combina com a mecânica de luz: lamparina e tocha precisam ser reacesas; o pote de vagalumes é a única fonte que não apaga.
- Ao ser vencido, a alma descansa e revela um segredo da lore.
- Recompensa: brasas extras.

**Romãozinho (encontro de história)**
Lenda de Goiás: um menino que, por maldade, foi amaldiçoado a vagar para sempre, atirando pedras nas pessoas. Aqui ele é um **espelho sombrio do Enzo**: outro menino que entrou na mata há muitos anos e nunca saiu.
- **Na Mata Fechada e nas Grotas:** de vez em quando, pedras voam do escuro na direção do Enzo (trajetória telegrafada por 0,8 s) e se ouve uma risada de criança. Ele nunca aparece.
- **Esconderijo do Romãozinho:** sala secreta das Grotas, escondida atrás de uma parede de pedra que só a **Borduna** quebra. Lá dentro, Enzo enfrenta o Romãozinho:
  - Padrão: chuva de pedras em leque → corre em círculo pela sala jogando pedras → para cansado por 2 s.
- Ao ser derrotado pela primeira vez, ele não some: senta no chão e conta que se perdeu na mata, que a maldição o prendeu e que esqueceu o caminho de casa. Pede para o Enzo não desistir do Pipoca. Entrega o **amuleto da Pedra** (seção 5.3).
- Nas runs seguintes, ele não ataca mais: só observa de longe. Se o Enzo vencer o Boitatá, Romãozinho aparece no final, finalmente livre.

### 9.2 Anhangá (guardião secreto)

Na tradição tupi, o Anhangá é um espírito protetor dos animais e da caça, que aparece como um **veado branco de olhos de fogo**.

- **Respeito redobrado:** é uma figura de grande importância para povos tupi. Ele é sempre digno, misterioso e poderoso. Nunca é usado como piada, nunca é tratado como demônio, e o Boto não flerta nem faz graça com ele.
- **Clareira do Anhangá:** área secreta que aparece em **algumas runs**, escondida na Mata Fechada ou no Igapó. Não é garantida: a mata que muda de forma às vezes revela o caminho.
- **Função no jogo:** troca brasas por uma **bênção rara para a run**: cura total e um escudo que absorve 1 golpe em cada área até o fim da run.
- **Papel na história:** o guardião mais antigo da mata. É ele quem conta ao Enzo **como a queimada começou**, o segredo mais sério do jogo. As falas dele são poucas e pesadas.
- Visual: a única silhueta branca do jogo além do Boto, com olhos de fogo. Quando ele aparece, as outras luzes da clareira se apagam.

---

## 10. Chefes

Todos os ataques de chefe são telegrafados por **1,0 s**. Cada chefe tem **padrões fixos em sequência**, não aleatórios. Depois de cada ataque forte há uma janela de punição. Ao ser derrotado, o chefe é libertado da maldição, diz uma fala curta e se transforma no **amuleto** dele (só na primeira vitória; nas seguintes, deixa brasas extras).

**Boto (Borda da Mata, tutorial)**
Ver seção 8. Única luta do jogo pensada para ensinar, e a única que o jogador **sempre perde**.

**Mapinguari (fim da Mata Fechada)**
Gigante lento que guarda a mata fechada.
- Padrão: anda em direção ao Enzo por 3 s → pisão em área circular de raio 2 tiles ao redor de si → fica parado 1,5 s → repete.
- Abaixo de metade da vida: o pisão passa a ter raio 3 e ele dá dois pisões seguidos.

**Iara (fim do Igapó)**
Senhora das águas escuras.
- Padrão: canto que puxa o Enzo em direção a ela por 2 s (dá pra resistir andando contra) → mergulha e reaparece em outro ponto da água → jato d'água em linha reta → fica fora da água 2 s.
- Enzo só causa dano quando ela está fora da água.

**Cuca (fim das Grotas)**
Feiticeira das grotas.
- Padrão: feitiço de sono numa área circular de raio 2 (quem ficar dentro fica parado 1,5 s) → invoca 2 Vagalumes-fumaça → teleporta para outro ponto da arena.
- Abaixo de metade da vida: lança 2 feitiços de sono de uma vez em pontos diferentes.

**Boitatá (Coração da Mata, chefe final)**
A serpente de fogo, guardiã corrompida.
- Corpo longo, formado por vários segmentos, que se move como uma cobra pela arena. Só a cabeça recebe dano.
- Padrão: rastro de fogo por onde passa (dura 4 s) → olhar flamejante em linha reta → enrola no centro e solta uma onda de fogo em anel que se expande (dá pra pular com a esquiva) → fica tonto 2 s.
- O Saci assiste da borda da arena, segurando o Pipoca.
- Ao ser derrotado, o fogo se apaga, a mata volta a ter cor e para de mudar de forma. O Saci se liberta, confessa que era ele quem tirava o Enzo da mata, devolve o Pipoca e as brasas que guardou. Esse é o final da história principal.

### 10.1 Amuleto contra o próprio dono

Quando Enzo usa o amuleto de um chefe **contra esse mesmo chefe** (numa run seguinte, ou contra o Eco dele no pós-jogo), acontece uma **interação especial**: o chefe reconhece a própria força e reage de um jeito único. Isso vale a pena testar, mas não deixa a luta fácil de graça: cada interação tem uma vantagem e um risco.

| Amuleto | Contra | O que acontece |
|---|---|---|
| Chapéu do Boto (Mergulho) | Boto (revanche) | Se Enzo mergulhar enquanto o Boto está debaixo d'água, os dois se encontram no fundo. Cena rápida: o Boto fica indignado ("Plágio! Isso é plágio!") e sobe atordoado, exposto por 3 s. Se Enzo mergulhar fora desse momento, o Boto ri e ganha um ataque extra |
| Pegada do Mapinguari (Pisão) | Mapinguari | Se Enzo pisar **no mesmo instante** do pisão dele, as duas ondas se chocam e se anulam. O Mapinguari cai de joelhos por 3 s, confuso. Fora do tempo, o Mapinguari ignora o atordoamento |
| Concha da Iara (Canto) | Iara | Em vez de ser puxada, a Iara para de atacar e **responde o canto em dueto**. Sai da água e fica imóvel por 4 s, comovida. Só funciona uma vez por luta: na segunda, ela se irrita e o próximo canto dela puxa com o dobro de força |
| Caldeirão da Cuca (Sono) | Cuca | A Cuca é imune e **devolve o feitiço** ao Enzo, rindo do "amador". Se Enzo esquivar do feitiço devolvido, ele explode em cima dela e ela cochila no próprio sono por 3 s. Se não esquivar, Enzo dorme |
| Escama do Boitatá (Rastro de fogo) | Boitatá | O fogo do amuleto é **fogo limpo**, da parte do Boitatá que já foi libertada. Ele apaga o rastro de fogo corrompido por onde passa e causa dano dobrado na cabeça. O Boitatá hesita por 2 s na primeira vez ("Esse fogo... era meu.") |
| Pedra do Romãozinho (Chuva de pedras) | Eco do Romãozinho (pós-jogo) | Os dois jogam pedras ao mesmo tempo e as pedras se chocam no ar. O Eco para, olha pro Enzo e desaparece por 5 s, deixando a sala livre |

**Regras:**
- Toda interação tem **fala exclusiva** do chefe, diferente das falas normais do amuleto, e na primeira vez que acontece ela vai para o **Diário da Mata**.
- As interações só valem para o amuleto daquele chefe específico. Amuletos de outros chefes funcionam normalmente.
- A primeira vez que o jogador descobre cada interação aparece uma marca no Diário ("Interação descoberta: 3 de 6"), sem explicar quais faltam.

### 10.2 Revanche do Boto (pós-jogo)

**Gatilho:** depois de vencer o Boitatá, Enzo volta com o Pipoca para a cabana. Na fogueira, o Boto o espera, de terno de gala e chapéu novo, sério pela primeira vez no jogo. Ele cumpre a promessa do tutorial: "Eu te derrubei naquele riacho, lembra? Você era um menino da cidade que não sabia nem segurar um galho. Agora atravessou a mata inteira e libertou o Boitatá. Agora sim, garoto. **Agora você pode me desafiar.**" E propõe a **Revanche**: o duelo de verdade, no domínio dele, o **Encontro das Águas**, do outro lado da mata. Para chegar lá, Enzo tem que **atravessar a floresta inteira de novo**.

**Por que a mata ainda é perigosa:** a maldição foi quebrada, mas deixou **cinzas**. A mata ainda se mexe à noite, e as cinzas criam **Ecos**: versões sombrias e mais fortes das criaturas e dos chefes, feitas do que restou da maldição. O Boto sabe disso, e diz que a travessia é parte do desafio ("Um cavalheiro precisa provar que merece o duelo.").

**Como funciona:**
- A Revanche é uma run normal, saindo da cabana, passando por todas as áreas e áreas de descanso.
- Todas as criaturas e chefes viram **Ecos**: silhuetas com brilho cinza, mais vida e mais rápidas (valores em `src/data/revanche.json`).
- O Saci, agora livre, aparece nas áreas de descanso e ajuda: vende uma dica por brasas e, uma vez por run, tira o Enzo de uma enrascada (cura metade da vida quando ela cai abaixo de 2).
- No fim da travessia, em vez do Boitatá, a arena final é o **Encontro das Águas**, e o chefe é **o Boto de verdade**.

**O Boto de verdade (chefe da Revanche):**
Sem brincadeira de tutorial. Ainda é vaidoso e engraçado nas falas, mas na luta é o chefe mais técnico do jogo.
- **Fase 1 — Cavalheiro:** chapéu bumerangue em sequências de 3, mergulhos rápidos com saída telegrafada, golpes de bengala.
- **Fase 2 — Carimbó:** dança girando pela arena e deixa redemoinhos de água que empurram o Enzo. Chama vagalumes encantados que formam barreiras.
- **Fase 3 — Encantador:** usa o charme nas criaturas da mata. Ecos aparecem e lutam do lado dele. Ele mesmo fica na água atacando de longe até os Ecos caírem.
- Quando a vida dele chega a um terço, ele tenta de novo a **onda d'água da fase verdadeira** do tutorial. Desta vez, **dá pra escapar**: o Mergulho do amuleto, a esquiva no momento certo ou subir nas pedras da arena. É o momento que mostra que o Enzo cresceu.
- Ao perder, o Boto tira o chapéu pela primeira e única vez no jogo, numa reverência ao Enzo (a câmera corta antes de mostrar a cabeça dele). O **Chapéu do Boto evolui para Chapéu de Gala**: o Mergulho passa a deixar um redemoinho no ponto de saída que empurra as criaturas.

**Níveis de Revanche:**
- Depois da primeira vitória, o Boto propõe uma nova revanche, cada vez mais difícil ("Revanche 2", "Revanche 3"...).
- Cada nível liga um **modificador** a mais na travessia, escolhido pelo Boto. Exemplos: a mata fica mais escura (fontes de luz duram menos), criaturas aparecem em grupos maiores, áreas de descanso sem cura, Pisadeira aparece mais rápido.
- Cada nível vencido rende brasas e uma fala nova do Boto. Os modificadores ficam em `src/data/revanche.json`.

---

## 11. Itens

Itens são consumíveis da mochila e **se perdem ao fim da run** (desmaiando ou indo embora). Armas não são itens: ficam no Arsenal (seção 5.2).

| Item | Onde consegue | Efeito |
|---|---|---|
| Rapadura | Chão, Matinta | Recupera 3 de vida |
| Mel silvestre | Chão, Matinta | Recupera 5 de vida |
| Bateria | Chão, Matinta | Recarrega 50% do celular |
| Pilhas | Chão, Matinta | Recarrega 50% da lanterna de mão |
| Óleo | Chão, Matinta | Recarrega 50% da lamparina |
| Tocha nova | Chão, Matinta | Troca a tocha por uma nova, com 100% |
| Power bank | Matinta (raro) | Recarrega 100% de qualquer fonte de luz |

Itens de recarga só funcionam na fonte certa. Os que aparecem no chão são sorteados de acordo com a fonte que o Enzo está usando, para não encher a mochila de recarga inútil.
| Peneira | Chão, Matinta, Comadre Fulozinha (1ª grátis) | Arremessada no redemoinho do Saci: ele derruba brasas e uma dica. 1 uso |
| Novelo de cipó | Matinta | Jogado no chão: o Curupira mais próximo para por 3 s para desembaraçar |
| Capa de folhas | Matinta | Criaturas não detectam Enzo por 5 s (atacar cancela o efeito) |

Itens novos só entram depois de adicionados a esta tabela.

---

## 12. Direção de arte

### Estilo: silhueta e luz

O mundo é feito de **silhuetas escuras** e **luz**. A forma conta quem é cada coisa; a cor aparece só em detalhes e onde a luz bate. Referências: *Limbo*, *Inside*, *Never Alone*, *Badland*.

**Princípios**
- **Silhueta primeiro:** personagens, criaturas e cenário são formas escuras, quase pretas, com contorno limpo. Sem textura, sem pixel, sem detalhe desnecessário.
- **Teste da silhueta (obrigatório):** toda criatura, chefe e guardião tem que ser reconhecível **só pela forma**, pintada de preto chapado. Se não der pra saber quem é, a forma está errada. O Revisor reprova personagem que falhe nesse teste.
- **A cor é rara e tem significado:** só aparece em detalhes que identificam o personagem ou o perigo.
  - Olhos das criaturas brilham na cor delas.
  - Gorro do Saci: vermelho, sempre visível, mesmo no escuro total.
  - Boto: o único personagem claro, de terno e chapéu brancos com detalhes em rosa. Ele parece "não pertencer" ao mundo sombrio, e essa é a piada visual.
  - Enzo: silhueta com um único detalhe de cor urbana (o boné), para o jogador nunca perder o personagem de vista.
  - Telegrafia de ataque: brilho vermelho no chão, sempre o elemento mais visível da tela.
- **A luz é a protagonista visual:** a fonte de luz do Enzo (seção 4.1) é o que revela cor e detalhe. Dentro do raio de luz, as silhuetas ganham contorno iluminado (luz de borda) e um pouco de cor. Fora dele, tudo é forma escura sobre névoa.
- **Profundidade com camadas:** fundo em várias camadas de silhuetas cada vez mais claras e desfocadas pela névoa, com leve efeito de paralaxe quando a câmera se move.
- **Partículas dão vida:** folhas caindo, vagalumes, fumaça, cinzas, brasas, gotas. Cada área tem as suas (seção 6).

**Áreas de descanso são o contraste:** luz quente e própria (a fogueira, a lagoa brilhando, os vagalumes bons). As silhuetas ganham cor e detalhe ali. O jogador tem que sentir alívio ao chegar.

**Degradação pela luz e pela névoa:** cada área de mata tem uma **cor de névoa** e uma **cor de luz ambiente** próprias, que contam a degradação:

| Área | Névoa | Luz ambiente | Partículas |
|---|---|---|---|
| Capoeira | Verde-azulada, rala | Lua fria, azulada | Vagalumes, folhas verdes |
| Mata Fechada | Cinza-esverdeada, densa | Quase nenhuma | Fumaça, folhas secas |
| Igapó | Azul escura, rente à água | Reflexo da água | Gotas, bruma |
| Grotas | Cinza de fuligem, em rajadas | Branca e fraca | Cinzas carregadas pelo vento |
| Coração da Mata | Vermelha e laranja | Vinda do fogo, de baixo pra cima | Brasas subindo |

### Técnica (para os agentes)
- **Resolução base:** 1920 x 1080, escalada para a janela mantendo a proporção.
- **Unidade de medida:** 1 tile = 64 px na resolução base. Todas as distâncias da bíblia em tiles seguem essa conversão.
- **Arte vetorial:** personagens e cenário em **SVG**, desenhados como formas simples. Os agentes podem criar as formas por código ou à mão em SVG.
- **Animação por partes (recorte):** cada personagem é dividido em partes (cabeça, tronco, braços, pernas, cauda) que giram e se movem por código. Nada de animação quadro a quadro.
- **Iluminação dinâmica:** usar o sistema de luzes 2D do Phaser (WebGL). A fonte de luz do Enzo, fogo, vagalumes, olhos das criaturas e telegrafias são luzes reais da cena.
- **Névoa e paralaxe:** camadas de fundo separadas, com opacidade e desfoque crescentes conforme a distância.
- **Desempenho:** o jogo tem que rodar a 60 quadros por segundo num notebook comum. Limite de luzes dinâmicas simultâneas e de partículas definido em `src/data/render.json`.

### Paleta oficial

As silhuetas usam os tons mais escuros. As cores claras e saturadas são reservadas para luz, detalhes de personagem e perigo.

| Uso | Hex |
|---|---|
| Noite (fundo) | `#0b0f0c` |
| Mata escura | `#1b2a1f` |
| Folhagem | `#2e4a32` |
| Folha clara | `#4f7a3a` |
| Broto | `#8fb35a` |
| Terra escura | `#3a2a1e` |
| Terra | `#6b4a2e` |
| Madeira | `#a07850` |
| Osso / papel | `#d9c9a3` |
| Luz / texto | `#f2efe6` |
| Água | `#5aa1a8` |
| Água funda | `#2c5d6b` |
| Fogo | `#ff8c2e` |
| Brasa clara | `#ffd166` |
| Perigo | `#c0392b` |
| Feitiço | `#7b4fa0` |
| **Rosa do Boto (exclusivo)** | `#f29bb5` |

O rosa é **exclusivo do Boto** e do amuleto dele. Nenhum outro elemento do jogo pode usar essa cor.

### Placeholders
- Enquanto a silhueta final de um personagem não estiver pronta, ele é uma **forma geométrica escura** (círculo, cápsula, triângulo) com o detalhe de cor que o identifica:
  Enzo = cápsula com boné colorido; criaturas = formas com olhos brilhando em Perigo; guardiões = formas com olhos em Broto; Saci = forma pequena com gorro vermelho; Boto = forma clara com chapéu e detalhe em Rosa do Boto; itens = pequenos brilhos em Brasa clara; fonte de cura = brilho em Água.
- A iluminação dinâmica e a névoa já entram desde o primeiro sprint, mesmo com placeholders: elas são o visual do jogo.
- Telegrafia de ataque: área com brilho em Perigo piscando no chão.

---

## 13. Áudio (fases futuras)

- Ambiente de cada área segue a degradação sonora (seção 6).
- Áreas de descanso: música calma com instrumentos regionais brasileiros (viola caipira, flautas, percussão).
- Cada chefe tem um tema próprio.
- O Saci tem uma risada característica que anuncia a chegada dele.
- O Boto entra sempre com o mesmo trechinho musical dramático (inclusive na luta do tutorial).
- O Uirapuru tem um canto próprio que toca na área de descanso dele.
- Até lá: sem áudio. Não adicionar arquivos de som sem card próprio.

---

## 14. Textos e idioma

- Todo texto do jogo em **português brasileiro**.
- Nenhum texto escrito direto no código: tudo em arquivos de dados (`src/data/textos.pt-BR.json`, as fichas dos guardiões, os textos dos amuletos e as listas de falas do Saci e do Boto), para facilitar tradução no futuro.
- Tom das mensagens: curto e com cara de história contada.
  Bom: "O Saci ri e some no redemoinho. O Pipoca late lá de longe."
  Ruim: "Evento de NPC Saci concluído."
- **Enzo:** menino da cidade, frases curtas, às vezes engraçadas. Ex.: "Zero sinal. Claro."
- **Saci:** debochado no começo, cada vez mais cansado e triste.
- **Boto:** galanteador, poético e confiante demais, com palavras difíceis usadas errado. Exemplos:
  - "Confie em mim, garoto. Eu sou praticamente um *cartógrafo*... das águas... de algumas águas."
  - (para a Naiá) "Se a lua soubesse da sua beleza, pediria demissão."
  - (depois do fora) "Ela está apenas fingindo. É um clássico."
- **Falas dos amuletos:** no máximo 2 frases curtas; cabem na legenda e são lidas em 4 s.

---

## 15. Regras técnicas para os agentes

- **Código em inglês** (variáveis, funções, arquivos). **Texto do jogo em português.**
- **Simulação com passo fixo:** a lógica do jogo roda em **60 atualizações por segundo**, independente da taxa de quadros da tela. Isso deixa o jogo determinístico.
- Toda lógica de jogo (movimento, colisão, combate, armas, amuletos, comportamento de criaturas e chefes, geração de mapa) fica **separada da renderização**, em funções puras que rodam sem abrir o navegador.
- **Seed interna:** toda geração procedural recebe uma seed como parâmetro. A seed é sorteada a cada run e **não é mostrada ao jogador**; serve para reproduzir bugs e para os testes automáticos. Em modo de desenvolvimento, pode ser definida por parâmetro na URL.
- **Testes por simulação:** testes automáticos alimentam a simulação com uma sequência de comandos (ex.: "anda para a direita por 30 atualizações, ataca") e verificam o resultado (posição, vida, criatura derrotada). Toda criatura, todo chefe, toda arma e todo amuleto precisam de testes do comportamento.
- **Regras de brasas testadas:** ir embora mantém 100%; desmaiar mantém exatamente 50% (arredondado para baixo).
- **Progresso permanente salvo localmente:** habilidades, arsenal, amuletos, brasas guardadas e a posição de cada amuleto na sequência de segredos.
- Todo valor de balanceamento (vida, dano, velocidades, tempos de aviso, recargas, preços) fica em arquivos de dados (`src/data/`), nunca fixo no código.
- A Fogueira, a Borda da Mata e as áreas de descanso têm layout fixo em arquivo de dados, não são procedurais.
- **Playtest humano:** teste automático garante que funciona, não que é bom de jogar. Todo card que mexe em combate, movimento, armas, amuletos ou chefe passa por um playtest do Guilherme antes do Done.
- Nada fora desta bíblia entra no jogo sem card aprovado.

---

## 16. Glossário

| Termo | Significado |
|---|---|
| Run | Uma tentativa completa, da Fogueira até vencer, ir embora ou desmaiar |
| Fogueira | Base do jogo; onde toda run começa e termina e onde se compram melhorias permanentes |
| Área de mata | Trecho perigoso, gerado proceduralmente |
| Área de descanso | Trecho seguro entre áreas de mata, com guardião, cura e trilha de volta pra Fogueira |
| Ir embora | Encerrar a run numa área de descanso e voltar pra Fogueira com 100% das brasas |
| Guardião | NPC do folclore aliado, que resistiu à maldição |
| Brasas | Moeda do jogo, usada na Fogueira e com os guardiões |
| Habilidade | Melhoria permanente comprada na Fogueira |
| Arsenal | Armas permanentes liberadas na Fogueira |
| Amuleto | Ganho ao derrotar um chefe pela primeira vez; dá uma habilidade ativa do chefe e faz ele contar segredos da lore a cada uso |
| Diário da Mata | Registro, na Fogueira, de todos os segredos contados pelos amuletos |
| Desmaio | Quando a vida chega a 0; a run acaba e Enzo perde 50% das brasas que carregava |
| Telegrafar | Mostrar antes, no chão, onde um ataque vai acertar |
| Janela de punição | Instante em que a criatura fica parada depois de um ataque forte |
| Esquiva | Rolamento rápido com invulnerabilidade |
| Fonte de luz | O que ilumina o caminho do Enzo; escolhida na Fogueira |
| Revanche | Pós-jogo: atravessar a mata de novo para enfrentar o Boto no Encontro das Águas |
| Eco | Versão sombria e mais forte de uma criatura ou chefe, criada pelas cinzas da maldição no pós-jogo |
| Interação especial | Reação única de um chefe quando Enzo usa o amuleto dele contra ele mesmo |
| Carga | Quanto resta da fonte de luz (bateria, óleo, chama) |
| Seed | Número interno que define a geração de uma run; não aparece para o jogador |
| Atualização (tick) | Um passo da simulação; 60 por segundo |
