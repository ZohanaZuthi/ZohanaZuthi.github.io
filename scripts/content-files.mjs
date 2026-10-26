import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import { slug } from 'github-slugger';

export const collectionNames = ['projects', 'research', 'certificates', 'achievements', 'gallery'];
export const listPath = name => `src/lists/${name}.json`;

// The list is authoritative, even when empty. Old Markdown files are backups only.
export async function readEntries(name) {
  try {
    const entries = JSON.parse(await readFile(listPath(name), 'utf8'));
    if (!Array.isArray(entries)) throw new Error(`${listPath(name)} must contain a list.`);
    return entries;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const directory = `src/content/${name}`;
  let files;
  try { files = await readdir(directory, { recursive: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  let savedOrder = [];
  try { savedOrder = JSON.parse(await readFile('src/settings/entry-order.json', 'utf8'))[name] || []; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const entries = [];
  for (const file of files.filter(file => file.endsWith('.md'))) {
    const text = await readFile(`${directory}/${file}`, 'utf8');
    const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!header) throw new Error(`Missing frontmatter in ${directory}/${file}`);
    const data = parse(header[1]);
    const id = String(data.slug || file.replace(/\.md$/, '').split('/').map(part => slug(part)).join('/').replace(/\/index$/, ''));
    const index = savedOrder.indexOf(`${directory}/${file}`);
    entries.push({ data: { ...data, id, body: text.slice(header[0].length) }, position: index < 0 ? Infinity : index });
  }
  return entries.sort((a, b) => a.position - b.position || (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || new Date(b.data.date) - new Date(a.data.date)).map(entry => entry.data);
}
