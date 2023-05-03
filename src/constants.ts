import { screen } from "electron";

// WebSocketサーバのホスト名を定義
const HOSTNAME = "http://localhost:8080";
// const HOSTNAME = proccess.env.HOSTNAME;
export { HOSTNAME };

/**
 * V8のAPIを使い画面サイズを取得します
 */
export const GetScreenSize: () => { SCREEN_WIDTH: number, SCREEN_HEIGHT: number } = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return { SCREEN_WIDTH: width, SCREEN_HEIGHT: height };
}
