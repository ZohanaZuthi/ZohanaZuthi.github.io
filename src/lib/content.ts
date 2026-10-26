import { getCollection } from 'astro:content';

type CollectionName = 'projects' | 'research' | 'certificates' | 'achievements' | 'gallery';
export const defaultResearchImage = '/images/research-default.png';

export async function published<T extends CollectionName>(name: T) {
  const entries = await getCollection(name, ({ data }) => data.published);
  return entries.sort((a, b) => a.data.listPosition - b.data.listPosition);
}

export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}

// Photo priorities remain compatible with previous gallery selections.
export function compareDisplayOrder(a: { order?: number | null; date: Date }, b: { order?: number | null; date: Date }) {
  return (a.order ?? Infinity) - (b.order ?? Infinity) || b.date.getTime() - a.date.getTime();
}
