const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progressaluno");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const numeroAlunosElement = document.getElementById('numeroAlunos');
const listaDados = document.getElementById("lista-dados");

let formStepsNum = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    animateFormSteps();
    if (formStepsNum === formSteps.length - 1) {
      exibirDados();
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
    animateFormSteps();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

function animateFormSteps() {
  formSteps.forEach((formStep, idx) => {
    if (idx === formStepsNum) {
      formStep.style.opacity = "1";
      formStep.style.transform = "translateX(0)";
    } else {
      formStep.style.opacity = "0";
      formStep.style.transform = "translateX(50px)";
    }
  });
}

function exibirDados() {
  const dados = [];

  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    const nome = input.getAttribute("name");
    const valor = input.value;

    if (nome && valor) {
      dados.push({ nome, valor });
    }
  });

  listaDados.innerHTML = "";
  dados.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = `${item.nome}: ${item.valor}`;
    listaDados.appendChild(li);
  });
}






 // Obtenha uma referência para a coleção "alunos"
 const alunosCollection = firebase.firestore().collection('alunos');

// Função para renderizar os cards dos alunos
function renderizarAlunos(alunos) {
  const listaAlunos = document.getElementById('lista-alunos');
  listaAlunos.innerHTML = '';

  alunos.forEach((aluno) => {
    const cardAluno = document.createElement('div');
    cardAluno.classList.add('card-aluno');

    const imagemAluno = document.createElement('img');
    imagemAluno.src = aluno.imagem;
    imagemAluno.alt = "Imagem do Aluno";
    imagemAluno.classList.add('imagem-aluno');
    cardAluno.appendChild(imagemAluno);

    const apelidoAluno = document.createElement('h2');
    apelidoAluno.textContent = aluno.apelido;
    cardAluno.appendChild(apelidoAluno);

    const CPF = document.createElement('p');
    CPF.textContent = `${aluno.cpf}`;
    cardAluno.appendChild(CPF);

    const statusAluno = document.createElement('div');
    statusAluno.classList.add('status-aluno');
    statusAluno.textContent = aluno.status;

    switch (aluno.status) {
      case 'Aprovado':
        statusAluno.classList.add('status-aprovado');
        break;
      case 'Pendente':
        statusAluno.classList.add('status-pendente');
        break;
      case 'Cancelado':
        statusAluno.classList.add('status-cancelado');
        break;
      case 'Expirado':
        statusAluno.classList.add('status-expirado');
        break;
      default:
        break;
    }

    cardAluno.appendChild(statusAluno);

    const botaoVisualizar = document.createElement('button');
    botaoVisualizar.innerHTML = '<i class="fas fa-eye"></i>';
    botaoVisualizar.classList.add('botao-visualizar');

    cardAluno.appendChild(botaoVisualizar);

    botaoVisualizar.addEventListener("click", function () {
      // Código a ser executado quando o card do aluno for clicado
      const menuFlutuanteBack = document.createElement("div");
      menuFlutuanteBack.classList.add("tela-flutuante-block");
    
      const menuFlutuante = document.createElement("div");
      menuFlutuante.classList.add("tela-flutuante");
  
    
      menuFlutuante.innerHTML = `
      <div>
         <h2 class="title">Dados do aluno</h2>
        </div>
        <div>
         <img src="${aluno.imagem}" alt="Imagem do Aluno" class="imagem-aluno-info">
         <div class="apelido">${aluno.apelido}</div>
        </div>

        <div class="dados">

        <div class="card-info">
        <div class="info-row">
          <span class="info-label">Nome:  </span>
          <span class="info-value">${aluno.nome}</span>
        </div>
      
     
        <div class="info-row">
        <span class="info-label">Status: </span>
        <span class="info-value">${aluno.status}</span>
      </div>
   
        <div class="info-row">
        <span class="info-label">Categoria CNH: </span>
        <span class="info-value">${aluno.categoria_cnh}</span>
      </div>
      <div class="info-row">
      <span class="info-label">CPF: </span>
      <span class="info-value">${aluno.cpf}</span>
    </div>
      <div class="info-row">
      <span class="info-label">Data Inicial: </span>
      <span class="info-value">${aluno.data_inicial}</span>
    </div>
      <div class="info-row">
      <span class="info-label">Telefone: </span>
      <span class="info-value">${aluno.telefone}</span>
    </div>
        <div class="info-row">
          <span class="info-label">Email: </span>
          <span class="info-value">${aluno.email}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Tipo de Processo: </span>
          <span class="info-value">${aluno.tipo_habilitacao}</span>
        </div>
       
      </div>
        </div>
      `;
    
      const btnClose = document.createElement('button');
      btnClose.innerHTML = '<i class="fas fa-times"></i>';
      btnClose.classList.add('btn-close');
      menuFlutuante.appendChild(btnClose);
    
      // Adicione o menu flutuante ao elemento body
      document.body.appendChild(menuFlutuante);
    
      // Adicione o menu flutuante de fundo antes do menu flutuante
      document.body.insertBefore(menuFlutuanteBack, menuFlutuante);
    
      console.log('Clicado');
    
      btnClose.addEventListener("click", function () {
        menuFlutuanteBack.remove();
        menuFlutuante.remove();
      });
    });


    
    

    listaAlunos.appendChild(cardAluno);
  });
}




 function atualizarQuantidadeAlunos() {
  const listaAlunos = document.getElementById('lista-alunos');
  const numeroAlunos = listaAlunos.childElementCount;
  numeroAlunosElement.textContent = `Alunos: ${numeroAlunos}`;
}

// Chame a função para atualizar a quantidade de alunos pela primeira vez
atualizarQuantidadeAlunos();

 // Função para atualizar a lista de alunos
 function atualizarListaAlunos() {
   alunosCollection.onSnapshot((snapshot) => {
     const alunos = [];
     snapshot.forEach((doc) => {
       const aluno = doc.data();
       alunos.push(aluno);
     });
     renderizarAlunos(alunos);
     atualizarQuantidadeAlunos();
   });
 }

 // Chame a função para atualizar a lista de alunos pela primeira vez
 atualizarListaAlunos();


function openModalNovoAluno() {
  var modalNovoAluno = document.getElementById('modalNovoAluno');
  modalNovoAluno.style.display = 'block';

  window.onclick = function(event) {
    if (event.target === modalNovoAluno) {
      modalNovoAluno.style.display = 'none';
    }
  }
}

function openModalNovaTurma() {
  var modalNovaTurma = document.getElementById('modalNovaTurma');
  modalNovaTurma.style.display = 'block';

  window.onclick = function(event) {
    if (event.target === modalNovaTurma) {
      modalNovaTurma.style.display = 'none';
    }
  }
}