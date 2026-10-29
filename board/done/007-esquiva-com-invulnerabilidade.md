---
id: 007
titulo: Esquiva com invulnerabilidade
coluna: done
resultado: concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: P
branch: card/007
---

## Ideia
O Enzo ganha a esquiva: um deslocamento rápido na direção do movimento, com janela de invulnerabilidade e tempo de recarga, nos valores da seção de jogabilidade da bíblia. Lógica na simulação pura e testada por simulação. Ainda sem inimigos para testar o desvio; um alvo de teste que causa dano é suficiente.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero esquivar com um rolamento rápido que me deixa invulnerável por instantes, para escapar de golpes e criaturas.

## Criterios de aceite
- [ ] Apertar Espaço enquanto o Enzo se move faz ele rolar na direção em que estava indo, percorrendo 3 tiles em 0,25 s.
- [ ] Durante os 0,25 s do rolamento o Enzo é invulnerável: um alvo de teste que causa dano por contato não tira vida dele se encostar nele nesse período.
- [ ] Fora do rolamento (antes de começar e depois de terminar), o mesmo alvo de teste causa dano normalmente.
- [ ] Depois de uma esquiva, apertar Espaço de novo antes de 0,8 s não faz nova esquiva; com 0,8 s ou mais, a nova esquiva acontece.
- [ ] O comportamento é coberto por testes automáticos de simulação, sem depender da tela (distância, duração, invulnerabilidade e intervalo).

## Referencias na biblia
- 4. Jogabilidade > Combate (Esquiva: rolamento de 3 tiles em 0,25 s, invulnerável, intervalo de 0,8 s)
- 4. Jogabilidade > Controles (Esquiva = Espaço)

## Tarefas tecnicas
Estado atual do main: `Command` so tem `moveX/moveY`; `GameState` e `{tick, player:{x,y}}`; `step` anda `speed*tilePx/60` px por tick; `readCommand` (render) le WASD; nao existe vida do Enzo nem dano. Unidade de posicao: px (tile = 64 px, `WORLD.tilePx`). Nenhuma dependencia nova.

Decisoes de interpretacao (a biblia nao define; registradas para o dev e o Guilherme):
- Espaco sem direcao de movimento (Enzo parado) **nao faz nada** e nao gasta o intervalo.
- O intervalo de 0,8 s conta **a partir do inicio do rolamento** (48 ticks desde o tick do aperto). Portanto nova esquiva e possivel 48 ticks depois do aperto anterior.
- A direcao do rolamento e a do comando no tick do aperto, fixa ate o fim; durante o rolamento o movimento normal e ignorado. Diagonal usa `moveVector` (normalizado), entao percorre 3 tiles em linha reta.

Passos:
1. `src/data/player.ts`: acrescentar `maxHp: 10` (o card 008 reutiliza) e um bloco `DODGE = { distanceTiles: 3, durationSeconds: 0.25, cooldownSeconds: 0.8 }` (pode ser em `src/data/dodge.ts`). Ticks derivados na sim: `Math.round(seconds * SIM.ticksPerSecond)` (15 e 48); velocidade do rolamento = `distanceTiles*tilePx/durationTicks` (12,8 px/tick).
2. `src/sim/types.ts`: `Command` ganha `dodge?: boolean` (opcional, para nao quebrar os testes existentes). `GameState.player` ganha `hp: number` e `dodge: { dirX, dirY, ticksLeft, cooldownLeft }` (ticksLeft > 0 = rolando; cooldownLeft > 0 = em recarga). Atualizar `createInitialState` em `src/sim/step.ts`.
3. `src/sim/dodge.ts` (novo, puro): `startDodge`/`advanceDodge` ou logica equivalente chamada pelo `step`: se `command.dodge` e cooldownLeft == 0 e nao esta rolando e `moveVector` != 0, inicia (ticksLeft = 15, cooldownLeft = 48, dir = moveVector). A cada tick: se rolando, move `dir * rollSpeed` e ignora movimento normal; decrementa ticksLeft e cooldownLeft (minimo 0). Exportar `isDodging(state)` (ticksLeft > 0) em `src/sim/index.ts`. O tick do aperto ja e o primeiro tick de rolamento (15 ticks de movimento no total, exatamente 192 px).
4. `src/sim/damage.ts` (novo, puro): `damagePlayer(state, amount): GameState` que nao faz nada se `isDodging(state)`, senao reduz `hp` (piso 0). Alvo de teste: em `src/data/testHazard.ts` `{ x, y, radiusPx, damage }` e funcao pura `touchHazard(state, hazard)` que aplica `damagePlayer` se a distancia do centro do Enzo ao do alvo <= radius. Sem criaturas, sem 1 s de invulnerabilidade pos-dano (isso e do card 008).
5. `src/render/readCommand.ts`: `Keys` ganha `dodge: boolean`, `Command.dodge` = essa tecla. `src/render/GameScene.ts`: registrar tecla SPACE e passar em `command()`. Cuidado: `dodge` deve valer so no tick em que a tecla foi pressionada (use `Phaser.Input.Keyboard.JustDown` guardado ate o proximo tick consumido) para nao disparar repetido; a recarga ja protege, mas o comando nao deve ficar "preso". Visual minimo opcional: marcador do Enzo semitransparente enquanto `isDodging`; sem arte nova.
6. Atualizar `tests/movement.test.ts` (`none` passa a ter `dodge: false`).

Testes (novo `tests/dodge.test.ts`, via `run`/`step`, sem tela):
- Rolar para a direita (comando `{moveX:1, dodge:true}` e depois mais 14 ticks de qualquer comando): deslocamento = 192 px (3 tiles) em exatamente 15 ticks, e no tick 16 volta a andar normal (320/60 px).
- Distancia identica nas 4 retas e na diagonal (hypot = 192); direcao fixa mesmo se o comando mudar no meio do rolamento.
- Invulneravel: `touchHazard` com o Enzo no tick 0..14 do rolamento nao altera `hp`; no tick 15 em diante e antes de rolar tira `damage`.
- Intervalo: segundo `dodge:true` no tick 47 apos o aperto nao inicia; no tick 48 inicia (checar posicao/ isDodging).
- Espaco parado (sem moveX/moveY) nao rola e nao inicia recarga (um aperto seguinte, ja movendo, rola).
- `readCommand` repassa `dodge`; `tests/architecture.test.ts` continua passando (sim sem phaser/render).

Dados: `PLAYER.maxHp = 10`; `DODGE.distanceTiles = 3`, `durationSeconds = 0.25`, `cooldownSeconds = 0.8`; alvo de teste `TEST_HAZARD` (x, y, radiusPx, damage ex.: 1) em `src/data/testHazard.ts`. Textos: nenhum.

Fora do escopo: esquiva dupla, bloqueio em agua rasa, esquiva perfeita, invulnerabilidade de 1 s apos dano, colisao com o mapa durante o rolamento (card 005), vida/morte/desmaio e HUD (card 008), animacao/arte, gamepad (A/X), qualquer criatura real, desenhar o alvo de teste na cena.

## Notas do dev
- Feito: dados (`DODGE`, `PLAYER.maxHp`, `TEST_HAZARD`), `src/sim/dodge.ts`, `src/sim/damage.ts` (`damagePlayer`, `touchHazard`), `step` com rolamento (15 ticks, 12,8 px/tick, dir fixa), `player.hp` e `player.dodge` no estado, tecla Espaco (JustDown so no primeiro tick do quadro) e marcador semitransparente enquanto rola. Testes em `tests/dodge.test.ts`.
- Decisoes seguiram o card (Espaco parado ignorado; recarga de 48 ticks contada do inicio do rolamento). Ajustei `tests/collision.test.ts` e `tests/battery.test.ts` para o novo formato de estado/Keys.
- Verificado so por codigo/testes: sensacao do rolamento, tecla Espaco real no navegador e o marcador semitransparente (playtest do Guilherme).
- `npm run test -- --run`: 78 testes passando. `npm run build`: OK.

## Comentarios
- 2026-10-22 | PO | Fora do escopo por ainda não valer nesta fase/card: Esquiva dupla (habilidade da árvore), proibição de esquivar em água rasa (Igapó), esquiva perfeita e a invulnerabilidade de 1 s após levar dano. A bíblia não define o que acontece ao apertar Espaço com o Enzo parado, nem se os 0,8 s contam do início ou do fim do rolamento; por isso os critérios cobrem só esquiva em movimento e falam em "depois de uma esquiva". Se o Guilherme quiser definir esses casos, vale registrar na bíblia antes. Atenção: o card é fase 2 e a fase atual no documento de fases ainda é 1 (decisão do SM).
- 2026-10-22 | Arquiteto | Plano pronto, estimativa P. playtest alterado de nao para sim (movimento/esquiva: sensacao do rolamento). Decisoes a confirmar com o Guilherme: Espaco parado e ignorado; 0,8 s contado do inicio do rolamento. Atencao: 008 tambem mexe em GameState/types (hp); este card cria `player.hp` e `PLAYER.maxHp`, o 008 deve reaproveitar (possivel conflito de merge trivial).
- 2026-10-29 | Revisor | Passou no checklist: escopo, valores da bíblia (3 tiles, 0,25 s, 0,8 s, Espaço) vindos de src/data, sim sem Phaser, sem aleatoriedade, 78 testes passando cobrindo distância, duração, invulnerabilidade e intervalo. (opcional) tests/dodge.test.ts: `let hp` reatribuído sem necessidade e comentário confuso no teste de invulnerabilidade.
- 2026-10-29 | QA | resultado: aprovado. Suíte completa (81 testes, 11 arquivos) e build OK.

| Critério | Evidência | Status |
|---|---|---|
| Espaço em movimento rola 3 tiles em 0,25 s | tests/dodge.test.ts > "3 tiles em exatamente 15 ticks..."; tests/qa/card-007.test.ts > "rola 3 tiles para cima em 15 ticks"; GameScene registra SPACE (JustDown) | ok |
| Invulnerável durante o rolamento | tests/dodge.test.ts > "invulneravel nos ticks 0..14..." e "...alvo no caminho"; QA > "hazard sobre o Enzo..." | ok |
| Dano normal antes e depois | mesmos testes (antes de rolar e a partir do tick 15) | ok |
| Recarga 0,8 s (47 não, 48 sim) | tests/dodge.test.ts > "intervalo: tick 47 nao inicia, tick 48 inicia"; QA > "recarga..." | ok |
| Cobertura por testes de simulação sem tela | tests/dodge.test.ts (via run/step), arquitetura passando | ok |

Roteiro de playtest:
1. Abra o jogo e ande com WASD; aperte Espaço: o Enzo deve rolar rápido na direção do movimento (cerca de 3 tiles) e o marcador ficar semitransparente.
2. Aperte Espaço parado: nada deve acontecer.
3. Aperte Espaço várias vezes seguidas: só rola de novo depois de cerca de 0,8 s.
4. Teste na diagonal e segurando a tecla: deve rolar uma vez só, sem repetir sozinho.
5. Avalie a sensação: distância e velocidade do rolamento estão boas?

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
- 2026-10-29 13:47 | SM | refinamento -> dev; worktree .worktrees/007 (branch card/007); resultado pendente. 006 mergeado.
- 2026-10-29 13:55 | SM | dev -> review; resultado pendente.
- 2026-10-29 14:02 | SM | review -> qa; resultado pendente.
- 2026-10-29 14:12 | SM | qa -> playtest (playtest: sim); resultado pendente, aguarda o Guilherme.
- 2026-10-29 15:10 | SM | Guilherme aprovou o playtest ("aprovado 007", no terminal). playtest -> done; resultado pendente para o redator.
- 2026-10-29 15:18 | SM | redator ok; merge --no-ff de card/007 no main; worktree e branch removidos; concluido.
