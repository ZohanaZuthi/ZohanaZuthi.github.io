import { published, compareDisplayOrder, entryPosition } from './content';
import { socialLink } from './social-link';

export interface GalleryItem {
  image: string;
  title: string;
  summary: string;
  date: Date;
  location?: string;
  relatedHref?: string;
  relatedLabel?: string;
  featured: boolean;
  order?: number | null;
  position?: number;
}

// Only explicitly selected photos are reused from awards, projects and certificates.
export async function galleryItems(): Promise<GalleryItem[]> {
  const [awards, projects, certificates, entries] = await Promise.all([
    published('achievements'), published('projects'), published('certificates'), published('gallery'),
  ]);
  const items: GalleryItem[] = entries.map(entry => ({
    ...entry.data, position: entryPosition('gallery', entry), relatedHref: socialLink(entry.data.link)?.href, relatedLabel: 'More information',
  }));
  for (const entry of [...awards, ...projects]) {
    const { id, data } = entry;
    const isAward = entry.collection === 'achievements';
    const coverPhoto = data.gallery.find(photo => photo.image === data.image);
    const photos = [
      ...(data.image && !coverPhoto ? [{ image: data.image, caption: '', title: '', featured: data.featureCover, homepage: data.homepageCover, order: data.order }] : []),
      ...data.gallery.map(photo => ({ ...photo, featured: photo.featured || (photo.image === data.image && data.featureCover), homepage: photo.homepage || (photo.image === data.image && data.homepageCover) })),
    ];
    for (const photo of photos.filter(photo => photo.featured || photo.homepage)) {
      items.push({
        image: photo.image, title: photo.title || data.title,
        summary: photo.caption || data.summary, date: data.date,
        location: entry.collection === 'achievements' ? entry.data.organization : undefined,
        relatedHref: isAward ? `/recognition/achievements/${id}/` : `/projects/${id}/`,
        relatedLabel: isAward ? 'Related achievement' : 'Related project', featured: photo.homepage, order: photo.order ?? data.order,
      });
    }
  }
  for (const { id, data } of certificates) {
    if ((!data.featureCover && !data.homepageCover) || !data.image) continue;
    items.push({ image: data.image, title: data.title, summary: data.summary, date: data.date,
      location: data.issuer, relatedHref: `/recognition/certificates/${id}/`,
      relatedLabel: 'Related certificate', featured: data.homepageCover, order: data.order });
  }
  const unique = new Map<string, GalleryItem>();
  for (const item of items.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity) || compareDisplayOrder(a, b))) {
    const existing = unique.get(item.image);
    if (existing) existing.featured ||= item.featured;
    else unique.set(item.image, item);
  }
  return [...unique.values()];
}
