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
