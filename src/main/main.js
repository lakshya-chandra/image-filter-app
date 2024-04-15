import { app, BrowserWindow, dialog, ipcMain, autoUpdater } from 'electron';
import * as path from 'path';

let mainWindow;

autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'https://github.com/lakshya-chandra/image-filter-app.git',
    owner: 'lakshya-chandra',
    releaseType: 'release',
    url: 'https://github.com/lakshya-chandra/image-filter-app'
  });

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      webSecurity: false
    }
  });

  // Vite DEV server URL
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
    autoUpdater.checkForUpdates();
  });

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});