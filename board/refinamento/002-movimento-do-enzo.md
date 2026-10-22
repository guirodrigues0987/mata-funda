---
id: 002
titulo: Enzo se move livremente
coluna: refinamento
resultado: bloqueado      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: feature
executor: claude
playtest: sim
estimativa: P
branch:
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
Dependencias: card 000 (esqueleto Vite/Phaser/Vitest) e card 001 (loop de passo fixo, `src/sim` com tick de 60/s) precisam estar no `main`. Este plano assume os nomes que 001 definir para o tick; o dev deve reutilizar o loop existente e nao criar outro.

1. Criar `src/data/player.ts` exportando `PLAYER_DATA = { speedTilesPerSecond: 5 }` e `src/data/world.ts` exportando `WORLD_DATA = { tileSizePx: 64 }`. Se 000/001 ja criaram esses arquivos, so acrescentar os campos.
2. Criar `src/data/palette.ts` (ou acrescentar a ele, se 000 ja criou) com as cores do placeholder do Enzo: corpo escuro (tom Noite/escuro da paleta, seção 12) e uma cor de bone. Nao pode ser `#f29bb5`.
3. Criar `src/sim/movement.ts` com funcoes puras e sem Phaser:
   - `type MoveInput = { up: boolean; down: boolean; left: boolean; right: boolean }`
   - `getMoveDirection(input): { x: number; y: number }` — eixos opostos se anulam (W+S = 0, A+D = 0); diagonal normalizada (divide por sqrt(2)); sem tecla = (0,0).
   - `stepPlayer(player: { x: number; y: number }, input: MoveInput, dt = 1/60): { x: number; y: number }` — retorna nova posicao com velocidade `speedTilesPerSecond * tileSizePx` px/s. Nao mutar o argumento.
4. Integrar no estado da simulacao existente (de 001): adicionar `player: {x, y}` e chamar `stepPlayer` a cada tick com o input do quadro atual. Posicao inicial `(0, 0)` vinda de dados (`PLAYER_DATA.startX/startY`) ou constante em dados.
5. Criar `src/render/input.ts` que le W, A, S, D do Phaser (`keyboard.addKeys`) e produz `MoveInput`. Sem logica de movimento aqui.
6. Criar `src/render/playerView.ts` (ou desenhar na cena principal) que desenha a capsula escura (retangulo arredondado/Graphics) com um bone colorido em cima, na posicao do estado. Apenas leitura do estado.
7. Testes em `tests/movement.test.ts` (Vitest, sem navegador):
   - Direita por 60 ticks: x aumenta 320 px (5 tiles), y igual (tolerancia `toBeCloseTo`).
   - Esquerda, cima, baixo por 60 ticks: 320 px no eixo correto.
   - W+D, W+A, S+D, S+A por 60 ticks: distancia euclidiana percorrida = 320 px (nao 452), com sinais certos em cada eixo.
   - Sem tecla por 60 ticks: posicao inalterada.
   - W+S e A+D juntas: parado.
   - Mudar `tileSizePx` ou `speedTilesPerSecond` no objeto de dados muda a distancia (prova que vem dos dados), ou `stepPlayer` aceita os dados por parametro com default.
   - Teste de que `src/sim/movement.ts` nao importa `phaser`.
8. Rodar `npm test` e `npm run build`.

Dados: `PLAYER_DATA.speedTilesPerSecond = 5`; `WORLD_DATA.tileSizePx = 64`; cores do placeholder em `src/data/palette.ts`.

Fora do escopo: colisao com cenario, aceleracao/inercia, esquiva, Pe leve, camera, animacao, sprite final, setas do teclado, gamepad, qualquer outra tecla alem de WASD.

Playtest: marcado `sim` (seção 15 da biblia exige playtest humano para movimento). O Guilherme deve avaliar se 5 tiles/s e a diagonal parecem corretos.

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo deste card (não há regra na bíblia): colisão com cenário, inércia/aceleração, esquiva, Pé leve. A bíblia (seção 15) diz que cards de movimento passam por playtest do Guilherme, mas o card está com `playtest: nao`; o arquiteto deve rever esse campo.
- 2026-10-22 | Arquiteto | playtest alterado para `sim`: a seção 15 manda playtest para todo card de movimento, o PO estava certo. Estimativa P.
- 2026-10-22 | Arquiteto | BLOQUEADO: depende dos cards 000 (esqueleto do projeto, nao ha package.json no main) e 001 (loop de passo fixo), ainda em refinamento e fora do `main`. Plano pronto; quando 000 e 001 estiverem no main, o SM pode resetar `resultado` para `aprovado` sem novo refinamento.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
