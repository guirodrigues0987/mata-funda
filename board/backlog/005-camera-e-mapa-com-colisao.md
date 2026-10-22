---
id: 005
titulo: Câmera que segue o Enzo e mapa com colisão
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
A câmera passa a seguir o Enzo. Um mapa fixo de teste, feito de tiles de 64 px, com paredes e obstáculos que bloqueiam o movimento. A colisão fica na simulação pura (src/sim), determinística, sem Phaser. Sem geração procedural ainda. O cenário de teste da luz (card 003) deve continuar funcionando sobre o mapa. Base de quase tudo que vem depois.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que a câmera acompanhe o Enzo por um mapa com paredes e obstáculos que ele não consegue atravessar, para sentir que estou explorando um lugar de verdade na mata.

## Criterios de aceite
- [ ] Existe um mapa fixo de teste, descrito em arquivo de dados, numa grade de tiles de 64 px, com pelo menos um corredor, uma sala e obstáculos soltos dentro da sala, e com área maior que uma tela de 1920 x 1080.
- [ ] Teste de simulação (sem navegador): Enzo andando contra uma parede por 60 atualizações (1 s) nunca tem sua posição dentro de um tile bloqueado, em nenhuma das 8 direções, incluindo as diagonais.
- [ ] Teste de simulação: em espaço livre, Enzo continua andando a 5 tiles/s (320 px/s), e o mesmo mapa com a mesma sequência de comandos sempre termina na mesma posição (determinístico).
- [ ] A colisão roda toda em funções puras da simulação, sem depender do Phaser, e os tiles bloqueados vêm do dado do mapa (nenhuma parede fixa no código).
- [ ] No jogo, a câmera mantém o Enzo no centro da tela enquanto ele anda, e o mapa se move na tela ao redor dele.
- [ ] No jogo, as paredes e os obstáculos aparecem como formas escuras (silhueta, cores da paleta de Noite e Mata escura), distintas do chão.
- [ ] A escuridão e a luz em volta do Enzo (card 003) continuam funcionando sobre o mapa: o círculo de luz acompanha o Enzo e o resto da tela fica escuro.

## Referencias na biblia
- 4. Jogabilidade > Atributos do Enzo (velocidade 5 tiles/s)
- 4. Jogabilidade > Visão
- 4. Jogabilidade > Mapa (grade de tiles, movimento livre sobre ela, layout fixo em arquivo de dados)
- 12. Direção de arte > Estilo: silhueta e luz, Técnica (1 tile = 64 px) e Paleta oficial
- 15. Regras técnicas para os agentes (simulação com passo fixo de 60 atualizações por segundo, lógica separada da renderização, valores em src/data)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo (a bíblia não define ou é de outro card): geração procedural, memória do mapa (card 010), inimigos, esquiva. Deslizar ao longo da parede ao andar na diagonal não está especificado na bíblia; o critério só exige que Enzo nunca entre em tile bloqueado, e o arquiteto pode escolher o comportamento mais simples.
- 2026-10-22 | PO | Aviso ao SM: a bíblia (seção 15) pede playtest do Guilherme para card que mexe em movimento; o card está com `playtest: nao`. Decisão do arquiteto/Guilherme.
- 2026-10-22 | PO | Aviso ao SM: este card é da fase 2 e a fase atual no documento de fases ainda é 1.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
