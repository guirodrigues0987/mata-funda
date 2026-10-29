---
id: 009
titulo: Vagalume-fumaça com telegrafia
coluna: review
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: M
branch: card/009
---

## Ideia
Primeira criatura do jogo: o Vagalume-fumaça, como descrito na seção de criaturas comuns da bíblia. Comportamento simples, ataque com telegrafia (aviso visual antes do golpe) e janela de punição, usando o golpe, a vida e a esquiva dos cards anteriores. Depende dos cards 005, 007 e 008.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero enfrentar o Vagalume-fumaça, uma criatura simples que vaga pela mata e me persegue quando chego perto, para ter o primeiro inimigo de verdade contra o qual usar o golpe, a vida e a esquiva.

## Criterios de aceite
- [ ] O Vagalume-fumaça tem 1 de vida, causa 1 de dano e se move a 2 tiles/s.
- [ ] Enquanto o Enzo está a 3 tiles ou mais de distância, o Vagalume vaga sem rumo (muda de direção sozinho, sem ir direto ao Enzo).
- [ ] Quando o Enzo chega a menos de 3 tiles, o Vagalume passa a perseguir o Enzo a 2 tiles/s; se o Enzo se afasta de novo para 3 tiles ou mais, volta a vagar.
- [ ] Encostar no Vagalume tira 1 de vida do Enzo, que fica 1 s invulnerável (piscando); durante o rolamento da esquiva o Enzo não recebe esse dano.
- [ ] Um golpe do Galho (dano 2) derrota o Vagalume, que se desfaz em fumaça e brasas, sem sangue nem corpo, e some do mapa.
- [ ] O Vagalume não atravessa paredes nem obstáculos do mapa com colisão.

## Referencias na biblia
- 9. Criaturas comuns > tabela (Vagalume-fumaça: vida 1, dano 1, velocidade 2, vaga sem rumo e persegue a menos de 3 tiles)
- 4. Jogabilidade > Combate (dano por contato, invulnerabilidade de 1 s, esquiva)
- 2. Tom e regras de representação (derrotados se desfazem em fumaça e brasas, sem gore)
- 5.2 Arsenal (Galho: dano 2)

## Tarefas tecnicas
Base no main: `step()` em `src/sim/step.ts` (move Enzo, depois `trySwing`), `damagePlayer` em `src/sim/combat.ts` (ja respeita esquiva, 1 s de invulnerabilidade e desmaio), `moveWithCollision` em `src/sim/collision.ts`, `hitFeedbackView` em `src/render/hitFeedback.ts`, `Dummy` e `dummies` em `GameState`. Sem dependencia nova. Playtest passa a `sim` (criatura e sensacao de combate; o cabecalho dizia `nao`).

1. **Dados** em `src/data/creatures.ts` (novo): `VAGALUME = { hp: 1, damage: 1, speedTilesPerSecond: 2, chaseRadiusTiles: 3, halfSizeTiles: 0.25, contactRadiusTiles: 0.5, wanderTurnSeconds: 1.5 }`. Os cinco primeiros vem da biblia (secao 9); `halfSizeTiles`, `contactRadiusTiles` e `wanderTurnSeconds` sao valores de teste (marcar com comentario, como o `TRAINING_DUMMY`). `VAGALUME_SPAWNS`: lista de `{ col, row }` absolutos no `TEST_MAP` (ex.: 3 pontos na sala grande, longe do spawn do Enzo). Em `src/data/combat.ts` adicionar em `COMBAT_VIEW` as cores/tempos da fumaca e brasas (`smokeColor`, `emberColor`, `deathFxSeconds`, `deathFxParticles`, `deathFxRadiusPx`) e `creatureColor`/`creatureSizePx`.
2. **RNG com seed** em `src/sim/rng.ts` (novo, puro): `nextRandom(seed: number): { value: number; seed: number }` (mulberry32 ou similar, determinístico). Em `src/data/sim.ts` adicionar `defaultSeed`.
3. **Tipos** em `src/sim/types.ts`: `Creature = { id: string; kind: "vagalume"; x; y; hp; dirX; dirY; turnTicksLeft; mode: "wander" | "chase" }`. `GameState` ganha `creatures: readonly Creature[]`, `rngSeed: number` e `lastDeath: { tick; x; y } | null` (so para o render desenhar fumaca/brasas; nenhuma regra le).
4. **Estado inicial**: `createInitialState(map = TEST_MAP, seed = SIM.defaultSeed)` cria os vagalumes a partir de `VAGALUME_SPAWNS` (id `vagalume-0`, ...), com direcao inicial sorteada pelo RNG. Manter o alvo de treino como esta.
5. **Comportamento** em `src/sim/creatures.ts` (novo, puro): `stepCreatures(state, map): GameState`.
   - Distancia ao Enzo < `chaseRadiusTiles * tilePx` (estritamente menor): `mode = "chase"`, direcao normalizada rumo ao Enzo. Distancia >= 3 tiles: `mode = "wander"`.
   - Em `wander`: decrementa `turnTicksLeft`; ao zerar, sorteia nova direcao (angulo via RNG, atualiza `rngSeed`) e reinicia o contador. Ao bater em parede (movimento bloqueado nos dois eixos) tambem sorteia nova direcao.
   - Velocidade `speedTilesPerSecond * tilePx / ticksPerSecond` nos dois modos; movimento por `moveWithCollision` com a meia-caixa do Vagalume (nao atravessa parede nem obstaculo).
   - Exportar em `src/sim/index.ts`.
6. **Dano por contato** em `src/sim/creatures.ts`: `touchCreatures(state)`: se `hypot(Enzo - criatura) <= contactRadiusTiles * tilePx`, chama `damagePlayer(state, VAGALUME.damage)` (reaproveita invulnerabilidade de 1 s, esquiva e desmaio; nao duplicar a regra). No maximo um dano por tick.
7. **Golpe**: em `trySwing` (`src/sim/combat.ts`) aplicar o mesmo `inSwing` tambem a `state.creatures` (dano `WEAPONS.galho.damage`), remover as com `hp <= 0` e gravar `lastDeath` com a posicao; `lastHit` continua valendo para criatura (targetId = id da criatura, damage = dano do golpe). Se acertar dummy e criatura no mesmo golpe, `lastHit` fica com o primeiro encontrado (dummies primeiro) - sem mudar o que o card 008 testa.
8. **Ordem em `step()`**: mover Enzo, `trySwing`, `stepCreatures`, `touchCreatures`. Assim quem morre no golpe nao causa dano no mesmo tick.
9. **Render** (so desenha o estado): `src/render/hitFeedback.ts`: `flashTargetId` tambem considera `st.creatures`; nao colocar barra de vida para criatura (vida 1). `GameScene.drawCombat`: desenhar cada criatura como retangulo/circulo (`creatureColor`), e, enquanto `tick - lastDeath.tick <= deathFxSeconds`, particulas de fumaca (cinza) e brasas (laranja) subindo a partir de `lastDeath`, sem sangue nem corpo. Nenhum numero de balanceamento fixo no codigo.
10. **Tecla de debug K** (card 008) continua como esta; nao mexer.

### Testes (Vitest, `tests/creatures.test.ts`; usar `tests/freeMap.ts` quando precisar de espaco livre)
- Dados: vida 1, dano 1, velocidade 2 e raio 3 batem com a biblia (le de `VAGALUME`).
- Vagar: Enzo a 5 tiles, 300 ticks sem mexer: criatura nunca entra em `chase`, muda de direcao pelo menos 2 vezes e a distancia a Enzo nao diminui em linha reta (nao vai direto a ele).
- Determinismo: mesma seed e mesmos comandos dao estado identico; seeds diferentes dao trajetos diferentes.
- Perseguir: Enzo a 2,9 tiles: modo `chase`; apos 30 ticks a distancia caiu ~1 tile (2 tiles/s, tolerancia pequena) e a direcao aponta para o Enzo.
- Limite do raio: a exatamente 3 tiles continua `wander`; a 2,99 tiles vira `chase`; afastar o Enzo para >= 3 tiles volta a `wander`.
- Velocidade: em `wander` livre, deslocamento em 60 ticks = 2 tiles (tolerancia).
- Contato: criatura encostando tira 1 de vida e `invulnerableTicks` = 60; segundo contato nos 60 ticks seguintes nao tira vida; apos 60 ticks tira de novo.
- Esquiva: Enzo rolando com criatura em cima nao perde vida.
- Golpe: Enzo mirando no Vagalume dentro do alcance/arco: criatura some de `creatures`, `lastDeath` preenchido, `lastHit.damage` = 2. Fora do alcance ou do arco: nada acontece.
- Mesmo tick: golpe que mata a criatura encostada no Enzo nao causa dano a ele.
- Colisao: criatura perseguindo com parede entre ela e Enzo (usar `TEST_MAP` ou mapa pequeno inline) nunca tem a caixa dentro de tile `#` em 600 ticks; wander perto de parede tambem.
- `hitFeedbackView`: acerto em criatura devolve `flashTargetId` com o id dela.
- Os testes existentes (008, 007, 005, architecture) continuam passando; `architecture.test.ts` garante que `src/sim` nao importa phaser/render.

### Fora do escopo
- Telegrafia, ataque forte, aviso vermelho e janela de punicao (nao existem para o Vagalume na biblia; ver comentario do PO).
- Soltar brasas coletaveis, contador de brasas ou qualquer progressao.
- Outras criaturas, spawn procedural, geracao de mapa por seed, deteccao de linha de visao (a perseguicao so usa distancia).
- Arma secundaria, mudar o Galho, mudar vida do Enzo, audio.
- Pathfinding: se a parede bloquear, o Vagalume apenas desliza/para; nao contornar.
- Alterar a tecla K, o alvo de treino ou o HUD alem do necessario.

## Notas do dev
- Feito conforme as tarefas: `src/data/creatures.ts`, `src/sim/rng.ts` (mulberry32), `src/sim/creatures.ts` (stepCreatures, touchCreatures), tipos/estado inicial com seed, golpe atinge criaturas (`lastDeath`), ordem do `step()` = Enzo, golpe, criaturas, contato. Render: circulo amarelo, fumaca cinza e brasas laranja subindo por 0,8 s, no mesmo grafico de combate (depth acima do mapa).
- Decisoes: spawns em tile bloqueado do mapa dado sao ignorados (assim mapas de teste como FREE_MAP nao ganham criaturas fora do lugar). Ao voltar de chase para wander, sorteia rumo novo na hora. Criatura morta some no mesmo tick, entao o flash de acerto so aparece se ela sobreviver (teste usa hp 5); a morte e mostrada pela fumaca.
- Fora: telegrafia/ataque forte (fora do escopo), brasas coletaveis, pathfinding.
- `npm run test -- --run`: 138 passaram. `npm run build`: ok. Commit 551dff1 em card/009.
- Verificado so por codigo/testes (nao visto no jogo): aparencia e depth da criatura e da fumaca/brasas, sensacao de velocidade e dos valores de teste (raio de contato, intervalo de vagar), vagar nos 3 spawns do TEST_MAP.

## Comentarios
- 2026-10-22 | PO | A ideia pedia "ataque com telegrafia e janela de punição". A ficha do Vagalume-fumaça na bíblia (seção 9) só tem dano por contato: não existe ataque forte, aviso nem janela de punição para ele. Como a bíblia manda e proíbe inventar comportamento, esses itens ficaram fora deste card. A telegrafia (0,8 s) e a janela de punição entram nos cards das criaturas que têm ataque forte (ex.: Porco-do-mato). Se o Guilherme quiser um ataque telegrafado para o Vagalume, precisa antes decidir e registrar na bíblia.
- 2026-10-22 | PO | Soltar brasas coletáveis (moeda) depende da progressão de brasas, que não faz parte dos cards 005, 007 e 008; aqui só vale o efeito visual de fumaça e brasas. Depende dos cards 005, 007 e 008.
- 2026-10-29 | Arquiteto | Plano pronto, estimativa M. Playtest alterado para `sim` (criatura/combate). Valores nao vindos da biblia (intervalo de mudanca de direcao do vagar, raio de contato, tamanho) ficam em `src/data/creatures.ts` como valores de teste para o Guilherme ajustar no playtest.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-29 18:42 | SM | backlog -> refinamento (dependências 005, 007, 008 no main; fase 2 = fase atual); resultado pendente.
- 2026-10-29 19:00 | SM | refinamento -> dev; worktree .worktrees/009 (branch card/009); resultado pendente. Arquiteto mudou playtest para sim. Título menciona telegrafia mas o escopo não tem (bíblia sec. 9): ver comentário do arquiteto.
- 2026-10-29 19:20 | SM | dev -> review; resultado pendente.
