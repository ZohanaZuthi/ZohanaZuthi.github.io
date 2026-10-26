import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site-url.mjs';
export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n${site ? `Sitemap: ${absoluteUrl('/sitemap.xml', site.href)}\n` : ''}`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
