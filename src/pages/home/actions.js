document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-links a[data-screen]");
    const homeDivs = document.querySelectorAll(".home-div > div");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const screen = this.getAttribute("data-screen");
            showDiv(screen);
        });
    });

    function showDiv(screen) {
        homeDivs.forEach(function (div) {
            if (div.classList.contains("home-div-" + screen)) {
                div.style.display = "block";
            } else {
                div.style.display = "none";
            }
        });
    }

    // Exibir a div "Inicio" quando a tela for carregada
    showDiv("inicio");


    // Após a conexão com o Firebase e a internet ser estabelecida
    // Esconder o preloader e exibir o conteúdo da tela Home
    function showHomeContent() {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("home-div").style.display = "block";
    }

    // Simulação do tempo de carregamento
    setTimeout(showHomeContent, 3000); // Altere o valor (3000ms) para o tempo necessário para estabelecer a conexão com o Firebase e a internet

});


