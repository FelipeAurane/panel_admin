const photoInput = document.getElementById("photoInput");
const thumbnailContainer = document.getElementById("thumbnailContainer");

photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];

  if (file) {
    const photoURL = URL.createObjectURL(file);
    const thumbnail = thumbnailContainer.querySelector(".thumbnail");
    thumbnail.src = photoURL;
    thumbnailContainer.style.display = "block"; // Exibe o contêiner da miniatura
  }
});

function deleteThumbnail() {
  const thumbnailContainer = document.getElementById("thumbnailContainer");
  const thumbnail = thumbnailContainer.querySelector(".thumbnail");
  
  if (thumbnail) {
    thumbnail.src = ""; // Define o atributo src da miniatura como vazio
    thumbnailContainer.style.display = "none"; // Oculta o contêiner da miniatura
  }
}

function adicionarPost() {
  const postText = document.getElementById("postText").value;
  const photoInput = document.getElementById("photoInput");
  const postList = document.getElementById("postList");
  const thumbnail = thumbnailContainer.querySelector(".thumbnail");

  if (postText || photoInput.files.length > 0) {
    const post = document.createElement("div");
    post.classList.add("post");

    const postImage = document.createElement("img");
    post.appendChild(postImage);

    const postInfo = document.createElement("div");
    postInfo.classList.add("post-info");

    const postAuthorInfo = document.createElement("div");
    postAuthorInfo.classList.add("author-info");

    const postAuthorImage = document.createElement("div");
    postAuthorImage.classList.add("author-image");
    postAuthorInfo.appendChild(postAuthorImage);

    const postAuthorName = document.createElement("span");
    postAuthorName.classList.add("name");
    postAuthorName.textContent = "Auto Escola DC"; // Troque "Nome do Usuário" pelo nome do usuário
    postAuthorInfo.appendChild(postAuthorName);

    postInfo.appendChild(postAuthorInfo);


    const postContent = document.createElement("p");
    postContent.id = "p";
    postContent.textContent = postText;
    postInfo.appendChild(postContent);
    
  
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      const photoURL = URL.createObjectURL(file);

      const postPhoto = document.createElement("img");
      postPhoto.src = photoURL;
      postInfo.appendChild(postPhoto);

      // Exibe o contêiner da miniatura ao adicionar uma imagem
      thumbnailContainer.style.display = "block";
    } else {
      // Oculta o contêiner da miniatura caso não haja imagem
      thumbnailContainer.style.display = "none";
    }

    const postTime = document.createElement("span");
    postTime.classList.add("post-time");
    postTime.textContent = obterHoraAtual();
    postInfo.appendChild(postTime);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const likeButton = document.createElement("button");
    likeButton.classList.add("edit-button");
    likeButton.innerHTML = "<i class='bx bxs-edit'></i> Editar";
    buttonsContainer.appendChild(likeButton);

    const arqButton = document.createElement("button");
    arqButton.classList.add("arq-button");
    arqButton.innerHTML = "<i class='bx bxs-folder'></i> Arquivar";
    buttonsContainer.appendChild(arqButton);

    const deletButton = document.createElement("button");
    deletButton.classList.add("deletar-button");
    deletButton.innerHTML = "<i class='bx bxs-trash'></i> Deletar";
    buttonsContainer.appendChild(deletButton);

    postInfo.appendChild(buttonsContainer);

    post.appendChild(postInfo);

    // Insere o novo post antes do primeiro elemento existente na lista
    const primeiroPost = postList.firstChild;
    postList.insertBefore(post, primeiroPost);

    // Limpar o campo de texto e o input de fotos
    document.getElementById("postText").value = "";
    photoInput.value = "";
    thumbnail.src = ""; // Define o atributo src da miniatura como vazio
    thumbnailContainer.style.display = "none"; // Oculta o contêiner da miniatura
  }
}


function obterHoraAtual() {
  const dataAtual = new Date();
  const hora = dataAtual.getHours().toString().padStart(2, "0");
  const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
  return `${hora}:${minutos}`;
}






const menuItems = document.querySelectorAll(".menu-horizontal li");
const telas = document.querySelectorAll(".tela");

function abrirTela(tela) {
  // Encontra o índice da tela selecionada
  const indexTela = Array.from(menuItems).findIndex((item) => item.textContent.toLowerCase() === tela);

  // Remove a classe "selected" de todos os itens do menu
  menuItems.forEach((menuItem) => {
    menuItem.classList.remove("selected");
  });

  // Adiciona a classe "selected" apenas ao item do menu clicado
  menuItems[indexTela].classList.add("selected");

  // Mostra a div correspondente e oculta as outras
  telas.forEach((tela, index) => {
    tela.style.display = index === indexTela ? "block" : "none";
  });
}

