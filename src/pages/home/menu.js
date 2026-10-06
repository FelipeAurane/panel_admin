let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
   let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
   arrowParent.classList.toggle("showMenu");
    });
  }
  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".menu-btn");
  console.log(sidebarBtn);
  sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
  });


  // Código JavaScript para abrir o menu ao clicar nos ícones
const bellIcon = document.querySelector('.bxs-bell');
const collectionIcon = document.querySelector('.bxs-collection');

bellIcon.addEventListener('click', function() {
  // Código para abrir o menu ao clicar no ícone de sino (bxs-bell)
  // Substitua este código com a lógica do seu menu
  console.log('Ícone de sino clicado!');
});

collectionIcon.addEventListener('click', function() {
  // Código para abrir o menu ao clicar no ícone de coleção (bxs-collection)
  // Substitua este código com a lógica do seu menu
  console.log('Ícone de coleção clicado!');
});

