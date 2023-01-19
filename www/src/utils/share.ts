export function ShareTwitter(url: string) {
  if (!url) return;
  const params = new URLSearchParams();
  params.set("text", "Shorten Link, Make Sharing Simpler! 🎉\nCheck it out:");
  params.set("url", url);
  params.set("hashtags", "LinkShorter");

  const twitterUrl = `https://twitter.com/share?${ params.toString() }`;
  window.open(twitterUrl, "", "left=0,top=auto,width=550,height=450");
}


export function GenQrcode() {
  const twitterUrl = `https://cli.im/url`;
  window.open(twitterUrl, "", "left=0,top=auto,width=1100,height=500");
}
