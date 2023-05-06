import { screen } from "electron";

// Appの名前を定義
export const APP_NAME = "CommentLive";

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

// serverUrlとroomNameの追加
let SERVER_URL = "";
let ROOM_NAME = "";

export function SetServerUrl(_serverUrl: string): void {
  SERVER_URL = _serverUrl;
}

export function GetServerUrl(): string {
  return SERVER_URL;
}

export function SetRoomName(_roomName: string): void {
  ROOM_NAME = _roomName;
}

export function GetRoomName(): string {
  return ROOM_NAME;
}
