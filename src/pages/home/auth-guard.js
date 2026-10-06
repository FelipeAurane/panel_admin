let tasks = [];
let currentUser = {};

function getUser() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentUser.uid = user.uid;
        let userLabel = document.getElementById("navbarDropdown");
        userLabel.innerHTML = user.email;
        resolve();
      } else {
        reject(new Error("Usuário não logado."));
      }
    });
  });
}

async function initializeApp() {
  try {
    await getUser();
    await readTasks();
  } catch (error) {
    console.error(error);
    swal({
      title: "Acesso negado",
      text: "Você precisa estar logado para acessar esta página.",
      icon: "error",
      closeOnClickOutside: false,
    }).then(() => {
      window.location.replace("../../index.html");
    });
  }
}

window.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});
