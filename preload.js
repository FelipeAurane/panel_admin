// preloader.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendLoginSuccessful: () => {
    ipcRenderer.send('login-successful');
  }
});
