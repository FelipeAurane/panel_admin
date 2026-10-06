// Chama a função para inicializar o Firebase com a coleção desejada
inicializarFirebase("DatasPAgendamentos");

const form = document.querySelector('#alunoForm',"form");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = document.querySelector('[name=data]').value;
  const hora = document.querySelector('[name=hora]').value;
  const type = document.querySelector('[name=type]').value;

  // Verifica se os campos estão vazios
  if (data.trim() === "" || hora.trim() === "") {
    console.error("Por favor, preencha todos os campos.");
    return;
  }

  // Verifica a data atual
  const dataAtual = new Date();
  const dataInserida = new Date(data);
  const umMesAntes = new Date();
  umMesAntes.setMonth(umMesAntes.getMonth() - 1);

  // Verifica se a data inserida é anterior à data atual ou a um mês anterior
  if (dataInserida < umMesAntes || dataInserida < dataAtual) {
    console.error("Não é possível adicionar datas anteriores a um mês atrás.");
    return;
  }

  // Obter a hora atual
  const horaAtual = new Date().getTime();

  // Criar o novo aluno com a hora atual
  db.add({
    data: data,
    hora: hora,
    disponivel: true, // Define a disponibilidade como verdadeira por padrão
    id: "",
    type: type,
    timestamp: horaAtual // Salvar a hora atual no momento do cadastro
  })
    .then(() => {
      console.error('Cadastrado com sucesso!');
      closeModal();
      form.reset();
      listarDatas(); // Atualiza a listagem após o cadastro
    })
    .catch((error) => {
      console.error('Erro ao cadastrar:', error);
    });
});

// Função para obter o nome do dia da semana em português
function obterNomeDiaSemana(data) {
  const diasSemana = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];
  const numeroDiaSemana = data.getDay();
  const diaSemana = diasSemana[numeroDiaSemana];

  return diaSemana;
}
// Função para obter o nome do mês
function obterNomeMes(numeroMes) {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return meses[numeroMes];
}

function formatarData(data) {
  const partes = data.split('/');
  const dia = partes[0];
  const mes = parseInt(partes[1]) - 1; // Ajuste para obter o índice correto do array de meses
  const ano = partes[2];
  const dataFormatada = new Date(ano, mes, dia);
  const diaSemana = obterNomeDiaSemana(dataFormatada);

  return {
    dia: dia,
    mes: obterNomeMes(mes), // Obtém o nome do mês corretamente
    ano: ano,
    diaSemana: diaSemana
  };
}

// Função para criar o elemento do card
function criarCard(data, disponivel, hora, id) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Formata a data
  const dataFormatada = formatarData(data);

  card.innerHTML = `
    <div class="calendar">
      <div class="calendar-body">
        <span class="month-name">${dataFormatada.mes}</span>
        <span class="day-name">${dataFormatada.diaSemana}</span>
        <span class="date-number">${dataFormatada.dia}</span>
        <span class="year">${dataFormatada.ano}</span>
      </div>
    </div>
  `;

  // Adiciona o manipulador de eventos de clique ao card
  card.addEventListener("mouseover", function () {
    // Cria o elemento do menu flutuante
    const menuFlutuante = criarMenuFlutuante(data, hora, id);

    // Adiciona o menu flutuante ao card
    card.appendChild(menuFlutuante);
  });

  // Adiciona o manipulador de eventos de saída do mouse do card
  card.addEventListener("mouseout", function () {
    // Remove o menu flutuante do card
    const menuFlutuante = card.querySelector(".menu-flutuante");
    if (menuFlutuante) {
      menuFlutuante.remove();
    }
  });

  return card;
}

// Função para criar o elemento do menu flutuante
function criarMenuFlutuante(data, hora, id) {
  const menuFlutuante = document.createElement("div");
  menuFlutuante.classList.add("menu-flutuante");

  menuFlutuante.innerHTML = `
    <div>Data: ${data}</div>
    <div>Hora: ${hora}</div>
    <div>CPF: ${id}</div>
  `;

  return menuFlutuante;
}

// Função para listar as datas nos cards
function listarDatas() {
  const cardsContainer = document.getElementById("cardsContainer");

  // Consulta a coleção "DatasPAgendamentos" ordenando pela propriedade "timestamp" em ordem decrescente
  db.orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
    // Limpa os cards container antes de adicionar os novos cards
    cardsContainer.innerHTML = "";

    // Loop pelos documentos retornados
    querySnapshot.forEach((doc) => {
      const data = doc.data().data;
      const disponivel = doc.data().disponivel;
      const hora = doc.data().hora;
      const id = doc.data().id;

      // Cria um elemento de card e preenche com os dados
      const card = criarCard(data, disponivel, hora, id);

      // Adiciona o card ao container
      cardsContainer.appendChild(card);

      // Verifica a disponibilidade e altera a cor do background
      if (!disponivel) {
        card.querySelector(".calendar .calendar-body .month-name").style.background = "#3ecd5e";
      }
    });
  }, (error) => {
    console.error("Erro ao consultar coleção:", error);
  });
}

listarDatas();

function openModalData() {
  const modaldata = document.getElementById('modaldata');
  modaldata.style.display = 'block';

  window.onclick = function(event) {
    if (event.target === modaldata) {
      modaldata.style.display = 'none';
    }
  }
}

function closeModal() {
  const modaldata = document.getElementById('modaldata');
  modaldata.style.display = 'none';

  const modaldelet = document.getElementById('modaldelet');
  modaldelet.style.display = 'none';

  const modalNovoAluno = document.getElementById('modalNovoAluno');
  modalNovoAluno.style.display = 'none';

  const modalNovaTurma = document.getElementById('modalNovaTurma');
  modalNovaTurma.style.display = 'none';
}

function openModalDelet() {
  const modaldelet = document.getElementById('modaldelet');
  modaldelet.style.display = 'block';

  window.onclick = function(event) {
    if (event.target === modaldelet) {
      modaldelet.style.display = 'none';
    }
  }
}

function closeModalDelet() {
  const modaldelet = document.getElementById('modaldelet');
  modaldelet.style.display = 'none';
}


