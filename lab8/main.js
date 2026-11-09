// A. Variáveis e elementos do HTML

const URL_API = "https://deisishop.pw.deisi.ulusofona.pt";
const CHAVE_CESTO = "produtos-selecionados";

// Guardamos referências aos elementos para os poder atualizar.
const nodeListaProdutos = document.querySelector("#lista-produtos");
const nodeEstadoProdutos = document.querySelector("#estado-produtos");
const nodeEstadoCategorias = document.querySelector("#estado-categorias");
const nodeFiltroCategoria = document.querySelector("#filtro-categoria");
const nodeOrdenarPreco = document.querySelector("#ordenar-preco");
const nodePesquisa = document.querySelector("#pesquisa-produto");
const nodeProdutosCesto = document.querySelector("#produtos-selecionados");
const nodeTotal = document.querySelector("#total");
const nodeFormularioCompra = document.querySelector("#form-compra");
const nodeNome = document.querySelector("#nome-cliente");
const nodeEstudante = document.querySelector("#estudante-deisi");
const nodeCupao = document.querySelector("#cupao");
const nodeBotaoComprar = document.querySelector("#botao-comprar");
const nodeResultadoCompra = document.querySelector("#resultado-compra");

// Os produtos vêm da API e o cesto é recuperado do armazenamento do navegador.
let produtos = [];
let cesto = lerCesto();


// B. Funções utilitárias

// Lê o cesto. Também aceita os produtos guardados pela versão anterior do site.
function lerCesto() {
  const dados = JSON.parse(localStorage.getItem(CHAVE_CESTO) || "[]");

  if (!Array.isArray(dados)) {
    return [];
  }

  return dados
    .map(function (item) {
      // Se já estava guardado o produto completo, ficamos só com o seu id.
      if (item !== null && typeof item === "object") {
        return String(item.id);
      }
      return String(item);
    })
    .filter(function (id) {
      return id !== "undefined" && id !== "null";
    });
}

// Guarda os identificadores dos produtos no navegador.
function guardarCesto() {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify(cesto));
}

// Mostra um preço no formato português, por exemplo, 12,50 €.
function formatarPreco(preco) {
  const numero = Number(preco);

  if (!Number.isFinite(numero)) {
    return "Preço indisponível";
  }

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR"
  }).format(numero);
}

// Pede à API a lista de categorias e cria uma opção para cada uma.
function carregarCategorias() {
  return fetch(URL_API + "/categories")
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Não foi possível carregar as categorias.");
      }
      return resposta.json();
    })
    .then(function (categorias) {
      categorias.forEach(function (categoria) {
        const opcao = document.createElement("option");
        opcao.value = categoria.name;
        opcao.textContent = categoria.name;
        nodeFiltroCategoria.appendChild(opcao);
      });

      nodeEstadoCategorias.textContent = "";
    })
    .catch(function (erro) {
      nodeEstadoCategorias.textContent =
        "Não foi possível carregar as categorias. Podes continuar a ver os produtos.";
    });
}

// Pede à API todos os produtos e depois apresenta-os na página.
function carregarProdutos() {
  nodeEstadoProdutos.textContent = "A carregar produtos...";

  return fetch(URL_API + "/products")
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os produtos.");
      }
      return resposta.json();
    })
    .then(function (dados) {
      if (!Array.isArray(dados)) {
        throw new Error("A API não devolveu uma lista de produtos.");
      }

      produtos = dados;
      renderizarProdutos();
      atualizarCesto();
    })
    .catch(function (erro) {
      nodeEstadoProdutos.textContent =
        "Não foi possível carregar os produtos. Verifica a ligação e tenta novamente.";
      atualizarCesto();
    });
}

// Cria o cartão que apresenta um produto.
function criarCartaoProduto(produto) {
  const cartao = document.createElement("article");
  cartao.className = "produto";

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title || "Produto sem nome";
  cartao.appendChild(titulo);

  if (produto.image) {
    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title || "Imagem do produto";
    imagem.loading = "lazy";
    cartao.appendChild(imagem);
  }

  const descricao = document.createElement("p");
  descricao.textContent = produto.description || "Sem descrição.";
  cartao.appendChild(descricao);

  const categoria = document.createElement("p");
  categoria.textContent = "Categoria: " + (produto.category || "Sem categoria");
  cartao.appendChild(categoria);

  const preco = document.createElement("p");
  preco.textContent = "Preço: " + formatarPreco(produto.price);
  cartao.appendChild(preco);

  if (produto.rating && produto.rating.rate !== undefined) {
    const avaliacao = document.createElement("p");
    avaliacao.textContent =
      "Avaliação: " + produto.rating.rate + " (" + produto.rating.count + " opiniões)";
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

// Pesquisa, filtra por categoria e ordena os produtos pelo preço.
function renderizarProdutos() {
  nodeListaProdutos.innerHTML = "";

  const categoriaEscolhida = nodeFiltroCategoria.value.toLowerCase();
  const pesquisa = nodePesquisa.value.trim().toLowerCase();

  let produtosVisiveis = produtos.filter(function (produto) {
    const categoriaDoProduto = String(produto.category || "").toLowerCase();
    const pertenceCategoria =
      categoriaEscolhida === "" || categoriaDoProduto === categoriaEscolhida;

    const textoProduto =
      String(produto.title || "") + " " +
      String(produto.description || "") + " " +
      String(produto.category || "");
    const correspondePesquisa = textoProduto.toLowerCase().includes(pesquisa);

    return pertenceCategoria && correspondePesquisa;
  });

  if (nodeOrdenarPreco.value === "crescente") {
    produtosVisiveis.sort(function (produtoA, produtoB) {
      return Number(produtoA.price) - Number(produtoB.price);
    });
  }

  if (nodeOrdenarPreco.value === "decrescente") {
    produtosVisiveis.sort(function (produtoA, produtoB) {
      return Number(produtoB.price) - Number(produtoA.price);
    });
  }

  if (produtosVisiveis.length === 0) {
    nodeEstadoProdutos.textContent = "Não foram encontrados produtos.";
    return;
  }

  nodeEstadoProdutos.textContent =
    produtosVisiveis.length + " produto(s) encontrado(s).";

  produtosVisiveis.forEach(function (produto) {
    nodeListaProdutos.appendChild(criarCartaoProduto(produto));
  });
}

// Atualiza a lista do cesto e calcula o total.
function atualizarCesto() {
  nodeProdutosCesto.innerHTML = "";
  let total = 0;

  if (cesto.length === 0) {
    nodeProdutosCesto.textContent = "O cesto está vazio.";
  }

  cesto.forEach(function (idProduto, indice) {
    const produto = produtos.find(function (item) {
      return String(item.id) === String(idProduto);
    });

    const linha = document.createElement("article");

    if (produto === undefined) {
      linha.textContent = "Produto " + idProduto + " indisponível.";
    } else {
      const titulo = document.createElement("h3");
      titulo.textContent = produto.title;
      linha.appendChild(titulo);

      const preco = Number(produto.price);
      if (Number.isFinite(preco)) {
        total += preco;
      }

      const textoPreco = document.createElement("p");
      textoPreco.textContent = formatarPreco(produto.price);
      linha.appendChild(textoPreco);
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
    nodeProdutosCesto.appendChild(linha);
  });

  nodeTotal.textContent = "Total: " + formatarPreco(total);
}


// C. Event handlers

// Envia o cesto para a API quando o formulário é submetido.
function comprar(evento) {
  evento.preventDefault();
  nodeResultadoCompra.textContent = "";

  if (cesto.length === 0) {
    nodeResultadoCompra.textContent = "Adiciona pelo menos um produto ao cesto.";
    return;
  }

  const nome = nodeNome.value.trim();
  if (nome === "") {
    nodeResultadoCompra.textContent = "Escreve o teu nome para continuar.";
    nodeNome.focus();
    return;
  }

  // A API recebe os ids dos produtos, a indicação de estudante, o cupão e o nome.
  const pedido = {
    products: cesto.map(function (id) {
      return Number(id);
    }),
    student: nodeEstudante.checked,
    coupon: nodeCupao.value.trim(),
    name: nome
  };

  nodeBotaoComprar.disabled = true;
  nodeResultadoCompra.textContent = "A processar a compra...";

  fetch(URL_API + "/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pedido)
  })
    .then(function (resposta) {
      // Lemos a resposta JSON e verificamos se a API aceitou o pedido.
      return resposta.json().then(function (resultado) {
        if (!resposta.ok || resultado.error) {
          throw new Error(resultado.error || "A compra não foi aceite pela API.");
        }
        return resultado;
      });
    })
    .then(function (resultado) {
      nodeResultadoCompra.textContent =
        (resultado.message ? resultado.message + " " : "Compra concluída. ") +
        "Referência: " + resultado.reference + ". Total: " + resultado.totalCost + " €.";

      // Limpamos o cesto só depois da confirmação da API.
      cesto = [];
      guardarCesto();
      atualizarCesto();
      nodeFormularioCompra.reset();
      nodeBotaoComprar.disabled = false;
    })
    .catch(function (erro) {
      if (erro.message === "Failed to fetch") {
        nodeResultadoCompra.textContent =
          "Não foi possível contactar a loja. Tenta novamente mais tarde.";
      } else {
        nodeResultadoCompra.textContent = erro.message;
      }
      nodeBotaoComprar.disabled = false;
    });
}


// D. Event listeners

nodeFiltroCategoria.addEventListener("change", renderizarProdutos);
nodeOrdenarPreco.addEventListener("change", renderizarProdutos);
nodePesquisa.addEventListener("input", renderizarProdutos);
nodeFormularioCompra.addEventListener("submit", comprar);


// E. Inicialização

// Carregamos as categorias primeiro e os produtos a seguir.
carregarCategorias().then(function () {
  carregarProdutos();
});
