---
id: 002
titulo: Enzo se move livremente
coluna: refinamento
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 1
tipo: feature
executor: claude
playtest: nao
estimativa:
branch:
---

## Ideia
O Enzo aparece como placeholder (cápsula escura com boné colorido, seção 12) e se move em 8 direções com WASD, na velocidade da seção 4 da bíblia (5 tiles/s, 1 tile = 64 px). Movimento na diagonal não pode ser mais rápido que na reta. Valores em arquivo de dados.

## Historia
Como jogador, quero mover o Enzo livremente em 8 direções com WASD, para explorar a mata na velocidade certa, sem que andar na diagonal seja mais rápido.

## Criterios de aceite
- [ ] O Enzo aparece na tela como placeholder: uma cápsula escura com um boné colorido (único detalhe de cor), sem usar o rosa do Boto (`#f29bb5`).
- [ ] Segurando só W, A, S ou D, o Enzo anda para cima, esquerda, baixo ou direita a 5 tiles/s (320 px/s, pois 1 tile = 64 px): em 60 atualizações (1 s) ele percorre 5 tiles.
- [ ] Segurando duas teclas perpendiculares (W+D, W+A, S+D, S+A), o Enzo anda na diagonal e a velocidade total continua 5 tiles/s: em 1 s ele percorre 5 tiles em linha reta na diagonal, não mais que isso.
- [ ] Sem nenhuma tecla pressionada, o Enzo fica parado.
- [ ] A velocidade do Enzo (5 tiles/s) e o tamanho do tile (64 px) vêm de arquivo de dados em `src/data/`, e não estão fixos no código.
- [ ] Um teste automático por simulação alimenta comandos (ex.: "direita por 60 atualizações", "direita+cima por 60 atualizações") e confere a distância percorrida, sem abrir o navegador.

## Referencias na biblia
- 4. Jogabilidade (fixa) > Controles (mover em 8 direções, livre, com WASD)
- 4. Jogabilidade (fixa) > Atributos do Enzo (Velocidade: 5 tiles/s)
- 12. Direção de arte > Técnica (1 tile = 64 px) e Placeholders (Enzo = cápsula com boné colorido)
- 15. Regras técnicas para os agentes (passo fixo de 60 atualizações por segundo, lógica separada da renderização, valores em `src/data/`, testes por simulação)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo deste card (não há regra na bíblia): colisão com cenário, inércia/aceleração, esquiva, Pé leve. A bíblia (seção 15) diz que cards de movimento passam por playtest do Guilherme, mas o card está com `playtest: nao`; o arquiteto deve rever esse campo.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
