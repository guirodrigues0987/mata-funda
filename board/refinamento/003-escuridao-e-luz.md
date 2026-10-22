---
id: 003
titulo: Escuridão e luz em volta do Enzo
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
A tela é escura e só o raio da lanterna do celular em volta do Enzo é iluminado (4 tiles, seção 4.1 e 12 da bíblia), usando as luzes 2D do Phaser. Sem bateria ainda, só a luz. Um cenário de teste com algumas formas escuras espalhadas para dar pra ver a luz revelando.

## Historia
Como jogador, quero ver só o que está dentro do raio da lanterna do celular em volta do Enzo e o resto na escuridão, para sentir que a mata é noite fechada e que luz é recurso.

## Criterios de aceite
- [ ] Tudo fora do raio de luz fica escuro, e o que está dentro do raio é visível.
- [ ] O raio da luz é de 4 tiles (1 tile = 64 px, ou seja, 256 px) em círculo, centrado no Enzo.
- [ ] A luz acompanha o Enzo em tempo real enquanto ele anda, sem atraso perceptível.
- [ ] Existe um cenário de teste com pelo menos 5 formas escuras espalhadas, algumas dentro e outras fora do raio inicial, que ficam visíveis só quando entram no raio da luz e voltam a ficar escuras quando saem.
- [ ] A luz usa o sistema de luzes 2D do Phaser.
- [ ] Nesta história a luz é fixa e sempre ligada: não há carga, bateria, ícone de HUD nem tecla L (ficam para outros cards).

## Referencias na biblia
- 4. Jogabilidade > Visão ("Tudo fora do raio de luz fica escuro")
- 4.1 Iluminação e bateria (raio da fonte de luz)
- 5.4 Fontes de luz (Lanterna do celular: 4 tiles, círculo)
- 4. Jogabilidade > Mapa (1 tile = 64 px)

## Tarefas tecnicas

## Notas do dev

## Comentarios
- 2026-10-22 | PO | Fora do escopo de propósito: memória do mapa (partes já vistas em tom apagado), carga/bateria, HUD, tecla L e raio de 1,5 tile sem carga. Cada um merece card próprio.
- 2026-10-22 | PO | Citei a seção 12 só pelo valor de 64 px por tile, que também aparece na seção 4 (Mapa); a parte final da bíblia não foi lida por limite de leitura, e nenhum critério depende dela.

## Historico
- 2026-10-21 12:00 | SM | criado no backlog (Sprint 0)
- 2026-10-22 14:29 | SM | backlog -> refinamento (PO aprovou)
