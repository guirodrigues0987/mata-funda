---
id: 003
titulo: Escuridão e luz em volta do Enzo
coluna: qa
resultado: pendente     # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: feature
executor: claude
playtest: nao
estimativa: P
branch: card/003
---

## Ideia
A tela é escura e só o raio da lanterna do celular em volta do Enzo é iluminado (4 tiles, seção 4.1 e 12 da bíblia), usando as luzes 2D do Phaser. Sem bateria ainda, só a luz. Um cenário de teste com algumas formas escuras espalhadas para dar pra ver a luz revelando.

## Historia
Como jogador, quero ver só o que está dentro do raio da lanterna do celular em volta do Enzo e o resto na escuridão, para sentir que a mata é noite fechada e que luz é recurso.

## Criterios de aceite
- [ ] Tudo fora do raio de luz fica escuro, e o que está dentro do raio é visível.
- [ ] O raio da luz é de 4 tiles (1 tile = 64 px, ou seja, 256 px) em círculo, centrado no Enzo.
- [ ] A luz acompanha o Enzo em tempo real enquanto ele anda, sem atraso perceptível.
- [ ] Existe um cenário de teste com pelo menos 5 formas escuras espalhadas, algumas dentro e outras fora do raio inicial, que ficam visíveis só quando entram no raio da luz e voltam a ficar escuras quando saem.
- [ ] A luz usa o sistema de luzes 2D do Phaser.
- [ ] Nesta história a luz é fixa e sempre ligada: não há carga, bateria, ícone de HUD nem tecla L (ficam para outros cards).

## Referencias na biblia
- 4. Jogabilidade > Visão ("Tudo fora do raio de luz fica escuro")
- 4.1 Iluminação e bateria (raio da fonte de luz)
- 5.4 Fontes de luz (Lanterna do celular: 4 tiles, círculo)
- 4. Jogabilidade > Mapa (1 tile = 64 px)

## Tarefas tecnicas
Estado do main: Enzo e um Graphics em `src/render/playerView.ts`; `state.player.x/y` esta em pixels, relativo ao centro da tela (`GameScene.draw` soma baseWidth/2 e baseHeight/2). Camera fixa, sem scroll. Seguir essa mesma convencao.

1. **Dados** em `src/data/light.ts` (`LIGHT`): `radiusTiles: 4`, `intensity`, `ambientColor` (usar `PALETTE.noite`, quase preto), `color` (`PALETTE.luz`). Raio em px = `radiusTiles * WORLD.tilePx` (256), calculado na funcao pura, nao fixo.
2. **Dados** em `src/data/testScene.ts` (`TEST_SCENE`): lista de pelo menos 6 formas escuras `{ id, x, y, width, height }` em px relativos ao centro (mesma origem do `player`), usando `mataEscura`/`folhagem` da paleta. Pelo menos 2 a menos de 256 px do Enzo no inicio (0,0), pelo menos 3 alem de 256 px (ex.: a ~320, ~450 e ~600 px) para o jogador andar ate elas. Evitar formas colocadas exatamente no limite de 256 px.
3. **Funcao pura** `src/sim/light.ts`: `lightRadiusPx(): number` e `isLit(origin:{x,y}, shape:{x,y,width,height}, radiusPx): boolean` (true se o ponto do retangulo mais proximo da origem esta a distancia <= raio; usar clamp, nao so o centro). Exportar em `src/sim/index.ts`. Sem import de Phaser.
4. **Render** `src/render/lightView.ts`: funcao `createLightRig(scene)` que chama `scene.lights.enable()`, `scene.lights.setAmbientColor(...)` com o ambiente escuro de LIGHT, e `scene.lights.addLight(x, y, radiusPx, color, intensity)`; retorna a luz. Funcao `updateLight(light, player)` que faz `light.setPosition(baseWidth/2 + player.x, baseHeight/2 + player.y)`.
5. **Render** `src/render/testSceneView.ts`: para cada forma de `TEST_SCENE`, gerar textura com `graphics.generateTexture` (ou `scene.textures.createCanvas`), criar `scene.add.image(...)` e chamar `setPipeline("Light2D")`. Importante: Graphics NAO recebe a pipeline Light2D; as formas precisam ser Image/Sprite. Textura de cor clara o bastante (ex.: `folhaClara`/`osso` em tom sobrio) para a luz revelar; fora da luz o ambiente escuro a esconde.
6. **`src/render/GameScene.ts`**: no `create`, criar o rig e as formas (antes do Enzo, para o Enzo ficar por cima); no `draw`, chamar `updateLight` com `this.state.player` (mesma fonte do marcador, mesmo frame, sem atraso). Enzo continua como Graphics sem pipeline, entao fica sempre visivel (coerente com bíblia 12: boné nunca se perde). Nao mexer em `step`/estado.
7. Rodar `npm run test` e `npm run build` (tsc). Conferir manualmente no `npm run dev`: formas distantes aparecem so ao chegar a ~4 tiles e somem ao se afastar; luz acompanha sem atraso.

**Testes (Vitest, `tests/light.test.ts`)**
- `lightRadiusPx()` retorna 256 com os dados atuais (4 * 64).
- `isLit`: forma em (200,0) 20x20 com origem (0,0) e raio 256 -> true; forma em (400,0) -> false.
- `isLit` no limite: retangulo cujo canto mais proximo esta a exatamente 256 -> true; a 257 -> false.
- Diagonal: definir x,y como CENTRO da forma. Forma 10x10 centrada em (170,170) (canto mais proximo ~ (165,165), dist ~233) -> true; centrada em (200,200) (canto mais proximo ~ (195,195), dist ~276) -> false.
- Simulacao: usar `run(createInitialState(), 60 comandos moveX:1)` (Enzo anda 300 px); a forma antes fora do raio (ex. em x=450) passa a `isLit` true com a nova posicao, e uma forma em x=-200 passa a false.
- `TEST_SCENE`: tem >= 5 formas; pelo menos 1 `isLit` e pelo menos 3 nao `isLit` a partir de `PLAYER.startX/startY`.
- Teste de arquitetura existente (`tests/architecture.test.ts`) deve continuar passando (sim sem Phaser).

**Dados**: `src/data/light.ts` (`LIGHT`) e `src/data/testScene.ts` (`TEST_SCENE`), conforme acima. Textos de jogo: nenhum.

**Dependencias**: nenhuma nova (luzes 2D ja vem no Phaser 3.90).

**Fora do escopo**: memoria do mapa (partes ja vistas), bateria/carga, HUD, tecla L, raio reduzido sem carga, iluminar o Enzo, normal maps, colisao com as formas, camera que segue o Enzo, nevoa, particulas, luz de borda, cor por area, mapa real. As formas de teste sao provisorias.

## Notas do dev
- Feito: LIGHT e TEST_SCENE em src/data; sim/light.ts (lightRadiusPx, isLit); render/lightView.ts (Light2D, ambiente noite, luz seguindo o Enzo no draw); render/testSceneView.ts (6 formas como Image com textura gerada e pipeline Light2D); GameScene integrada; tests/light.test.ts.
- Decisao: o Enzo segue como Graphics sem luz (sempre visivel). Em 60 ticks o Enzo anda 320 px (nao 300); testes usam os valores reais. Intensidade da luz = 2 (ajustavel em LIGHT). Nao conferi visualmente no navegador (sem ambiente grafico); a borda e suave por falloff do Phaser.
- Testes: npm run test -- --run: 31 passaram. npm run build: ok (so aviso de tamanho de chunk).

## Comentarios
- 2026-10-22 | PO | Fora do escopo de propósito: memória do mapa (partes já vistas em tom apagado), carga/bateria, HUD, tecla L e raio de 1,5 tile sem carga. Cada um merece card próprio.
- 2026-10-22 | PO | Citei a seção 12 só pelo valor de 64 px por tile, que também aparece na seção 4 (Mapa); a parte final da bíblia não foi lida por limite de leitura, e nenhum critério depende dela.
- 2026-10-22 | Arquiteto | Bloqueado: o main ainda não tem código (sem src/, tests/ nem package.json). Este card depende de 000-esqueleto-do-projeto (Vite + Phaser + Vitest, cena base) e de 002-movimento-do-enzo (posição do Enzo no estado da simulação, que a luz precisa seguir), e 001 (passo fixo) para o estado ser atualizado. Replanejar quando 000 e 002 estiverem no main. Previsão: estimativa P, playtest nao (só render de luz, sem regra de jogo), sem dependência nova (luzes 2D já vêm no Phaser). Pontos para o plano futuro: raio 256 px e cenário de teste em src/data/ (ex. light.json, testScene.json); render em src/render/ usando this.lights.enable() e Light pipeline; teste Vitest só da função pura que decide se uma forma está dentro do raio.
- 2026-10-22 | Arquiteto | Replanejado contra o main (000, 001, 002 presentes). Estimativa P, playtest nao (so visual). Risco: Light2D so afeta Image/Sprite, nao Graphics; por isso as formas de teste sao imagens geradas por textura. A borda da luz do Phaser e suave (falloff); aceitavel neste card.
- 2026-10-22 | Revisor | Aprovado: passou em todo o checklist. Escopo restrito às tarefas, sim/ sem Phaser, valores em src/data, sem aleatoriedade, 31 testes passam e `npm run build` ok. (opcional) Os testes de limite exato usam 256 e 257 via largura 10; vale conferir visualmente no `npm run dev` que a intensidade 2 dá a borda esperada.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
- 2026-10-22 15:39 | SM | desbloqueado (autorização do Guilherme): dependências 000, 001 e 002 estão no main; resultado -> pendente para o arquiteto planejar
- 2026-10-22 15:40 | SM | refinamento -> dev (arquiteto aprovou); worktree .worktrees/003 criado
- 2026-10-22 15:40 | SM | dev -> review (dev aprovou)
- 2026-10-22 15:41 | SM | review -> qa (revisor aprovou)
