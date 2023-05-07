import { WebSocket } from "ws"
import { Comment } from "./comment"
import * as p5 from "p5"
import { screen } from "electron";
import { getRandom } from "./utils";
import { HOSTNAME } from "./constants";

let socket: WebSocket;

let peerConnection: RTCPeerConnection;

let color_text: string;
let color_text_stroke: string;
const FRAME_RATE = 60;
const EMOJI_SEC = 2.0;
const TEXT_SEC = 6.0;

const { width, height } = screen.getPrimaryDisplay().workAreaSize;

let comments = []; //new Array(50);
function whileLoading(total) {
  console.log('loaded: ', + total);
}

// setup関数より前に呼ばれる関数
function preload() {
  let count_loaded = 0;
  for (let i = 0; i < max_number_of_comment; i++) {
    comments[i] = new Comment();
    comments[i].setLife(0);
  }
}

function startSocketConnection(room) {
  socket = io.connect(hostname);
  socket.on('you_are_connected', function () {
    // 部屋名を指定してジョインする．
    socket.emit('join', room);
  });

  socket.on('comment', newComment);
  socket.on('disconnect', () => {
    console.log('you have been disconnected');
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    console.log(data.username + ' joined');
  });
  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    console.log(data.username + ' left');
  });
  socket.on('reconnect', () => {
    console.log('you have been reconnected');
    socket.emit('join', room);
  });
  socket.on('login', (data) => {
    console.log(data);
  });
  socket.on('deactivate_comment_control', (data) => {
    console.log(data);
  });

  socket.on("disconnectPeer", () => {
    peerConnection.close();
  });

  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };
}

// 起動時、一番最初に呼ばれる関数
function setup(p: p5) {
  textFont("Noto Sans JP");
  mycanvas = p.createCanvas(windowWidth, windowHeight);
  console.log(windowWidth, windowHeight);
  document.getElementById("canvas_placeholder").append(mycanvas.elt);

  frameRate(FRAME_RATE); // フレームレートを30fpsに設定してあるみたい
  let params = getURLParams();
  if (params.name) {

  }

  textAlign(CENTER, CENTER);
  flg_sound_mute = false;
}

// 毎フレームごとに呼ばれる関数
function draw(p: p5) {
  // clear();
  p.background(0, 0, 0, 0);

  for (let i = 0; i < max_number_of_comment; i++) {
    let frames = 0;
    if (comments[i].getFlgEmoji()) {
      frames = EMOJI_SEC * FRAME_RATE;
    } else {
      frames = TEXT_SEC * FRAME_RATE;
    }

    if (comments[i].getLife() > 0) {
      comments[i].update(frames);
      comments[i].draw();
    }
  }
}

// newComment function でコメントを画面に描画する処理をしている
function newComment(data: any) {
  const p = new p5();

  // 送られてきたコメントが空の場合は処理を終了する
  if (data.comment.length <= 0) {
    return;
  }

  let isUpdate = false;
  let id = 0;
  // ライフがゼロになっている変数を探す（一番古い変数を探す）
  for (let i = 0; i < max_number_of_comment; i++) {
    if (comments[i].getLife() == 0) {
      id = i;
      comments[id].reset();
      isUpdate = true;
      break; // ライフがゼロの変数が見つかったらループを抜ける
    }
  }

  // 上書きできる変数が見つかった場合は、その変数を更新する
  if (isUpdate) {
    comments[id].setText(data.comment);
    // data.color_text: テキストの色
    // data.color_text_stroke: テキストの縁取りの色
    comments[id].setColor(data.color_text, data.color_text_stroke);
    // テキストサイズを設定
    const text_size = height / 20;
    p.textSize(text_size);

    comments[id].setIdImg(data.id_img);
    comments[id].setFlgSound(data.flg_sound);
    comments[id].setIdSound(data.id_sound);
    comments[id].setFlgEmoji(data.flg_emoji);
    // comments[id].setAlpha(255.0); // 1.0: 不透明, 0.0: 透明

    // X座標を設定
    comments[id].setTextWidth(p.textWidth(data.comment));
    const text_width = comments[id].getTextWidth();
    if (text_width < width) {
      comments[id].setX(getRandom(text_width / 2, width - text_width / 2));
    }
    else {
      comments[id].setX(text_width / 2);
    }

    // Y座標を設定, 描画時間の設定
    if (comments[id].getFlgEmoji()) {
      // 絵文字の場合の処理
      // 描画時間: 1500ms
      comments[id].setLife(EMOJI_SEC * FRAME_RATE);

      const max_height = height - (text_size / 2);
      const min_height = height - (height / 10);
      // px単位で指定する
      // comments[id].setY(Math.random(min_height, max_height));
      comments[id].setY(getRandom(min_height, max_height));
    } else {
      // テキストの場合の処理
      // 描画時間: 3000ms
      comments[id].setLife(TEXT_SEC * FRAME_RATE);
      comments[id].setX(width + text_width / 2);
      comments[id].setY(Math.random() * height - text_size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
