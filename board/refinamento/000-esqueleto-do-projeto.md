---
id: 000
titulo: Esqueleto do projeto
coluna: refinamento
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: tecnico
executor: claude
playtest: nao
estimativa:
branch:
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

## Notas do dev

## Comentarios
- 2026-10-22 | PO | História escrita. Observação: a bíblia não lista as pastas em detalhe; usei as da Ideia do card (src/sim, src/render, src/data, tests), coerentes com a seção 15.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
