let gameState = 'start';

let pontos = 0;
let vidas = 5;

// Variáveis para elementos do jogo
let abelhaX, abelhaY;
let flores = []; // Array para armazenar várias flores
const NUM_FLORES = 10; // Quantidade de flores no jardim
let moscaX, moscaY;
let mosca2X, mosca2Y;

// Emojis para os elementos do jogo
const EMOJI_ABELHA = '🐝';
const EMOJI_FLOR = '🌸';
const EMOJI_MOSCA = '🪰';

function preload() {
  // Não precisamos carregar imagens com os emojis
}

function setup() {
  createCanvas(800, 600);
  // Posições iniciais para a abelha
  abelhaX = width / 2;
  abelhaY = height / 2;

  // Inicializa as posições das flores
  for (let i = 0; i < NUM_FLORES; i++) {
    flores.push({ x: random(width), y: random(height) });
  }

  novaPosicaoMosca();
}

function draw() {
  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'tutorial') {
    drawTutorialScreen();
  } else if (gameState === 'game') {
    drawGameScreen();
  } else if (gameState === 'info') {
    drawInfoScreen();
  } else if (gameState === 'credits') {
    drawCreditsScreen();
  } else if (gameState === 'gameover') {
    drawGameOverScreen();
  }
}

function keyPressed() {
  if (gameState === 'start') {
    if (key === 't' || key === 'T') {
      gameState = 'tutorial';
    } else if (key === 'j' || key === 'J') { // 'J' de "Jogar"
      gameState = 'game';
      // Resetar pontos e vidas ao iniciar o jogo
      pontos = 0;
      vidas = 5;
      // Reinicializar as posições das flores para um novo jogo
      for (let i = 0; i < NUM_FLORES; i++) {
        flores[i].x = random(width);
        flores[i].y = random(height);
      }
      novaPosicaoMosca();
      novaPosicaoMosca2();
      abelhaX = width / 2; // Posiciona a abelha no centro
      abelhaY = height / 2;
    } else if (key === 'c' || key === 'C') {
      gameState = 'credits';
    }
  } else if (gameState === 'tutorial') {
    if (key === 'v' || key === 'V') { // 'V' de "Voltar"
      gameState = 'start';
    }
  }
}

function drawStartScreen() {
  background(144, 238, 144);
  textAlign(CENTER);
  textSize(48);
  fill(0);
  text("O Resgate das Abelhas", width / 2, height / 4);

  textSize(24);
  text("Pressione 'J' para Jogar", width / 2, height / 2);
  text("Pressione 'T' para Tutorial", width / 2, height / 2 + 50);
  text("Pressione 'C' para Créditos", width / 2, height / 2 + 100);
}

function drawTutorialScreen() {
  background(144, 238, 144);
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("Tutorial", width / 2, height / 4);

  textSize(18);
  textAlign(LEFT);
  text("Use as setas do teclado para mover a abelha.", width / 4, height / 2 - 50);
  text("Colete as flores para ganhar 5 pontos.", width / 4, height / 2);
  text("Cuidado com as moscas forídeo! Elas fazer você perder 1 vida.", width / 4, height / 2 + 50);
  text("Se seus pontos chegarem a 50, você vence!", width / 4, height / 2 + 100);
  text("Se suas vidas chegarem a 0, é game over.", width / 4, height / 2 + 150);
  text("Pressione 'V' para Voltar ao Menu Principal.", width / 4, height / 2 + 200);
}

function drawGameScreen() {
  // Desenha o fundo como um jardim
  background(144, 238, 144);
  
  // Desenha o sol
  fill(253, 184, 19);
  ellipse(width - 100, 100, 150, 150);
  
  // Desenha a grama
  fill(34, 139, 34);
  rect(0, height - 100, width, 100);

  // Configurações para o texto
  textSize(30);
  textAlign(CENTER, CENTER);

  // Desenha a abelha
  text(EMOJI_ABELHA, abelhaX, abelhaY);

  // Desenha as flores e verifica colisão
  for (let i = 0; i < flores.length; i++) {
    text(EMOJI_FLOR, flores[i].x, flores[i].y);
    let dFlor = dist(abelhaX, abelhaY, flores[i].x, flores[i].y);
    if (dFlor < 20) {
      pontos += 5;
      flores[i].x = random(width);
      flores[i].y = random(height);
    }
  }

  // Desenha as moscas
  text(EMOJI_MOSCA, moscaX, moscaY);
  text(EMOJI_MOSCA, mosca2X, mosca2Y);

  // Movimento das moscas para a abelha
  let velocidade = 0.5;
  if (moscaX < abelhaX) moscaX += velocidade;
  if (moscaX > abelhaX) moscaX -= velocidade;
  if (moscaY < abelhaY) moscaY += velocidade;
  if (moscaY > abelhaY) moscaY -= velocidade;

  if (mosca2X < abelhaX) mosca2X += velocidade;
  if (mosca2X > abelhaX) mosca2X -= velocidade;
  if (mosca2Y < abelhaY) mosca2Y += velocidade;
  if (mosca2Y > abelhaY) mosca2Y -= velocidade;

  // Movimento da abelha com setas
  if (keyIsDown(LEFT_ARROW)) {
    abelhaX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    abelhaX += 5;
  }
  if (keyIsDown(UP_ARROW)) {
    abelhaY -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    abelhaY += 5;
  }
  abelhaX = constrain(abelhaX, 0, width);
  abelhaY = constrain(abelhaY, 0, height);

  // Colisão com mosca
  if (dist(abelhaX, abelhaY, moscaX, moscaY) < 20 ||
      dist(abelhaX, abelhaY, mosca2X, mosca2Y) < 20) {
    vidas--;
    novaPosicaoMosca();
    novaPosicaoMosca2();

    if (vidas <= 0) {
      gameState = 'gameover';
    }
  }
  
  // Exibir pontos e vidas
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Pontos: " + pontos, 20, 30);
  text("Vidas: " + vidas, 20, 60);

  if (pontos >= 50) {
    gameState = 'info';
  }
}

function novaPosicaoMosca() {
  moscaX = random(width);
  moscaY = random(height);
}

function novaPosicaoMosca2() {
  mosca2X = random(width);
  mosca2Y = random(height);
}

function drawInfoScreen() {
  background(144, 238, 144);
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("A Importância das Abelhas", width / 2, height / 4);

  let marginX = width * 0.15;
  let textWidthLimit = width - (2 * marginX);
  textSize(18);
  textAlign(LEFT);
  let startY = height / 2 - 80;
  let lineHeight = 25;

  let paragraph1 = "As abelhas são essenciais para o nosso ecossistema! Elas são responsáveis pela polinização de grande parte das plantas, incluindo muitas das culturas que nos alimentam.";
  text(paragraph1, marginX, startY, textWidthLimit, 100);

  let paragraph2 = "Um de seus principais vilões é a mosca forídeo, um parasita que ataca as abelhas, comprometendo a saúde das colmeias e, consequentemente, a polinização.";
  text(paragraph2, marginX, startY + lineHeight * 4, textWidthLimit, 100);

  // Botão para o Cenário Final (Créditos)
  fill(0, 150, 0);
  rect(width / 2 - 100, height - 100, 200, 50);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Cenário Final", width / 2, height - 75);
}

function mousePressed() {
  if (gameState === 'info') {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height - 100 && mouseY < height - 50) {
      gameState = 'credits';
    }
  }
  if (gameState === 'credits') {
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height - 100 && mouseY < height - 50) {
    gameState = 'start';
  }
}
  if (gameState === 'gameover') {
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height - 100 && mouseY < height - 50) {
    gameState = 'start';
  }
}
}

function drawCreditsScreen() {
  background(144, 238, 144);
  textAlign(CENTER);
  textSize(36);
  fill(0);
  text("Créditos", width / 2, height / 4);

  textSize(24);
  text("Agrinho 2025", width / 2, height / 2 - 50);
  text("Aluno: Jose Augusto Simon dos Santos", width / 2, height / 2);
  text("1° série B, Colégio Cívico Militar Presidente Castelo Branco", width / 2, height / 2 + 50);
  text("Componente Curricular: Pensamento Computacional", width / 2, height / 2 + 100);
  
  // Botão "Voltar ao Início"
fill(0, 150, 0);
rect(width / 2 - 100, height - 100, 200, 50);
fill(255);
textSize(20);
text("Voltar ao Início", width / 2, height - 70);
}

function drawGameOverScreen() {
  background(100, 155, 100);
  
  // Desenha o sol
  fill(253, 184, 19);
  ellipse(width - 100, 100, 150, 150);

  // Uma "grama" simples na parte de baixo
  fill(34, 139, 34);
  rect(0, height - 100, width, 100);

  fill(0);
  textAlign(CENTER);
  textSize(32);
  text("Que pena, suas abelhas foram atacadas pelo forídeo!", width / 2, height / 4);
  
  textSize(20);
  text("Contudo, você sabia que as abelhas são essenciais para o nosso ecossistema?", width / 2, height / 2 - 50);
  text("Elas são responsáveis pela polinização de grande parte das plantas,", width / 2, height / 2);
  text("incluindo muitas das culturas que nos alimentam.", width / 2, height / 2 + 50);
  
  // Botão "Voltar ao Início"
fill(0, 150, 0);
rect(width / 2 - 100, height - 100, 200, 50);
fill(255);
textSize(20);
text("Voltar ao Início", width / 2, height - 70);
}