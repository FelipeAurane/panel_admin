// Função para buscar a imagem do usuário
async function getUserImage(uid) {
  const adminRef = await firebase.database().ref("users/admin/" + uid).once("value");
  const funcionarioRef = await firebase.database().ref("users/funcionarios/" + uid).once("value");

  if (adminRef.exists()) {
    const adminData = adminRef.val();
    document.getElementById("image").src = adminData.imageURL;
    document.getElementById("name").textContent = adminData.name;
    document.getElementById("job").textContent = adminData.status;

    const onlineIndicator = document.getElementById("onlineIndicator");
    onlineIndicator.style.display = "block"; // Mostra o ponto verde
  } else if (funcionarioRef.exists()) {
    const funcionarioData = funcionarioRef.val();
    document.getElementById("image").src = funcionarioData.imageURL;
    document.getElementById("name").textContent = funcionarioData.name;
    document.getElementById("job").textContent = funcionarioData.status;

    const onlineIndicator = document.getElementById("onlineIndicator");
    onlineIndicator.style.display = "block"; // Mostra o ponto verde
  } else {
    document.getElementById("image").src = "./profile.jpg";
    document.getElementById("name").textContent = "Nome";
    document.getElementById("job").textContent = "Cargo";

    const onlineIndicator = document.getElementById("onlineIndicator");
    onlineIndicator.style.display = "none"; // Oculta o ponto verde
  }
}

// Função para obter o usuário atual e buscar sua imagem
function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getUserImage(user.uid);
    } else {
      document.getElementById("image").src = "./profile.jpg";
      document.getElementById("name").textContent = "Nome";
      document.getElementById("job").textContent = "Cargo";

      const onlineIndicator = document.getElementById("onlineIndicator");
      onlineIndicator.style.display = "none"; // Oculta o ponto verde
    }
  });
}

// Carregar a função getUser quando a página for carregada
window.onload = function() {
  getUser();
};
