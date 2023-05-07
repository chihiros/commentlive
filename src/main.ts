import { app, BrowserWindow, screen, Menu, MenuItem, Tray, shell, clipboard } from "electron";
import { HOSTNAME, APP_NAME, SetServerUrl, SetRoomName, GetRoomName } from "./constants";
import { createPrompt, PromptResponse } from "./prompt";
import { contextMenu } from "./menu";

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
// const is_linux = process.platform === 'linux'

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    title: "CommentLive",
    // width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    width: 800,
    height: 600,
    transparent: true,
  });
  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.show();
    // QRコードの表示
    win.webContents.executeJavaScript(`toggleQR(true, "top_right", "${GetRoomName()}");`, true)
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
  });

  return win;
}

app.setName(APP_NAME);
app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: 'quit', label: `${app.name} を終了` }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  console.log("handlePrompt");
  createPrompt()
    .then((e: PromptResponse) => {
      // キャンセルされた場合はアプリを終了する
      if (!e) {
        app.quit();
        return;
      }
      SetServerUrl(e.serverUrl);
      SetRoomName(e.roomName);
      const win = createWindow();

      win.setAlwaysOnTop(true, "screen-saver")
      win.setIgnoreMouseEvents(true);
      console.log("handlePrompt - then");
      console.log(e);

      const cMenu = contextMenu(win);

      let tray: Tray;
      if (is_windows) tray = new Tray(`${__dirname}/images/icon.ico`);
      else if (is_mac) tray = new Tray(`${__dirname}/images/icon.png`);

      tray.setToolTip('commentable-viewer')

      tray.setContextMenu(cMenu)
      //クリック時の操作を設定
      tray.on('click', () => {
        // メニューを表示
        tray.popUpContextMenu(cMenu)
      })

      console.log("GetRoomName(): ", GetRoomName());


      win.webContents.executeJavaScript(`startSocketConnection("${GetRoomName()}");`, true)
        .catch(console.error);
    })
    .catch(console.error);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
