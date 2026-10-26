import { getCollection } from 'astro:content';
import entryOrder from '../settings/entry-order.json';

type CollectionName = 'projects' | 'research' | 'certificates' | 'achievements' | 'gallery';

export const defaultResearchImage = '/images/research-default.png';

export async function published<T extends CollectionName>(name: T) {
  const entries = await getCollection(name, ({ data }) => data.published);
  return entries.sort((a, b) => entryPosition(name, a) - entryPosition(name, b) || compareDisplayOrder(a.data, b.data));
}

export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}

// Numbered entries come first; dates break ties and order unnumbered entries.
export function compareDisplayOrder(a: { order?: number | null; date: Date }, b: { order?: number | null; date: Date }) {
  return (a.order ?? Infinity) - (b.order ?? Infinity) || b.date.getTime() - a.date.getTime();
}

export function entryPosition(name: CollectionName, entry: { id: string; filePath?: string }) {
  const saved = (entryOrder as Partial<Record<CollectionName, string[]>>)[name] || [];
  const file = entry.filePath?.replaceAll('\\', '/');
  const index = saved.findIndex(path => path === file || path === `src/content/${name}/${entry.id}.md`);
  return index < 0 ? Infinity : index;
}
