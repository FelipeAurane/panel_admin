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