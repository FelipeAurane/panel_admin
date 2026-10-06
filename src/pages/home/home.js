// Inicialize o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0XYPKwS7FtnzKAKVJ-u8DpqTKRnuMrFo",
  authDomain: "dc-app-15757.firebaseapp.com",
  databaseURL: "https://dc-app-15757-default-rtdb.firebaseio.com",
  projectId: "dc-app-15757",
  storageBucket: "dc-app-15757.appspot.com",
  messagingSenderId: "729530524480",
  appId: "1:729530524480:web:98ae85ac4901781f6490a5",
  measurementId: "G-SFKPRYNZQ4"
};
firebase.initializeApp(firebaseConfig);


// Obtém uma referência para o objeto de autenticação
const auth = firebase.auth();

const logOutButton = document.getElementById('log_out_button');
logOutButton.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      // Redirecionar para a página de login após logout
      window.location.href = '../../pages/login/index.html';
    })
    .catch((error) => {
      console.error('Erro ao fazer logout:', error);
    });
});



const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }
});

function menuToggle(){
  const toggleMenu = document.querySelector('.menu-content');
  toggleMenu.classList.toggle('active')
}


const fecharButton = document.getElementById('fecharButton');

fecharButton.addEventListener('click', () => {
  window.close();
});











const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const calendario = document.querySelector('.calendario');
const mesAtualElemento = document.getElementById('mes-atual');
const diasElemento = document.getElementById('dias');
const mesAnterior = document.getElementById('mes-anterior');
const mesProximo = document.getElementById('mes-proximo');

let dataAtual = new Date();

function renderCalendario(ano, mes) {
  mesAtualElemento.textContent = meses[mes] + ' ' + ano;

  let primeiroDia = new Date(ano, mes, 1).getDay();
  let ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
  let ultimoDia = new Date(ano, mes + 1, 0).getDate();

  let diasHTML = '';
  let dia = 1;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < primeiroDia) {
        diasHTML += `<span class="outro-mes">${ultimoDiaMesAnterior - primeiroDia + j + 1}</span>`;
      } else if (dia <= ultimoDia) {
        let classeDia = (dia === dataAtual.getDate() && mes === dataAtual.getMonth() && ano === dataAtual.getFullYear()) ? 'hoje' : '';
        diasHTML += `<span class="${classeDia}">${dia}</span>`;
        dia++;
      } else {
        diasHTML += `<span class="outro-mes">${dia - ultimoDia}</span>`;
        dia++;
      }
    }
  }

  diasElemento.innerHTML = diasHTML;

  // Ocultar ou exibir botões de meses anteriores e próximos
  const hoje = new Date();
  if (hoje.getMonth() === mes && hoje.getFullYear() === ano) {
    mesAnterior.style.display = 'none';
    mesProximo.style.display = 'none';
  } else {
    mesAnterior.style.display = 'inline';
    mesProximo.style.display = 'inline';
  }
}

renderCalendario(dataAtual.getFullYear(), dataAtual.getMonth());

document.getElementById('mes-anterior').addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  renderCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
});

document.getElementById('mes-proximo').addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
});
