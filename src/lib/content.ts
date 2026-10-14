import { getCollection } from 'astro:content';

type CollectionName = 'projects' | 'research' | 'certificates' | 'achievements';

export async function published<T extends CollectionName>(name: T) {
  const entries = await getCollection(name, ({ data }) => data.published);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}

