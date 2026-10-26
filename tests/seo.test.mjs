import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { resolveSiteUrl, absoluteUrl, plainDescription, xmlEscape } from '../src/lib/site-url.mjs';

test('each client gets its own production origin; template and local builds do not invent one', () => {
  assert.equal(resolveSiteUrl('', { GITHUB_REPOSITORY: 'Adib-Hassan-1/Adib-Hassan-1.github.io' }), 'https://adib-hassan-1.github.io');
  assert.equal(resolveSiteUrl('', { GITHUB_REPOSITORY: 'ZohanaZuthi/ZohanaZuthi.github.io' }), 'https://zohanazuthi.github.io');
  assert.equal(resolveSiteUrl('', { GITHUB_REPOSITORY: 'ZohanaZuthi/Portfolio_template' }), '');
  assert.equal(resolveSiteUrl('', {}), '');
  assert.equal(resolveSiteUrl(' https://example.com/?test=1#test ', {}), 'https://example.com');
  assert.equal(resolveSiteUrl('', { PUBLIC_SITE_URL: 'https://example.org/' }), 'https://example.org');
  assert.equal(resolveSiteUrl('https://custom.example', { GITHUB_REPOSITORY: 'Owner/Owner.github.io' }), 'https://custom.example');
});
test('unsafe origins and image URLs are rejected; metadata and sitemap text is escaped', () => {
  for (const value of ['javascript:alert(1)', 'not a url', 'https://user:password@example.com']) assert.equal(resolveSiteUrl(value, {}), '');
  assert.equal(absoluteUrl('/uploads/image.webp', 'https://example.com'), 'https://example.com/uploads/image.webp');
  assert.equal(absoluteUrl('javascript:alert(1)', 'https://example.com'), '');
  assert.equal(plainDescription(' **Project**\n [details](https://example.com) <b>here</b> '), 'Project details here');
  assert.equal(xmlEscape('A&B<"'), 'A&amp;B&lt;&quot;');
});

// Run after a production build with EXPECTED_SITE_URL set to verify the generated site.
const origin = process.env.EXPECTED_SITE_URL;
if (origin) {
  function htmlFiles(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? htmlFiles(join(dir, item.name)) : item.name.endsWith('.html') ? [join(dir, item.name)] : []); }
  const pages = htmlFiles('dist');
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  test('all public built pages have their own canonical and sharing metadata', () => {
    for (const path of pages) {
      const file = relative('dist', path).replaceAll('\\', '/');
      const html = readFileSync(path, 'utf8');
      const head = html.split('</head>')[0];
      if (file === '404.html' || file === '404/index.html' || file === 'analytics/index.html') {
        assert.match(head, /name="robots" content="noindex, nofollow"/, file);
        assert.doesNotMatch(head, /rel="canonical"|property="og:url"/, file);
        continue;
      }
      const route = '/' + file.replace(/index\.html$/, '');
      const url = new URL(route, origin).href;
      assert.ok(head.includes(`rel="canonical" href="${url}"`), file);
      assert.ok(head.includes(`property="og:url" content="${url}"`), file);
      assert.match(head, /name="description" content="[^"]+"/, file);
      assert.match(head, /name="twitter:card"/, file);
      assert.ok(sitemap.includes(`<loc>${xmlEscape(url)}</loc>`), `Sitemap missing ${route}`);
    }
  });
  test('sitemap only includes published pages; analytics and 404 remain excluded', () => {
    assert.doesNotMatch(sitemap, /\/analytics\/|\/404\//);
    for (const section of ['projects', 'research', 'certificates', 'achievements']) {
      const list = JSON.parse(readFileSync(`src/lists/${section}.json`, 'utf8'));
      for (const item of list.filter(item => item.published === false && item.id)) {
        const prefix = ['certificates', 'achievements'].includes(section) ? `/recognition/${section}/` : `/${section}/`;
        assert.ok(!sitemap.includes(`${prefix}${item.id}/`));
      }
    }
    assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`Sitemap: ${origin.replace(/\/$/, '')}/sitemap.xml`));
  });
  test('homepage person schema is valid JSON and active navigation is accessible', () => {
    const home = readFileSync('dist/index.html', 'utf8');
    const json = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json);
    const schema = JSON.parse(json);
    assert.equal(schema['@type'], 'Person');
    assert.ok(schema.name);
    assert.equal(schema.url.replace(/\/$/, ''), origin.replace(/\/$/, ''));
    assert.match(home, /href="\/" aria-current="page"/);
    assert.match(readFileSync('dist/projects/index.html', 'utf8'), /href="\/projects\/" aria-current="page"/);
  });
}
