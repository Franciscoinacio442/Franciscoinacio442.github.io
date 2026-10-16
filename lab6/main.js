// A. declaração de variáveis

const nodeInputNumero =
  document.querySelector('#colecao input[type="number"]');

const nodeInputSubmit =
  document.querySelector('#colecao input[type="submit"]');

const nodeUlColecao = document.querySelector("#colecao ul");
const nodeTotalColecao = document.querySelector("#colecao h3 span");
const form = document.querySelector("#colecao form");

const nodeUlRepetidos = document.querySelector("#repetidos ul");
const nodeTotalRepetidos = document.querySelector("#repetidos h3 span");

const colecao = [];
const repetidos = [];

const chaveStorage = "lab6-cromos";


// B. event handlers

function ordenarNumeros(a, b) {
  return a - b;
}

function guardaCarta() {
  const valor = nodeInputNumero.value;

  if (valor.trim() === "") {
    return;
  }

  const numero = Number(valor);

  if (!Number.isSafeInteger(numero) || numero < 0) {
    return;
  }

  if (colecao.includes(numero)) {
    repetidos.push(numero);
    repetidos.sort(ordenarNumeros);
  } else {
    colecao.push(numero);
    colecao.sort(ordenarNumeros);
  }

  atualizarPagina();
  guardarDados();

  form.reset();
  nodeInputNumero.focus();
}

function atualizaLista(lista, nodeUl) {
  nodeUl.innerHTML = "";

  lista.forEach(function (numero, indice) {
    const item = document.createElement("li");

    item.innerHTML =
      '<span></span><button type="button">Apagar</button>';

    item.querySelector("span").textContent = numero;

    const botao = item.querySelector("button");

    botao.addEventListener("click", function () {
      lista.splice(indice, 1);

      atualizarPagina();
      guardarDados();
    });

    nodeUl.append(item);
  });
}

function atualizarPagina() {
  atualizaLista(colecao, nodeUlColecao);
  atualizaLista(repetidos, nodeUlRepetidos);

  nodeTotalColecao.textContent = colecao.length;
  nodeTotalRepetidos.textContent = repetidos.length;
}

function eliminarRepetido() {
  const indice = Number(this.dataset.indice);

  repetidos.splice(indice, 1);

  atualizarPagina();
  guardarDados();
}

function guardarDados() {
  const dados = {
    colecao: colecao,
    repetidos: repetidos
  };

  try {
    localStorage.setItem(chaveStorage, JSON.stringify(dados));
  } catch {
    console.warn("Não foi possível guardar os cromos.");
  }
}

function carregarDados() {
  try {
    const textoGuardado = localStorage.getItem(chaveStorage);

    if (textoGuardado === null) {
      return;
    }

    const dados = JSON.parse(textoGuardado);

    if (
      !dados ||
      !Array.isArray(dados.colecao) ||
      !Array.isArray(dados.repetidos)
    ) {
      return;
    }

    dados.colecao.forEach(function (numero) {
      if (
        Number.isSafeInteger(numero) &&
        numero >= 0 &&
        !colecao.includes(numero)
      ) {
        colecao.push(numero);
      }
    });

    dados.repetidos.forEach(function (numero) {
      if (Number.isSafeInteger(numero) && numero >= 0) {
        repetidos.push(numero);
      }
    });

    colecao.sort(ordenarNumeros);
    repetidos.sort(ordenarNumeros);
  } catch {
    console.warn("Não foi possível carregar os cromos.");
  }
}
function resetListas() {
  colecao.length = 0;
  repetidos.length = 0;

  atualizarPagina();
  guardarDados();

  form.reset();
  nodeInputNumero.focus();
}


// C. event listeners

form.onsubmit = function (event) {
  event.preventDefault();
  guardaCarta();
};

function associarEventosEliminar() {
  const botoes = document.querySelectorAll("#repetidos button");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", eliminarRepetido);
  });
}
document
  .querySelector("#botao-reset")
  .addEventListener("click", resetListas);

// D. inicialização

carregarDados();
atualizarPagina();
