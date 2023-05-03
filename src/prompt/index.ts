import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

export type PromptResponse = {
  serverUrl: string;
  roomName: string;
}

export function createPrompt(): Promise<PromptResponse | null> {
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

    promptWindow.loadFile(path.join(__dirname, 'prompt/prompt.html'));

    ipcMain.once('prompt-input', (_, input: PromptResponse | null) => {
      resolve(input);
      promptWindow.close();
    });

    promptWindow.on('closed', () => {
      ipcMain.removeAllListeners('prompt-input');
      resolve(null);
    });
  });
}
