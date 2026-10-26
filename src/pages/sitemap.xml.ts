import type { APIRoute } from 'astro';
import { published } from '../lib/content';
import { absoluteUrl, xmlEscape } from '../lib/site-url.mjs';
export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/about/', '/projects/', '/research/', '/recognition/', '/gallery/'];
  const sections = [['projects', '/projects/'], ['research', '/research/'], ['certificates', '/recognition/certificates/'], ['achievements', '/recognition/achievements/']] as const;
  for (const [collection, prefix] of sections) {
    for (const entry of await published(collection)) paths.push(`${prefix}${entry.id}/`);
  }
  const urls = site ? paths.map(path => `<url><loc>${xmlEscape(absoluteUrl(path, site.href))}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
