let flores = [];
let colmeias = [];
let abelhas = [];
let pontuacao = 0;
let venceu = false;

let telaInicio = true;
let telaTutorial = false;
let telaFinal = false;

let botaoPlantar, botaoReset, botaoComecar, botaoJogarNovamente, botaoTutorialAvancar;

// --- Constantes do Jogo ---
const PONTOS_PARA_VENCER = 100;
const PONTOS_POR_ABELHA = 25;
const CLIQUES_PARA_LIBERAR = 5;
const CHANCE_DE_COLMEIA = 0.15; // 15%
const LIMITE_DE_PLANTAS = 20;


function setup() {
  createCanvas(600, 400);
  noLoop(); // iniciar parado

  // Botão Começar (tela inicial)
  botaoComecar = createButton('Começar');
  estiloBotaoPrincipal(botaoComecar);
  botaoComecar.position(width / 2 - 60, height / 2 + 40);
  botaoComecar.mousePressed(() => {
    telaInicio = false;
    telaTutorial = true;
    botaoComecar.hide();
    botaoTutorialAvancar.show();
    loop();
  });

  // Botão Avançar Tutorial (escondido no início)
  botaoTutorialAvancar = createButton('Entendi, vamos jogar!');
  estiloBotaoPrincipal(botaoTutorialAvancar);
  botaoTutorialAvancar.position(width / 2 - 110, height - 70);
  botaoTutorialAvancar.mousePressed(() => {
    telaTutorial = false;
    telaFinal = false;
    botaoTutorialAvancar.hide();
    botaoJogarNovamente.hide();
    botaoPlantar.show();
    botaoReset.show();

    // Reset geral do jogo
    resetarJardim(true); // O 'true' indica que é o primeiro início
  });
  botaoTutorialAvancar.hide();

  // Botão Plantar Flor (escondido no início)
  botaoPlantar = createButton('Plantar'); // Nome do botão
  estiloBotaoSecundario(botaoPlantar);
  botaoPlantar.position(10, height + 15);
  botaoPlantar.mousePressed(plantaFlorOuColmeia); // Nome da função
  botaoPlantar.hide();

  // Botão Reiniciar Jardim (escondido no início)
  botaoReset = createButton('Reiniciar Jardim');
  estiloBotaoSecundario(botaoReset);
  botaoReset.position(120, height + 15); // Posição ajustada
  botaoReset.mousePressed(() => resetarJardim(false));
  botaoReset.hide();

  // Botão Jogar Novamente (escondido no início)
  botaoJogarNovamente = createButton('Jogar Novamente');
  estiloBotaoPrincipal(botaoJogarNovamente);
  botaoJogarNovamente.position(width / 2 - 80, height / 2 + 60);
  botaoJogarNovamente.mousePressed(() => {
    resetarJardim(false);
    loop();
  });
  botaoJogarNovamente.hide();
}

// Funções de estilo 
function estiloBotaoPrincipal(botao) {
  botao.style('font-family', 'Poppins, sans-serif');
  botao.style('font-weight', '700');
  botao.style('font-size', '20px');
  botao.style('background-color', '#111827');
  botao.style('color', '#ffffff');
  botao.style('border', 'none');
  botao.style('border-radius', '8px');
  botao.style('padding', '12px 36px');
  botao.style('cursor', 'pointer');
  botao.style('box-shadow', '0 6px 15px rgba(17, 24, 39, 0.25)');
  botao.mouseOver(() => botao.style('background-color', '#374151'));
  botao.mouseOut(() => botao.style('background-color', '#111827'));
}
function estiloBotaoSecundario(botao) {
  botao.style('font-family', 'Poppins, sans-serif');
  botao.style('font-weight', '600');
  botao.style('font-size', '16px');
  botao.style('background-color', '#111827');
  botao.style('color', '#ffffff');
  botao.style('border', 'none');
  botao.style('border-radius', '8px');
  botao.style('padding', '10px 24px');
  botao.style('cursor', 'pointer');
  botao.style('box-shadow', '0 4px 10px rgba(17,24,39,0.25)');
  botao.mouseOver(() => botao.style('background-color', '#374151'));
  botao.mouseOut(() => botao.style('background-color', '#111827'));
}

function draw() {
  if (telaInicio) {
    background(255);
    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(48);
    textStyle(BOLD);
    text('Jardim das Abelhas', width/2, height/2 - 40);

    fill('#6b7280');
    textSize(18);
    textStyle(NORMAL);
    text("Ajude as abelhas a polinizar as flores!\nMas cuidado com as colmeias vazias.", width / 2, height / 2);
    return;
  }

  if (telaTutorial) {
    background(255);
    fill('#111827');
    textAlign(LEFT, TOP);
    textSize(36);
    textStyle(BOLD);
    text('Como Jogar', 30, 30);

    fill('#6b7280');
    textSize(18);
    textStyle(NORMAL);
    // Texto do tutorial para explicar a nova mecânica
    let tutorialText =  
      "• Comece com uma abelha voando pelo jardim.\n" +
      "• Clique em 'Plantar' para adicionar flores ou colmeias.\n" +
      "• A cada 25 pontos, mais abelhas aparecerão para ajudar.\n" +
      "• 15% das vezes, você plantará uma colmeia que prende as abelhas!\n" +
      "  Para libertar as abelhas presas, clique na colmeia 5 vezes.\n" +
      "• Alcance 100 pontos para vencer e salvar o jardim!\n\n"+
      "Divirta-se preservando o mundo das abelhas! 🐝🌸";

    text(tutorialText, 30, 90, width - 60, height - 150);
    return;
  }

  background(180, 220, 180);
  textSize(16);
  fill(0);
  textAlign(LEFT, BASELINE);

  text("Pontuação: " + pontuacao, 10, 20);
  text("Clique em uma colmeia para libertar as abelhas!", 10, 40);

  if (telaFinal) {
    push();
    fill(255, 255, 255, 230);
    rect(0, 0, width, height, 20);
    pop();

    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(48);
    textStyle(BOLD);
    text('Você venceu!', width / 2, height / 2 - 40);

    fill('#6b7280');
    textSize(20);
    textStyle(NORMAL);
    text('Parabéns por polinizar o mundo 🐝🌸', width / 2, height / 2);

    botaoPlantar.hide();
    botaoReset.hide();
    botaoJogarNovamente.show();

    noLoop();
    return;
  } else {
    botaoJogarNovamente.hide();
    botaoPlantar.show();
    botaoReset.show();
  }

  for (let flor of flores) {
    flor.mostrar();
  }

  // Loop para colmeias
  for (let colmeia of colmeias) {
    colmeia.mostrar();
  }

  for (let abelha of abelhas) {
    abelha.verificarAprisionamento(colmeias); // Verifica se a abelha foi presa
    abelha.mover();
    abelha.mostrar();
    abelha.polinizacao(flores);
  }

  // A cada 25 pontos, adiciona uma nova abelha
  let abelhasEsperadas = floor(pontuacao / PONTOS_POR_ABELHA) + 1;
  if (abelhas.length < abelhasEsperadas) {
    abelhas.push(new Abelha(random(width), random(height)));
  }

  if (venceu && !telaFinal) {
    telaFinal = true;
  }
}

function plantaFlorOuColmeia() { // Nome da função
  if (telaInicio || telaFinal || venceu || telaTutorial) return;
  if (flores.length + colmeias.length >= LIMITE_DE_PLANTAS) return;

  if (random() < CHANCE_DE_COLMEIA) {
    // Cria uma Colmeia 
    colmeias.push(new Colmeia(random(50, width - 50), random(100, height - 50)));
  } else {
    flores.push(new Flor(random(50, width - 50), random(100, height - 50)));
  }
}

function mousePressed() {
  if (telaInicio || telaFinal || telaTutorial) return;

  // Lógica para clicar nas colmeias e libertar abelhas
  for (let colmeia of colmeias) {
    if (colmeia.clicado(mouseX, mouseY)) {
      colmeia.receberClique();
      if (colmeia.prontaParaLiberar()) {
        // Liberta todas as abelhas presas nesta colmeia
        for (let abelha of abelhas) {
          if (abelha.presa && abelha.colmeiaOndeEstaPresa === colmeia) {
            abelha.libertar();
          }
        }
        // Reseta a colmeia para poder prender abelhas novamente
        colmeia.resetar();
      }
      break; // Processa apenas um clique de colmeia por vez
    }
  }
}

function resetarJardim(primeiraVez = false) {
  flores = [];
  colmeias = [];
  abelhas = [];
  pontuacao = 0;
  venceu = false;
  telaFinal = false;
  
  if (primeiraVez) {
    telaTutorial = false;
  }

  abelhas.push(new Abelha(random(width), random(height)));
  
  botaoJogarNovamente.hide();
  botaoPlantar.show();
  botaoReset.show();
  if(!primeiraVez) loop();
}

// --- CLASSE FLOR ---
class Flor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.polinizacoes = 0;
    this.estado = 'flor'; 
  }

  mostrar() {
    noStroke();
    if (this.estado === 'flor') {
      fill(255, 100, 150);
      ellipse(this.x, this.y, 30, 30);
    } else {
      fill(255, 200, 0);
      ellipse(this.x, this.y, 35, 35);
    }
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.polinizacoes, this.x, this.y);
  }

  polinizar() {
    if (this.estado === 'flor') {
      this.polinizacoes++;
      pontuacao++;
      if (this.polinizacoes >= 5) {
        this.estado = 'fruto';
      }
      if (pontuacao >= PONTOS_PARA_VENCER) {
        venceu = true;
      }
    }
  }
}

// --- CLASSE COLMEIA  ---
class Colmeia {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.raio = 25;
    this.cliquesParaLiberar = CLIQUES_PARA_LIBERAR;
  }

  mostrar() {
    noStroke();
    // Desenho da colmeia
    fill(218, 165, 32); // Cor de mel/dourado
    ellipse(this.x, this.y, this.raio * 2, this.raio * 2.2);
    fill(0, 0, 0, 150);
    ellipse(this.x, this.y - 5, this.raio * 0.6, this.raio * 0.6);

    // Texto com o número de cliques restantes
    fill(255);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(this.cliquesParaLiberar, this.x, this.y + 2);
  }

  clicado(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.raio;
  }

  receberClique() {
    this.cliquesParaLiberar = max(0, this.cliquesParaLiberar - 1);
  }

  prontaParaLiberar() {
    return this.cliquesParaLiberar === 0;
  }

  resetar() {
    this.cliquesParaLiberar = CLIQUES_PARA_LIBERAR;
  }
}


// --- CLASSE ABELHA  ---
class Abelha {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direcao = p5.Vector.random2D();
    this.velocidade = 2;
    this.presa = false; // NOVO: estado da abelha
    this.colmeiaOndeEstaPresa = null; // NOVO: referência para a colmeia
  }

  // NOVO: Método para verificar se a abelha deve ser presa
  verificarAprisionamento(colmeias) {
    if (this.presa) return; // Se já está presa, não faz nada

    for (let colmeia of colmeias) {
      let d = dist(this.x, this.y, colmeia.x, colmeia.y);
      if (d < colmeia.raio) {
        this.presa = true;
        this.colmeiaOndeEstaPresa = colmeia;
        break;
      }
    }
  }

  // NOVO: Método para libertar a abelha
  libertar() {
    this.presa = false;
    this.colmeiaOndeEstaPresa = null;
    this.direcao = p5.Vector.random2D(); // Sai em uma nova direção
  }

  mover() {
    // ALTERADO: A abelha só se move se não estiver presa
    if (this.presa) {
      // Fica vibrando dentro da colmeia
      this.x = this.colmeiaOndeEstaPresa.x + random(-1, 1);
      this.y = this.colmeiaOndeEstaPresa.y + random(-1, 1);
      return;
    }
    
    this.x += this.direcao.x * this.velocidade;
    this.y += this.direcao.y * this.velocidade;

    if (this.x < 0 || this.x > width) {
      this.direcao.x *= -1;
      this.x = constrain(this.x, 0, width);
    }
    if (this.y < 0 || this.y > height) {
      this.direcao.y *= -1;
      this.y = constrain(this.y, 0, height);
    }
  }

  mostrar() {
    fill(255, 220, 0);
    ellipse(this.x, this.y, 15, 12);
    fill(0);
    ellipse(this.x - 4, this.y, 4, 4);
  }

  polinizacao(flores) {
    // ALTERADO: Só poliniza se não estiver presa
    if (this.presa) return;

    for (let flor of flores) {
      let d = dist(this.x, this.y, flor.x, flor.y);
      if (d < 25 && flor.estado === 'flor') {
        flor.polinizar();
      }
    }
  }
}