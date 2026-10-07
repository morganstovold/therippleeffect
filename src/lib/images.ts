const WIDTHS = [480, 800, 1200, 1600, 2000];

function srcset(maxWidth: number, urlFor: (width: number) => string) {
  const widths = WIDTHS.filter((width) => width < maxWidth).concat(maxWidth);
  return {
    src: urlFor(maxWidth),
    srcset: widths.map((width) => `${urlFor(width)} ${width}w`).join(", "),
  };
}

// Unsplash serves any width on request, so remote photos get a real srcset without a build step.
export function unsplashSrcset(url: string, maxWidth: number) {
  const base = url.split("?")[0];
  return srcset(maxWidth, (width) => {
    const params = new URLSearchParams({ auto: "format", fit: "crop", q: "75", w: String(width) });
    return `${base}?${params}`;
  });
}

// Cloudflare Image Transformations resize local files on the fly. It only runs on the production domain
// (enabled in alchemy.run.ts), so previews and dev get the original file instead.
export function cloudflareSrcset(path: string, maxWidth: number) {
  if (!import.meta.env.SITE) {
    return undefined;
  }
  return srcset(maxWidth, (width) => `/cdn-cgi/image/width=${width},format=auto,quality=80${path}`);
}
