import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

export function createPrompt(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const promptWindow = new BrowserWindow({
      width: 512,
      height: 288,
      modal: true,
      resizable: false,
      parent: BrowserWindow.getFocusedWindow(),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    promptWindow.loadFile(path.join(__dirname, 'prompt.html'));

    ipcMain.once('prompt-input', (_, input: string | null) => {
      resolve(input);
      promptWindow.close();
    });

    promptWindow.on('closed', () => {
      ipcMain.removeAllListeners('prompt-input');
      resolve(null);
    });
  });
}
