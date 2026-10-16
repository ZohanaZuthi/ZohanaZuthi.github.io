import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { chromium } from 'playwright';
import { parse } from 'yaml';
import { projectPreviewPath } from '../src/lib/project-image.js';

// Generated previews are rebuilt each time; uploaded cover images are never changed.
await rm('public/project-previews', { recursive: true, force: true });
await mkdir('public/project-previews', { recursive: true });

const directory = 'src/content/projects';
const files = await readdir(directory, { recursive: true });
const urls = new Set();
for (const file of files.filter(file => file.endsWith('.md'))) {
  const text = await readFile(`${directory}/${file}`, 'utf8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) continue;
  const project = parse(frontmatter[1]);
  if (project.published !== true || project.image?.trim() || !project.link?.trim()) continue;
  try {
    const url = new URL(project.link.trim());
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) {
      urls.add(project.link.trim());
    }
  } catch {
    // An incomplete URL uses the default project illustration.
  }
}

if (urls.size) {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome' });
    for (const url of urls) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
        serviceWorkers: 'block',
      });
      try {
        const page = await context.newPage();
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        if (!response?.ok()) throw new Error('Page unavailable');
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        if (/\/(login|sign-in|signin|auth)(\/|$)/i.test(new URL(page.url()).pathname)) {
          throw new Error('Sign-in required');
        }
        await page.screenshot({
          path: `public${projectPreviewPath(url)}`,
          type: 'jpeg', quality: 80, animations: 'disabled', timeout: 10000,
        });
        console.log(`Created project preview: ${new URL(url).hostname}`);
      } catch {
        console.warn(`Using default project image: ${new URL(url).hostname}`);
      } finally {
        await context.close();
      }
    }
  } catch {
    console.warn('Preview browser unavailable; using default project images.');
  } finally {
    await browser?.close();
  }
} else {
  console.log('No project URLs need previews.');
}
