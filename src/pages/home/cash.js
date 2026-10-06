// Importe a biblioteca do Stripe
// Chave definida via variável de ambiente para segurança
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

// Crie uma nova conta de cliente
const createCustomer = async (nome, email) => {
  try {
    const customer = await stripe.customers.create({
      name: nome,
      email: email,
    });
    return customer;
  } catch (error) {
    console.error('Erro ao criar conta de cliente:', error);
    throw error;
  }
};

// Exemplo de uso: Crie um novo cliente
const nomeCliente = 'João Silva';
const emailCliente = 'joao.silva@example.com';

createCustomer(nomeCliente, emailCliente)
  .then((customer) => {
    console.log('Conta de cliente criada:', customer);
  })
  .catch((error) => {
    console.error('Erro ao criar conta de cliente:', error);
  });

// Registre um pagamento e atualize o saldo em conta
const registrarPagamento = async (idCliente, valor) => {
  try {
    // Crie uma cobrança para o cliente
    const charge = await stripe.charges.create({
      customer: idCliente,
      amount: valor,
      currency: 'brl',
    });

    // Atualize o saldo em conta do cliente
    await stripe.customers.update(idCliente, {
      balance: {
        // Adicione o valor do pagamento ao saldo existente
        available: charge.amount + charge.balance_transaction.amount,
      },
    });

    return charge;
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    throw error;
  }
};

// Exemplo de uso: Registre um pagamento de R$100 para o cliente com ID 'cus_123'
const idCliente = 'cus_123';
const valorPagamento = 10000; // O valor é fornecido em centavos (R$100)

registrarPagamento(idCliente, valorPagamento)
  .then((charge) => {
    console.log('Pagamento registrado:', charge);
  })
  .catch((error) => {
    console.error('Erro ao registrar pagamento:', error);
  });
