import { screen } from "electron";

// WebSocketサーバのホスト名を定義
const HOSTNAME = "http://localhost:8080";
export { HOSTNAME };

// 画面サイズをAPIから取得
const { width, height } = screen.getPrimaryDisplay().workAreaSize;
const { WIDTH, HEIGHT } = { WIDTH: width, HEIGHT: height };
export { WIDTH, HEIGHT };
