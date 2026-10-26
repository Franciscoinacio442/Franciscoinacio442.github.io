// A. Variáveis com referências aos elementos do HTML

const nodeProdutos = document.querySelector("#lista-produtos");
const nodeCesto = document.querySelector("#produtos-selecionados");

const nodeTotal = document.querySelector("#total");
// Guarda o nome para identificar o cesto no localStorage.
const chaveCesto = "produtos-selecionados";

// B. Funções utilitárias


function lerCesto() {
  // Vai buscar ao localStorage o texto guardado com este nome.
  const textoGuardado = localStorage.getItem(chaveCesto);


  if (textoGuardado === null) {

    return [];
  }

  // Converte o texto guardado numa lista e devolve essa lista.
  return JSON.parse(textoGuardado);
}



function guardarCesto(cesto) {
  // Converte a lista num texto, porque o localStorage guarda texto.
  const texto = JSON.stringify(cesto);


  localStorage.setItem(chaveCesto, texto);
}



function criarInformacaoProduto(produto) {

  const artigo = document.createElement("article");
  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;
  const imagem = document.createElement("img");
  imagem.src = produto.image;

  imagem.alt = produto.title;

  const descricao = document.createElement("p");

  descricao.textContent = produto.description;


  const categoria = document.createElement("p");

  // Junta o texto "Categoria: " à categoria do produto.
  categoria.textContent = "Categoria: " + produto.category;

  // Cria um parágrafo para o preço.
  const preco = document.createElement("p");

  // Mostra o preço com duas casas decimais e o símbolo do euro.
  preco.textContent = "Preço: " + produto.price.toFixed(2) + " €";

  // Cria um parágrafo para a avaliação.
  const avaliacao = document.createElement("p");

  // Mostra a classificação e a quantidade de avaliações do produto.
  avaliacao.textContent =
    "Avaliação: " + produto.rating.rate +
    "/5 (" + produto.rating.count + " avaliações)";

  // Coloca todos os elementos criados dentro do article.
  artigo.append(titulo, imagem, descricao, categoria, preco, avaliacao);

  // Devolve o artigo construído a quem chamou esta função.
  return artigo;
}


// Define uma função que cria um cartão para o catálogo da loja.
function criarProduto(produto) {
  // Usa a função anterior para construir a informação do produto.
  const artigo = criarInformacaoProduto(produto);

  // Cria o botão que permitirá adicionar o produto.
  const botao = document.createElement("button");

  // Define um botão normal, que não submete formulários.
  botao.type = "button";

  // Define o texto apresentado no botão.
  botao.textContent = "+ Adicionar ao cesto";

  // Chama a função que associa o clique deste botão ao produto.
  associarBotaoAdicionar(botao, produto);

  // Coloca o botão dentro do artigo.
  artigo.append(botao);

  // Devolve o cartão completo.
  return artigo;
}


// Define uma função que mostra todos os produtos de uma lista.
function renderizarProdutos(lista) {
  // Limpa os cartões anteriores para não os duplicar.
  nodeProdutos.innerHTML = "";

  // Percorre a lista e executa esta função uma vez por produto.
  lista.forEach(function (produto) {
    // Cria o cartão do produto atual.
    const artigo = criarProduto(produto);

    // Insere o cartão na área dos produtos da página.
    nodeProdutos.append(artigo);
  }); // Fecha a função passada ao forEach e a chamada ao forEach.
}


// Define uma função que cria um cartão para o cesto.
function criaProdutoCesto(produto, indice) {
  // Constrói a informação do produto.
  const artigo = criarInformacaoProduto(produto);

  // Cria um botão para remover esta unidade do cesto.
  const botao = document.createElement("button");

  // Define um botão normal.
  botao.type = "button";

  // Define o texto do botão.
  botao.textContent = "Remover";

  // Associa o botão à posição deste produto no cesto.
  associarBotaoRemover(botao, indice);

  // Coloca o botão dentro do artigo.
  artigo.append(botao);

  // Devolve o cartão completo.
  return artigo;
}


// Define uma função que atualiza os cartões do cesto e o total.
function atualizaCesto() {
  // Recupera a lista de produtos guardada.
  const cesto = lerCesto();

  // Limpa os cartões antigos do cesto.
  nodeCesto.innerHTML = "";

  // Começa a soma dos preços em zero cêntimos.
  let totalCentimos = 0;

  // Percorre cada produto e a respetiva posição na lista.
  cesto.forEach(function (produto, indice) {
    // Cria o cartão desse produto com o botão de remover.
    const artigo = criaProdutoCesto(produto, indice);

    // Coloca o cartão na área do cesto.
    nodeCesto.append(artigo);

    // Converte o preço em cêntimos e acrescenta-o ao total.
    totalCentimos += Math.round(produto.price * 100);
  });

  // Converte o total para euros e atualiza o parágrafo inteiro.
  nodeTotal.textContent =
    "Total: " + (totalCentimos / 100).toFixed(2) + " €";
}

// C. Event handlers

// Define o que acontece quando queremos adicionar um produto.
function adicionarAoCesto(produto) {
  // Recupera o cesto atual.
  const cesto = lerCesto();

  // Acrescenta o produto ao fim da lista.
  cesto.push(produto);

  // Guarda a lista alterada no navegador.
  guardarCesto(cesto);

  // Atualiza os cartões e o preço total na página.
  atualizaCesto();
}


// Define o que acontece quando queremos remover uma unidade.
function removerDoCesto(indice) {
  // Recupera o cesto atual.
  const cesto = lerCesto();

  // Remove um elemento a partir da posição indicada.
  cesto.splice(indice, 1);

  // Guarda a lista depois da remoção.
  guardarCesto(cesto);

  // Atualiza os cartões e o preço total na página.
  atualizaCesto();
}

// D. Event Listeners

// Define uma função que prepara o clique de um botão de adicionar.
function associarBotaoAdicionar(botao, produto) {
  // Fica à espera de um clique neste botão.
  botao.addEventListener("click", function () {
    // Quando houver um clique, adiciona o produto correspondente.
    adicionarAoCesto(produto);
  });
}


// Define uma função que prepara o clique de um botão de remover.
function associarBotaoRemover(botao, indice) {
  // Fica à espera de um clique neste botão.
  botao.addEventListener("click", function () {
    // Quando houver um clique, remove o produto nessa posição.
    removerDoCesto(indice);
  });
}

// E. Inicialização

// Verifica se ainda não existe um cesto guardado neste endereço.
if (localStorage.getItem(chaveCesto) === null) {
  // Guarda uma lista vazia apenas na primeira utilização.
  guardarCesto([]);
}

// Mostra na página os produtos definidos no ficheiro produtos.js.
renderizarProdutos(produtos);

// Mostra o cesto guardado e calcula o total.
atualizaCesto();
