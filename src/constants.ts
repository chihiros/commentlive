import { screen } from "electron";

// WebSocketサーバのホスト名を定義
const HOSTNAME = "http://localhost:8080";
export { HOSTNAME };

// 画面サイズをAPIから取得
const { width, height } = screen.getPrimaryDisplay().workAreaSize;
const { SCREEN_WIDTH, SCREEN_HEIGHT } = { SCREEN_WIDTH: width, SCREEN_HEIGHT: height };
export { SCREEN_WIDTH, SCREEN_HEIGHT };
