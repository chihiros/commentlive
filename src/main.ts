import { app, BrowserWindow, screen, Menu, MenuItem, Tray } from "electron";
import * as prompt from 'electron-prompt';
import * as path from "path";
import { GetScreenSize } from "./constants";
import { generateName } from "./utils";
import { contextMenu } from "./menu";
import { createPrompt } from "./prompt";

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
}

app.whenReady().then(() => {
  createWindow()
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
      // win.setAlwaysOnTop(true, "screen-saver")
      // win.setIgnoreMouseEvents(true);
      // win.loadFile('index.html')
      console.log("handlePrompt - then");
      console.log(e);

    })
    .catch(console.error);

  const g_room = "";
  // prompt({
  //   title: 'CommentLive',
  //   // alwaysOnTop: true,
  //   label: '部屋名を入力して入室してください',
  //   // value: generateName(),
  //   value: "test_room",
  //   //menuBarVisible: true,
  //   buttonLabels: {
  //     ok: '入室',
  //     cancel: 'やめる'
  //   },
  //   inputAttrs: {
  //     type: 'text',
  //     // required: true
  //   },
  //   type: 'input',
  //   //resizable: true,
  //   // customStylesheet: path.join(__dirname, '/css/prompt.css')
  // }).then((r) => {
  //   win.setAlwaysOnTop(true, "screen-saver")
  //   win.setIgnoreMouseEvents(true);
  //   win.loadFile('index.html')

  //   let room = "";
  //   if (r === null) {
  //     console.log('user cancelled');
  //     room = "";
  //     app.quit();
  //   } else {
  //     console.log('result', r);
  //     room = r;
  //   }
  //   g_room = room;
  //   let tray: Tray;
  //   if (is_windows) tray = new Tray(`${__dirname}/images/icon.ico`);
  //   else if (is_mac) tray = new Tray(`${__dirname}/images/icon.png`);

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
    win.webContents.executeJavaScript(`toggleQR(true, "top_right", "${g_room}");`, true)
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
