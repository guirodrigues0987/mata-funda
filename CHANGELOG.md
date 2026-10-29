# Changelog — Mata Funda

Tudo que muda no jogo, escrito pelo agente Redator a cada card concluído.

## [Não lançado]

### Adicionado
- O projeto ganhou sua base técnica: ao abrir o jogo, aparece uma cena vazia na cor Noite, em 1920x1080, que se ajusta à janela mantendo a proporção. (card 000)
- O jogo agora é publicado automaticamente na internet a cada atualização do projeto, só depois de passar nos testes; se algum teste falhar, a versão anterior continua no ar. O primeiro lançamento depende de o Guilherme ativar o GitHub Pages (Source = GitHub Actions). (card 004)
- O jogo agora roda a 60 atualizações por segundo, sempre no mesmo ritmo, não importa se a tela está lenta ou rápida. Um marcador de teste na cena se move com as setas ou WASD para mostrar isso funcionando. (card 001)
- O Enzo agora aparece como uma cápsula escura com um boné laranja e anda em 8 direções com W, A, S e D, a 5 tiles por segundo. Andar na diagonal não é mais rápido que andar reto. (card 002)
- A mata agora é escura: só um círculo de luz de 4 tiles em volta do Enzo, como a lanterna do celular, deixa ver o que está por perto, e a luz acompanha o Enzo enquanto ele anda. Há formas de teste espalhadas que só aparecem quando entram na luz. A luz é fixa e sempre ligada, e o efeito visual ainda não foi visto no navegador. (card 003)
- A câmera agora acompanha o Enzo, que fica sempre no centro da tela, por um mapa de teste maior que a tela, com corredor, sala, paredes e obstáculos soltos. Paredes e obstáculos aparecem como formas escuras e o Enzo não consegue atravessá-los; na diagonal, ele desliza pela parede. A luz em volta dele continua acompanhando. (card 005)
- A lanterna do celular agora tem bateria: começa com 100% e gasta carga enquanto está acesa, esgotando em 2 min 30 s. A tecla L liga e desliga a luz (com meio segundo de intervalo entre um aperto e outro), e com a luz desligada ou a carga zerada o Enzo enxerga só 1,5 tile à volta. Um indicador de bateria com a porcentagem fica sempre visível no canto da tela. (card 006)
- O Enzo agora pode esquivar com a tecla Espaço enquanto anda: rola 3 tiles em um quarto de segundo, ficando invulnerável durante o rolamento, e só pode esquivar de novo depois de 0,8 s. Espaço com o Enzo parado não faz nada. (card 007)
- O Enzo agora ataca com o Galho: o clique esquerdo dá um golpe corpo a corpo na direção do mouse, com alcance de 1 tile e a cada 0,4 s, que causa 2 de dano. Um alvo de treino mostra a vida (como 4/6), pisca em amarelo e exibe o número do dano quando é acertado, e some ao chegar a zero. O Enzo agora tem 10 de vida, fica 1 s invulnerável piscando depois de levar dano e desmaia ao chegar a zero. (card 008)

### Alterado
- As setas do teclado não movem mais o Enzo; o movimento é só com WASD. (card 002)

### Corrigido
