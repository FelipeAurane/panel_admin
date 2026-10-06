// Your Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD0XYPKwS7FtnzKAKVJ-u8DpqTKRnuMrFo",
  authDomain: "dc-app-15757.firebaseapp.com",
  databaseURL: "https://dc-app-15757-default-rtdb.firebaseio.com",
  projectId: "dc-app-15757",
  storageBucket: "dc-app-15757.appspot.com",
  messagingSenderId: "729530524480",
  appId: "1:729530524480:web:98ae85ac4901781f6490a5",
  measurementId: "G-SFKPRYNZQ4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
const auth = firebase.auth();
const database = firebase.database();

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
      return auth.signInWithEmailAndPassword(email, password);
    })
    .then(function(userCredential) {
      const user = userCredential.user;
      const usersRef = database.ref('users');

      usersRef.child('admin').orderByChild('email').equalTo(user.email).once('value')
        .then(function(adminSnapshot) {
          if (adminSnapshot.exists()) {
            // User is an admin, send login successful event
            window.api.sendLoginSuccessful();
          } else {
            usersRef.child('funcionarios').orderByChild('email').equalTo(user.email).once('value')
              .then(function(employeesSnapshot) {
                if (employeesSnapshot.exists()) {
                  // User is an employee, send login successful event
                  window.api.sendLoginSuccessful();
                } else {
                  alert('Email não encontrado nos dados do usuário!');
                }
              })
              .catch(function(error) {
                console.error('Erro ao verificar usuário no banco de dados:', error);
              });
          }
        })
        .catch(function(error) {
          console.error('Erro ao verificar usuário no banco de dados:', error);
        });
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorElement = document.getElementById('error-message');

  emailInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      login();
    }
  });

  emailInput.addEventListener('input', function() {
    clearError();
  });

  passwordInput.addEventListener('input', function() {
    clearError();
  });

  function clearError() {
    errorElement.textContent = '';
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
  }

  function displayError(message) {
    errorElement.textContent = message;
  }

  function clearInputs() {
    emailInput.value = '';
    passwordInput.value = '';
    clearError();
  }

  function login() {
    const email = emailInput.value;
    const password = passwordInput.value;
  
    // ... Resto do código de login ...
  
    // Exemplo de verificação: validar se o email e a senha são válidos
    if (email === '' || password === '') {
      displayError('Preencha todos os campos!');
      emailInput.classList.add('input-error');
      passwordInput.classList.add('input-error');
    } else {
      // Lógica de autenticação bem-sucedida
      // Faça as ações necessárias após um login bem-sucedido
    }
  }

  clearInputs(); // Chama a função para limpar os inputs quando a página é carregada
});

document.addEventListener("DOMContentLoaded", function(event) {
  const splashContainer = document.querySelector(".splash-container");
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  emailInput.value = ""; // Limpa o valor do input de email
  passwordInput.value = ""; // Limpa o valor do input de senha

  setTimeout(function() {
    splashContainer.classList.add("fade-out");

    setTimeout(function() {
      splashContainer.style.display = "none";
    }, 1000); // Tempo de duração da animação de fade-out (1 segundo no exemplo)
  }, 5000); // Tempo em milissegundos antes de o elemento desaparecer (5 segundos no exemplo)
});



