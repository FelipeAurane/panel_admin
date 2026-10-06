// Chama a função para inicializar o Firebase com a coleção desejada
inicializarFirebase("DatasPAgendamentos");

// Variáveis para controle da paginação
let paginaAtual = 1;
const itensPorPagina = 5;

function criarItemLista(data, hora, id) {
  const itemLista = document.createElement("li");
  itemLista.classList.add("date-item");
  itemLista.setAttribute("data-id", id);

  const dataFormatada = formatarData(data);

  itemLista.innerHTML = `
    <div class="date-info" id="${id}">
      <span class="date-day">${dataFormatada.dia}</span>
      <span class="date-month">${dataFormatada.mes}</span>
      <span class="date-year">${dataFormatada.ano}</span>
    </div>
    <div class="date-actions">
      <div class="delete-button" onclick="excluirData('${id}')">
        <i class='bx bxs-trash' style='color:#ffffff'></i>
      </div>
    </div>
  `;

  return itemLista;
}
// Função para listar as datas na página com sistema de paginação
function listarDatas() {
    const datesList = document.getElementById("datesList");
    const totalPaginasElement = document.getElementById("totalPaginas");
    const paginaAnteriorButton = document.getElementById("paginaAnterior");
    const proximaPaginaButton = document.getElementById("proximaPagina");
  
    // Consulta a coleção "DatasPAgendamentos" ordenando pela propriedade "timestamp" em ordem decrescente
    firebase.firestore()
      .collection("DatasPAgendamentos")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        // Limpa a lista de datas antes de adicionar os novos itens
        datesList.innerHTML = "";
  
        // Lista de documentos na página atual
        const documentosPagina = querySnapshot.docs.slice(
          (paginaAtual - 1) * itensPorPagina,
          paginaAtual * itensPorPagina
        );
  
        // Loop pelos documentos retornados na página atual
        documentosPagina.forEach((doc) => {
          const data = doc.data().data;
          const hora = doc.data().hora;
          const id = doc.id;
  
          // Cria um item de lista e preenche com os dados
          const itemLista = criarItemLista(data, hora, id);
  
          // Adiciona o item de lista à lista de datas
          datesList.appendChild(itemLista);
        });
  
        // Calcula a quantidade total de páginas
        const totalPaginas = Math.ceil(querySnapshot.docs.length / itensPorPagina);
  
        // Atualiza o elemento HTML com a quantidade total de páginas
        totalPaginasElement.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  
        // Habilita ou desabilita os botões de página anterior e próxima conforme necessário
        if (paginaAtual === 1) {
          paginaAnteriorButton.disabled = true;
        } else {
          paginaAnteriorButton.disabled = false;
        }
  
        if (paginaAtual === totalPaginas) {
          proximaPaginaButton.disabled = true;
        } else {
          proximaPaginaButton.disabled = false;
        }
      })
      .catch((error) => {
        console.error("Erro ao consultar coleção:", error);
      });
  }
  

// Função para exibir a página anterior
function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    listarDatas();
  }
}

// Função para exibir a próxima página
function proximaPagina() {
  paginaAtual++;
  listarDatas();
}

function excluirData(id) {
    firebase.firestore()
      .collection("DatasPAgendamentos")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Data excluída com sucesso!");
        const itemLista = document.querySelector(`[data-id="${id}"]`);
        if (itemLista) {
          itemLista.remove();
        }
        listarDatas(); // Atualiza a lista após a exclusão
      })
      .catch((error) => {
        console.error("Erro ao excluir data:", error);
      });
  }
  

// Chama a função para listar as datas ao carregar a página
listarDatas();