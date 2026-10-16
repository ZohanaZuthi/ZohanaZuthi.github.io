import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';

/** @param {string} url */
export function projectPreviewPath(url) {
  const filename = createHash('sha256').update(url.trim()).digest('hex').slice(0, 16);
  return `/project-previews/${filename}.jpg`;
}

/** @param {{ image?: string, link?: string }} project */
export function projectImage(project) {
  if (project.image?.trim()) return project.image;
  if (project.link?.trim()) {
    const preview = projectPreviewPath(project.link);
    if (existsSync(`public${preview}`)) return preview;
  }
  return '/images/project-default.png';
}
