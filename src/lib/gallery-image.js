import { readFileSync } from 'node:fs';

// Generated before builds. Original uploads are never overwritten.
let previews = {};
try {
  previews = JSON.parse(readFileSync('public/gallery-previews/manifest.json', 'utf8'));
} catch {
  // Original images remain available if previews have not been generated locally.
}

export function galleryPreview(source) {
  return previews[source] || { src: source, srcset: undefined };
}
