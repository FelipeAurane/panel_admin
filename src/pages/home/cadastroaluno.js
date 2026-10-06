const db = firebase.firestore();

//------------------------CAMERA------------------------//

const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('videoElement');
const staticImage = document.getElementById('staticImage');
const captureButton = document.getElementById('captureButton');
let captureState = 0;

captureButton.addEventListener('click', () => {
  if (captureState === 0) {
    // Abrir a câmera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Exibir o vídeo da webcam no elemento de vídeo
        staticImage.style.display = 'none'; // Ocultar a imagem estática
        videoElement.style.display = 'block'; // Exibir o elemento de vídeo
        videoElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Erro ao acessar a câmera:', error);
      });

    captureButton.textContent = 'Tirar Foto'; // Alterar o texto para "Tirar Foto"
    captureState = 1; // Atualizar o estado para 1 (câmera aberta)
  } else if (captureState === 1) {
    // Tirar foto
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const capturedImage = new Image();
    capturedImage.src = canvas.toDataURL();

    capturedImage.onload = function() {
      videoElement.srcObject = null; // Parar o streaming de vídeo
      videoElement.style.display = 'none'; // Ocultar o elemento de vídeo
      staticImage.style.display = 'block'; // Exibir a imagem estática
      staticImage.src = capturedImage.src; // Exibir a imagem capturada no elemento <img>
      captureButton.textContent = 'Tirar Outra'; // Alterar o texto para "Tirar Outra"
      captureState = 0; // Atualizar o estado para 0 (câmera fechada)
    };

    // Inserir automaticamente a URL da imagem no campo de input
    document.getElementById('imagemInput').value = capturedImage.src;
  }
});

const form = document.querySelector('form');
const cancelButton = document.getElementById('cancelButton');
const submitButton = document.getElementById('submitButton');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let nome = document.querySelector('[name=nome]').value;
  let email = document.querySelector('[name=email]').value;
  let imagem = document.querySelector('[name=imagem]').value;
  let categoria = document.querySelector('[name=categoria]').value;
  let dataInicial = document.querySelector('[name=data_inicial]').value;
  let tipoHabilitacao = document.querySelector('[name=tipo_habilitacao]').value;
  let status = "Pendente";
  let cpf = document.querySelector('[name=cpf]').value;

  // Verificar se o CPF ou e-mail já existe antes de adicionar o aluno
  db.collection('alunos').where('cpf', '==', cpf).get().then((querySnapshot) => {
    if (!querySnapshot.empty) {
      alert('CPF já existe, não é permitido criar outro usuário com o mesmo CPF.');
    } else {
      db.collection('alunos').where('email', '==', email).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          alert('E-mail já existe, não é permitido criar outro usuário com o mesmo e-mail.');
        } else {
          // CPF e e-mail não existem, criar o novo aluno
          db.collection('alunos').add({
            nome: nome,
            email: email,
            imagem: imagem,
            categoria_cnh: categoria,
            data_inicial: dataInicial,
            tipo_habilitacao: tipoHabilitacao,
            cpf: cpf,
            status: status
          }).then(() => {
            alert('Cadastrado com sucesso!');
          }).catch((error) => {
            console.error('Erro ao cadastrar:', error);
          });
        }
      }).catch((error) => {
        console.error('Erro ao verificar o e-mail existente:', error);
      });
    }
  }).catch((error) => {
    console.error('Erro ao verificar o CPF existente:', error);
  });
});

cancelButton.addEventListener('click', () => {
  // Implemente a lógica para cancelar o formulário
  console.log('Formulário cancelado.');
});

submitButton.addEventListener('click', () => {
  // Implemente a lógica para salvar o formulário
  console.log('Formulário salvo.');
});

// Restante do código...

db.collection('alunos').onSnapshot(function (snapshot) {
  const dataBody = document.getElementById('dataBody');
  dataBody.innerHTML = '';

  snapshot.forEach(function (doc) {
    const row = document.createElement('tr');
    const nomeCell = document.createElement('td');
    const categoriaCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const dataInicialCell = document.createElement('td');

    nomeCell.innerHTML = `
      <div class="flex items-center text-sm">
        <div class="relative hidden w-8 h-8 mr-3 md:block">
          <img class="object-cover w-full h-full rounded-full" src="${doc.data().imagem}" alt="" loading="lazy" />
        </div>
        <div>
          <p class="font-semibold">${doc.data().nome}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400">${doc.data().tipo_habilitacao}</p>
        </div>
      </div>
    `;

    categoriaCell.textContent = doc.data().categoria_cnh;
    statusCell.innerHTML = `
      <div class="px-4 py-3 font-semibold items-center leading-tight rounded-full
        ${doc.data().status === 'Pendente' ? 'text-status-pendente' :
        doc.data().status === 'Aprovado' ? 'text-status-aprovado' :
        doc.data().status === 'Cancelado' ? 'text-status-cancelado' :
        doc.data().status === 'Expirado' ? 'text-status-expirado' : ''}">
        <div class="flex items-center text-sm">
          <div>
            <p class="font-semibold items-center text-sm">${doc.data().status}</p>
          </div>
        </div>
      </div>
    `;

    dataInicialCell.textContent = doc.data().data_inicial;

    row.classList.add('text-gray-700', 'dark:text-gray-400');
    row.appendChild(nomeCell);
    row.appendChild(categoriaCell);
    row.appendChild(statusCell);
    row.appendChild(dataInicialCell);

    dataBody.appendChild(row);
  });
});

const newAlunoButton = document.getElementById('newAlunoButton');
const formCard = document.getElementById('formCard');
const alunoForm = document.getElementById('alunoForm');

newAlunoButton.addEventListener('click', () => {
  formCard.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
  formCard.style.display = 'none';
});

alunoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obter os valores dos campos do formulário
  const nome = document.getElementById('nomeInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  // Outros campos do formulário
  // ...

  // Limpar os campos do formulário
  alunoForm.reset();

  // Ocultar o formulário
  formCard.style.display = 'none';

  // Processar os dados do formulário (por exemplo, enviar para o servidor)
  console.log('Nome:', nome);
  console.log('Email:', email);
  console.log('Senha:', password);
});
