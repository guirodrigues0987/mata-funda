---
id: 004
titulo: Publicar o jogo no GitHub Pages
coluna: qa
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: tecnico
executor: claude
playtest: nao
estimativa: P
branch: card/004
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
Contexto: `package.json` já tem `npm test` (vitest run) e `npm run build` (tsc --noEmit && vite build, saída em `dist/`). O `vite.config.ts` já usa `base: "./"`, então os assets resolvem em subcaminho (`/mata-funda/`) sem 404. Não precisa mexer no Vite.

1. Criar `.github/workflows/deploy.yml` com gatilho `on: push: branches: [main]` (e `workflow_dispatch` para republicar à mão).
   - `permissions: contents: read, pages: write, id-token: write`.
   - `concurrency: group: pages, cancel-in-progress: false`.
2. Job `test`: `actions/checkout`, `actions/setup-node` (Node 22, `cache: npm`), `npm ci`, `npm test`. Passo com nome próprio "Testes".
3. Job `build` (`needs: test`): checkout, setup-node, `npm ci`, `npm run build` (passo "Build"), `actions/configure-pages`, `actions/upload-pages-artifact` com `path: dist`.
4. Job `deploy` (`needs: build`): `environment: github-pages` (url = `steps.deployment.outputs.page_url`), `actions/deploy-pages` (passo "Publicação"). Como `needs` encadeia os jobs, teste falho impede build e deploy, e o site anterior continua no ar.
5. Atualizar `README.md`: na seção "Stack do jogo" ou "Rodando o jogo", adicionar a linha "Jogo publicado: https://guirodrigues0987.github.io/mata-funda/" e uma nota de que cada push no `main` testa, builda e publica.
6. Verificação manual pelo dev (anotar em `## Notas do dev`): rodar `npm ci && npm test && npm run build && npx vite preview --base /mata-funda/` e conferir que a página abre sem 404 no console. Depois do primeiro push no main, conferir a execução no GitHub (3 jobs verdes) e a URL.

Arquivos: criar `.github/workflows/deploy.yml`; alterar `README.md`.

Testes: não há teste Vitest novo (é infra de CI, sem lógica de jogo). Os testes existentes em `tests/` são o portão do workflow. Validar a sintaxe do YAML localmente (ex.: `python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/deploy.yml'))"`).

Dados: nenhum valor em `src/data/`. Nenhum texto de jogo.

Dependências: nenhuma nova no npm. Só actions oficiais do GitHub (checkout, setup-node, configure-pages, upload-pages-artifact, deploy-pages), necessárias para o Pages.

Pré-requisitos humanos (Guilherme, fora do código): em Settings > Pages do repositório, definir Source = "GitHub Actions"; e o token/chave usado para dar push precisa de permissão para alterar workflows (escopo `workflow`). Sem isso o primeiro deploy falha. O QA deve conferir a URL pública só depois disso.

Fora do escopo: mudar `vite.config.ts`, domínio customizado, preview por PR/branch, cache de build elaborado, lint, matriz de versões do Node, badges, qualquer mudança em `src/`.

## Notas do dev
- Criado `.github/workflows/deploy.yml` (jobs test -> build -> deploy, passos "Testes", "Build", "Publicação", Node 22, gatilho push no main + workflow_dispatch). YAML validado com PyYAML. README ganhou a URL pública e a nota do fluxo.
- Decisão: usei versões v4/v5/v3/v4 das actions oficiais (checkout/setup-node, configure-pages, upload-pages-artifact, deploy-pages).
- Verificação: `dist/index.html` referencia `./assets/index-*.js` (caminho relativo, funciona em /mata-funda/). Não consegui rodar `vite preview` com servidor (comando negado pelo sandbox), então a checagem de 404 no console foi só por inspeção do dist. Conferir a execução no GitHub e a URL após o primeiro push (pré-requisitos do Guilherme: Pages Source = GitHub Actions e escopo `workflow`).
- `npm run test -- --run`: 2 arquivos, 4 testes passando. `npm run build`: ok (só aviso de chunk > 500 kB do Phaser).

## Comentarios
- 2026-10-22 | PO | Depende do card 000 (esqueleto com testes e build). Sem texto de jogo neste card.
- 2026-10-22 | Arquiteto | Bloqueado: depende do card 000 (esqueleto), que ainda não está no `main` (não existem `package.json`, `src/`, `tests/` nem config de build). O plano do workflow depende dos scripts reais de `test` e `build` e do diretório de saída (`dist/`) e do `base` do Vite para evitar 404 em subcaminho do Pages. Replanejar quando o 000 estiver no `main`.
- 2026-10-22 | Arquiteto | Plano aprovado (P). Dependência 000 já no main. Atenção: exige ativar Pages com Source = GitHub Actions e permissão `workflow` no push, ambos do Guilherme.
- 2026-10-22 | Revisor | Passou no checklist: diff só cria deploy.yml e ajusta README, conforme as tarefas; jobs test->build->deploy, passos Testes/Build/Publicação, permissões e concurrency corretos; sem mudanças em src/ ou deps. (opcional) A verificação de 404 só foi por inspeção do dist; o QA deve conferir a URL após Pages Source = GitHub Actions.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
- 2026-10-22 14:32 | SM | arquiteto deixou bloqueado (depende de cards ainda não mergeados); aguarda Guilherme/dependências
- 2026-10-22 14:45 | SM | desbloqueado com autorização do Guilherme: dependência 000 já está no main; resultado -> pendente
- 2026-10-22 14:46 | SM | refinamento -> dev (arquiteto aprovou); worktree .worktrees/004 criado
- 2026-10-22 14:47 | SM | dev -> review (dev aprovou)
- 2026-10-22 14:47 | SM | review -> qa (revisor aprovou)
