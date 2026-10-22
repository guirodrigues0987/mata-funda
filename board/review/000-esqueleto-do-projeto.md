---
id: 000
titulo: Esqueleto do projeto
coluna: review
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: tecnico
executor: claude
playtest: nao
estimativa: P
branch: card/000
---

## Ideia
Criar a base do projeto: Vite + Phaser 3 + TypeScript + Vitest, com a estrutura de pastas da seção 15 da bíblia (src/sim, src/render, src/data, tests). Scripts npm: dev, build, test. Uma cena vazia do Phaser com fundo na cor Noite da paleta, em 1920x1080 escalado. Um teste de exemplo passando.

## Historia
Como time, precisamos de um projeto base com Phaser 3, TypeScript e testes automáticos funcionando, com a lógica separada da renderização, para que os próximos cards construam o jogo em cima de uma estrutura estável.

## Criterios de aceite
- [ ] `npm run dev` abre o jogo no navegador, mostrando uma cena vazia do Phaser com o fundo na cor Noite (`#0b0f0c`).
- [ ] O jogo usa resolução base de 1920x1080 e escala para a janela mantendo a proporção.
- [ ] `npm run build` termina sem erros e gera a versão publicável do jogo.
- [ ] `npm test` roda o Vitest e passa com pelo menos um teste de exemplo, sem abrir o navegador.
- [ ] Existem as pastas `src/sim` (lógica pura, sem Phaser), `src/render`, `src/data` e `tests`, e o código de `src/sim` não importa nada do Phaser.
- [ ] A cor Noite fica em um arquivo de dados em `src/data`, e não fixa no código da cena.

## Referencias na biblia
- 12. Direção de arte > Técnica (resolução base 1920x1080) e Paleta oficial (Noite)
- 15. Regras técnicas para os agentes (separação entre lógica e renderização, valores em `src/data/`)

## Tarefas tecnicas
1. Criar `package.json` (nome `mata-funda`, `"type": "module"`) com scripts `dev` (`vite`), `build` (`tsc --noEmit && vite build`), `test` (`vitest run`, para nao abrir modo watch nem navegador). Dependencias: `phaser` (3.x). DevDependencies: `vite`, `typescript`, `vitest`. Nenhuma outra dependencia. Rodar `npm install` e versionar `package-lock.json`.
2. Criar `tsconfig.json` (target ES2020, module ESNext, moduleResolution Bundler, `strict: true`, `noEmit`, `include: ["src", "tests"]`).
3. Criar `vite.config.ts` com `base: "./"` (build publicavel em qualquer subpasta) e configuracao do Vitest (`test.environment: "node"`, `include: ["tests/**/*.test.ts"]`).
4. Criar `.gitignore` com `node_modules`, `dist`, `.worktrees`, se ainda nao existir.
5. Criar `index.html` na raiz: `<div id="game">`, `<script type="module" src="/src/main.ts">`, body com margem 0 e fundo `#0b0f0c` (so para evitar flash; a cor oficial vem dos dados na cena).
6. Criar `src/data/palette.ts` exportando `PALETTE` (objeto `as const`) com a **paleta oficial completa** da secao 12 (noite, mataEscura, folhagem, folhaClara, broto, terraEscura, terra, madeira, osso, luz, agua, aguaFunda, fogo, brasaClara, perigo, feitico, rosaBoto) em hex string. Comentario no arquivo: `rosaBoto` e exclusivo do Boto.
7. Criar `src/data/render.ts` exportando `RENDER` com `baseWidth: 1920`, `baseHeight: 1080`, `tilePx: 64`. (A bíblia cita `src/data/render.json`; usar `.ts` aqui e permitido, mas se preferir JSON, manter o nome `render` e importar com `resolveJsonModule`. Escolher UM formato para todo `src/data/` e registrar em Notas do dev.)
8. Criar `src/data/sim.ts` exportando `SIM` com `ticksPerSecond: 60`. Apenas o valor; nao implementar o loop agora.
9. Criar `src/sim/index.ts` como ponto de entrada da logica pura, com uma funcao pura minima `hexToNumber(hex: string): number` em `src/sim/color.ts` (converte `"#0b0f0c"` em `0x0b0f0c`), reexportada pelo index. Nada em `src/sim` importa `phaser` nem `src/render`.
10. Criar `src/render/EmptyScene.ts`: classe que estende `Phaser.Scene` (chave `"empty"`), no `create()` chama `this.cameras.main.setBackgroundColor(PALETTE.noite)`. Sem sprites.
11. Criar `src/render/createGame.ts` que monta `Phaser.Game` com `type: Phaser.AUTO`, `parent: "game"`, `width/height` vindos de `RENDER`, `backgroundColor: PALETTE.noite`, `scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }` e a `EmptyScene`.
12. Criar `src/main.ts` que so chama `createGame()`.
13. Criar `tests/color.test.ts` e `tests/architecture.test.ts` (ver Testes).
14. Atualizar `README.md` com 3 linhas: como rodar `npm run dev`, `npm run build`, `npm test`.
15. Conferir manualmente: `npm test` passa, `npm run build` sem erros, `npm run dev` abre a cena com fundo `#0b0f0c` e a tela escala mantendo proporcao ao redimensionar a janela.

### Arquivos
Criar: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore` (se faltar), `index.html`, `src/main.ts`, `src/data/palette.ts`, `src/data/render.ts`, `src/data/sim.ts`, `src/sim/index.ts`, `src/sim/color.ts`, `src/render/createGame.ts`, `src/render/EmptyScene.ts`, `tests/color.test.ts`, `tests/architecture.test.ts`. Alterar: `README.md`.

### Testes
- `tests/color.test.ts`: `hexToNumber("#0b0f0c")` retorna `0x0b0f0c`; `hexToNumber(PALETTE.noite)` retorna `0x0b0f0c`.
- `tests/architecture.test.ts`: le (com `fs`) todos os `.ts` em `src/sim` e verifica que nenhum contem `phaser` nem `render/` em imports. Verifica tambem que `PALETTE.noite === "#0b0f0c"` e que `RENDER.baseWidth/baseHeight` sao 1920/1080.
- Ambos rodam em ambiente node, sem navegador.

### Dados
`src/data/palette.ts` (`PALETTE`), `src/data/render.ts` (`RENDER`), `src/data/sim.ts` (`SIM.ticksPerSecond = 60`). A cena le a cor de `PALETTE.noite`; nenhum hex fixo em `src/render`.

### Fora do escopo
Loop de passo fixo, Enzo, movimento, mapa, luzes dinamicas, nevoa, paralaxe, SVG, audio, save local, seed, menus, CI, deploy. Nao criar outras cenas nem assets. Nao adicionar ESLint/Prettier.

## Notas do dev
- Feito: projeto Vite + Phaser 3 + TS + Vitest, pastas src/sim, src/render, src/data, tests; EmptyScene com fundo PALETTE.noite; FIT 1920x1080; testes de cor e arquitetura; README atualizado.
- Decisoes: dados em `.ts` (formato unico em src/data). Adicionei `@types/node` (devDependency) e `skipLibCheck`/`types: node` no tsconfig para os testes usarem `fs` sob `tsc --noEmit`. vite.config importa de `vitest/config`.
- Fora: nada. Build avisa de chunk > 500kB (Phaser), esperado.
- `npm run test -- --run`: 2 arquivos, 4 testes passando. `npm run build`: sem erros.

## Comentarios
- 2026-10-22 | Arquiteto | Plano pronto, estimativa P, playtest nao. Fora do codigo porque nao ha nada no main ainda (sem src/ nem package.json). Phaser e Vite sao exigidos pela bíblia/card; Vitest idem.
- 2026-10-22 | PO | História escrita. Observação: a bíblia não lista as pastas em detalhe; usei as da Ideia do card (src/sim, src/render, src/data, tests), coerentes com a seção 15.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | refinamento -> dev (arquiteto aprovou); worktree .worktrees/000 criado
- 2026-10-22 14:37 | SM | dev -> review (dev aprovou)
