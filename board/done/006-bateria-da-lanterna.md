---
id: 006
titulo: Bateria da lanterna
coluna: done
resultado: pendente
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: sim
estimativa: M
branch: card/006
---

## Ideia
A lanterna do celular passa a ter carga: gasta enquanto acesa, a tecla L liga e desliga, e sem carga o raio cai para o valor da bíblia. Um indicador simples da carga na tela. Sem áreas de descanso nem recarga por item ainda, só o gasto e o desligar. Continua o card 003, que deixou isso de fora.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que a lanterna do celular gaste carga enquanto está acesa e que eu possa ligá-la e desligá-la com a tecla L, para que a luz vire um recurso que preciso administrar na mata.

## Criterios de aceite
- [ ] A run começa com a lanterna do celular ligada, com 100% de carga e raio de luz de 4 tiles.
- [ ] Com a luz ligada, a carga vai de 100% a 0% em 150 s (cai de forma contínua); com a luz desligada, a carga não muda.
- [ ] A tecla L liga e desliga a luz. Depois de um aperto de L, outro aperto em menos de 0,5 s é ignorado.
- [ ] Com a luz desligada, ou com a carga em 0%, o raio de visão do Enzo é de 1,5 tile. Com carga em 0%, apertar L não acende a luz.
- [ ] Um indicador sempre visível no canto da tela mostra um ícone de bateria e a porcentagem de carga (número inteiro, de 0% a 100%), atualizada enquanto a carga muda.
- [ ] Testes de simulação cobrem: gasto em 150 s, sem gasto com a luz desligada, intervalo de 0,5 s entre ligar e desligar, e raio de 1,5 tile com a carga zerada.

## Referencias na biblia
- 4. Jogabilidade > Controles (tecla L)
- 4.1 Iluminação e bateria > Como funciona (carga contínua, carga zerada com raio de 1,5 tile)
- 4.1 Iluminação e bateria > Ligar e desligar (tecla L, intervalo de 0,5 s)
- 4.1 Iluminação e bateria > HUD (ícone de bateria com a porcentagem)
- 5.4 Fontes de luz (Lanterna do celular: raio 4 tiles, duração base 150 s)

## Tarefas tecnicas

Estado atual (main): `GameState = { tick, player }`; `Command = { moveX, moveY }`; `step()` em `src/sim/step.ts`; `lightRadiusPx()` em `src/sim/light.ts` le `LIGHT.radiusTiles` (4); `lightView.ts` cria a luz Phaser com raio fixo; `GameScene` le WASD e chama `step`. Nao ha HUD.

Decisoes de projeto (para o dev nao adivinhar):
- Carga guardada em **ticks restantes** (inteiro): `chargeTicks`, inicio = `durationSeconds * ticksPerSecond` = 9000. Evita erro de ponto flutuante: 150 s = exatamente 9000 ticks ligados.
- Porcentagem exibida = `Math.ceil(chargeTicks / maxChargeTicks * 100)` (100 no inicio, so mostra 0 quando a carga e realmente 0).
- "Aperto de L" = **um pulso por aperto** (borda de descida, `Phaser.Input.Keyboard.JustDown`), nao tecla segurada. No sim vira `toggleLight: true` no comando daquele tick.
- Intervalo de 0,5 s = 30 ticks (`toggleCooldownSeconds`). So comeca a contar quando um toggle **teve efeito**; aperto ignorado nao reinicia o intervalo. Aperto com carga 0 nao tem efeito e nao inicia intervalo.
- Ordem dentro do `step`: (1) cooldown decrementa; (2) processa toggle; (3) gasta carga se `lightOn` (apos o toggle, entao ligar e desligar no mesmo tick nao e possivel); (4) se `chargeTicks` chegou a 0, `lightOn = false`.
- Raio efetivo: `lightOn && chargeTicks > 0` -> 4 tiles; senao 1,5 tile. Com a luz desligada o raio 1,5 tile continua valendo (silhueta); na tela a luz Phaser fica com raio de 1,5 tile, nao some.

Passos:
1. **Dados** em `src/data/light.ts` (estender `LIGHT`, sem mudar `radiusTiles`/cores): `durationSeconds: 150`, `offRadiusTiles: 1.5`, `toggleCooldownSeconds: 0.5`. Textos do HUD em `src/data/texts.ts` (novo): formato `"{pct}%"` (ou helper `batteryLabel`) e qualquer rotulo em portugues. Valores visuais do HUD (margem, tamanho do icone, cores da PALETTE) em `src/data/render.ts` sob `RENDER.hud`.
2. **Tipos** em `src/sim/types.ts`: `Command` ganha `readonly toggleLight?: boolean` (opcional, para nao quebrar os testes e chamadas existentes que montam `{moveX, moveY}`); `GameState` ganha `readonly light: { on: boolean; chargeTicks: number; cooldownTicks: number }`.
3. **Sim** em `src/sim/light.ts`: adicionar funcoes puras `createLightState()`, `stepLight(light, toggleLight): LightState`, `lightRadiusTiles(light)`, `currentLightRadiusPx(light)`, `batteryPercent(light)`. **Manter** `lightRadiusPx()` e `isLit()` como estao (tests/light.test.ts depende do 256).
4. **Sim** em `src/sim/step.ts`: `createInitialState()` inclui `light: createLightState()`; `step()` devolve `light: stepLight(state.light, command.toggleLight === true)`. Sem importar Phaser.
5. **Render** em `src/render/readCommand.ts`: `Keys` ganha `toggleLight: boolean` (ja resolvido como "acabou de apertar"); `readCommand` repassa para `Command`. Atualizar `tests/movement.test.ts` onde monta `Keys`.
6. **Render** em `src/render/GameScene.ts`: registrar tecla L (`kb.addKey("L")`); no `update`, ler `JustDown(L)` **uma vez por quadro** e entregar o pulso so ao **primeiro** tick daquele quadro (senao varios ticks no mesmo quadro repetiriam o toggle). Passar o raio atual para a luz.
7. **Render** em `src/render/lightView.ts`: `updateLight` recebe tambem o estado de luz e faz `light.setRadius(currentLightRadiusPx(state.light))`. Quando a luz esta desligada/zerada, manter a luz Phaser com raio de 1,5 tile.
8. **Render** novo `src/render/hudView.ts`: `createBatteryHud(scene)` desenha icone de bateria (Graphics) e um Text com a porcentagem, no canto superior esquerdo, `setScrollFactor(0)`, profundidade acima de tudo, **sem** pipeline de luz (para nao escurecer). `updateBatteryHud(hud, light)` atualiza o texto com `batteryPercent`. Sempre visivel, inclusive com luz desligada ou carga 0. Nao implementar vermelho/piscar.
9. **Testes** (ver abaixo) e rodar `npm run test` e `npm run build`.

Testes (Vitest, `tests/battery.test.ts`, alimentando `run()` com comandos):
- Estado inicial: `light.on === true`, `batteryPercent === 100`, raio efetivo = 4 tiles (256 px).
- Gasto: 9000 ticks com `{0,0}` -> `chargeTicks === 0`, `batteryPercent === 0`, `light.on === false`. Em 4500 ticks -> 50%. Em 1 tick -> ainda 100 (ceil), carga menor que a inicial.
- Sem gasto desligado: aperta L (1 tick), espera 30 ticks para sair do intervalo, roda mais 600 ticks desligada -> `chargeTicks` igual ao valor logo apos o toggle (so o tick do toggle antes dele, se houver, conta; verificar que e constante durante os 600).
- Intervalo: L no tick 0 desliga; L no tick 29 (menos de 0,5 s) e ignorado (continua desligada); L no tick 30 liga. Aperto ignorado nao reinicia o intervalo (L no tick 15 ignorado, L no tick 30 funciona).
- Carga zero: apos esgotar, raio efetivo = 1,5 tile (96 px); aperto de L (depois de esperar o intervalo) nao acende (`on` continua false, raio 96 px).
- Luz desligada com carga: raio efetivo 96 px.
- Determinismo: mesma sequencia de comandos duas vezes -> estado igual.
- `readCommand`: `toggleLight` repassado ao comando; `batteryPercent` arredonda para cima e fica em 0..100.
- Regressao: os testes existentes (movimento, step, light, architecture) continuam passando; `src/sim` sem import de Phaser/render.

Fora do escopo (nao fazer):
- Recarga (area de descanso ou item), luz piscando, icone vermelho com 20% ou menos, fala do Enzo, som/mensagem do celular desligando, furtividade com luz apagada, efeitos de ambiente, habilidades de luz, outras fontes de luz (so o celular), arquivo `luzes.json` completo, escolha da fonte na Fogueira.
- Teclas alternativas de gamepad (direcional para cima).
- Ocultar/escurecer cenario fora do raio alem do que a luz Phaser ja faz; memoria do mapa (card 010).
- Nenhuma dependencia nova.

## Notas do dev
- Feito: dados (LIGHT estendido, TEXTS, RENDER.hud), tipos (toggleLight opcional, LightState), funcoes puras de luz em src/sim/light.ts, step integrado, readCommand com toggleLight, tecla L (JustDown 1x por quadro, pulso so no primeiro tick), raio da luz Phaser dinamico, HUD de bateria (icone + %, canto superior esquerdo, sem pipeline de luz) em src/render/hudView.ts. Testes em tests/battery.test.ts.
- Decisao: o icone tem um preenchimento proporcional a carga (alem do texto); sem vermelho/piscar. Fixture de tests/collision.test.ts ajustado (GameState ganhou campo light).
- Nao verificado no navegador: aparencia do HUD, luz Phaser mudando de raio, tecla L na pratica (playtest).
- npm run test: 64 passaram. npm run build: ok (so aviso de tamanho de chunk).

## Comentarios
- 2026-10-22 | PO | Fora deste card, de propósito (escopo aprovado: só gasto e desligar): recarga em área de descanso e por item, luz piscando e ícone vermelho com 20% ou menos, fala do Enzo com carga baixa, som/mensagem do celular desligando, furtividade com a luz apagada, efeitos de ambiente e habilidades de luz. Cada um precisa de card próprio.

- 2026-10-22 | Arquiteto | Plano pronto, estimativa M. playtest: sim (mexe em luz, sensação de jogo; PO tinha deixado nao). Decisões fixadas: carga em ticks inteiros (9000), % com ceil, L como pulso por aperto, intervalo de 30 ticks só conta após toggle efetivo, comando toggleLight opcional para não quebrar testes atuais.

- 2026-10-29 | Revisor | Aprovado: passou em todo o checklist (escopo, bíblia, separação sim/render, dados, determinismo, testes 64 ok, sem dependência nova). (opcional) strokeThickness: 4 em src/render/hudView.ts poderia ir para RENDER.hud.
- 2026-10-29 | QA | resultado: aprovado. npm install, npm run test (9 arquivos, 64 testes) e npm run build ok (so aviso de tamanho de chunk).

| Critério | Evidência | Status |
|---|---|---|
| Começa ligada, 100%, raio 4 tiles | tests/battery.test.ts > "estado inicial: ligada, 100%, raio 4 tiles" | ok |
| 100% a 0% em 150 s; sem gasto desligada | tests/battery.test.ts > "gasta 150 s (9000 ticks) ligada" e "sem gasto com a luz desligada" | ok |
| L liga/desliga; segundo aperto em menos de 0,5 s ignorado | tests/battery.test.ts > "intervalo de 0,5 s entre toques"; GameScene usa JustDown (um pulso por aperto, so no 1o tick do quadro) | ok |
| Raio 1,5 tile desligada ou com carga 0; L nao acende com 0% | tests/battery.test.ts > "carga zerada: raio 1,5 tile e L nao acende" e "luz desligada com carga: raio 96 px" | ok |
| Indicador sempre visivel com icone e % inteiro | codigo: src/render/hudView.ts (icone + texto, scrollFactor 0, sem Light2D) atualizado em GameScene.draw; % em tests/battery.test.ts > "porcentagem fica em 0..100". Aparencia: so no playtest | ok (visual no playtest) |
| Testes de simulacao cobrem os 4 casos | tests/battery.test.ts (gasto, desligada, intervalo, raio zerado) | ok |

Nao foi preciso escrever testes novos de QA.

Roteiro de playtest:
1. Abra o jogo: confira a bateria no canto superior esquerdo mostrando 100% e a luz com raio grande (4 tiles).
2. Fique parado e ande um pouco: a porcentagem deve cair de forma continua, chegando a 0% em cerca de 2 min 30 s.
3. Aperte L: a luz encolhe para um circulo pequeno (1,5 tile) e a porcentagem para de cair. Aperte L de novo: volta o raio grande e o gasto.
4. Aperte L duas vezes bem rapido: o segundo aperto logo em seguida deve ser ignorado (meio segundo de intervalo). Segurar L nao deve ficar alternando.
5. Deixe a carga chegar a 0%: a luz apaga sozinha (raio pequeno), o HUD continua visivel com 0% e L nao acende mais.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
- 2026-10-29 13:14 | SM | refinamento -> dev; worktree .worktrees/006 (branch card/006); resultado pendente. 005 mergeado.
- 2026-10-29 13:20 | SM | dev -> review; resultado pendente.
- 2026-10-29 13:24 | SM | review -> qa; resultado pendente.
- 2026-10-29 13:28 | SM | qa -> playtest (playtest: sim); resultado pendente, aguarda o Guilherme.
- 2026-10-29 13:40 | SM | Guilherme aprovou o playtest ("aprovado 006", no terminal). playtest -> done; resultado pendente para o redator.
