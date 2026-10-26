import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { slug } from 'github-slugger';
import { readEntries, listPath } from './content-files.mjs';

// One Gallery record per selected image; the uploaded file is reused.
export function syncGallery(current, sources) {
  const selected = new Map();
  for (const [collection, entries] of Object.entries(sources)) {
    for (const entry of entries.filter(entry => entry.published)) {
      const award = collection === 'achievements';
      const certificate = collection === 'certificates';
      const id = entry.id?.trim() || slug(entry.title);
      const photos = [
        { image: entry.image, featured: entry.featureCover, homepage: entry.homepageCover },
        ...(entry.gallery || []).map(photo => ({ ...photo,
          featured: photo.featured || (photo.image === entry.image && entry.featureCover),
          homepage: photo.homepage || (photo.image === entry.image && entry.homepageCover),
        })),
      ];
      for (const photo of photos) {
        if (!photo.image || (!photo.featured && !photo.homepage)) continue;
        const item = {
          title: photo.title || entry.title, summary: photo.caption || entry.summary || entry.title,
          date: entry.date, image: photo.image,
          location: (certificate ? entry.issuer : award ? entry.organization : '') || '',
          featured: Boolean(photo.homepage), published: true,
          relatedHref: certificate ? `/recognition/certificates/${id}/` : award ? `/recognition/achievements/${id}/` : `/projects/${id}/`,
          relatedLabel: certificate ? 'Related certificate' : award ? 'Related achievement' : 'Related project',
        };
        const existing = selected.get(photo.image);
        // Prefer a photo's own caption over the cover's default metadata.
        if (!existing || photo.caption || photo.title) selected.set(photo.image, { ...item, featured: item.featured || Boolean(existing?.featured) });
        else existing.featured ||= item.featured;
      }
    }
  }

  const result = [];
  for (const entry of current) {
    if (!entry.linkedImage) { result.push(entry); continue; }
    const source = selected.get(entry.linkedImage);
    if (!source) continue; // The source photo was unchecked, removed, or unpublished.
    let previous = {};
    try { previous = JSON.parse(entry.linkedData || '{}'); } catch { /* Older records have no snapshot. */ }
    const updated = { ...entry };
    for (const [key, value] of Object.entries(source)) {
      // Keep edits made in Gallery; otherwise follow changes to the original entry.
      if (!(key in entry) || JSON.stringify(entry[key]) === JSON.stringify(previous[key])) updated[key] = value;
    }
    updated.linkedData = JSON.stringify(source);
    result.push(updated);
  }
  const represented = new Set(result.flatMap(entry => [entry.image, entry.linkedImage].filter(Boolean)));
  const ids = new Set(result.map(entry => entry.id));
  for (const [image, source] of selected) {
    if (represented.has(image)) continue;
    const base = `shared-${createHash('sha256').update(image).digest('hex').slice(0, 12)}`;
    let id = base;
    for (let suffix = 2; ids.has(id); suffix++) id = `${base}-${suffix}`;
    ids.add(id);
    result.push({ id, ...source, linkedImage: image, linkedData: JSON.stringify(source) });
    represented.add(image);
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const current = await readEntries('gallery');
  const sources = Object.fromEntries(await Promise.all(
    ['achievements', 'projects', 'certificates'].map(async name => [name, await readEntries(name)]),
  ));
  const updated = syncGallery(current, sources);
  if (JSON.stringify(current) !== JSON.stringify(updated)) {
    await writeFile(listPath('gallery'), JSON.stringify(updated, null, 2) + '\n');
  }
  console.log(`Gallery contains ${updated.length} records, including ${updated.filter(entry => entry.linkedImage).length} selected source photos.`);
}
