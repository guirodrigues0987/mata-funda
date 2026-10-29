# Diário de Desenvolvimento — Mata Funda

Um registro de como cada card passou pelo quadro de agentes. Escrito pelo agente Redator e usado como base para os posts sobre o projeto.

---


### 2026-10-22 — Card 000: Esqueleto do projeto
Quem fez: PO → Arquiteto → Dev (Claude) → Revisor → Dev (retrabalho) → Revisor → QA
Retrabalhos: 1 (o Revisor pegou que o projeto tinha instalado o Phaser 4, mas a bíblia pede Phaser 3)
O que mudou no jogo: nasceu a base do Mata Funda, com uma cena vazia na cor Noite em 1920x1080, testes automáticos e a lógica separada da renderização.
Curiosidade: o primeiro card do quadro já foi barrado por causa de um número de versão. Trocar o Phaser 4 pelo 3.90 não exigiu mexer em nenhuma linha de código.


### 2026-10-22 — Card 004: Publicar o jogo no GitHub Pages
Quem fez: PO → Arquiteto (bloqueou uma vez, depois aprovou) → Dev (Claude) → Revisor → QA
Retrabalhos: 0
O que mudou no jogo: a cada push no main, o GitHub roda os testes, gera o build e publica o jogo numa URL pública; se um teste falhar, nada é publicado.
Curiosidade: o Arquiteto primeiro travou o card porque o esqueleto do projeto ainda não estava no main, e só liberou o plano depois. O primeiro deploy ainda depende do Guilherme ativar Pages com Source = GitHub Actions (e de uma credencial com escopo workflow).


### 2026-10-22 — Card 001: Loop de simulação com passo fixo
Quem fez: PO → Arquiteto (bloqueou uma vez, depois aprovou) → Dev (Claude) → Revisor → QA
Retrabalhos: 0
O que mudou no jogo: a simulação agora roda em passo fixo de 60 atualizações por segundo, separada do desenho na tela, e um quadrado de teste se move com as setas ou WASD.
Curiosidade: o Arquiteto avisou do perigo de arredondamento no relógio: 100 ms precisam dar exatamente 6 ticks. O Dev resolveu com uma tolerância minúscula, e 60 quadros de 1000/60 ms fecham em 60 ticks certinhos. Um teto de 10 ticks por quadro evita que o jogo trave ao voltar de uma aba em segundo plano.


### 2026-10-22 — Card 002: Enzo se move livremente
Quem fez: PO → Arquiteto (bloqueou uma vez, depois aprovou) → Dev (Claude) → Revisor → QA → Playtest (Guilherme)
Retrabalhos: 0
O que mudou no jogo: o Enzo ganhou corpo de cápsula escura com boné laranja e anda em 8 direções com WASD a 5 tiles por segundo, sem ficar mais rápido na diagonal.
Curiosidade: o PO tinha marcado o card sem playtest, mas o Arquiteto lembrou que a bíblia manda playtest para todo card de movimento. A velocidade provisória do card 001 (240 px/s) deu lugar aos 320 px/s definitivos, agora lidos de arquivos de dados, e a diagonal foi corrigida com um teste que confere 320 px de distância em vez de ~452.


### 2026-10-22 — Card 003: Escuridão e luz em volta do Enzo
Quem fez: PO → Arquiteto (bloqueou uma vez, depois aprovou) → Dev (Claude) → Revisor → QA
Retrabalhos: 0
O que mudou no jogo: a tela ficou na escuridão e só um círculo de 4 tiles em volta do Enzo, a lanterna do celular, revela o que está por perto, usando as luzes 2D do Phaser.
Curiosidade: o Arquiteto avisou que a luz do Phaser só afeta imagens, não desenhos simples, então as formas de teste viraram texturas geradas por código, e o Enzo continua sem luz, sempre visível. Ponto de honestidade: ninguém viu o efeito rodando no navegador (o ambiente não tem tela). Raio, posição e lógica foram checados por 31 testes e pelo build, mas a intensidade 2 e a borda suave da luz ainda precisam do olho do Guilherme.


### 2026-10-29 — Card 005: Câmera e mapa com colisão
Quem fez: PO → Arquiteto → Dev (Claude) → Revisor → QA → Playtest (Guilherme)
Retrabalhos: 0
O que mudou no jogo: a câmera passou a seguir o Enzo por um mapa fixo de 40x24 tiles, com corredor, sala e obstáculos que ele não atravessa, e a luz do card 003 continua acompanhando.
Curiosidade: o PO marcou o card sem playtest, mas o Arquiteto pediu playtest por mexer em movimento, e o card passou por todo o quadro sem nenhum retrabalho. A colisão ficou na simulação pura, sem Phaser, e o QA testou todos os tiles livres do mapa nas 8 direções. O card esperou uns dias pelo playtest, aprovado pelo Guilherme via Telegram.


### 2026-10-29 — Card 006: Bateria da lanterna
Quem fez: PO → Arquiteto → Dev (Claude) → Revisor → QA → Playtest (Guilherme)
Retrabalhos: 0
O que mudou no jogo: a lanterna do celular agora gasta bateria (150 s de 100% a 0%), liga e desliga com a tecla L, e um indicador no canto da tela mostra a carga.
Curiosidade: o Arquiteto guardou a carga em ticks inteiros (9000) em vez de decimais, assim 150 s fecham exatamente, sem erro de arredondamento. Ele também elevou o card para playtest, e o Guilherme aprovou no terminal.


### 2026-10-29 — Card 007: Esquiva com invulnerabilidade
Quem fez: PO → Arquiteto → Dev (Claude) → Revisor → QA → Playtest (Guilherme)
Retrabalhos: 0
O que mudou no jogo: o Enzo ganhou a esquiva: com Espaço ele rola 3 tiles em 0,25 s, sem levar dano durante o rolamento, e precisa esperar 0,8 s para rolar de novo.
Curiosidade: a bíblia não dizia o que fazer com Espaço parado nem de quando contar os 0,8 s. O Arquiteto decidiu: parado não faz nada, e a recarga conta do início do rolamento. Como ainda não há inimigos, um alvo de teste que causa dano provou a invulnerabilidade, e o card passou por todo o quadro sem retrabalho.


### 2026-10-29 — Card 008: Golpe com o Galho, vida e dano
Quem fez: PO → Arquiteto → Dev (Claude) → Revisor → QA → Playtest (Guilherme)
Retrabalhos: 3 (1: alvo e arco eram desenhados por baixo do mapa, por ordem de camadas; 2: cliques se perdiam em quadros sem tick de simulação, comum em monitores de 120/144 Hz; 3: o golpe saía mas não dava nenhum sinal de acerto)
O que mudou no jogo: o Enzo ganhou o Galho, com golpe corpo a corpo na direção do mouse (1 tile, 2 de dano, a cada 0,4 s), vida 10 com 1 s de invulnerabilidade e desmaio, e um alvo de treino que pisca, mostra o número do dano e a barra de vida.
Curiosidade: no primeiro playtest o Guilherme não via o alvo nem o golpe: o código funcionava, mas o mapa era desenhado por cima de tudo. Na terceira reprovação ele achou que o golpe era "um arco que precisa encostar no inimigo" e perguntou do projétil, que na bíblia é do Estilingue. Ele decidiu manter o Galho corpo a corpo e só acrescentar feedback visível de acerto, e o card foi aprovado no playtest seguinte.
