const WIDTHS = [480, 800, 1200, 1600, 2000];

// Unsplash serves any width on request, so remote photos get a real srcset without a build step.
export function unsplashSrcset(url: string, maxWidth: number) {
  const widths = WIDTHS.filter((width) => width < maxWidth).concat(maxWidth);
  return {
    src: unsplashUrl(url, maxWidth),
    srcset: widths.map((width) => `${unsplashUrl(url, width)} ${width}w`).join(", "),
  };
}

function unsplashUrl(url: string, width: number) {
  const params = new URLSearchParams({ auto: "format", fit: "crop", q: "75", w: String(width) });
  return `${url.split("?")[0]}?${params}`;
}
