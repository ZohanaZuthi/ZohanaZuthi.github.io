import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { slug } from 'github-slugger';

// Keep existing detail URLs and Markdown rendering while following the saved list order.
export function portfolioList(name: string): Loader {
  const filePath = `src/lists/${name}.json`;
  return {
    name: `portfolio-list-${name}`,
    async load({ config, store, parseData, renderMarkdown, watcher }) {
      const url = new URL(filePath, config.root);
      const sync = async () => {
        const entries = JSON.parse(await readFile(url, 'utf8'));
        if (!Array.isArray(entries)) throw new Error(`${filePath} must contain a list.`);
        const ids = new Set<string>();
        const loaded = [];
        for (const [position, entry] of entries.entries()) {
          const id = entry.id?.trim() || slug(entry.title || '');
          if (!id || ids.has(id)) throw new Error(`Use a unique Page address for each entry in ${filePath}: ${id}`);
          if (id.split('/').some((part: string) => !part || part === '.' || part === '..')) throw new Error(`Invalid Page address: ${id}`);
          ids.add(id);
          const data = await parseData({ id, data: { ...entry, listPosition: position }, filePath });
          const body = entry.body || '';
          loaded.push({ id, data, body, filePath, rendered: await renderMarkdown(body, { fileURL: url }) });
        }
        store.clear();
        for (const entry of loaded) store.set(entry);
      };
      await sync();
      watcher?.add(fileURLToPath(url));
      watcher?.on('change', async changed => { if (changed === fileURLToPath(url)) await sync(); });
    },
  };
}
