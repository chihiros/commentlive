export function downloadAllComments(): void {
  // テキストエリアより文字列を取得
  const element: HTMLTextAreaElement = document.getElementById('textarea_comment_history') as HTMLTextAreaElement;
  const txt = element.value;
  if (!txt) { return; }

  // 文字列をBlob化
  const blob = new Blob([txt], { type: 'text/plain' });

  // ダウンロード用のaタグ生成
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = ('comments.txt');
  a.click();
}

function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateName(): string {
  const name1 = ["computer", "design", "art", "human", "410", "interface", "tmu"];
  const name2 = ["room", "class", "conference", "event", "area", "place"];
  const name = capFirst(name1[getRandomInt(0, name1.length)]) + '_' + capFirst(name2[getRandomInt(0, name2.length)]);
  return name;
}
