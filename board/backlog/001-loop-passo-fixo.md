---
id: 001
titulo: Loop de simulação com passo fixo
coluna: backlog
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

## Criterios de aceite

## Referencias na biblia

## Tarefas tecnicas

## Notas do dev

## Comentarios

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
