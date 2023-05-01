import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as child_process from 'child_process';

export function createPrompt(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const promptWindow = new BrowserWindow({
      width: 300,
      height: 200,
      modal: true,
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
