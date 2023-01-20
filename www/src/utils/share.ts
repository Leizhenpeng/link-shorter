export function ShareTwitter(url: string) {
  if (!url) return;
  const params = new URLSearchParams();
  params.set("text", "Shorten Link, Make Sharing Simpler! 🎉\nCheck it out:");
  params.set("url", url);
  params.set("hashtags", "LinkShorter");

  const twitterUrl = `https://twitter.com/share?${ params.toString() }`;
  popupWindow(twitterUrl, "Share on Twitter", window, 800, 600);
}


export function GenQrcode() {
  const twitterUrl = `https://cli.im/url`;
  popupWindow(twitterUrl, "", window, 1180, 500);
}

function popupWindow(url: string, windowName: string, win: any, w: number, h: number) {
  const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
  const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
  return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${ w }, height=${ h }, top=${ y }, left=${ x }`);
}
