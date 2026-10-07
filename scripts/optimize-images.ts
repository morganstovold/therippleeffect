// Shrinks oversized photos in src/ in place, keeping each file's name and format so content links don't break.
// Run with `bun run images` after adding photos.
import { readdir, rename, stat } from "node:fs/promises";
import { extname, join } from "node:path";

import sharp from "sharp";

const MAX_WIDTH = 2000;
const MAX_BYTES = 500 * 1024;
const FORMATS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* imagesIn(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* imagesIn(path);
    else if (FORMATS.has(extname(entry.name).toLowerCase())) yield path;
  }
}

let shrunk = 0;
for await (const path of imagesIn("src")) {
  const { size } = await stat(path);
  const { width = 0 } = await sharp(path).metadata();
  if (size <= MAX_BYTES && width <= MAX_WIDTH) continue;

  const image = sharp(path).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const ext = extname(path).toLowerCase();
  if (ext === ".png") image.png({ compressionLevel: 9, palette: true });
  else if (ext === ".webp") image.webp({ quality: 82 });
  else image.jpeg({ quality: 82, mozjpeg: true });

  const temp = `${path}.tmp`;
  await image.toFile(temp);
  const after = (await stat(temp)).size;
  await rename(temp, path);
  shrunk++;
  console.log(`${path}: ${Math.round(size / 1024)} KB -> ${Math.round(after / 1024)} KB`);
}
console.log(shrunk ? `Shrunk ${shrunk} image(s).` : "All images are already small enough.");
