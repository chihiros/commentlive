import { BrowserWindow, Menu, shell, clipboard } from 'electron';
import { HOSTNAME } from "./constants";

const g_room = "test";

// export const contextMenu = Menu.buildFromTemplate([
export function contextMenu(): Menu {
  const win = new BrowserWindow();
  return Menu.buildFromTemplate([
    {
      label: "投稿ページを開く", click: async () => {
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
  ]);
}
