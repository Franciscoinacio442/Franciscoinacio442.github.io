// Procuramos os elementos uma única vez, fora das funções.
const mensagem = document.querySelector("#mensagem");
const textoColorido = document.querySelector("#texto-colorido");
const campoEscrita = document.querySelector("#escrita");
const campoCor = document.querySelector("#cor-fundo");
const resultadoCor = document.querySelector("#resultado-cor");
const contador = document.querySelector("#contador");
let total = 0;
let indiceCor = 0;

const coresEscrita = ["lightblue", "lightyellow", "lightpink"];

// 1. mouseover: o rato entra no texto.
function mostrarMensagem() {
  mensagem.textContent = "Bem-vindo a Setúbal!";
  mensagem.style.backgroundColor = "lightgreen";
}

// 1. mouseout: o rato sai do texto.
function reporMensagem() {
  mensagem.textContent = "Passa o rato sobre este texto.";
  mensagem.style.backgroundColor = "#f0fff4";
}

// 2. click: muda a cor do texto.
function pintarTexto(cor) {
  textoColorido.style.color = cor;
}

// 3. input: alterna a cor do campo quando o conteúdo muda.
function mudarCorCampo() {
  campoEscrita.style.backgroundColor = coresEscrita[indiceCor];
  indiceCor = (indiceCor + 1) % coresEscrita.length;
}

// 4. submit: aplica uma cor ao fundo da página.
function alterarFundo(evento) {
  evento.preventDefault();

  const cor = campoCor.value.trim().toLowerCase();

  // Aceita nomes de cores reconhecidos pelo navegador.
  const nomeValido =
    /^[a-z]+$/.test(cor) &&
    CSS.supports("color", cor) &&
    ![
      "inherit",
      "initial",
      "unset",
      "revert",
      "revertlayer",
      "currentcolor",
      "transparent",
    ].includes(cor);

  if (!nomeValido) {
    resultadoCor.textContent =
      "Cor inválida. Experimenta pink, blue, yellow ou green.";
    return;
  }

  document.body.style.backgroundColor = cor;
  resultadoCor.textContent = "Cor de fundo alterada para " + cor + ".";
}

// 5. click: acrescenta uma unidade ao contador.
function contar() {
  total++;
  contador.textContent = "Contagem: " + total;
}

// 5. dblclick: repõe o contador a zero.
function reiniciarContador() {
  total = 0;
  contador.textContent = "Contagem: " + total;
}


