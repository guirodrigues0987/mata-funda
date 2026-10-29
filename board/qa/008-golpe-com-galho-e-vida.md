---
id: 008
titulo: Golpe com o Galho, vida e dano
coluna: qa
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
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

## Comentarios
- 2026-10-22 | PO | A bíblia só define o Galho por "intervalo" de 0,4 s; não há duração de animação nem tempo de recuperação separados, então usei só o intervalo e não inventei outros números. A vida do alvo de treino também não está na bíblia: é valor de teste, escolhido na implementação (sugestão para quem refinar: múltiplo de 2). Obs. para o SM: o card é de fase 2 e a fase atual no documento ainda é 1.
- 2026-10-22 | Arquiteto | Plano pronto, estimativa M. Mudei playtest de nao para sim: o card e combate e define a sensacao do golpe (alcance, arco, ritmo de 0,4 s, piscar da invulnerabilidade). Vida do alvo de treino definida em 6 (3 golpes). Command ganha campos opcionais para reduzir conflito com os cards 005 e 007, que tambem mexem em Command/GameState; quem entrar depois resolve o merge.
- 2026-10-29 | Revisor | Passou no checklist. Mover damagePlayer de damage.ts para combat.ts esta dentro do escopo (tarefa 3 pede damagePlayer em combat.ts; damage.ts so reimporta, esquiva e touchHazard preservados) e a tecla K temporaria esta prevista na tarefa 5. Testes (93) e build ok. (opcional) dano 3 da tecla K e 0,1 s do arco estao fixos em GameScene; mover para src/data. (opcional) offset do alvo de treino relativo ao spawn e desvio justificado da tarefa 1.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
- 2026-10-29 15:19 | SM | refinamento -> dev; worktree .worktrees/008 (branch card/008); resultado pendente. 007 mergeado.
- 2026-10-29 15:40 | SM | dev -> review; resultado pendente.
- 2026-10-29 15:45 | SM | review -> qa; resultado pendente.
