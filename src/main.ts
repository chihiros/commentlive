import { app, BrowserWindow, screen, Menu, MenuItem, shell, Tray, clipboard } from "electron";
import * as prompt from 'electron-prompt';
import * as path from "path";

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
// const is_linux = process.platform === 'linux'
let win: BrowserWindow;

function createWindow() {
  // Windowのサイズを取得する
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log(width, height);

  win = new BrowserWindow({
    title: "CommentLive",
    // width: width,
    // height: height,
    width: 800,
    height: 600,
    transparent: true,
  });

  win.loadFile(path.join(__dirname, "../index.html"));
}

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateName() {
  const name1 = ["computer", "design", "art", "human", "410", "interface", "tmu"];
  const name2 = ["room", "class", "conference", "event", "area", "place"];
  const name = capFirst(name1[getRandomInt(0, name1.length)]) + '_' + capFirst(name2[getRandomInt(0, name2.length)]);
  return name;
}

app.whenReady().then(() => {
  createWindow()
  const menu = Menu.buildFromTemplate(
    [{
      label: app.name,
      submenu: [
        { role: 'quit', label: `${app.name} を終了` }
      ]
    }]);
  Menu.setApplicationMenu(menu);

  let g_room = "";
  prompt({
    title: 'CommentLive',
    alwaysOnTop: true,
    label: '部屋名を入力して入室してください',
    value: generateName(),
    // value: "test_room",
    //menuBarVisible: true,
    buttonLabels: {
      ok: '入室',
      cancel: 'やめる'
    },
    inputAttrs: {
      type: 'text',
      // required: true
    },
    type: 'input',
    //resizable: true,
    // customStylesheet: path.join(__dirname, '/css/prompt.css')
  }).then((r) => {
    win.setAlwaysOnTop(true, "screen-saver")
    win.setIgnoreMouseEvents(true);
    win.loadFile('index.html')

    let room = "";
    if (r === null) {
      console.log('user cancelled');
      room = "";
      app.quit();
    } else {
      console.log('result', r);
      room = r;
    }
    g_room = room;
    let tray: Tray;
    if (is_windows) tray = new Tray(`${__dirname}/images/icon.ico`);
    else if (is_mac) tray = new Tray(`${__dirname}/images/icon.png`);

    // const hostname = "https://commentable.fly.dev";
    const hostname = "http://localhost:8080";
    // const hostname = proccess.env.HOSTNAME;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "投稿ページを開く", click: async () => {
          await shell.openExternal(hostname + '/?room=' + g_room);
        }
      },
      {
        label: '投稿ページURLをコピー',
        click() {
          clipboard.writeText(hostname + '/?room=' + g_room);
          console.log(hostname + '/?room=' + encodeURI(g_room));
        }
      },
      {
        type: 'separator',
      },
      {
        label: "QR Code表示",
        submenu: [
          {
            label: '非表示', type: 'radio',
            click(item, focusedWindow) {
              console.log(item, focusedWindow);
              win.webContents.executeJavaScript(`toggleQR(${item.checked}, "none", "${g_room}");`, true)
                .catch(console.error);
            }
          },
          {
            label: 'QR Code [CENTER]', type: 'radio',
            click(item, focusedWindow) {
              console.log(item, focusedWindow);
              win.webContents.executeJavaScript(`toggleQR(${item.checked}, "center", "${g_room}");`, true)
                .catch(console.error);
            }
          },
          {
            label: 'QR Code [TOP RIGHT]', type: 'radio', checked: true,
            click(item, focusedWindow) {
              console.log(item, focusedWindow);
              win.webContents.executeJavaScript(`toggleQR(${item.checked}, "top_right", "${g_room}");`, true)
                .catch(console.error);
            }
          },
        ]
      },

      {
        label: '投稿制限解除', type: 'checkbox',
        click(item) {
          win.webContents.executeJavaScript(`toggleCommentControl(${item.checked});`, true)
            .catch(console.error);
        }
      },

      {
        label: 'Mute sound', type: 'checkbox',
        click() {
          win.webContents.executeJavaScript(`toggleSoundMute();`, true)
            .catch(console.error);
        }
      },
      {
        type: 'separator',
      },
      { label: 'Quit Commentable-Viewer', role: 'quit' },
    ])

    const screens = screen.getAllDisplays();

    let data_append: Electron.MenuItemConstructorOptions;
    data_append.label = '表示ディスプレイ選択';

    const submenu: Electron.MenuItemConstructorOptions[] = [];
    for (const sc of screens) {
      submenu.push({
        label: `Display-${sc.id} [${sc.bounds.x}, ${sc.bounds.y}] ${sc.bounds.width}x${sc.bounds.height}`,
        type: 'radio',
        // x: sc.workArea.x,
        // y: sc.workArea.y,
        // w: sc.workArea.width,
        // h: sc.workArea.height,
        click: function (item: any) {
          console.log(item);
          win.setPosition(item.x, item.y, true);
          win.setSize(item.w, item.h, true);
          console.log(item.x, item.y, item.w, item.h);
        }
      });
    }
    data_append.submenu = submenu;
    contextMenu.insert(3, new MenuItem(data_append));

    tray.setToolTip('commentable-viewer')

    tray.setContextMenu(contextMenu)
    //クリック時の操作を設定
    tray.on('click', () => {
      // メニューを表示
      tray.popUpContextMenu(contextMenu)
    })

    win.webContents.executeJavaScript(`startSocketConnection("${room}");`, true)
      .catch(console.error);
  }).catch(console.error);


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
