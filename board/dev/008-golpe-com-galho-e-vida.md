---
id: 008
titulo: Golpe com o Galho, vida e dano
coluna: dev
resultado: pendente
retrabalho: 3
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: M
branch: card/008
---

## Ideia
O Enzo ataca com o Galho (arma principal inicial): golpe com alcance, duração e recuperação da bíblia. O Enzo tem vida e pode receber dano; um alvo de treino tem vida e morre ao chegar a zero. Valores em src/data. Sem outras armas e sem criaturas ainda.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero atacar com o Galho na direção do mouse e ter uma vida que diminui quando levo dano, para sentir o combate corpo a corpo e o risco de desmaiar.

## Criterios de aceite
- [ ] Clique esquerdo faz o Enzo golpear com o Galho na direção do mouse; o golpe acerta alvos a até 1 tile de distância, dentro de um arco de 90° voltado para o mouse, e não acerta alvos fora desse alcance ou arco.
- [ ] Cada golpe do Galho causa 2 de dano, e o Enzo só pode golpear de novo 0,4 s depois do golpe anterior (cliques dentro desse intervalo não geram golpe).
- [ ] Existe um alvo de treino parado no mapa com vida definida em `src/data`; cada golpe que o acerta tira 2 de vida dele e, ao chegar a 0, ele é removido do jogo. (O alvo é só ferramenta de teste, não é criatura da bíblia.)
- [ ] O Enzo começa com Vida 10. Ao receber dano, perde essa quantidade de vida e fica 1 s invulnerável (piscando); dano recebido durante esse 1 s é ignorado.
- [ ] Quando a vida do Enzo chega a 0, o jogo registra que ele desmaiou e a vida nunca fica abaixo de 0. (Perda de brasas e volta à Fogueira ficam para outro card.)
- [ ] Os valores do Galho (dano 2, intervalo 0,4 s, alcance 1 tile, arco 90°) e a Vida inicial 10 ficam em `src/data`, e não escritos direto na lógica.
- [ ] Não há outras armas, criaturas, esquiva nem dano por contato de inimigos neste card; para testar o dano ao Enzo basta um meio de teste (ex.: função chamada pelo teste automatizado).

## Referencias na biblia
- 4. Jogabilidade > Controles (atacar com a arma principal: clique esquerdo; mirar: mouse)
- 4. Jogabilidade > Atributos do Enzo (Vida 10)
- 4. Jogabilidade > Combate (dano por contato, 1 s de invulnerabilidade depois de levar dano)
- 5. Progressão > Desmaio (vida a 0 = desmaio)
- 5.2 Arsenal > Armas principais (Galho: dano 2, intervalo 0,4 s, 1 tile, arco 90°)

## Tarefas tecnicas
Contexto do main: `Command` so tem `moveX/moveY`; `GameState` so tem `tick` e `player {x,y}` (px, origem no centro); `step` e `run` em `src/sim/step.ts`; 1 tile = `WORLD.tilePx` = 64; 60 ticks/s (`SIM.ticksPerSecond`). Nao ha mouse, vida, nem alvos hoje. Sem dependencia nova.

1. **Dados** em `src/data/combat.ts` (novo), tudo em segundos/tiles/graus, sem numeros soltos na logica:
   - `WEAPONS.galho = { damage: 2, intervalSeconds: 0.4, reachTiles: 1, arcDegrees: 90 }`
   - `ENZO_COMBAT = { maxHp: 10, invulnerableSeconds: 1 }`
   - `TRAINING_DUMMY = { x: 192, y: 0, hp: 6 }` (px, mesma origem do player; 3 golpes para matar; e valor de teste, nao da biblia).
2. **Tipos** em `src/sim/types.ts`:
   - `Command` ganha `attack?: boolean` (true so no tick em que houve clique) e `aimX?: number`, `aimY?: number` (vetor do Enzo ate o mouse, em px; nao precisa ser normalizado). Campos opcionais para nao quebrar os testes atuais nem conflitar com os cards 005/007.
   - `GameState.player` ganha `hp`, `facingX`, `facingY` (inicial 1,0), `attackCooldownTicks`, `invulnerableTicks`, `fainted: boolean`.
   - `GameState` ganha `dummies: readonly {id: string; x: number; y: number; hp: number}[]` e `lastSwing: { tick: number; dirX: number; dirY: number } | null` (so para o render desenhar o golpe).
3. **Logica pura** em `src/sim/combat.ts` (novo, exportar em `src/sim/index.ts`):
   - `secondsToTicks(s)` = `Math.round(s * SIM.ticksPerSecond)` (0,4 s = 24 ticks; 1 s = 60).
   - `inSwing(origin, dir, target, weapon)`: true se distancia centro-a-centro <= `reachTiles * tilePx` e o angulo entre `dir` e o alvo <= `arcDegrees / 2` (bordas inclusivas, com pequena tolerancia numerica; distancia 0 conta como acerto).
   - `trySwing(state, command)`: se `attack`, `!fainted` e `attackCooldownTicks === 0`: normaliza `aim` (se aim for zero ou ausente, usa o `facing` atual), atualiza `facing`, poe cooldown em `secondsToTicks(intervalSeconds)`, tira `damage` de cada dummy em `inSwing`, remove dummies com hp <= 0, grava `lastSwing`. Senao nao faz nada.
   - `damagePlayer(state, amount)`: se `invulnerableTicks > 0` ou `fainted`, devolve o estado igual; senao `hp = max(0, hp - amount)`, `invulnerableTicks = secondsToTicks(invulnerableSeconds)`, e `fainted = true` se hp chegou a 0. Este e o "meio de teste" do dano ao Enzo (nenhum inimigo chama isso ainda).
4. **`src/sim/step.ts`**: `createInitialState` inicializa os novos campos (hp = `maxHp`, dummy vindo de `TRAINING_DUMMY`). `step` decrementa (min 0) `attackCooldownTicks` e `invulnerableTicks` a cada tick, aplica o movimento atual e chama `trySwing`. Ordem fixa: timers, movimento, golpe. Nao mudar a velocidade nem o movimento existentes.
5. **Render** (so desenha e le entrada):
   - `src/render/readCommand.ts`: aceitar `attack` e `aim` opcionais e repassar ao `Command`.
   - `src/render/GameScene.ts`: ler clique esquerdo (`pointerdown` marca um flag), calcular `aim = pointer.worldX/worldY - posicao do Enzo na tela`, e enviar `attack: true` apenas no primeiro tick do frame que teve clique, depois limpar o flag. Desenhar o alvo de treino (retangulo, some quando removido), um arco curto do golpe por ~0,1 s a partir de `lastSwing`, e o Enzo piscando enquanto `invulnerableTicks > 0`. Nada de regra de jogo aqui.
   - Para o playtest, tecla de debug `K` que chama `damagePlayer(state, 3)` no `GameScene` (marcada como temporaria no codigo). Nao e criterio de aceite, serve para o Guilherme ver a invulnerabilidade e o desmaio. Mostrar a vida como texto simples no canto (HUD de verdade fica para outro card).
6. **Testes** (Vitest, `tests/combat.test.ts`, usando `createInitialState`, `step`, `run`):
   - Golpe com alvo a 1 tile (64 px) na direcao do aim: dummy perde 2 de hp.
   - Alvo a 1,5 tile (96 px) na direcao do aim: nao perde hp (fora de alcance).
   - Alvo a 0,5 tile, mas atras do aim (180 graus): nao perde hp. Alvo a 40 graus: perde. Alvo a 50 graus: nao perde (arco de 90 graus).
   - Aim diferente do eixo X (ex.: para baixo) acerta alvo abaixo e nao acerta alvo a direita.
   - Dois `attack: true` separados por 23 ticks: so um golpe (hp cai 2). Separados por 24 ticks: dois golpes (hp cai 4).
   - Tres golpes espacados de 24 ticks em dummy com hp 6: dummy removido de `state.dummies`.
   - `attack` ausente/false nunca gera golpe.
   - `damagePlayer(estado, 3)`: hp 10 -> 7 e `invulnerableTicks` = 60. Segundo dano logo depois: hp continua 7. Apos 60 ticks de `step`, novo dano passa (hp 4).
   - Dano grande (ex.: 99): hp = 0 (nunca negativo) e `fainted` true; depois disso `attack` nao golpeia.
   - Valores vem de `src/data/combat.ts`: teste le `WEAPONS.galho` e `ENZO_COMBAT` e confere 2, 0.4, 1, 90, 10, 1.
   - Os testes existentes (`movement`, `step`, `light`, `clock`) continuam passando sem alteracao; `architecture.test.ts` continua verde (sim sem phaser/render).
7. Rodar `npm run test` e `npm run build`.

**Fora do escopo:** outras armas (Facao, Lanca, Borduna, estilingue), criaturas ou IA, dano por contato, esquiva, perda de brasas e retorno a Fogueira ao desmaiar, colisao com mapa (card 005), HUD final de vida, efeitos de som ou particulas, knockback, animacao do Enzo, qualquer duracao/recuperacao do golpe alem do intervalo de 0,4 s.

## Notas do dev
- Feito: dados em src/data/combat.ts; src/sim/combat.ts (secondsToTicks, inSwing, trySwing, damagePlayer); step com timers, movimento e golpe; Command/GameState estendidos; render com clique esquerdo, alvo, arco do golpe, piscar, texto de vida e tecla K (temporaria).
- Decisoes: ja existia `damagePlayer` (card 007, em damage.ts) e `hp`; movi/estendi `damagePlayer` para combat.ts (continua ignorando dano durante esquiva, agora tambem ignora na invulnerabilidade de 1 s e apos desmaio). `PLAYER.maxHp` agora vem de `ENZO_COMBAT.maxHp`. Posicao do alvo de treino e relativa ao spawn do Enzo (`offsetX: 192`), pois (192,0) absoluto cairia em parede do mapa de teste.
- Fora: nada do escopo ficou de fora.
- npm run test: 12 arquivos, 93 testes passando. npm run build: ok.
- Verificado so por codigo/testes (nao jogado): clique/mira no mouse (pointer worldX/Y), desenho do arco e do alvo, piscar, texto de vida e tecla K.

Retrabalho 1 (playtest reprovado: alvo nao aparecia, golpe nao saia):
- Causa raiz (por analise do codigo): o Graphics do combate (alvo + arco) era criado ANTES das imagens do mapa e todos estavam em depth 0; o Phaser desenha na ordem de criacao, entao os tiles do mapa cobriam o alvo e o arco. O clique/dano provavelmente funcionavam, mas nada era visivel. Correcao: camadas em RENDER.depth (mapa 0, combate 10, Enzo 20) aplicadas em GameScene. O Graphics nao depende de Light2D, entao aparece mesmo no escuro; o alvo fica a 192 px (< 256 px da luz), em tile de chao.
- Teste novo tests/visibility.test.ts (alvo em chao, dentro do raio de luz, ordem das camadas). 95 testes ok, build ok.
- Verificado so por codigo/testes (nao jogado): que o alvo e o arco agora aparecem de fato, e que o clique esquerdo chega ao jogo (pointerdown/worldX); se ainda falhar no playtest, a suspeita seguinte e a entrada do mouse.

- Retrabalho 2: (1) clique perdido em quadros sem tick: nova funcao pura consumeClick em src/render/clickPulse.ts; GameScene.update so zera o clique quando advanced.ticks > 0. (2) removido expect(LIGHT).toBeDefined() e o import em tests/visibility.test.ts. (3) mira via camera.getWorldPoint(ptr.x, ptr.y); cores, tamanhos, 0,1 s do arco e dano 3 da tecla K movidos para COMBAT_VIEW em src/data/combat.ts. Teste novo tests/clickPulse.test.ts (quadro sem tick mantem, com tick consome, fluxo clique->readCommand->step->dano no alvo). 99 testes ok, build ok.
- Fluxo conferido por codigo: pointerdown -> clicked -> consumeClick -> attack no 1o tick -> readCommand(aimX/aimY) -> step -> trySwing -> dano/lastSwing -> drawCombat.
- Verificado so por codigo/testes (nao jogado): que o clique do mouse chega de fato ao jogo, getWorldPoint correto com a camera centrada, e o desenho do arco/alvo na tela.

## Comentarios
- 2026-10-22 | PO | A bíblia só define o Galho por "intervalo" de 0,4 s; não há duração de animação nem tempo de recuperação separados, então usei só o intervalo e não inventei outros números. A vida do alvo de treino também não está na bíblia: é valor de teste, escolhido na implementação (sugestão para quem refinar: múltiplo de 2). Obs. para o SM: o card é de fase 2 e a fase atual no documento ainda é 1.
- 2026-10-22 | Arquiteto | Plano pronto, estimativa M. Mudei playtest de nao para sim: o card e combate e define a sensacao do golpe (alcance, arco, ritmo de 0,4 s, piscar da invulnerabilidade). Vida do alvo de treino definida em 6 (3 golpes). Command ganha campos opcionais para reduzir conflito com os cards 005 e 007, que tambem mexem em Command/GameState; quem entrar depois resolve o merge.
- 2026-10-29 | Revisor | Passou no checklist. Mover damagePlayer de damage.ts para combat.ts esta dentro do escopo (tarefa 3 pede damagePlayer em combat.ts; damage.ts so reimporta, esquiva e touchHazard preservados) e a tecla K temporaria esta prevista na tarefa 5. Testes (93) e build ok. (opcional) dano 3 da tecla K e 0,1 s do arco estao fixos em GameScene; mover para src/data. (opcional) offset do alvo de treino relativo ao spawn e desvio justificado da tarefa 1.
- 2026-10-29 | QA | resultado: aprovado. Suite completa: 12 arquivos, 93 testes ok; build ok (so aviso de chunk grande). Nenhum teste novo do QA foi necessario (tests/combat.test.ts cobre tudo).
- 2026-10-29 | Revisor | Retrabalho 1: reprovado. (1) Causa do dev e consistente: em GameScene o combatGfx era criado antes das Images do mapa (todas depth 0, Phaser desenha por ordem de criacao), entao os tiles cobriam alvo e arco; Graphics nao usa Light2D, entao ignora o escuro; Enzo (criado depois) aparecia, o que bate. A correcao RENDER.depth (map 0, combat 10, enzo 20) esta certa e dentro do escopo; o diff contra main so tem arquivos do card. (2) Problema nao tratado, que explica "o golpe nao saia": src/render/GameScene.ts update(), linhas ~60-71: `attackPulse = this.clicked; this.clicked = false;` limpa o clique mesmo quando `advanced.ticks === 0`, e entao nenhum `step` recebe `attack: true` e o clique se perde. O clock acumula em passos de 16,67 ms; em monitor 120/144 Hz a maioria dos quadros tem 0 ticks, e em 60 Hz isso tambem ocorre por jitter. Mudar para limpar `this.clicked` so quando `advanced.ticks > 0` (ou manter o flag ate ser consumido por um tick). O restante da entrada esta correto: pointerdown + leftButtonDown, aim = worldX/worldY - player (camera so centerOn, sem scrollFactor/zoom no mapa, entao worldX/Y e coordenada do mundo, igual a do Enzo), readCommand repassa attack/aimX/aimY e trySwing os usa. (3) tests/visibility.test.ts: `expect(LIGHT).toBeDefined()` (linha 15) e vazio e o import de LIGHT so existe para isso; remova. O teste de depth so compara constantes de dados, nao garante que GameScene as aplica (aceitavel, mas nao prova a correcao). (4) Faltou teste do fluxo clique->comando: sugiro extrair a logica "consumir clique so se houve tick" para funcao pura em src/render/ e testa-la. (opcional) 0xaa4444, 0xffffff, 0.1 s do arco e dano 3 da tecla K fixos em GameScene; mover para src/data. (opcional) activePointer.worldX/Y pode ficar defasado com o mouse parado e a camera se movendo; recalcular com camera.getWorldPoint(ptr.x, ptr.y).
- 2026-10-29 | Revisor | Retrabalho 2: passou no checklist. Resolvido: (1) consumeClick (src/render/clickPulse.ts) so zera o clique quando ha tick; GameScene.update usa click.pending/pulse corretamente; (2) expect(LIGHT) e import removidos; (3) mira por camera.getWorldPoint e valores visuais/dano K em COMBAT_VIEW (src/data/combat.ts). Fluxo conferido: pointerdown -> clicked -> consumeClick -> attack so no 1o tick -> command() aim -> readCommand -> step (timers, movimento, trySwing) -> dano/lastSwing -> drawCombat. Diff contra main so tem arquivos do card, sem Math.random/Date.now/rede, sim sem Phaser. 99 testes e build ok. Pendente so de playtest (mouse, arco e alvo na tela).

| Critério | Evidência | Status |
|---|---|---|
| Golpe na direção do mouse, 1 tile, arco 90° | tests/combat.test.ts > "acerta a 1 tile", "nao acerta a 1,5 tile", "nao acerta alvo atras", "arco: 40 graus acerta, 50 nao", "aim para baixo..."; GameScene envia aim = mouse - Enzo | ok |
| 2 de dano, intervalo 0,4 s | "cooldown: 23 ticks um golpe, 24 ticks dois" | ok |
| Alvo de treino com vida em src/data, removido em 0 | "tres golpes removem o alvo"; TRAINING_DUMMY.hp=6 em src/data/combat.ts | ok |
| Vida 10, dano, 1 s invulnerável, dano ignorado | "dano, invulnerabilidade de 60 ticks e novo dano" | ok |
| Vida 0 = desmaio, nunca negativa | "vida nunca negativa, desmaia e nao golpeia" | ok |
| Valores em src/data | "valores vem de src/data"; src/sim/combat.ts le WEAPONS/ENZO_COMBAT | ok |
| Sem outras armas/criaturas/dano por contato | revisão do diff: só Galho e dummy; damagePlayer sem chamadores além do teste e da tecla K | ok |

- 2026-10-29 | QA | Retrabalho 2: resultado: aprovado. Suite completa 15 arquivos, 106 testes ok; build ok (so aviso de chunk grande). Novo: tests/qa/card-008.test.ts (commit ec2a260 em card/008).

| Critério | Evidência | Status |
|---|---|---|
| Golpe na direção do mouse, 1 tile, arco 90° | tests/combat.test.ts > "acerta a 1 tile", "nao acerta a 1,5 tile", "nao acerta alvo atras", "arco: 40 graus acerta, 50 nao", "aim para baixo..." | ok |
| 2 de dano, intervalo 0,4 s | tests/combat.test.ts > "cooldown: 23 ticks um golpe, 24 ticks dois" | ok |
| Alvo de treino com vida em src/data, removido em 0 | tests/combat.test.ts > "tres golpes removem o alvo" | ok |
| Vida 10, dano, 1 s invulnerável, dano ignorado | tests/combat.test.ts > "dano, invulnerabilidade de 60 ticks e novo dano" | ok |
| Vida 0 = desmaio, nunca negativa | tests/combat.test.ts > "vida nunca negativa, desmaia e nao golpeia" | ok |
| Valores em src/data | tests/combat.test.ts > "valores vem de src/data" | ok |
| Sem outras armas/criaturas/dano por contato | revisão do diff | ok |
| Correção do playtest: clique com quadros sem tick | tests/qa/card-008.test.ts > "monitor 144 Hz...", "240 Hz...", "sem fila de golpes", "caminho completo fere o alvo" (clock real + consumeClick + readCommand + step) | ok |
| Correção do playtest: ordem das camadas | tests/qa/card-008.test.ts > "mapa < combate < Enzo < HUD", "GameScene aplica as camadas" (confere o código-fonte) | ok |

Limite: o desenho real (Phaser) e o mouse não rodam em teste; as camadas foram checadas por leitura do código-fonte de GameScene. Confirmar no playtest.

Roteiro de playtest (o servidor de dev já roda no worktree; RECARREGUE a página, Ctrl+F5, antes de jogar):
1. Abra o jogo e recarregue. Deve aparecer um retângulo (alvo de treino) 3 tiles à direita do Enzo e o texto "Vida 10/10" no canto.
2. Ande até ~1 tile do alvo, clique esquerdo mirando nele: deve aparecer um arco rápido (~0,1 s) e o alvo perder vida; no 3º golpe ele some. Mire para o lado oposto ou fique a mais de 1 tile: não deve acertar.
3. Faça spam de cliques: só deve golpear a cada ~0,4 s. Se tiver monitor de 120/144 Hz, confirme que nenhum clique "some".
4. Aperte K: vida cai 3 e o Enzo pisca por 1 s; K de novo durante o piscar não tira vida.
5. Aperte K até zerar: a vida para em 0 ("DESMAIOU") e o clique não golpeia mais.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
- 2026-10-29 15:19 | SM | refinamento -> dev; worktree .worktrees/008 (branch card/008); resultado pendente. 007 mergeado.
- 2026-10-29 15:40 | SM | dev -> review; resultado pendente.
- 2026-10-29 15:45 | SM | review -> qa; resultado pendente.
- 2026-10-29 15:52 | SM | qa -> playtest (playtest: sim); resultado pendente, aguarda o Guilherme.
- 2026-10-29 16:05 | SM | Guilherme reprovou o playtest (no terminal): "a parte da vida até desmaiar funcionou ok, mas não apareceu nenhum monstro nem consegui atirar". Ou seja: tecla K, vida, invulnerabilidade e desmaio ok; alvo de treino não aparece e o golpe (clique esquerdo) não sai. playtest -> dev; retrabalho 1; resultado pendente.
- 2026-10-29 16:20 | SM | dev -> review (retrabalho 1); resultado pendente.
- 2026-10-29 16:30 | SM | revisor reprovou (clique perdido em quadros sem tick em GameScene.update; teste visibility com expect inútil; comentários no card). review -> dev; retrabalho 2; resultado pendente. Atenção: no retrabalho 3 o card é bloqueado.
- 2026-10-29 16:45 | SM | dev -> review (retrabalho 2); resultado pendente.
- 2026-10-29 16:52 | SM | review -> qa (retrabalho 2); resultado pendente.
- 2026-10-29 17:00 | SM | qa -> playtest (retrabalho 2, playtest: sim); resultado pendente, aguarda o Guilherme.
- 2026-10-29 17:20 | SM | Guilherme reprovou o playtest (no terminal): "reprovado 008: está aparecendo o arco quando eu clico, mas não aparece se eu dou dano ou o projétil. Eu tenho que encostar o arco no inimigo para poder dar dano nele". Retrabalho chegou a 3: card BLOQUEADO (fica em playtest/, não volta para dev). Pontos: (1) falta feedback visível de acerto/dano no alvo; (2) o alcance do Galho é 1 tile, arco 90° (bíblia 5.2, corpo a corpo, sem projétil; o projétil é do Estilingue, fora do escopo do card). Aguarda decisão do Guilherme sobre o que ele espera do golpe.
- 2026-10-29 17:25 | SM | Guilherme decidiu (no terminal) destravar o card com "só feedback de acerto": manter Galho corpo a corpo, 1 tile, arco 90° (bíblia 5.2) e acrescentar feedback visível quando o golpe acerta (alvo pisca, número do dano, barra de vida do alvo). Retrabalho continua 3 (registro), bloqueio levantado por decisão do Guilherme. playtest -> dev; resultado pendente. Antes do dev: PO acrescenta o critério e o arquiteto as tarefas.
