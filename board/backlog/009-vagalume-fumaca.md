---
id: 009
titulo: Vagalume-fumaça com telegrafia
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
Primeira criatura do jogo: o Vagalume-fumaça, como descrito na seção de criaturas comuns da bíblia. Comportamento simples, ataque com telegrafia (aviso visual antes do golpe) e janela de punição, usando o golpe, a vida e a esquiva dos cards anteriores. Depende dos cards 005, 007 e 008.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero enfrentar o Vagalume-fumaça, uma criatura simples que vaga pela mata e me persegue quando chego perto, para ter o primeiro inimigo de verdade contra o qual usar o golpe, a vida e a esquiva.

## Criterios de aceite
- [ ] O Vagalume-fumaça tem 1 de vida, causa 1 de dano e se move a 2 tiles/s.
- [ ] Enquanto o Enzo está a 3 tiles ou mais de distância, o Vagalume vaga sem rumo (muda de direção sozinho, sem ir direto ao Enzo).
- [ ] Quando o Enzo chega a menos de 3 tiles, o Vagalume passa a perseguir o Enzo a 2 tiles/s; se o Enzo se afasta de novo para 3 tiles ou mais, volta a vagar.
- [ ] Encostar no Vagalume tira 1 de vida do Enzo, que fica 1 s invulnerável (piscando); durante o rolamento da esquiva o Enzo não recebe esse dano.
- [ ] Um golpe do Galho (dano 2) derrota o Vagalume, que se desfaz em fumaça e brasas, sem sangue nem corpo, e some do mapa.
- [ ] O Vagalume não atravessa paredes nem obstáculos do mapa com colisão.

## Referencias na biblia
- 9. Criaturas comuns > tabela (Vagalume-fumaça: vida 1, dano 1, velocidade 2, vaga sem rumo e persegue a menos de 3 tiles)
- 4. Jogabilidade > Combate (dano por contato, invulnerabilidade de 1 s, esquiva)
- 2. Tom e regras de representação (derrotados se desfazem em fumaça e brasas, sem gore)
- 5.2 Arsenal (Galho: dano 2)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | A ideia pedia "ataque com telegrafia e janela de punição". A ficha do Vagalume-fumaça na bíblia (seção 9) só tem dano por contato: não existe ataque forte, aviso nem janela de punição para ele. Como a bíblia manda e proíbe inventar comportamento, esses itens ficaram fora deste card. A telegrafia (0,8 s) e a janela de punição entram nos cards das criaturas que têm ataque forte (ex.: Porco-do-mato). Se o Guilherme quiser um ataque telegrafado para o Vagalume, precisa antes decidir e registrar na bíblia.
- 2026-10-22 | PO | Soltar brasas coletáveis (moeda) depende da progressão de brasas, que não faz parte dos cards 005, 007 e 008; aqui só vale o efeito visual de fumaça e brasas. Depende dos cards 005, 007 e 008.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
