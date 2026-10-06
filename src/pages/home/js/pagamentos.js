// Configure a chave pública do Stripe
var stripe = Stripe('SUA_CHAVE_PUBLICA_DO_STRIPE');

// Capture os detalhes do cartão quando o formulário for enviado
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  var cardNumber = document.getElementById('card-number').value;
  var cardExpiry = document.getElementById('card-expiry').value;
  var cardCVC = document.getElementById('card-cvc').value;

  stripe.createToken(cardNumber, cardExpiry, cardCVC).then(function(result) {
    if (result.error) {
      // Lidar com erros de validação do cartão
      console.error(result.error.message);
    } else {
      // Enviar o token para o seu servidor para processamento posterior
      var token = result.token;
      console.log(token);
      // Faça uma chamada AJAX para enviar o token para o seu servidor
    }
  });
});
