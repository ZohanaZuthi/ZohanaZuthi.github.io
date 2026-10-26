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

// Source selections are synchronized into the same list owners edit in Pages CMS.
export async function galleryItems(): Promise<GalleryItem[]> {
  const entries = await published('gallery');
  const unique = new Map<string, GalleryItem>();
  for (const { data } of entries) {
    if (unique.has(data.image)) continue;
    const link = socialLink(data.link);
    unique.set(data.image, { ...data,
      relatedHref: link?.href || data.relatedHref,
      relatedLabel: link ? 'More information' : data.relatedLabel,
    });
  }
  return [...unique.values()];
}
