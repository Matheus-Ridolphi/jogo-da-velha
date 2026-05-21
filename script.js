const celulas = document.querySelectorAll(".celula");
const statusTexto = document.getElementById("status");
const botaoReiniciar = document.getElementById("reiniciar");
const line = document.getElementById("line");
const poderAtivadoJogadorX = document.getElementById("poderAtivadoX");
const poderUsadoJogadorX = document.getElementById("poderUsadoX");
const poderAtivadoJogadorO = document.getElementById("poderAtivadoO");
const poderUsadoJogadorO = document.getElementById("poderUsadoO");
const containerpoderJogadorAtualX = document.getElementById("direita");
const containerpoderJogadorAtualO = document.getElementById("esquerda");

let sorteioJogadorQueComeca = 0;
let poderDeSubstituicaoAtivadoX = false;
let poderDeSubstituicaoUsadoX = false;
let poderDeSubstituicaoAtivadoO = false;
let poderDeSubstituicaoUsadoO = false;
let jogadorAtual = "";
let jogoAtivo = true;
let estadoJogo = ["", "", "", "", "", "", "", "", ""];

definirJogadorInicial();

function definirJogadorInicial() {
  jogadorAtual = sorteio(2) === 1 ? "X" : "O";
  statusTexto.textContent = `Vez do jogador ${jogadorAtual}`;
  aplicarCorJogadorAtual();
}

function aplicarCorJogadorAtual() {
  if (jogadorAtual == "X") {
    document.documentElement.style.setProperty("--cor-jogador-atualX", "green");
    document.documentElement.style.setProperty("--cor-jogador-atualO", "white");

  }
  else {
    document.documentElement.style.setProperty("--cor-jogador-atualX", "white");
    document.documentElement.style.setProperty("--cor-jogador-atualO", "green");
  }
}

function sorteio(intervalo) {
  return (sorteioJogadorQueComeca = Math.floor(Math.random() * intervalo));
}

const combinacoesVitoria = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function alterarTextoPoderJogador() {
  if (jogadorAtual === "X") {
    if (poderDeSubstituicaoAtivadoX === true && poderDeSubstituicaoUsadoX != true) {
      poderAtivadoJogadorX.textContent = "Ativado";
      poderAtivadoJogadorX.classList.remove("poderDesativado");
      poderAtivadoJogadorX.classList.add("poderAtivado");
    }
    else {
      poderAtivadoJogadorX.textContent = "Desativado";
      poderAtivadoJogadorX.classList.add("poderDesativado");
      poderAtivadoJogadorX.classList.remove("poderAtivado");
    }
  }
  else if (jogadorAtual === "O") {
    if (poderDeSubstituicaoAtivadoO === true && poderDeSubstituicaoUsadoO != true) {
      poderAtivadoJogadorO.textContent = "Ativado";
      poderAtivadoJogadorO.classList.remove("poderDesativado");
      poderAtivadoJogadorO.classList.add("poderAtivado");
    }
    else {
      poderAtivadoJogadorO.textContent = "Desativado";
      poderAtivadoJogadorO.classList.add("poderDesativado");
      poderAtivadoJogadorO.classList.remove("poderAtivado");
    }
  }
}

function verificarVitoria() {
  for (let i = 0; i < combinacoesVitoria.length; i++) {
    const [a, b, c] = combinacoesVitoria[i];

    if (
      estadoJogo[a] !== "" &&
      estadoJogo[a] === estadoJogo[b] &&
      estadoJogo[a] === estadoJogo[c]
    ) {
      criarLinhaVitoria([a, b, c]);
      statusTexto.textContent = `Jogador ${estadoJogo[a]} venceu!`;
      statusTexto.classList.add("vitoria");
      jogoAtivo = false;
      return;
    }
  }

  if (!estadoJogo.includes("")) {
    statusTexto.textContent = "Empate!";
    jogoAtivo = false;
    return;
  }

  jogadorAtual = jogadorAtual === "X" ? "O" : "X";
  statusTexto.textContent = `Vez do jogador ${jogadorAtual}`;
  aplicarCorJogadorAtual();
}

function clicarCelula(evento) {
  const celula = evento.target;
  const index = celula.dataset.index;

  if (!jogoAtivo) {
    return;
  }

  if (estadoJogo[index] !== "" && poderDeSubstituicaoAtivadoO === true && poderDeSubstituicaoUsadoO === false) {
    veficiarPossibilidadeTroca(index, celula);
    return;
  } 

  if (estadoJogo[index] !== "" && poderDeSubstituicaoAtivadoX === true && poderDeSubstituicaoUsadoX === false) {
    veficiarPossibilidadeTroca(index, celula);
    return;
  }

  if (estadoJogo[index] !== "") {
    return;
  }

  estadoJogo[index] = jogadorAtual;
  celula.textContent = jogadorAtual;

  verificarVitoria();
}

function reiniciarJogo() {
  statusTexto.classList.remove("vitoria");
  poderDeSubstituicaoAtivadoX = false;
  poderDeSubstituicaoUsadoX = false;
  poderDeSubstituicaoAtivadoO = false;
  poderDeSubstituicaoUsadoO = false;
  jogadorAtual = sorteio(2) === 1 ? "X" : "O";
  jogoAtivo = true;
  estadoJogo = ["", "", "", "", "", "", "", "", ""];

  statusTexto.textContent = `Vez do jogador ${jogadorAtual}`;

  poderAtivadoJogadorX.textContent = "Desativado";
  poderAtivadoJogadorO.textContent = "Desativado";

  celulas.forEach((celula) => {
    celula.textContent = "";
  });

  const linhas = document.querySelectorAll(".win-line");

  linhas.forEach((linha) => {
    linha.style.opacity = "0";
  });

  aplicarCorJogadorAtual();
}

function criarLinhaVitoria(posicoes) {

  const mapaLinhas = {
    "0,1,2": "top",
    "3,4,5": "middle",
    "6,7,8": "bottom",

    "0,3,6": "left",
    "1,4,7": "center",
    "2,5,8": "right",

    "0,4,8": "diag1",
    "2,4,6": "diag2"
  };

  const chave = posicoes.join(",");

  const idLinha = mapaLinhas[chave];

  const linha = document.getElementById(idLinha);

  linha.style.opacity = "1";
}

celulas.forEach((celula) => {
  celula.addEventListener("click", clicarCelula);
});

botaoReiniciar.addEventListener("click", reiniciarJogo);

document.addEventListener("keydown", function(event) {
  if (event.key === "x" || event.key === "X") {
    poderDeSubstituicaoAtivadoX = !poderDeSubstituicaoAtivadoX;
  }
  else if (event.key === "o" || event.key === "O") {
    poderDeSubstituicaoAtivadoO = !poderDeSubstituicaoAtivadoO;
  }

  alterarTextoPoderJogador();
});

function veficiarPossibilidadeTroca(index, celula) {
  if (estadoJogo[index] === jogadorAtual) {
    return;
  }

  if (
    estadoJogo[index] === "X" &&
    jogadorAtual === "O" &&
    poderDeSubstituicaoAtivadoO === true
  ) {
    estadoJogo[index] = "O";
    poderDeSubstituicaoUsadoO = true;
    poderUsadoJogadorO.textContent = "Utilizado";
    poderUsadoJogadorO.classList.remove("poderNaoUsado");
    poderUsadoJogadorO.classList.add("poderUsado");
    poderDeSubstituicaoAtivadoO = false;
    celula.textContent = jogadorAtual;
    poderAtivadoJogadorO.textContent = "Desativado";
    poderAtivadoJogadorO.classList.remove("poderAtivado");
    poderAtivadoJogadorO.classList.add("poderDesativado");
    verificarVitoria();
  }
  else if (
    estadoJogo[index] === "O" &&
    jogadorAtual === "X" &&
    poderDeSubstituicaoAtivadoX === true
  ) {
    estadoJogo[index] = "X";
    poderDeSubstituicaoUsadoX = true;
    poderUsadoJogadorX.textContent = "Utilizado";
    poderUsadoJogadorX.classList.remove("poderNaoUsado");
    poderUsadoJogadorX.classList.add("poderUsado");
    poderDeSubstituicaoAtivadoX = false;
    celula.textContent = jogadorAtual;
    poderAtivadoJogadorX.textContent = "Desativado";
    poderAtivadoJogadorX.classList.remove("poderAtivado");
    poderAtivadoJogadorX.classList.add("poderDesativado");
    verificarVitoria();
  }
}
