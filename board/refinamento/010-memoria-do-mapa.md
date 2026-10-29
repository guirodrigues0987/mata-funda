---
id: 010
titulo: Memória do mapa
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
As partes do mapa que o Enzo já viu continuam visíveis em tom apagado quando saem da luz, como diz a bíblia. Fica de fora a parte nova que aparece só na luz. Continua o card 003 (que deixou isso de fora) e depende do mapa do card 005.

*(Ordem e escopo aprovados pelo Guilherme em 2026-10-22; o SM só copiou a lista aprovada para o card. Detalhes e valores: PO e bíblia.)*

## Historia
Como jogador, quero que as partes do mapa que o Enzo já viu continuem visíveis em tom apagado quando saem do raio da luz, para me orientar na mata sem perder a sensação de escuridão.

## Criterios de aceite
- [ ] Um tile do mapa que já esteve dentro do raio de luz do Enzo (4 tiles com a lanterna do celular) e depois ficou fora dele continua visível, em tom apagado.
- [ ] O tom apagado é visivelmente mais escuro que o tile dentro do raio de luz e visivelmente mais claro que um tile nunca visto.
- [ ] Um tile que o Enzo nunca viu (nunca entrou no raio) continua totalmente escuro, sem nenhuma pista visível.
- [ ] Quando o Enzo volta a um tile já visto e ele entra de novo no raio de luz, o tile aparece com a iluminação normal (não apagada).
- [ ] O que o Enzo viu não é esquecido enquanto a run continua: andar para longe e voltar mantém os tiles vistos em tom apagado.
- [ ] A regra de "o que já foi visto" fica na simulação pura (sem Phaser) e é determinística: a mesma sequência de movimentos produz o mesmo conjunto de tiles vistos, e há teste automático para isso.
- [ ] Funciona sobre o mapa com colisão do card 005, nos tiles de 64 px.

## Referencias na biblia
- 4. Jogabilidade > Visão ("Partes do mapa já vistas ficam visíveis em tom apagado (memória do mapa)")
- 4.1 Iluminação e bateria (raio da fonte de luz)
- 4. Jogabilidade > Mapa (grade de tiles, 1 tile = 64 px)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Depende do card 005 (mapa com tiles). A bíblia não dá número para o "tom apagado", por isso o critério é relativo (entre o iluminado e o escuro total); o valor exato fica a cargo do dev/arquiteto e pode ser ajustado pelo Guilherme no visual.
- 2026-10-22 | PO | Fora do escopo: guardar a memória entre runs (a mata muda a cada run, seção 4 > Mapa), efeitos de luz com carga baixa e minimapa. Lembrete: este card é de fase 2 e a fase atual é 1; o SM decide quando puxar.

## Historico
- 2026-10-22 15:58 | SM | criado no backlog (Fase 2)
- 2026-10-22 15:59 | SM | PO aprovou; card fica no backlog: fase 2 > fase atual 1 (aguarda Guilherme atualizar docs/fases-do-projeto.md)
- 2026-10-29 18:42 | SM | backlog -> refinamento (dependências 005, 007, 008 no main; fase 2 = fase atual); resultado pendente.
