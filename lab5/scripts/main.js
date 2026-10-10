// 1. VARIÁVEIS E ELEMENTOS DO HTML

const mensagem = document.querySelector("#mensagem");
const textoColorido = document.querySelector("#texto-colorido");
const botoesCor = document.querySelectorAll("button.color");
const escrita = document.querySelector("#escrita");
const corFundo = document.querySelector("#cor-fundo");

const botaoContar = document.querySelector("#botao-contar");
const botaoDecrementar = document.querySelector("#botao-decrementar");
const botaoReset = document.querySelector("#botao-reset");
const contador = document.querySelector("#contador");

const formulario = document.querySelector("#formulario");
const nome = document.querySelector("#nome");
const idade = document.querySelector("#idade");
const resposta = document.querySelector("#resposta");

const contadorAutomatico = document.querySelector("#contador-automatico");


const cores = ["lightblue", "lightyellow", "lightpink", "lightgray"];
const chaveContador = "lab5-contador";

let indiceCor = 0;
let total = 0;
let segundos = 0;


// 2. FUNÇÕES

// Esta é a única arrow function.
const mostrarMensagem = () => {
  mensagem.textContent = "1. Obrigado por passares!";
};

function reporMensagem() {
  mensagem.textContent = "1. Passa por aqui!";
}

function pintarTexto() {
  textoColorido.style.color = this.dataset.color;
}

function alternarCor() {
  escrita.style.backgroundColor = cores[indiceCor];

  indiceCor++;

  if (indiceCor === cores.length) {
    indiceCor = 0;
  }
}

function alterarFundo() {
  document.body.style.backgroundColor = this.value;
}

function carregarContador() {
  try {
    const valorGuardado = localStorage.getItem(chaveContador);

    if (valorGuardado !== null) {
      const numeroGuardado = Number(valorGuardado);

      if (Number.isSafeInteger(numeroGuardado)) {
        total = numeroGuardado;
      }
    }
  } catch {
    // Se o armazenamento estiver bloqueado, começa em zero.
  }

  atualizarContador();
}

function atualizarContador() {
  contador.textContent = total;

  try {
    localStorage.setItem(chaveContador, String(total));
  } catch {
    // Sem armazenamento, o contador funciona até recarregar.
  }
}

function contar() {
  total++;
  atualizarContador();
}

function decrementar() {
  total--;
  atualizarContador();
}

function reporContador() {
  total = 0;
  atualizarContador();
}

function apresentarPessoa(e) {
  e.preventDefault();

  const nomeIntroduzido = nome.value.trim();

  if (nomeIntroduzido === "") {
    resposta.textContent = "Escreve o teu nome antes de submeter.";
    nome.focus();
    return;
  }

  resposta.textContent =
    `Olá, o ${nomeIntroduzido} tem ${idade.value}!`;
}

function atualizarContadorAutomatico() {
  segundos++;
  contadorAutomatico.textContent = segundos;
}




// 3. EVENTOS

mensagem.addEventListener("mouseover", mostrarMensagem);
mensagem.addEventListener("mouseout", reporMensagem);

botoesCor.forEach(function (botao) {
  botao.addEventListener("click", pintarTexto);
});

escrita.addEventListener("input", alternarCor);
corFundo.addEventListener("change", alterarFundo);

botaoContar.addEventListener("click", contar);
botaoDecrementar.addEventListener("click", decrementar);
botaoReset.addEventListener("click", reporContador);

formulario.onsubmit = apresentarPessoa;



// 4. INICIALIZAÇÃO

carregarContador();

contadorAutomatico.textContent = segundos;
setInterval(atualizarContadorAutomatico, 1000);
