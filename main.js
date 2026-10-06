// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  

  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets', 'ic.png'), // Substitua 'icon.ico' pelo nome do seu arquivo de ícone
    width: width,
    height: height,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  const indexPath = path.join(__dirname, 'src', 'pages', 'login', 'index.html');
  mainWindow.loadFile(indexPath);

  ipcMain.on('login-successful', () => {
    const homePath = path.join(__dirname, 'src', 'pages', 'home', 'home.html');
    mainWindow.loadFile(homePath);
  });


  

}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
