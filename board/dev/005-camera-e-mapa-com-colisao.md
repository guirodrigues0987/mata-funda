---
id: 005
titulo: Câmera que segue o Enzo e mapa com colisão
coluna: dev
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: M
branch: card/005
---

## Ideia
A câmera passa a seguir o Enzo. Um mapa fixo de teste, feito de tiles de 64 px, com paredes e obstáculos que bloqueiam o movimento. A colisão fica na simulação pura (src/sim), determinística, sem Phaser. Sem geração procedural ainda. O cenário de teste da luz (card 003) deve continuar funcionando sobre o mapa. Base de quase tudo que vem depois.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que a câmera acompanhe o Enzo por um mapa com paredes e obstáculos que ele não consegue atravessar, para sentir que estou explorando um lugar de verdade na mata.

## Criterios de aceite
- [ ] Existe um mapa fixo de teste, descrito em arquivo de dados, numa grade de tiles de 64 px, com pelo menos um corredor, uma sala e obstáculos soltos dentro da sala, e com área maior que uma tela de 1920 x 1080.
- [ ] Teste de simulação (sem navegador): Enzo andando contra uma parede por 60 atualizações (1 s) nunca tem sua posição dentro de um tile bloqueado, em nenhuma das 8 direções, incluindo as diagonais.
- [ ] Teste de simulação: em espaço livre, Enzo continua andando a 5 tiles/s (320 px/s), e o mesmo mapa com a mesma sequência de comandos sempre termina na mesma posição (determinístico).
- [ ] A colisão roda toda em funções puras da simulação, sem depender do Phaser, e os tiles bloqueados vêm do dado do mapa (nenhuma parede fixa no código).
- [ ] No jogo, a câmera mantém o Enzo no centro da tela enquanto ele anda, e o mapa se move na tela ao redor dele.
- [ ] No jogo, as paredes e os obstáculos aparecem como formas escuras (silhueta, cores da paleta de Noite e Mata escura), distintas do chão.
- [ ] A escuridão e a luz em volta do Enzo (card 003) continuam funcionando sobre o mapa: o círculo de luz acompanha o Enzo e o resto da tela fica escuro.

## Referencias na biblia
- 4. Jogabilidade > Atributos do Enzo (velocidade 5 tiles/s)
- 4. Jogabilidade > Visão
- 4. Jogabilidade > Mapa (grade de tiles, movimento livre sobre ela, layout fixo em arquivo de dados)
- 12. Direção de arte > Estilo: silhueta e luz, Técnica (1 tile = 64 px) e Paleta oficial
- 15. Regras técnicas para os agentes (simulação com passo fixo de 60 atualizações por segundo, lógica separada da renderização, valores em src/data)

## Tarefas tecnicas
Estado atual do main: o Enzo vive em coordenadas relativas ao centro da tela (start 0,0), `step` move sem colisao, e o cenario do card 003 (`src/data/testScene.ts`) tambem e relativo ao centro. Esta mudanca passa tudo para coordenadas de mundo em px (origem no canto superior esquerdo do mapa). Sem dependencia nova.

1. **Dados do mapa** em `src/data/testMap.ts`: `TEST_MAP = { rows: string[] }`, um tile por caractere (`#` bloqueado, `.` livre), mais `spawn: { col, row }`. Layout fixo: pelo menos 1 corredor (largura 2 tiles), 1 sala e 4+ obstaculos soltos (`#` isolados) dentro da sala, cercado de parede. Tamanho minimo 40 x 24 tiles (2560 x 1536 px, maior que 1920 x 1080). Todas as linhas com o mesmo comprimento.
2. **Dados do jogador**: em `src/data/player.ts` remover `startX/startY` e acrescentar `halfWidthPx` e `halfHeightPx` da caixa de colisao (pe do Enzo, menor que o tile; ex. 0,25 e 0,25 tile, em tiles convertidos por `WORLD.tilePx` na sim). O spawn vem do mapa (centro do tile `spawn`).
3. **Colisao pura** em `src/sim/collision.ts` (exportar em `src/sim/index.ts`): `isTileBlocked(map, col, row)` (fora da grade conta como bloqueado), `boxOverlapsBlocked(map, x, y, halfW, halfH)` e `moveWithCollision(map, pos, dx, dy, halfW, halfH)`. Comportamento mais simples: mover X e Y em eixos separados (tenta X, se colidir cancela X; depois Y). Isso da deslize na parede de graca e garante que nunca entra em tile bloqueado. Para nao atravessar com passo grande, o passo maximo por tick (~5,3 px) e menor que um tile, entao basta testar a posicao final por eixo; encostar exatamente na borda e permitido (usar comparacao estrita com epsilon pequeno vindo de `src/data/sim.ts` se precisar).
4. **Estado e step**: `createInitialState(map = TEST_MAP)` posiciona o Enzo no spawn; `step(state, command)` usa `moveWithCollision`. O mapa e dado constante (nao entra no `GameState`); manter a assinatura `step(state, command)` e `run` para nao quebrar os testes existentes, com parametro opcional de mapa no final para os testes usarem mapas pequenos.
5. **Camera (render)**: em `src/render/GameScene.ts` trocar o offset `baseWidth/2 + player` por coordenadas de mundo direto; `this.cameras.main.startFollow` no marcador do Enzo (ou `centerOn` a cada `draw`, mais simples e sem suavizacao, preferido para ficar fiel a sim) e `setBounds` NAO usar: o Enzo fica sempre no centro, mesmo na borda do mapa. Atualizar `lightView.ts` (`createLightRig`/`updateLight`) para posicionar a luz em coordenadas de mundo.
6. **Desenho do mapa** em `src/render/mapView.ts`: gerar texturas por codigo (como `testSceneView.ts`, Graphics nao recebe Light2D) para chao (Mata escura `#1b2a1f` ou Terra escura, tom proximo do fundo) e para tiles bloqueados (Noite `#0b0f0c` com contorno de Folhagem para ler a forma); usar `Image` com pipeline `Light2D`, uma imagem por tile (ou por bloco), todas as cores de `PALETTE`. Obstaculos e paredes devem ser distinguiveis do chao.
7. **Cenario do card 003**: substituir `createTestScene` por `createMapView`. Remover `src/data/testScene.ts` e `src/render/testSceneView.ts` e adaptar `tests/light.test.ts` (teste de formas acesas): usar os tiles bloqueados do `TEST_MAP` como retangulos (centro/largura/altura) com `isLit` e verificar, a partir do spawn, que ha ao menos 1 acesa e ao menos 3 fora do raio. Manter os demais testes de luz.
8. **Testes** em `tests/collision.test.ts` (Vitest, sem Phaser):
   - Mapa pequeno (5x5 com parede): para cada uma das 8 direcoes, Enzo parte de ao lado da parede e anda 60 ticks contra ela; em todo tick a caixa dele nao sobrepoe tile bloqueado (`boxOverlapsBlocked` falso).
   - Mesmo teste de 60 ticks em cada uma das 8 direcoes no `TEST_MAP` real, a partir do spawn e de um ponto junto a um obstaculo da sala.
   - Espaco livre: 60 ticks para a direita avancam 320 px (+-0,001) e na diagonal a distancia percorrida tambem e 320 px.
   - Determinismo: a mesma sequencia de comandos (ex. 300 ticks variados) duas vezes termina na mesma posicao exata.
   - Consistencia do dado: linhas do mapa com mesmo comprimento, spawn em tile livre, mapa maior que 1920 x 1080, ha ao menos um tile bloqueado isolado (obstaculo) e nenhum tile `#` vem de constante no codigo da sim (teste de arquitetura existente cobre imports).
   - Atualizar `tests/step.test.ts` e `tests/movement.test.ts` se dependerem de `startX/startY` ou de andar sem parede (usar mapa livre grande passado como parametro).
9. Rodar `npm run test` e `npm run build`. Conferir no navegador: o Enzo fica no centro, o mapa se move, o circulo de luz o acompanha e o resto fica escuro.

**Playtest (Guilherme):** andar pelo corredor e pela sala, encostar em paredes e obstaculos, em retas e diagonais; avaliar se o deslize na parede e o tamanho da caixa de colisao dao boa sensacao e se a camera ficou legivel.

**Fora do escopo:** geracao procedural, memoria do mapa (card 010), inimigos, esquiva, paralaxe e neblina, suavizacao ou limites da camera, colisao entre entidades, sprites finais, novas tecnicas de iluminacao alem do que o card 003 ja faz.

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo (a bíblia não define ou é de outro card): geração procedural, memória do mapa (card 010), inimigos, esquiva. Deslizar ao longo da parede ao andar na diagonal não está especificado na bíblia; o critério só exige que Enzo nunca entre em tile bloqueado, e o arquiteto pode escolher o comportamento mais simples.
- 2026-10-22 | PO | Aviso ao SM: a bíblia (seção 15) pede playtest do Guilherme para card que mexe em movimento; o card está com `playtest: nao`. Decisão do arquiteto/Guilherme.
- 2026-10-22 | PO | Aviso ao SM: este card é da fase 2 e a fase atual no documento de fases ainda é 1.

- 2026-10-22 | Arquiteto | Aprovado, estimativa M. playtest: sim (movimento e colisao mexem na sensacao de jogo, biblia secao 15). Fase atual ja e 2. Deslize pela parede escolhido (eixos separados), por ser o mais simples e deterministico.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
- 2026-10-22 16:52 | SM | refinamento -> dev (arquiteto aprovou; playtest: sim); worktree .worktrees/005 criado. 006, 007 e 008 esperam para não conflitarem em step.ts
