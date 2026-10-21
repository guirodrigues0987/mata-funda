# Fases do Projeto — Mata Funda

Plano de execução em 4 fases. Estimativas considerando **10 a 15 horas por semana**, com os agentes escrevendo a maior parte do código e o Guilherme como Product Owner humano, playtester e aprovador.

| Fase | Nome | Duração estimada | Resultado |
|---|---|---|---|
| 1 | A Fábrica | 2 a 3 semanas | Agentes construindo o jogo sozinhos, card a card, de forma confiável |
| 2 | MVP Jogável | 2 a 3 meses | Primeira versão pública do jogo, jogável no navegador |
| 3 | História Completa | 4 a 6 meses | O jogo inteiro, do tutorial ao Boitatá |
| 4 | Pós-jogo e Polimento | 2 a 3 meses | Revanche do Boto, Ecos, áudio e acabamento |

> **Fase atual: 1** (o Scrum Master só puxa para refinamento cards com `fase` menor ou igual a este número; o Guilherme atualiza esta linha ao mudar de fase).

**Regra geral:** cada fase só começa quando o critério de pronto da anterior for cumprido. A referência de conteúdo de todas as fases é a `docs/biblia-do-jogo.md`.

---

## Fase 1 — A Fábrica

**Objetivo:** deixar a esteira de agentes funcionando antes de construir o jogo de verdade. Nada de conteúdo do jogo além do mínimo para testar a esteira.

### O que entra

**Semana 1 — Infra e kit**
- Criar o repositório `mata-funda` no GitHub com o kit inicial (Scrum Master, subagentes, quadro, bíblia).
- Montar a VPS seguindo o `setup-vps.md`: usuário `agentes`, Claude Code, Gemini CLI, deploy key, tmux.
- Primeira rodada manual no tmux, só para ver o Scrum Master ler o quadro e responder.

**Semana 2 — Sprint 0 (cards de teste da esteira)**
- Rodar os cards do Sprint 0, que já estão no backlog do kit:
  - 000 — Esqueleto do projeto (Vite + Phaser + TypeScript + Vitest)
  - 001 — Loop de simulação com passo fixo (60 atualizações por segundo)
  - 002 — Enzo se move livremente com WASD
  - 003 — Escuridão e luz em volta do Enzo
  - 004 — Publicar o jogo no GitHub Pages (pode ficar para a semana 3)
- Acompanhar cada card passando por todas as colunas e anotar onde cada agente erra.
- Ajustar os arquivos dos subagentes a cada erro (essa é a parte mais importante da fase).

**Semana 3 — Automação e Gemini**
- Ligar as rodadas automáticas no cron, começando com intervalo de 60 minutos.
- Medir o consumo de cota do Claude Code e do Gemini por rodada.
- Testar o Gemini como executor em um card simples (`executor: gemini`).
- Publicar o jogo no GitHub Pages (mesmo que seja só um quadrado andando no escuro).

### Critério de pronto
- [ ] Os 5 cards do Sprint 0 chegaram no Done sem o Guilherme escrever código.
- [ ] Pelo menos 1 card foi reprovado pelo Revisor ou pelo QA e voltou para Dev sozinho.
- [ ] Rodadas automáticas rodando por 3 dias seguidos sem travar.
- [ ] Consumo de cota medido e intervalo do cron ajustado.
- [ ] Jogo publicado em uma URL pública.

### Riscos
- Agentes que inventam coisas fora da bíblia → endurecer as regras nos subagentes.
- Loop de retrabalho gastando cota → o limite de 3 retrabalhos já está no Scrum Master.
- Permissões demais na VPS → seguir o `settings.json` restrito e ir liberando aos poucos.

---

## Fase 2 — MVP Jogável

**Objetivo:** a primeira versão do jogo que vale a pena mostrar. Um pedaço pequeno, mas completo e com a cara final.

### O que entra
- **Base:** Fogueira com a cabana, Comadre Fulozinha, árvore de habilidades reduzida (Fôlego, Bateria reforçada, Esquiva dupla).
- **Tutorial:** Borda da Mata e a luta do Boto, com a derrota garantida e o empréstimo do chapéu.
- **Áreas:** Capoeira → Toca da Caipora → Mata Fechada com o chefe Mapinguari.
- **Combate:** golpe, esquiva com invulnerabilidade, telegrafia, janela de punição.
- **Armas:** Galho, Facão e Lança (principais); Estilingue e Arco e flecha (secundárias).
- **Luz:** Lanterna do celular e Lamparina, com carga, desligar a luz e recarga nas áreas de descanso.
- **Criaturas:** Vagalume-fumaça, Porco-do-mato assombrado, Chibamba, Curupira.
- **Amuletos:** Chapéu do Boto e Pegada do Mapinguari, com as primeiras falas de lore.
- **Progressão:** brasas, ir embora ou seguir, desmaio com perda de 50%, Saci tirando o Enzo da mata (só as pistas iniciais).
- **Geração procedural** das áreas de mata, com a mata mudando a cada run.
- **Visual:** silhueta e luz com placeholders, névoa e partículas da Capoeira e da Mata Fechada.
- **Saci** aparecendo com o Pipoca nas áreas de mata.

### O que NÃO entra
Igapó em diante, Boitatá, Revanche, mini-chefes, Anhangá, áudio, controle.

### Critério de pronto
- [ ] Dá para jogar do tutorial até derrotar o Mapinguari sem bugs que travem o jogo.
- [ ] Uma run leva entre 15 e 25 minutos.
- [ ] 5 pessoas de fora jogaram e deram feedback.
- [ ] Publicado no GitHub Pages e no itch.io.
- [ ] Vídeo "dia 1 vs hoje" gravado e postado.

---

## Fase 3 — História Completa

**Objetivo:** o jogo inteiro, do tutorial ao final com o Pipoca.

### O que entra
- **Áreas:** Igapó, Grotas e Coração da Mata, com as mecânicas de ambiente (água, vento, chão em brasa).
- **Áreas de descanso:** Clareira da Matinta, Lagoa da Vitória-Régia, Ninho do Uirapuru.
- **Chefes:** Iara, Cuca e Boitatá.
- **Guardiões completos:** Matinta Pereira (mercadora), Naiá (curandeira), Uirapuru (bênção).
- **Boto como alívio cômico** nas áreas de descanso, com conselhos e flertes (dentro das regras da bíblia).
- **Arsenal completo:** Borduna, Machadinhas, Boleadeira, Zarabatana.
- **Luz completa:** Lanterna de mão, Tocha, Pote de vagalumes.
- **Árvore de habilidades completa.**
- **Criaturas restantes:** Mula sem Cabeça, Lobisomem, Corpo-seco, Mão-Pelada, Pé-de-Garrafa, Ipupiara, Batatão, Pisadeira.
- **Amuletos:** Iara, Cuca, Boitatá, com as sequências completas de segredos.
- **Diário da Mata.**
- **Segredo do Saci** revelado aos poucos, até a confissão no final.
- **Final:** Boitatá libertado, mata volta a ter cor, Saci devolve o Pipoca e as brasas.

### Critério de pronto
- [ ] Dá para zerar o jogo.
- [ ] Toda a lore da bíblia está no jogo e aparece na ordem certa.
- [ ] Balanceamento: zerar leva entre 8 e 15 horas para um jogador médio.
- [ ] Nova versão publicada e divulgada.

---

## Fase 4 — Pós-jogo e Polimento

**Objetivo:** dar motivo para continuar jogando depois do final e deixar o jogo com acabamento de lançamento.

### O que entra
- **Revanche do Boto:** cena na cabana, travessia com Ecos, Encontro das Águas, Boto de verdade, Chapéu de Gala.
- **Níveis de Revanche** com modificadores.
- **Interações de amuleto contra o próprio dono** e o contador no Diário.
- **Encontros especiais:** Maria Caninana e Cobra Norato, Bradador, Romãozinho e o amuleto da Pedra.
- **Anhangá** e a Clareira secreta, com o segredo de como a queimada começou.
- **Áudio:** ambiente por área, trilha das áreas de descanso, temas dos chefes, risada do Saci, entrada do Boto.
- **Arte final:** trocar os placeholders pelas silhuetas definitivas.
- **Controle** (gamepad).
- **Balanceamento fino** e correção de bugs.

### Critério de pronto
- [ ] Revanche jogável até o nível 5.
- [ ] Todas as interações de amuleto funcionando.
- [ ] Sem placeholders visíveis.
- [ ] Lançamento "1.0" com trailer.

---

## Em paralelo, em todas as fases

- **Conteúdo:** post semanal mostrando o quadro trabalhando e a evolução do jogo.
- **Plataforma Scrum (trabalhos futuros):** quadro web, bot de Telegram e métricas entram quando a esteira da Fase 1 estiver estável, sem atrasar o jogo.
- **Bíblia viva:** toda decisão nova de design entra na bíblia antes de virar card.
