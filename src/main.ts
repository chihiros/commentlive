import { app, BrowserWindow, screen } from "electron";
import * as path from "path";

function createWindow() {
  // Windowのサイズを取得する
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // console.log(width, height);

  const mainWindow = new BrowserWindow({
    // width: width,
    // height: height,
    width: 800,
    height: 600,
    transparent: true,

    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    // },
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
