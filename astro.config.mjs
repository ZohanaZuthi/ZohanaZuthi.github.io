import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { resolveSiteUrl } from './src/lib/site-url.mjs';
const settings = JSON.parse(readFileSync(new URL('./src/data/site.json', import.meta.url), 'utf8'));
const siteUrl = resolveSiteUrl(settings.siteUrl);

// A repository named USERNAME.github.io is served from the domain root.
export default defineConfig({
  output: 'static',
  ...(siteUrl ? { site: siteUrl } : {}),
  trailingSlash: 'always',
});
