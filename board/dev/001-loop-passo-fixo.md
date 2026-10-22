---
id: 001
titulo: Loop de simulação com passo fixo
coluna: dev
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: tecnico
executor: claude
playtest: nao
estimativa: P
branch: card/001
---

## Ideia
A simulação do jogo roda em passo fixo de 60 atualizações por segundo, separada da renderização (seção 15 da bíblia). Uma função pura recebe o estado e os comandos do jogador e devolve o próximo estado. A renderização só desenha o estado. Testes provam que o mesmo conjunto de comandos sempre gera o mesmo resultado.

## Historia
Como time, precisamos de uma simulação que roda em passo fixo de 60 atualizações por segundo, separada da renderização, para que o jogo seja determinístico e testável sem abrir o navegador.

## Criterios de aceite
- [ ] A simulação avança exatamente 60 atualizações (ticks) por segundo de tempo simulado, independente da taxa de quadros da tela (por exemplo, um quadro lento de 100 ms executa 6 ticks e um quadro de ~16,7 ms executa 1 tick).
- [ ] Existe uma função pura que recebe o estado atual e os comandos do jogador e devolve o próximo estado, sem alterar o estado recebido e sem depender de relógio, aleatoriedade global ou navegador.
- [ ] A renderização apenas lê e desenha o estado; nenhuma lógica de jogo roda dentro dela.
- [ ] Teste automático: o mesmo estado inicial com a mesma sequência de comandos (ex.: "anda para a direita por 30 atualizações") executada duas vezes gera estados finais idênticos.
- [ ] Teste automático: a simulação roda em ambiente de teste sem navegador e 60 ticks correspondem a 1 segundo de jogo.
- [ ] Os valores de balanceamento usados (como a taxa de 60 ticks por segundo) ficam em arquivo de dados em `src/data/`, não fixos na lógica.

## Referencias na biblia
- 15. Regras técnicas para os agentes (simulação com passo fixo; lógica separada da renderização; testes por simulação; valores em arquivos de dados)
- 16. Glossário (Atualização/tick: 60 por segundo)

## Tarefas tecnicas
Base atual no main: `src/data/sim.ts` ja tem `SIM.ticksPerSecond = 60`; `src/sim/index.ts` so reexporta `color`; `tests/architecture.test.ts` proibe `src/sim` de importar phaser ou `render/`. Sem dependencia nova.

1. **Dados** (`src/data/sim.ts`): manter `ticksPerSecond: 60`. Adicionar `maxTicksPerFrame: 10` (teto anti "espiral da morte" quando a aba volta de segundo plano) e `playerSpeedPxPerSecond: 240` (velocidade provisoria do marcador de teste, so para provar o passo; o card de movimento real define o valor final).
2. **Tipos** (`src/sim/types.ts`): `Command = { moveX: -1 | 0 | 1; moveY: -1 | 0 | 1 }` (so o necessario para provar o passo; nada de ataque/dash); `GameState = { tick: number; player: { x: number; y: number } }`, tudo `readonly`.
3. **Estado e passo** (`src/sim/step.ts`):
   - `createInitialState(): GameState` com tick 0 e jogador em (0,0).
   - `step(state, command): GameState` pura: nao muta o argumento, devolve objeto novo, incrementa `tick`, move `speed / ticksPerSecond` por tick, usando apenas `SIM` de `src/data/sim.ts`. Sem `Date`, `performance`, `Math.random`.
   - `run(state, commands: readonly Command[]): GameState` que aplica `step` em sequencia (ajuda os testes).
4. **Acumulador de tempo** (`src/sim/clock.ts`), puro e sem relogio proprio:
   - `createClock(): { accumulatorMs: number }`.
   - `advanceClock(clock, frameDeltaMs): { clock; ticks: number }` soma o delta, calcula `ticks = floor(acc / (1000 / ticksPerSecond))`, limita a `maxTicksPerFrame` (descartando o excedente do acumulador), guarda o resto. Delta negativo ou NaN vira 0. Cuidado com erro de ponto flutuante: 100 ms deve dar exatamente 6 ticks e 60 quadros de 1000/60 ms devem dar 60 ticks (usar tolerancia pequena, ex.: epsilon, ou acumular em unidades de tick = delta*ticksPerSecond/1000).
5. **Exportar** `types`, `step`, `clock` em `src/sim/index.ts`.
6. **Render** (`src/render/GameScene.ts`, substitui `EmptyScene.ts` em `createGame.ts`; remover `EmptyScene.ts`):
   - Guarda `state` e `clock`. No `update(_, delta)` chama `advanceClock`, e para cada tick chama `step(state, readCommand())`. Depois desenha o estado (um retangulo/circulo simples na posicao do jogador, cor de `PALETTE`). Nao ha regra de jogo na cena alem de ler teclado (setas/WASD) e traduzir para `Command`.
   - Leitura de teclado em funcao pequena `readCommand(keys): Command` dentro de `src/render/`.
   - Desenho interpolado nao e necessario neste card.
7. **Testes** (`tests/`):
   - `tests/clock.test.ts`: delta 100 ms de um clock novo gera 6 ticks; 1000/60 ms gera 1 tick; 60 quadros de 1000/60 ms somam 60 ticks; 16 quadros de 10 ms geram 9 ou 10 ticks sem perder resto (160 ms = 9 ticks, resto ~10 ms preservado); delta enorme (5000 ms) gera exatamente `maxTicksPerFrame`; delta negativo gera 0 ticks.
   - `tests/step.test.ts`: (a) `step` nao muta o estado recebido (usar `Object.freeze` profundo no estado e comparar com copia por `structuredClone`); (b) determinismo: `run` do mesmo estado inicial com 30 comandos `moveX: 1` duas vezes gera estados `toEqual` e `tick === 30`, `player.x` igual a `30 * speed / 60`; (c) 60 comandos vazios levam `tick` a 60, equivalente a 1 s (`tick / ticksPerSecond === 1`); (d) a taxa lida e `SIM.ticksPerSecond` (nenhum 60 literal em `src/sim`).
   - Os testes rodam em ambiente node, sem navegador (nenhum import de phaser).
   - Manter `tests/architecture.test.ts` passando; opcionalmente acrescentar la que `src/sim` nao referencia `Date`, `performance` nem `Math.random`.
8. Rodar `npm run test` e `npm run build` (tsc + vite) e conferir que passam.

**Fora do escopo**: colisao, mapa, inimigos, combate, dash, camera, interpolacao visual, geracao procedural/seed (nenhum RNG aqui), save, menus, gamepad, HUD, qualquer ajuste final de velocidade do jogador. O `Command` e o `GameState` ficam minimos; os cards seguintes os estendem.

## Notas do dev

## Comentarios
- 2026-10-22 | PO | História pronta. Card técnico, pertence à fase 1 (Sprint 0). Menção a `src/data/` vem da seção 15 da bíblia.

- 2026-10-22 | Arquiteto | Bloqueado: depende do card 000 (Esqueleto do projeto), que ainda não está no main. Não existem `package.json`, `src/`, `tests/`, Vitest nem TypeScript. Este card precisa de `src/sim`, `src/data` e `tests` e do runner de testes criados pelo 000. Quando o 000 estiver no main, o card volta a ser refinado. Estimativa prévia: P (loop acumulador de tempo em `src/sim`, função `step` pura, taxa em `src/data`, 2 testes), playtest: nao.
- 2026-10-22 | Arquiteto | Plano pronto. Estimativa P, playtest nao, executor claude. Dependencia 000 ja esta no main. Atencao ao arredondamento do acumulador (100 ms = 6 ticks exatos).

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
- 2026-10-22 14:45 | SM | desbloqueado com autorização do Guilherme: dependência 000 já está no main; resultado -> pendente
- 2026-10-22 14:46 | SM | refinamento -> dev (arquiteto aprovou); worktree .worktrees/001 criado
