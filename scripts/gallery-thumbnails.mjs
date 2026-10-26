import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import sharp from 'sharp';
import { readEntries } from './content-files.mjs';

const output = 'public/gallery-previews';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const sources = new Set();
for (const collection of ['achievements', 'projects', 'certificates', 'gallery']) {
  for (const entry of await readEntries(collection)) {
    if (entry?.published !== true) continue;
    if (entry.image) sources.add(entry.image);
    for (const photo of entry.gallery || []) if (photo.image) sources.add(photo.image);
  }
}

const manifest = {};
const publicRoot = resolve('public');
for (const source of sources) {
  if (typeof source !== 'string' || !source.startsWith('/') || source.startsWith('//')) continue;
  try {
    const file = resolve(publicRoot, `.${decodeURIComponent(source.split(/[?#]/)[0])}`);
    if (!file.startsWith(publicRoot + sep)) continue;
    const input = await readFile(file);
    const hash = createHash('sha256').update('gallery-v1').update(input).digest('hex').slice(0, 20);
    const variants = new Map();
    for (const width of [320, 640]) {
      const { data, info } = await sharp(input).rotate().resize({ width, withoutEnlargement: true })
        .webp({ quality: 76 }).toBuffer({ resolveWithObject: true });
      const url = `/gallery-previews/${hash}-${info.width}.webp`;
      await writeFile(`public${url}`, data);
      variants.set(info.width, url);
    }
    const sizes = [...variants.entries()].sort((a, b) => a[0] - b[0]);
    manifest[source] = { src: sizes.at(-1)[1], srcset: sizes.map(([width, url]) => `${url} ${width}w`).join(', ') };
  } catch {
    console.warn(`Using original gallery image: ${source}`);
  }
}
await writeFile(`${output}/manifest.json`, JSON.stringify(manifest));
console.log(`Generated gallery thumbnails for ${Object.keys(manifest).length} local images.`);
