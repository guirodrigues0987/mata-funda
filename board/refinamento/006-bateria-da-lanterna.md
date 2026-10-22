---
id: 006
titulo: Bateria da lanterna
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
A lanterna do celular passa a ter carga: gasta enquanto acesa, a tecla L liga e desliga, e sem carga o raio cai para o valor da bíblia. Um indicador simples da carga na tela. Sem áreas de descanso nem recarga por item ainda, só o gasto e o desligar. Continua o card 003, que deixou isso de fora.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que a lanterna do celular gaste carga enquanto está acesa e que eu possa ligá-la e desligá-la com a tecla L, para que a luz vire um recurso que preciso administrar na mata.

## Criterios de aceite
- [ ] A run começa com a lanterna do celular ligada, com 100% de carga e raio de luz de 4 tiles.
- [ ] Com a luz ligada, a carga vai de 100% a 0% em 150 s (cai de forma contínua); com a luz desligada, a carga não muda.
- [ ] A tecla L liga e desliga a luz. Depois de um aperto de L, outro aperto em menos de 0,5 s é ignorado.
- [ ] Com a luz desligada, ou com a carga em 0%, o raio de visão do Enzo é de 1,5 tile. Com carga em 0%, apertar L não acende a luz.
- [ ] Um indicador sempre visível no canto da tela mostra um ícone de bateria e a porcentagem de carga (número inteiro, de 0% a 100%), atualizada enquanto a carga muda.
- [ ] Testes de simulação cobrem: gasto em 150 s, sem gasto com a luz desligada, intervalo de 0,5 s entre ligar e desligar, e raio de 1,5 tile com a carga zerada.

## Referencias na biblia
- 4. Jogabilidade > Controles (tecla L)
- 4.1 Iluminação e bateria > Como funciona (carga contínua, carga zerada com raio de 1,5 tile)
- 4.1 Iluminação e bateria > Ligar e desligar (tecla L, intervalo de 0,5 s)
- 4.1 Iluminação e bateria > HUD (ícone de bateria com a porcentagem)
- 5.4 Fontes de luz (Lanterna do celular: raio 4 tiles, duração base 150 s)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora deste card, de propósito (escopo aprovado: só gasto e desligar): recarga em área de descanso e por item, luz piscando e ícone vermelho com 20% ou menos, fala do Enzo com carga baixa, som/mensagem do celular desligando, furtividade com a luz apagada, efeitos de ambiente e habilidades de luz. Cada um precisa de card próprio.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-22 16:51 | SM | backlog -> refinamento (PO aprovou; Fase atual agora é 2)
