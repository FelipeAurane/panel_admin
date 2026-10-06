let db;
let dbOrder;

// Função para inicializar o Firebase e atribuir a db
function inicializarFirebase(colecao) {
  const firebaseConfig = {
    apiKey: "AIzaSyD0XYPKwS7FtnzKAKVJ-u8DpqTKRnuMrFo",
    authDomain: "dc-app-15757.firebaseapp.com",
    databaseURL: "https://dc-app-15757-default-rtdb.firebaseio.com",
    projectId: "dc-app-15757",
    storageBucket: "dc-app-15757.appspot.com",
    messagingSenderId: "729530524480",
    appId: "1:729530524480:web:98ae85ac4901781f6490a5",
    measurementId: "G-SFKPRYNZQ4"
  };

  // Verifica se o aplicativo já foi inicializado
  if (!firebase.apps.length) {
    // Inicializa o Firebase com a configuração fornecida
    firebase.initializeApp(firebaseConfig);
  } else {
    // Se o aplicativo já foi inicializado, use o aplicativo existente
    firebase.app();
  }

  // Atribui db à coleção especificada
  db = firebase.firestore().collection(colecao);
  dbOrder = db.orderBy("timestamp");
}
