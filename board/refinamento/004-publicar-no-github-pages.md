---
id: 004
titulo: Publicar o jogo no GitHub Pages
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
A cada push no main, um GitHub Actions roda os testes, faz o build e publica o jogo no GitHub Pages. Se os testes falharem, não publica.

## Historia
Como time, precisamos que cada push no main teste, gere o build e publique o jogo no GitHub Pages, para ter o jogo do navegador sempre atualizado numa URL pública.

## Criterios de aceite
- [ ] Todo push no `main` dispara automaticamente uma execução que roda os testes do projeto e depois gera o build do jogo.
- [ ] Se qualquer teste falhar, o build não é publicado e a versão anterior do site continua no ar.
- [ ] Se os testes passarem, o build é publicado no GitHub Pages e o jogo abre e roda no navegador pela URL pública do repositório.
- [ ] A URL pública fica registrada no `README.md` do repositório.
- [ ] A execução mostra no GitHub o resultado (sucesso ou falha) de cada etapa: testes, build e publicação.
- [ ] A página publicada carrega sem erros de arquivo não encontrado (404) no console do navegador.

## Referencias na biblia
- Cabeçalho: Plataforma (navegador, Phaser + TypeScript)
- 15. Regras técnicas para os agentes (lógica separada da renderização, testável sem abrir o navegador)
- Também em `docs/fases-do-projeto.md`: Fase 1, Semana 3 (publicar o jogo no GitHub Pages)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Depende do card 000 (esqueleto com testes e build). Sem texto de jogo neste card.
- 2026-10-22 | Arquiteto | Bloqueado: depende do card 000 (esqueleto), que ainda não está no `main` (não existem `package.json`, `src/`, `tests/` nem config de build). O plano do workflow depende dos scripts reais de `test` e `build` e do diretório de saída (`dist/`) e do `base` do Vite para evitar 404 em subcaminho do Pages. Replanejar quando o 000 estiver no `main`.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
- 2026-10-22 14:45 | SM | desbloqueado com autorização do Guilherme: dependência 000 já está no main; resultado -> pendente
