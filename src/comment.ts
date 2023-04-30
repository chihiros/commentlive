import * as p5 from "p5";

export class Comment {
  private x: number;
  private y: number;
  private text: string;
  private alpha: number;
  private life: number;
  private size: number;
  private text_width: number;
  private flg_img: boolean;
  private flg_emoji: boolean;
  private id_img: number;
  private color_text: string;
  private color_text_stroke: string;

  constructor() {
    this.x = Math.round(Math.random() * 100);
    this.y = Math.round(Math.random() * 100);
    this.text = "test";
    this.alpha = 0;
    this.life = 1; // 0 - 255
    this.size = 72.0;
    this.text_width = 0;
    this.flg_img = false;
    this.flg_emoji = false;
  }

  setAlpha(_alpha: number): void {
    this.alpha = _alpha;
  }

  getAlpha(): number {
    return this.alpha;
  }

  setIdImg(_id_img: number): void {
    this.id_img = _id_img;
  }

  getIdImg(): number {
    return this.id_img;
  }

  setTextWidth(_text_width: number): void {
    this.text_width = _text_width;
  }

  getTextWidth(): number {
    return this.text_width;
  }

  // Emoji -> true
  // Text -> false
  getFlgEmoji(): boolean {
    return this.flg_emoji;
  }

  setFlgEmoji(_flg_emoji: boolean): void {
    this.flg_emoji = _flg_emoji;
  }

  setColor(_color_text: string, _color_text_stroke: string): void {
    this.color_text = _color_text;
    this.color_text_stroke = _color_text_stroke;
  }

  setLife(_life: number): void {
    this.life = _life;
  }

  getLife(): number {
    return this.life;
  }

  setText(_text: string): void {
    this.text = _text;
    return;
  }

  setX(_x: number): void {
    this.x = _x;
  }

  setY(_y: number): void {
    this.y = _y;
  }

  useImage(): void {
    this.flg_img = true;
  }

  update(_FRAME: number): void {
    if (this.life > 0) {
      if (this.flg_emoji) {
        // 絵文字の場合の移動
        // this.alpha = this.alpha - 10;
        // this.size = this.life
        this.life--;
        const dy = 2;
        const _y = dy * _FRAME; // トータルフレームの移動px数
        this.y = this.y - dy;

        const amp = 0.6;  // 振幅
        this.x = this.x + Math.sin(12.0 * Math.PI * ((dy * this.life) / _y)) * amp;

        if (this.life == 0) {
          this.flg_img = false;
        }
      } else {
        // テキストの場合の移動
        this.life--;
        const dx = (width + this.text_width) / _FRAME;
        this.x = this.x - dx;

        if (this.life == 0) {
          this.flg_img = false;
        }
      }
    }
    return;
  }

  draw(p: p5): void {
    if (this.flg_img == false) {
      p.stroke(this.color_text_stroke);
      p.strokeWeight(5); // 縁取りは5px
      p.fill(this.color_text);
      p.text(this.text, this.x, this.y);
    }
    return;
  }

  reset(): void {
    this.x = Math.round(Math.random() * 100);
    this.y = Math.round(Math.random() * 100);
    this.text = "test";
    this.alpha = 0;
    this.life = 1; // 0 - 255
    this.size = 72.0;
    this.text_width = 0;
    this.flg_img = false;
    return;
  }
}
