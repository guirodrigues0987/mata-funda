---
id: 002
titulo: Enzo se move livremente
coluna: review
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: feature
executor: claude
playtest: sim
estimativa: P
branch: card/002
---

## Ideia
O Enzo aparece como placeholder (cápsula escura com boné colorido, seção 12) e se move em 8 direções com WASD, na velocidade da seção 4 da bíblia (5 tiles/s, 1 tile = 64 px). Movimento na diagonal não pode ser mais rápido que na reta. Valores em arquivo de dados.

## Historia
Como jogador, quero mover o Enzo livremente em 8 direções com WASD, para explorar a mata na velocidade certa, sem que andar na diagonal seja mais rápido.

## Criterios de aceite
- [ ] O Enzo aparece na tela como placeholder: uma cápsula escura com um boné colorido (único detalhe de cor), sem usar o rosa do Boto (`#f29bb5`).
- [ ] Segurando só W, A, S ou D, o Enzo anda para cima, esquerda, baixo ou direita a 5 tiles/s (320 px/s, pois 1 tile = 64 px): em 60 atualizações (1 s) ele percorre 5 tiles.
- [ ] Segurando duas teclas perpendiculares (W+D, W+A, S+D, S+A), o Enzo anda na diagonal e a velocidade total continua 5 tiles/s: em 1 s ele percorre 5 tiles em linha reta na diagonal, não mais que isso.
- [ ] Sem nenhuma tecla pressionada, o Enzo fica parado.
- [ ] A velocidade do Enzo (5 tiles/s) e o tamanho do tile (64 px) vêm de arquivo de dados em `src/data/`, e não estão fixos no código.
- [ ] Um teste automático por simulação alimenta comandos (ex.: "direita por 60 atualizações", "direita+cima por 60 atualizações") e confere a distância percorrida, sem abrir o navegador.

## Referencias na biblia
- 4. Jogabilidade (fixa) > Controles (mover em 8 direções, livre, com WASD)
- 4. Jogabilidade (fixa) > Atributos do Enzo (Velocidade: 5 tiles/s)
- 12. Direção de arte > Técnica (1 tile = 64 px) e Placeholders (Enzo = cápsula com boné colorido)
- 15. Regras técnicas para os agentes (passo fixo de 60 atualizações por segundo, lógica separada da renderização, valores em `src/data/`, testes por simulação)

## Tarefas tecnicas
Dependencias: cards 000 e 001 ja estao no `main`. Este plano reaproveita o que o 001 criou (`step`, `Command`, `GameState`, `advanceClock`, `GameScene`, `readCommand`) e substitui apenas o provisorio. Nenhuma dependencia nova.

Estado real do codigo: `src/sim/step.ts` faz `player.x += moveX * SIM.playerSpeedPxPerSecond / ticksPerSecond` (sem normalizar diagonal; 240 px/s provisorio). `Command` tem `moveX/moveY` em {-1,0,1}. `GameScene` usa setas + WASD e um quadrado verde (`marker`) como marcador. `RENDER.tilePx = 64` ja existe em `src/data/render.ts`.

1. Dados:
   - Criar `src/data/player.ts` com `PLAYER = { speedTilesPerSecond: 5, startX: 0, startY: 0 }`.
   - Reaproveitar `RENDER.tilePx` como tamanho do tile? Nao: tile e conceito de mundo, nao de render. Criar `src/data/world.ts` com `WORLD = { tilePx: 64 }` e fazer `RENDER.tilePx` ser removido (ou apontar para `WORLD.tilePx`) para ter uma unica fonte. Verificar usos com grep antes.
   - Em `src/data/sim.ts` remover `playerSpeedPxPerSecond` (e o comentario "Provisorio").
   - Em `src/data/palette.ts` NAO adicionar cores: placeholder usa `PALETTE.noite`/`mataEscura` (corpo) e `PALETTE.fogo` (bone). Proibido `rosaBoto`.
2. Alterar `src/sim/step.ts`:
   - Criar helper puro `moveVector(command): {x, y}` (pode ficar em `src/sim/movement.ts`, exportado por `src/sim/index.ts`): se `moveX` e `moveY` ambos nao-zero, multiplica cada eixo por `Math.SQRT1_2`; senao devolve o eixo como esta.
   - `step` passa a usar `PLAYER.speedTilesPerSecond * WORLD.tilePx / SIM.ticksPerSecond` como deslocamento por tick (= 320/60 px) multiplicado pelo vetor normalizado. Sem literal `60` no codigo de `src/sim` (teste existente proibe).
   - `createInitialState` usa `PLAYER.startX/startY`.
   - Nao mutar o estado recebido (teste existente).
3. Alterar `src/render/readCommand.ts` e `GameScene.ts`: o card pede WASD; remover as setas do teclado (`createCursorKeys`, `this.cursors`) mantendo so W, A, S, D. `readCommand` continua igual (ja devolve -1/0/1 e W+S / A+D se anulam).
4. Alterar `src/render/GameScene.ts`: trocar o `marker` (retangulo verde) por um placeholder do Enzo: capsula escura (Graphics `fillRoundedRect`, cor `PALETTE.mataEscura` com contorno `PALETTE.noite`/`folhagem` para destacar do fundo `noite`) com um bone em `PALETTE.fogo` (unico detalhe de cor). Tamanho derivado de `WORLD.tilePx` (ex.: ~0.5 x 1 tile) via constantes em `src/data/render.ts`. Pode extrair para `src/render/playerView.ts`. So le o estado.
5. Testes:
   - Atualizar `tests/step.test.ts`: o teste "e deterministico" usa `SIM.playerSpeedPxPerSecond`; trocar por `PLAYER.speedTilesPerSecond * WORLD.tilePx`.
   - Criar `tests/movement.test.ts` (Vitest, usando `run`/`createInitialState`):
     - Direita, esquerda, cima, baixo por 60 comandos: deslocamento de 320 px no eixo certo e 0 no outro (`toBeCloseTo`).
     - W+D, W+A, S+D, S+A por 60 comandos: distancia euclidiana = 320 (nao ~452) e sinais corretos dos eixos.
     - Sem comando por 60 ticks: posicao igual a inicial.
     - Comandos opostos (moveX=0 resultante de W+S/A+D) via `readCommand`: parado.
     - Valores vem de dados: 320 == `PLAYER.speedTilesPerSecond * WORLD.tilePx` (lido dos dados, nao literal).
     - Teste de `readCommand` com `Keys` (importavel sem Phaser): W+S -> moveY 0, A+D -> moveX 0.
   - Manter `tests/architecture.test.ts` passando (sim sem phaser/render).
6. Rodar `npm test` e `npm run build`.

Dados: `PLAYER.speedTilesPerSecond = 5`, `PLAYER.startX/startY = 0`, `WORLD.tilePx = 64`; remover `SIM.playerSpeedPxPerSecond`. Cores do placeholder reaproveitam `PALETTE`.

Fora do escopo: colisao com cenario, aceleracao/inercia, esquiva, Pe leve, camera seguindo, animacao, sprite final, gamepad, outras teclas alem de WASD, mudar o loop/clock do 001.

Playtest: `sim` (seção 15). O Guilherme deve avaliar se 5 tiles/s e a diagonal parecem corretos.

## Notas do dev
- Feito: dados em `src/data/player.ts` e `world.ts` (RENDER.tilePx aponta para WORLD.tilePx; SIM.playerSpeedPxPerSecond removido); `moveVector` em `src/sim/movement.ts` normaliza a diagonal; `step` usa 5 tiles/s x 64 px; WASD apenas (setas removidas); placeholder do Enzo em `src/render/playerView.ts` (capsula mataEscura, contorno folhagem, bone fogo); `tests/movement.test.ts` novo e `step.test.ts` atualizado.
- Decisao: medidas do placeholder ficam em `src/data/render.ts`.
- Fora: nada pendente. Playtest visual fica com o Guilherme.
- `npm run test`: 25 testes passando. `npm run build`: ok (so aviso de tamanho de chunk).

## Comentarios
- 2026-10-22 | PO | Fora do escopo deste card (não há regra na bíblia): colisão com cenário, inércia/aceleração, esquiva, Pé leve. A bíblia (seção 15) diz que cards de movimento passam por playtest do Guilherme, mas o card está com `playtest: nao`; o arquiteto deve rever esse campo.
- 2026-10-22 | Arquiteto | playtest alterado para `sim`: a seção 15 manda playtest para todo card de movimento, o PO estava certo. Estimativa P.
- 2026-10-22 | Arquiteto | BLOQUEADO: depende dos cards 000 (esqueleto do projeto, nao ha package.json no main) e 001 (loop de passo fixo), ainda em refinamento e fora do `main`. Plano pronto; quando 000 e 001 estiverem no main, o SM pode resetar `resultado` para `aprovado` sem novo refinamento.

- 2026-10-22 | Arquiteto | Plano revalidado contra o codigo real do 001: reaproveita step/Command/GameScene/readCommand, substitui os 240 px/s provisorios por 5 tiles/s x 64 px = 320 px/s vindos de `src/data/`, adiciona normalizacao da diagonal e remove setas (card pede so WASD). playtest: sim, estimativa P, aprovado.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
- 2026-10-22 14:49 | SM | desbloqueado (autorização do Guilherme): dependências 000 e 001 estão no main; resultado -> pendente para o arquiteto revalidar o plano
- 2026-10-22 14:49 | SM | refinamento -> dev (arquiteto aprovou); worktree .worktrees/002 criado
- 2026-10-22 14:50 | SM | dev -> review (dev aprovou)
