---
id: 007
titulo: Esquiva com invulnerabilidade
coluna: backlog
resultado: aprovado      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: nao
estimativa:
branch:
---

## Ideia
O Enzo ganha a esquiva: um deslocamento rápido na direção do movimento, com janela de invulnerabilidade e tempo de recarga, nos valores da seção de jogabilidade da bíblia. Lógica na simulação pura e testada por simulação. Ainda sem inimigos para testar o desvio; um alvo de teste que causa dano é suficiente.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero esquivar com um rolamento rápido que me deixa invulnerável por instantes, para escapar de golpes e criaturas.

## Criterios de aceite
- [ ] Apertar Espaço enquanto o Enzo se move faz ele rolar na direção em que estava indo, percorrendo 3 tiles em 0,25 s.
- [ ] Durante os 0,25 s do rolamento o Enzo é invulnerável: um alvo de teste que causa dano por contato não tira vida dele se encostar nele nesse período.
- [ ] Fora do rolamento (antes de começar e depois de terminar), o mesmo alvo de teste causa dano normalmente.
- [ ] Depois de uma esquiva, apertar Espaço de novo antes de 0,8 s não faz nova esquiva; com 0,8 s ou mais, a nova esquiva acontece.
- [ ] O comportamento é coberto por testes automáticos de simulação, sem depender da tela (distância, duração, invulnerabilidade e intervalo).

## Referencias na biblia
- 4. Jogabilidade > Combate (Esquiva: rolamento de 3 tiles em 0,25 s, invulnerável, intervalo de 0,8 s)
- 4. Jogabilidade > Controles (Esquiva = Espaço)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo por ainda não valer nesta fase/card: Esquiva dupla (habilidade da árvore), proibição de esquivar em água rasa (Igapó), esquiva perfeita e a invulnerabilidade de 1 s após levar dano. A bíblia não define o que acontece ao apertar Espaço com o Enzo parado, nem se os 0,8 s contam do início ou do fim do rolamento; por isso os critérios cobrem só esquiva em movimento e falam em "depois de uma esquiva". Se o Guilherme quiser definir esses casos, vale registrar na bíblia antes. Atenção: o card é fase 2 e a fase atual no documento de fases ainda é 1 (decisão do SM).

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
