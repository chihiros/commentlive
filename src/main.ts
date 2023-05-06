import { app, BrowserWindow, screen, Menu, MenuItem, Tray, shell, clipboard } from "electron";
import * as prompt from 'electron-prompt';
import * as path from "path";
import { HOSTNAME, APP_NAME, GetScreenSize, SetServerUrl, SetRoomName, GetRoomName } from "./constants";
import { generateName } from "./utils";
import { contextMenu } from "./menu";
import { createPrompt, PromptResponse } from "./prompt";

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
// const is_linux = process.platform === 'linux'
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    title: "CommentLive",
    // width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    width: 800,
    height: 600,
    transparent: true,
  });
  win.loadFile('index.html');
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
      createWindow();
      win.setAlwaysOnTop(true, "screen-saver")
      win.setIgnoreMouseEvents(true);
      console.log("handlePrompt - then");
      console.log(e);
    })
    .catch(console.error);

  let tray: Tray;
  if (is_windows) tray = new Tray(`${__dirname}/images/icon.ico`);
  else if (is_mac) tray = new Tray(`${__dirname}/images/icon.png`);

  //   const screens = screen.getAllDisplays();

  //   let data_append: Electron.MenuItemConstructorOptions;
  //   data_append.label = '表示ディスプレイ選択';

  //   const submenu: Electron.MenuItemConstructorOptions[] = [];
  //   for (const sc of screens) {
  //     submenu.push({
  //       label: `Display-${sc.id} [${sc.bounds.x}, ${sc.bounds.y}] ${sc.bounds.width}x${sc.bounds.height}`,
  //       type: 'radio',
  //       // x: sc.workArea.x,
  //       // y: sc.workArea.y,
  //       // w: sc.workArea.width,
  //       // h: sc.workArea.height,
  //       click: function (item: any) {
  //         console.log(item);
  //         win.setPosition(item.x, item.y, true);
  //         win.setSize(item.w, item.h, true);
  //         console.log(item.x, item.y, item.w, item.h);
  //       }
  //     });
  //   }
  //   data_append.submenu = submenu;
  //   const cMenu = contextMenu();
  //   cMenu.insert(3, new MenuItem(data_append));

  //   tray.setToolTip('commentable-viewer')

  //   tray.setContextMenu(cMenu)
  //   //クリック時の操作を設定
  //   tray.on('click', () => {
  //     // メニューを表示
  //     tray.popUpContextMenu(cMenu)
  //   })

  //   win.webContents.executeJavaScript(`startSocketConnection("${room}");`, true)
  //     .catch(console.error);
  // }).catch(console.error);


  win.webContents.on('did-finish-load', () => {
    win.show();
    // QRコードの表示
    win.webContents.executeJavaScript(`toggleQR(true, "top_right", "${GetRoomName()}");`, true)
      // .then(result => { })
      .catch(console.error);

  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
