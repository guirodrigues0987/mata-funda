---
id: 010
titulo: Memória do mapa
coluna: refinamento
resultado: aprovado      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: M
branch:
---

## Ideia
As partes do mapa que o Enzo já viu continuam visíveis em tom apagado quando saem da luz, como diz a bíblia. Fica de fora a parte nova que aparece só na luz. Continua o card 003 (que deixou isso de fora) e depende do mapa do card 005.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que as partes do mapa que o Enzo já viu continuem visíveis em tom apagado quando saem do raio da luz, para me orientar na mata sem perder a sensação de escuridão.

## Criterios de aceite
- [ ] Um tile do mapa que já esteve dentro do raio de luz do Enzo (4 tiles com a lanterna do celular) e depois ficou fora dele continua visível, em tom apagado.
- [ ] O tom apagado é visivelmente mais escuro que o tile dentro do raio de luz e visivelmente mais claro que um tile nunca visto.
- [ ] Um tile que o Enzo nunca viu (nunca entrou no raio) continua totalmente escuro, sem nenhuma pista visível.
- [ ] Quando o Enzo volta a um tile já visto e ele entra de novo no raio de luz, o tile aparece com a iluminação normal (não apagada).
- [ ] O que o Enzo viu não é esquecido enquanto a run continua: andar para longe e voltar mantém os tiles vistos em tom apagado.
- [ ] A regra de "o que já foi visto" fica na simulação pura (sem Phaser) e é determinística: a mesma sequência de movimentos produz o mesmo conjunto de tiles vistos, e há teste automático para isso.
- [ ] Funciona sobre o mapa com colisão do card 005, nos tiles de 64 px.

## Referencias na biblia
- 4. Jogabilidade > Visão ("Partes do mapa já vistas ficam visíveis em tom apagado (memória do mapa)")
- 4.1 Iluminação e bateria (raio da fonte de luz)
- 4. Jogabilidade > Mapa (grade de tiles, 1 tile = 64 px)

## Tarefas tecnicas

**Decisao de design (valor do tom apagado, para o Guilherme corrigir):** a biblia nao da numero. Escolhido `MEMORY.overlayAlpha = 0.6`: o tile lembrado e redesenhado com a textura normal (cores da paleta) a 60% de opacidade, SEM luz, por cima do fundo quase preto. Resultado esperado: chao lembrado ~ rgb(21,31,23), claramente mais claro que o escuro total (noite, rgb(11,15,12)) e bem mais escuro que o tile iluminado (luz intensidade 2). Para ajustar, basta mudar esse numero em `src/data/light.ts`. Por isso o card passa a `playtest: sim` (e uma questao de luz/sensacao visual; o teste automatico nao diz se o tom ficou bom).

Regra de "visto" (decidida aqui): um tile e visto quando intersecta o raio de luz ATUAL do Enzo (usa `isLit` com o retangulo do tile e `currentLightRadiusPx(state.light)`), ou seja 4 tiles com a lanterna ligada e 1,5 tile com ela apagada/sem carga. Paredes tambem contam como vistas. Sem linha de visao (a luz atravessa paredes, como o Light2D ja faz hoje).

1. Dados: em `src/data/light.ts` adicionar `export const MEMORY = { overlayAlpha: 0.6 } as const;` (sem tocar em `LIGHT`).
2. Tipo: em `src/sim/types.ts` adicionar a `GameState` o campo `readonly seenTiles: ReadonlySet<number>` (indice do tile = `row * larguraDaLinha + col`; usar a largura `rows[0].length` do mapa, todos os mapas sao retangulares). Comentar que e a memoria da run e nao e salva entre runs.
3. Nova sim pura `src/sim/memory.ts` (exportar em `src/sim/index.ts`):
   - `tileIndex(map, col, row): number`.
   - `tilesInLight(map, player, radiusPx): number[]` : percorre so a caixa de tiles que cobre o raio (nao o mapa inteiro) e devolve os indices cujo retangulo (64 px, centro em `(col+0.5)*tilePx`) passa em `isLit`.
   - `revealTiles(map, seen, player, light): ReadonlySet<number>` : uniao de `seen` com `tilesInLight(...)`. Se nada novo, devolve o MESMO `seen` (sem copiar, evita alocar 60x por segundo).
   - `tileVisibility(map, state, col, row): "unseen" | "remembered" | "lit"` : `lit` se o tile esta no raio agora; `remembered` se esta em `seenTiles` e nao esta no raio; senao `unseen`. E isto que o render consulta (o render nao decide regra).
4. `src/sim/step.ts`: `createInitialState(map)` inicia `seenTiles` com `revealTiles(map, new Set(), player, light)` (o spawn ja e visto); em `step`, depois de mover e de `stepLight`, `seenTiles: revealTiles(map, state.seenTiles, moved, nextLight)`. Nao mexer em combate, esquiva nem vida.
5. Render `src/render/mapView.ts`: alem do `Image` com `Light2D` por tile, criar um segundo `Image` por tile (mesma textura, SEM `setPipeline("Light2D")`, `setAlpha(MEMORY.overlayAlpha)`, `setDepth(RENDER.depth.memory)`, `setVisible(false)`). Retornar `{ tiles, overlays }` ou um objeto `MapView`, e exportar `updateMapMemory(view, state, map)` que para cada overlay faz `setVisible(tileVisibility(...) === "remembered")`. Para nao varrer 960 tiles por quadro sem necessidade, pode varrer so quando `state.seenTiles` mudou ou o tile do Enzo/raio mudou; varrer tudo todo quadro tambem e aceitavel neste mapa (960 tiles) se o dev preferir simplicidade.
6. `src/data/render.ts`: adicionar `memory: 1` em `RENDER.depth` (acima do mapa 0, abaixo de combate 10). Ajustar `GameScene.ts` (`create` guarda o `MapView`; `draw` chama `updateMapMemory`) e o `setDepth` do mapa existente.
7. Atualizar chamadas/fixtures que construam `GameState` na mao, se houver (grep por `lastHit:` em `tests/`), para incluir `seenTiles`.

**Arquivos:** criar `src/sim/memory.ts`, `tests/memory.test.ts`; alterar `src/data/light.ts`, `src/data/render.ts`, `src/sim/types.ts`, `src/sim/step.ts`, `src/sim/index.ts`, `src/render/mapView.ts`, `src/render/GameScene.ts`.

**Testes** (`tests/memory.test.ts`, usando `TEST_MAP` ou `tests/freeMap.ts`, via `step`/`run`):
- Estado inicial: o tile do spawn e um tile a 3 tiles dele estao em `seenTiles`; um tile a 6+ tiles do spawn nao.
- Anda para a direita ~10 tiles (comandos `moveX: 1`): o tile do spawn continua em `seenTiles` e `tileVisibility` = `remembered`; o tile sob o Enzo = `lit`.
- Nunca visto: um tile longe do caminho percorrido (ex.: canto da sala grande) e `unseen` e NAO esta em `seenTiles`.
- Volta ao ponto de partida: o tile antes `remembered` passa a `lit` (e continua em `seenTiles`).
- Memoria persiste: ida e volta longa nao remove nenhum indice (conjunto so cresce: tamanho final >= tamanho em qualquer tick anterior).
- Determinismo: a mesma sequencia de comandos rodada duas vezes da conjuntos iguais (mesmos indices).
- Raio respeitado: parado no spawn com a luz ligada, todo tile cujo retangulo esta a distancia > 4 tiles do Enzo nao e visto, e todo o que esta <= 4 e visto. Com a luz apagada (`toggleLight`), em um ponto novo so entram tiles dentro de 1,5 tile.
- Referencia estavel: tick sem novo tile devolve o mesmo `Set` (`toBe`).
- Mapa com colisao: parede dentro do raio tambem fica vista; o Enzo continua bloqueado por ela (regressao leve do card 005).
- `npm run test` inteiro e `npm run build` passam; `tests/architecture.test.ts` continua verde (sim sem Phaser).

**Dados:** `MEMORY.overlayAlpha = 0.6` em `src/data/light.ts`; `RENDER.depth.memory = 1` em `src/data/render.ts`. Nenhum texto novo. Nenhuma dependencia nova.

**Fora do escopo:** guardar memoria entre runs; minimapa/mapa em tela cheia; efeitos de luz com carga baixa; linha de visao/sombras por parede; esconder ou revelar o alvo de treino pela memoria (inimigos/objetos so aparecem como hoje); mudar raio, bateria ou ambiente da luz; gerar mapa procedural; qualquer mudanca em combate, esquiva ou vida.

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Depende do card 005 (mapa com tiles). A bíblia não dá número para o "tom apagado", por isso o critério é relativo (entre o iluminado e o escuro total); o valor exato fica a cargo do dev/arquiteto e pode ser ajustado pelo Guilherme no visual.
- 2026-10-22 | PO | Fora do escopo: guardar a memória entre runs (a mata muda a cada run, seção 4 > Mapa), efeitos de luz com carga baixa e minimapa. Lembrete: este card é de fase 2 e a fase atual é 1; o SM decide quando puxar.

- 2026-10-29 | Arquiteto | Plano pronto, estimativa M. Valor escolhido para o tom apagado (nao existe na biblia): opacidade 0.6 da textura normal sem luz (`MEMORY.overlayAlpha` em src/data/light.ts). Guilherme: corrija no playtest se ficar claro/escuro demais. Card marcado playtest: sim por ser sensacao visual de luz. "Visto" = tile no raio de luz atual (4 tiles ligada, 1,5 apagada), sem linha de visao.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-29 18:42 | SM | backlog -> refinamento (dependências 005, 007, 008 no main; fase 2 = fase atual); resultado pendente.
- 2026-10-29 19:10 | SM | arquiteto aprovou o refinamento (playtest mudou para sim; tom apagado MEMORY.overlayAlpha=0.6 é decisão do arquiteto, Guilherme pode corrigir). Card espera o 009 sair de dev (ambos mexem em types.ts, step.ts e GameScene) para entrar em dev.
