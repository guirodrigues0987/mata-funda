---
id: 008
titulo: Golpe com o Galho, vida e dano
coluna: refinamento
resultado: pendente      # pendente | aprovado | reprovado | bloqueado | cancelado | concluido
retrabalho: 0
fase: 2
tipo: feature
executor: claude
playtest: nao
estimativa:
branch:
---

## Ideia
O Enzo ataca com o Galho (arma principal inicial): golpe com alcance, duração e recuperação da bíblia. O Enzo tem vida e pode receber dano; um alvo de treino tem vida e morre ao chegar a zero. Valores em src/data. Sem outras armas e sem criaturas ainda.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero atacar com o Galho na direção do mouse e ter uma vida que diminui quando levo dano, para sentir o combate corpo a corpo e o risco de desmaiar.

## Criterios de aceite
- [ ] Clique esquerdo faz o Enzo golpear com o Galho na direção do mouse; o golpe acerta alvos a até 1 tile de distância, dentro de um arco de 90° voltado para o mouse, e não acerta alvos fora desse alcance ou arco.
- [ ] Cada golpe do Galho causa 2 de dano, e o Enzo só pode golpear de novo 0,4 s depois do golpe anterior (cliques dentro desse intervalo não geram golpe).
- [ ] Existe um alvo de treino parado no mapa com vida definida em `src/data`; cada golpe que o acerta tira 2 de vida dele e, ao chegar a 0, ele é removido do jogo. (O alvo é só ferramenta de teste, não é criatura da bíblia.)
- [ ] O Enzo começa com Vida 10. Ao receber dano, perde essa quantidade de vida e fica 1 s invulnerável (piscando); dano recebido durante esse 1 s é ignorado.
- [ ] Quando a vida do Enzo chega a 0, o jogo registra que ele desmaiou e a vida nunca fica abaixo de 0. (Perda de brasas e volta à Fogueira ficam para outro card.)
- [ ] Os valores do Galho (dano 2, intervalo 0,4 s, alcance 1 tile, arco 90°) e a Vida inicial 10 ficam em `src/data`, e não escritos direto na lógica.
- [ ] Não há outras armas, criaturas, esquiva nem dano por contato de inimigos neste card; para testar o dano ao Enzo basta um meio de teste (ex.: função chamada pelo teste automatizado).

## Referencias na biblia
- 4. Jogabilidade > Controles (atacar com a arma principal: clique esquerdo; mirar: mouse)
- 4. Jogabilidade > Atributos do Enzo (Vida 10)
- 4. Jogabilidade > Combate (dano por contato, 1 s de invulnerabilidade depois de levar dano)
- 5. Progressão > Desmaio (vida a 0 = desmaio)
- 5.2 Arsenal > Armas principais (Galho: dano 2, intervalo 0,4 s, 1 tile, arco 90°)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | A bíblia só define o Galho por "intervalo" de 0,4 s; não há duração de animação nem tempo de recuperação separados, então usei só o intervalo e não inventei outros números. A vida do alvo de treino também não está na bíblia: é valor de teste, escolhido na implementação (sugestão para quem refinar: múltiplo de 2). Obs. para o SM: o card é de fase 2 e a fase atual no documento ainda é 1.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
