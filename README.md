# Mata Funda

Um roguelike de ação sobre o folclore brasileiro, **construído por um time de agentes de IA** organizados num quadro Scrum.

Enzo, um menino de São Paulo, entra na Mata Funda atrás do cachorro dele, levado pelo Saci. A floresta foi amaldiçoada por uma queimada, e as criaturas do folclore perderam o juízo.

O jogo é a demonstração. O projeto de verdade é a **esteira**: cada coluna do quadro tem um agente, e os cards andam sozinhos do backlog ao Done.

---

## Como a esteira funciona

```
backlog → refinamento → dev → review → qa → playtest → done
   PO       Arquiteto    Dev   Revisor  QA   Guilherme  Redator
```

- O **Scrum Master** (sessão principal do Claude Code, instruções em `CLAUDE.md`) lê o quadro, move os cards e chama o subagente de cada coluna.
- Os **subagentes** ficam em `.claude/agents/`.
- O **quadro** é a pasta `board/`: cada coluna é uma pasta, cada card é um arquivo `.md` (formato em `board/TEMPLATE.md`).
- Cada card em desenvolvimento ganha um **branch e um worktree próprios** em `.worktrees/<id>`, e só entra no `main` depois de passar por todas as colunas.
- **Playtest** é a única coluna humana: cards que mexem na sensação do jogo esperam o Guilherme jogar e aprovar.

## Documentos

| Arquivo | O que é |
|---|---|
| `docs/biblia-do-jogo.md` | O que o jogo é. Todos os agentes seguem. |
| `docs/fases-do-projeto.md` | As 4 fases do projeto e o que entra em cada uma. |
| `docs/diario-de-desenvolvimento.md` | Como cada card passou pelo quadro. |
| `CHANGELOG.md` | O que mudou no jogo. |
| `CLAUDE.md` | Instruções do Scrum Master. |

## Usando

### Criar um card
Copie `board/TEMPLATE.md` para `board/backlog/<id>-<nome>.md`, preencha `id`, `titulo`, `fase` e a seção `## Ideia`. Pode ser pelo site do GitHub, até pelo celular. O resto os agentes preenchem.

### Rodada manual (na VPS, dentro do tmux)
```bash
cd ~/mata-funda
claude
```
E então: `próxima rodada`.

### Rodada automática
```bash
crontab -e
```
```
0 * * * * flock -n /tmp/mata-funda-rodada.lock /home/agentes/mata-funda/scripts/rodada.sh
```
Log em `logs/rodadas.log`.

### Aprovar um playtest
Jogue seguindo o roteiro que o QA deixou nos comentários do card em `board/playtest/`. Depois mude `resultado:` para `aprovado` ou `reprovado` (com um comentário dizendo o que estava errado) e faça commit. Na próxima rodada o Scrum Master move o card.

### Destravar um card
Cards `bloqueado` aparecem no resumo de cada rodada. Leia os comentários, resolva a dúvida (às vezes é atualizar a bíblia), escreva sua decisão em `## Comentarios` e volte `resultado:` para `pendente`.

## Stack do jogo
Phaser 3 + TypeScript + Vite, testes com Vitest, publicado no GitHub Pages.

## Rodando o jogo
- `npm run dev`: abre o jogo no navegador.
- `npm run build`: gera a versão publicável em `dist/`.
- `npm test`: roda os testes (Vitest).
