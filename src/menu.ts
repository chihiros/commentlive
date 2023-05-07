import { BrowserWindow, Menu, shell, clipboard } from 'electron';
import { HOSTNAME } from "./constants";

const g_room = "test";

// export const contextMenu = Menu.buildFromTemplate([
export function contextMenu(win: BrowserWindow): Menu {
  const screens = screen.getAllDisplays();
  console.log("screens", screens);

  const submenu: Electron.MenuItemConstructorOptions[] = [];
  for (const sc of screens) {
    submenu.push({
      // label: `Display-${sc.id} [${sc.bounds.x}, ${sc.bounds.y}] ${sc.bounds.width}x${sc.bounds.height}`,
      label: `${sc.label} [${sc.bounds.width}x${sc.bounds.height}]`,
      type: 'radio',
      click: function (item: any) {
        console.log("item", item);
        win.setPosition(item.x, item.y, true);
        win.setSize(item.w, item.h, true);
        console.log(item.x, item.y, item.w, item.h);
      }
    });
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "投稿ページを開く",
      click: async () => {
        await shell.openExternal(HOSTNAME + '/?room=' + g_room);
      }
    },
    {
      label: '投稿ページURLをコピー',
      click() {
        clipboard.writeText(HOSTNAME + '/?room=' + g_room);
        console.log(HOSTNAME + '/?room=' + encodeURI(g_room));
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
      type: 'separator',
    },
    { label: 'Quit Commentable-Viewer', role: 'quit' },
  ]);
}
