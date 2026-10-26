import { access, mkdir, writeFile } from 'node:fs/promises';
import { collectionNames, listPath, readEntries } from './content-files.mjs';

// Create missing lists once. Never replace an existing CMS list or remove originals.
await mkdir('src/lists', { recursive: true });
for (const name of collectionNames) {
  try { await access(listPath(name)); continue; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const entries = await readEntries(name);
  await writeFile(listPath(name), JSON.stringify(entries, null, 2) + '\n', { flag: 'wx' });
  console.log(`Preserved ${entries.length} ${name} entries in ${listPath(name)}.`);
}
