function applyCPFFormat(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto após os primeiros três dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto após os próximos três dígitos
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um traço antes dos últimos dois dígitos
    event.target.value = value;
  }
  
  function applyRGFormat(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/(\d{2})(\d)/, '$1.$2'); // Coloca um ponto após os primeiros dois dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto após os próximos três dígitos
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um traço antes dos últimos dois dígitos
    event.target.value = value;
  }
  
  function formatarDataNascimento(input) {
    let value = input.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/(\d{2})(\d)/, '$1/$2'); // Coloca uma barra após os primeiros dois dígitos
    value = value.replace(/(\d{2})(\d)/, '$1/$2'); // Coloca uma barra após os próximos dois dígitos
    input.value = value;
  }
  
  function formatarHorario(input) {
    let value = input.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/(\d{2})(\d)/, '$1:$2'); // Coloca dois pontos após os primeiros dois dígitos
    input.value = value;
  }

  function applyTelefoneFormat(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses e espaço após o código de área
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca um traço antes dos últimos quatro dígitos
    event.target.value = value;
  }

  function mascararSenha(input) {
    let value = input.value;
    let maskedValue = '';
    for (let i = 0; i < value.length; i++) {
      maskedValue += '•'; // Utiliza um caractere de bullet (•) para mascarar cada caractere da senha
    }
    input.value = maskedValue;
  }