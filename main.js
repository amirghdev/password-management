const { BrowserWindow, app, Menu } = require("electron");
const path = require("path");

let isDev = process.env.NODE_ENV !== "development";

const createWindow = () => {
  const win = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    width: 1000,
    title: "password management",
    height: 600,
    autoHideMenuBar: true,
    icon: "./icon.ico",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // open devtools for dev
  // if (isDev) {
  //   win.webContents.openDevTools();
  // }
  win.loadFile(path.join(__dirname, "./public/html/index.html"));
};

app.whenReady().then(() => {
  createWindow();
  Menu.app.on("activate", () => {
    if (BrowserWindow.getAllWindows.length == 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
