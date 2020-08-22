const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Badge = require('electron-windows-badge');

let mainWindow;

function createWindow() {
  console.log('dirname', __dirname);
  app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
      height: 700,
      width: 1200,
      webPreferences: {
        webSecurity: true,
        nodeIntegration: true,
        preload: path.join(__dirname, '../public/preload.js'),
      },
    });
    const badgeOptions = {}
    new Badge(mainWindow, badgeOptions);

    mainWindow.loadURL('http://localhost:3000');
    app.setBadgeCount(2);
    // mainWindow.webContents.on('did-start-navigation', () => {
    //   ipcMain.on("")
    // });
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
