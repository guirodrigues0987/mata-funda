---
id: 001
titulo: Loop de simulação com passo fixo
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
A simulação do jogo roda em passo fixo de 60 atualizações por segundo, separada da renderização (seção 15 da bíblia). Uma função pura recebe o estado e os comandos do jogador e devolve o próximo estado. A renderização só desenha o estado. Testes provam que o mesmo conjunto de comandos sempre gera o mesmo resultado.

## Historia
Como time, precisamos de uma simulação que roda em passo fixo de 60 atualizações por segundo, separada da renderização, para que o jogo seja determinístico e testável sem abrir o navegador.

## Criterios de aceite
- [ ] A simulação avança exatamente 60 atualizações (ticks) por segundo de tempo simulado, independente da taxa de quadros da tela (por exemplo, um quadro lento de 100 ms executa 6 ticks e um quadro de ~16,7 ms executa 1 tick).
- [ ] Existe uma função pura que recebe o estado atual e os comandos do jogador e devolve o próximo estado, sem alterar o estado recebido e sem depender de relógio, aleatoriedade global ou navegador.
- [ ] A renderização apenas lê e desenha o estado; nenhuma lógica de jogo roda dentro dela.
- [ ] Teste automático: o mesmo estado inicial com a mesma sequência de comandos (ex.: "anda para a direita por 30 atualizações") executada duas vezes gera estados finais idênticos.
- [ ] Teste automático: a simulação roda em ambiente de teste sem navegador e 60 ticks correspondem a 1 segundo de jogo.
- [ ] Os valores de balanceamento usados (como a taxa de 60 ticks por segundo) ficam em arquivo de dados em `src/data/`, não fixos na lógica.

## Referencias na biblia
- 15. Regras técnicas para os agentes (simulação com passo fixo; lógica separada da renderização; testes por simulação; valores em arquivos de dados)
- 16. Glossário (Atualização/tick: 60 por segundo)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | História pronta. Card técnico, pertence à fase 1 (Sprint 0). Menção a `src/data/` vem da seção 15 da bíblia.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
