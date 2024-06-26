"use strict";
const electron = require("electron");
const path = require("path");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
let mainWindow;
electron.autoUpdater.setFeedURL({
  provider: "github",
  repo: "https://github.com/lakshya-chandra/image-filter-app.git",
  owner: "lakshya-chandra",
  releaseType: "release",
  url: "https://github.com/lakshya-chandra/image-filter-app"
});
async function handleFileOpen() {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/preload.js"),
      webSecurity: false
    }
  });
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => mainWindow = null);
}
electron.app.whenReady().then(() => {
  electron.ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("ready", () => {
  electron.autoUpdater.checkForUpdates();
});
electron.app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
