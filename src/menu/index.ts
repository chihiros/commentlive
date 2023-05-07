import { BrowserWindow, Menu, shell, clipboard, screen } from 'electron';
import { HOSTNAME, GetRoomName } from "../constants";

export function contextMenu(win: BrowserWindow): Menu {
  const screens = screen.getAllDisplays();
  console.log("screens", screens);

  const submenu: Electron.MenuItemConstructorOptions[] = [];
  for (const sc of screens) {
    submenu.push({
      label: `${sc.label} [${sc.bounds.width}x${sc.bounds.height}]`,
      type: 'radio',
      click: function () {
        win.setPosition(sc.bounds.x, sc.bounds.y, true);
        win.setSize(sc.bounds.width, sc.bounds.height, true);
        console.log(sc.bounds.x, sc.bounds.y, sc.bounds.width, sc.bounds.height);

      }
    });
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "投稿ページを開く",
      click: async () => {
        await shell.openExternal(HOSTNAME + '/?room=' + GetRoomName());
      }
    },
    {
      label: '投稿ページURLをコピー',
      click() {
        clipboard.writeText(HOSTNAME + '/?room=' + GetRoomName());
        console.log(HOSTNAME + '/?room=' + encodeURI(GetRoomName()));
      }
    },
    {
      type: 'separator',
    },
    {
      label: '表示ディスプレイ選択',
      submenu: submenu,
    },
    {
      label: "QR Code表示",
      submenu: [
        {
          label: '非表示', type: 'radio',
          click(item, focusedWindow) {
            console.log(item, focusedWindow);
            win.webContents.executeJavaScript(`toggleQR(${item.checked}, "none", "${GetRoomName()}");`, true)
              .catch(console.error);
          }
        },
        {
          label: 'QR Code [CENTER]', type: 'radio',
          click(item, focusedWindow) {
            console.log(item, focusedWindow);
            win.webContents.executeJavaScript(`toggleQR(${item.checked}, "center", "${GetRoomName()}");`, true)
              .catch(console.error);
          }
        },
        {
          label: 'QR Code [TOP RIGHT]', type: 'radio', checked: true,
          click(item, focusedWindow) {
            console.log(item, focusedWindow);
            win.webContents.executeJavaScript(`toggleQR(${item.checked}, "top_right", "${GetRoomName()}");`, true)
              .catch(console.error);
          }
        },
      ]
    },
    {
      type: 'separator',
    },
    { label: 'Quit Commentable-Viewer', role: 'quit' },
  ]);

  return menu;
}
