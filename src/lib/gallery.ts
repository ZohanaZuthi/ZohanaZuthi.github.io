import { published } from './content';
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
}

// Award photos stay in their original entries; the gallery only references them.
export async function galleryItems(): Promise<GalleryItem[]> {
  const [awards, entries] = await Promise.all([published('achievements'), published('gallery')]);
  const items: GalleryItem[] = entries.map(({ data }) => ({
    ...data, relatedHref: socialLink(data.link)?.href, relatedLabel: 'More information',
  }));
  for (const { id, data } of awards) {
    const coverPhoto = data.gallery.find(photo => photo.image === data.image);
    const photos = [
      ...(data.image && !coverPhoto ? [{ image: data.image, caption: '', title: '', featured: data.featureCover }] : []),
      ...data.gallery.map(photo => ({ ...photo, featured: photo.featured || (photo.image === data.image && data.featureCover) })),
    ];
    for (const photo of photos) {
      items.push({
        image: photo.image, title: photo.title || data.title,
        summary: photo.caption || data.summary, date: data.date,
        location: data.organization, relatedHref: `/recognition/achievements/${id}/`,
        relatedLabel: 'Related achievement', featured: photo.featured,
      });
    }
  }
  const unique = new Map<string, GalleryItem>();
  for (const item of items.sort((a, b) => b.date.getTime() - a.date.getTime())) {
    const existing = unique.get(item.image);
    if (existing) existing.featured ||= item.featured;
    else unique.set(item.image, item);
  }
  return [...unique.values()];
}
