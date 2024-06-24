const { app, BrowserWindow } = require("electron");
const path = require("path");

// Dynamically import 'electron-is-dev' as an ES module
const isDevPromise = import("electron-is-dev");

// Require your server here to start it with the Electron app
require("./index.js");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile("index.html");

  // Wait for isDevPromise to resolve
  isDevPromise
    .then((isDev) => {
      if (isDev.default) {
        win.webContents.openDevTools();
      }
    })
    .catch((err) => {
      console.error("Failed to check if in development mode:", err);
    });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
