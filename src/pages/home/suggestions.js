// Verifica se o aplicativo já foi inicializado
if (!firebase.apps.length) {
  // Inicializa o Firebase
  firebase.initializeApp(firebaseConfig);
} else {
  // Se o aplicativo já foi inicializado, use o aplicativo existente
  firebase.app();
}

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const suggestionsList = document.getElementById('suggestionsList');

searchInput.addEventListener('input', handleSearchInput);
document.addEventListener('click', handleOutsideClick);

function handleSearchInput() {
  const searchValue = searchInput.value.trim();
  suggestionsContainer.style.display = searchValue.length > 0 ? 'block' : 'none';

  if (searchValue.length > 0) {
    performSearch(searchValue);
  }
}

function handleOutsideClick(event) {
  const isClickedOutside = !searchInput.contains(event.target) && !suggestionsContainer.contains(event.target);
  if (isClickedOutside) {
    suggestionsContainer.style.display = 'none';
  }
}

function performSearch(searchValue) {
  const searchRef = firebase.database().ref('alunos');

  searchRef.orderByChild('nome')
    .startAt(searchValue.toLowerCase())
    .endAt(searchValue.toLowerCase() + '\uf8ff')
    .once('value')
    .then(function(snapshot) {
      const results = [];

      snapshot.forEach(function(childSnapshot) {
        const aluno = childSnapshot.val();
        results.push(aluno);
      });

      displaySearchResults(results);
    })
    .catch(function(error) {
      console.error('Erro ao buscar resultados:', error);
    });
}

function displaySearchResults(results) {
  suggestionsList.innerHTML = '';

  if (results.length > 0) {
    results.forEach(function(aluno) {
      const listItem = document.createElement('li');
      const nome = aluno.nome;
      const cpf = aluno.cpf;
      const email = aluno.email;
      const telefone = aluno.telefone;

      listItem.textContent = `Nome: ${nome}, CPF: ${cpf}, Email: ${email}, Telefone: ${telefone}`;
      suggestionsList.appendChild(listItem);
    });
  } else {
    const noResultsItem = document.createElement('li');
    noResultsItem.textContent = 'Nenhum resultado';
    suggestionsList.appendChild(noResultsItem);
  }
}

searchInput.addEventListener('input', function() {
  const searchValue = searchInput.value.trim();
  suggestionsContainer.style.display = searchValue.length > 0 ? 'block' : 'none';
});

document.addEventListener('click', function(event) {
  const isClickedOutside = !searchInput.contains(event.target) && !suggestionsContainer.contains(event.target);
  if (isClickedOutside) {
    suggestionsContainer.style.display = 'none';
  }
});