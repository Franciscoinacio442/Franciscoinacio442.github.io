// A. Variáveis e elementos do HTML

const URL_API = "https://deisishop.pw.deisi.ulusofona.pt";
const CHAVE_CESTO = "produtos-selecionados";

const listaProdutos = document.querySelector("#lista-produtos");
const estadoProdutos = document.querySelector("#estado-produtos");
const estadoCategorias = document.querySelector("#estado-categorias");
const filtroCategoria = document.querySelector("#filtro-categoria");
const ordenarPreco = document.querySelector("#ordenar-preco");
const pesquisaProduto = document.querySelector("#pesquisa-produto");

const produtosCesto = document.querySelector("#produtos-selecionados");
const totalCesto = document.querySelector("#total");

const formularioCompra = document.querySelector("#form-compra");
const nomeCliente = document.querySelector("#nome-cliente");
const estudanteDeisi = document.querySelector("#estudante-deisi");
const cupao = document.querySelector("#cupao");
const botaoComprar = document.querySelector("#botao-comprar");
const resultadoCompra = document.querySelector("#resultado-compra");

let produtos = [];

// Recupera o cesto guardado no navegador.
let cesto = JSON.parse(localStorage.getItem(CHAVE_CESTO) || "[]");

if (!Array.isArray(cesto)) {
  cesto = [];
}


// B. Funções

function guardarCesto() {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify(cesto));
}

function formatarPreco(preco) {
  const numero = Number(preco);

  if (isNaN(numero)) {
    return "Preço indisponível";
  }

  return numero.toFixed(2).replace(".", ",") + " €";
}

// Vai buscar as categorias e coloca-as no menu.
function carregarCategorias() {
  fetch(URL_API + "/categories")
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao carregar categorias.");
      }

      return resposta.json();
    })
    .then(function (categorias) {
      categorias.forEach(function (categoria) {
        const opcao = document.createElement("option");

        opcao.value = categoria.name;
        opcao.textContent = categoria.name;

        filtroCategoria.appendChild(opcao);
      });

      estadoCategorias.textContent = "";
    })
    .catch(function () {
      estadoCategorias.textContent =
        "Não foi possível carregar as categorias.";
    });
}

// Vai buscar os produtos e chama as funções que os mostram.
function carregarProdutos() {
  estadoProdutos.textContent = "A carregar produtos...";

  fetch(URL_API + "/products")
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao carregar produtos.");
      }

      return resposta.json();
    })
    .then(function (dados) {
      produtos = dados;

      mostrarProdutos();
      atualizarCesto();
    })
    .catch(function () {
      estadoProdutos.textContent =
        "Não foi possível carregar os produtos.";
    });
}

// Cria o cartão de um produto.
function criarCartao(produto) {
  const cartao = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;
  cartao.appendChild(titulo);

  const imagem = document.createElement("img");
  const avisoImagem = document.createElement("p");

  avisoImagem.textContent = "Imagem indisponível.";
  avisoImagem.hidden = true;

  if (produto.image) {
    imagem.src = produto.image;
    imagem.alt = produto.title;

    // Se o endereço da imagem falhar, mostramos o aviso.
    imagem.addEventListener("error", function () {
      imagem.hidden = true;
      avisoImagem.hidden = false;
    });

    cartao.appendChild(imagem);
  } else {
    avisoImagem.hidden = false;
  }

  cartao.appendChild(avisoImagem);

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;
  cartao.appendChild(descricao);

  const categoria = document.createElement("p");
  categoria.textContent = "Categoria: " + produto.category;
  cartao.appendChild(categoria);

  const preco = document.createElement("p");
  preco.textContent = "Preço: " + formatarPreco(produto.price);
  cartao.appendChild(preco);

  if (produto.rating) {
    const avaliacao = document.createElement("p");
    avaliacao.textContent =
      "Avaliação: " + produto.rating.rate +
      " (" + produto.rating.count + " opiniões)";
    cartao.appendChild(avaliacao);
  }

  const botaoAdicionar = document.createElement("button");
  botaoAdicionar.type = "button";
  botaoAdicionar.textContent = "Adicionar ao cesto";

  botaoAdicionar.addEventListener("click", function () {
    cesto.push(String(produto.id));
    guardarCesto();
    atualizarCesto();
  });

  cartao.appendChild(botaoAdicionar);

  return cartao;
}

// Aplica pesquisa e filtros, e depois mostra os produtos.
function mostrarProdutos() {
  listaProdutos.innerHTML = "";

  const categoriaEscolhida = filtroCategoria.value.toLowerCase();
  const textoEscrito = pesquisaProduto.value.trim().toLowerCase();

  let produtosVisiveis = produtos.filter(function (produto) {
    const categoria = String(produto.category || "").toLowerCase();

    const categoriaCerta =
      categoriaEscolhida === "" || categoria === categoriaEscolhida;

    const textoProduto =
      produto.title + " " +
      produto.description + " " +
      produto.category;

    const textoCerto =
      textoProduto.toLowerCase().includes(textoEscrito);

    return categoriaCerta && textoCerto;
  });

  if (ordenarPreco.value === "crescente") {
    produtosVisiveis.sort(function (produtoA, produtoB) {
      return Number(produtoA.price) - Number(produtoB.price);
    });
  }

  if (ordenarPreco.value === "decrescente") {
    produtosVisiveis.sort(function (produtoA, produtoB) {
      return Number(produtoB.price) - Number(produtoA.price);
    });
  }

  if (produtosVisiveis.length === 0) {
    estadoProdutos.textContent = "Não foram encontrados produtos.";
    return;
  }

  estadoProdutos.textContent =
    produtosVisiveis.length + " produto(s) encontrado(s).";

  produtosVisiveis.forEach(function (produto) {
    listaProdutos.appendChild(criarCartao(produto));
  });
}

// Mostra o cesto e calcula o total.
function atualizarCesto() {
  produtosCesto.innerHTML = "";

  let total = 0;

  if (cesto.length === 0) {
    produtosCesto.textContent = "O cesto está vazio.";
  }

  cesto.forEach(function (idProduto, indice) {
    const produto = produtos.find(function (item) {
      return String(item.id) === String(idProduto);
    });

    const linha = document.createElement("article");

    if (produto) {
      const titulo = document.createElement("h3");
      titulo.textContent = produto.title;
      linha.appendChild(titulo);

      const preco = Number(produto.price);
      total = total + preco;

      const textoPreco = document.createElement("p");
      textoPreco.textContent = formatarPreco(produto.price);
      linha.appendChild(textoPreco);
    } else {
      linha.textContent = "Produto indisponível.";
    }

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", function () {
      cesto.splice(indice, 1);
      guardarCesto();
      atualizarCesto();
    });

    linha.appendChild(botaoRemover);
    produtosCesto.appendChild(linha);
  });

  totalCesto.textContent = formatarPreco(total);
}


// C. Função da compra

function comprar(evento) {
  evento.preventDefault();

  resultadoCompra.textContent = "";

  if (cesto.length === 0) {
    resultadoCompra.textContent = "Adiciona um produto ao cesto.";
    return;
  }

  const nome = nomeCliente.value.trim();

  if (nome === "") {
    resultadoCompra.textContent = "Escreve o teu nome.";
    nomeCliente.focus();
    return;
  }

  const pedido = {
    products: cesto.map(function (id) {
      return Number(id);
    }),
    student: estudanteDeisi.checked,
    coupon: cupao.value.trim(),
    name: nome
  };

  botaoComprar.disabled = true;
  resultadoCompra.textContent = "A processar a compra...";

  fetch(URL_API + "/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pedido)
  })
    .then(function (resposta) {
      return resposta.json().then(function (dados) {
        if (!resposta.ok || dados.error) {
          throw new Error(dados.error || "A compra não foi aceite.");
        }

        return dados;
      });
    })
    .then(function (dados) {
      resultadoCompra.textContent =
        (dados.message || "Compra concluída.") +
        " Referência: " + dados.reference +
        ". Total: " + formatarPreco(dados.totalCost);

      cesto = [];
      guardarCesto();
      atualizarCesto();
      formularioCompra.reset();
      botaoComprar.disabled = false;
    })
    .catch(function () {
      resultadoCompra.textContent =
        "A compra não foi concluída. Tenta novamente.";
      botaoComprar.disabled = false;
    });
}


// D. Eventos

filtroCategoria.addEventListener("change", mostrarProdutos);
ordenarPreco.addEventListener("change", mostrarProdutos);
pesquisaProduto.addEventListener("input", mostrarProdutos);
formularioCompra.addEventListener("submit", comprar);


// E. Início

carregarCategorias();
carregarProdutos();
