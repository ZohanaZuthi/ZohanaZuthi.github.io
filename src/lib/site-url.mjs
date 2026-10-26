// Each client's deployment supplies its own GitHub repository name.
export function resolveSiteUrl(value, environment = process.env) {
  const input = typeof value === 'string' ? value.trim() : '';
  const configured = input || environment.PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
      url.search = ''; url.hash = '';
      return url.href.replace(/\/$/, '');
    } catch { return ''; }
  }
  const [owner, repository] = (environment.GITHUB_REPOSITORY || '').split('/');
  return owner && repository?.toLowerCase() === `${owner.toLowerCase()}.github.io` ? `https://${owner.toLowerCase()}.github.io` : '';
}
export function plainDescription(value = '') {
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
}
export function absoluteUrl(value, siteUrl) {
  if (!value || !siteUrl) return '';
  try { const url = new URL(value, `${siteUrl}/`); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
export function xmlEscape(value) {
  return String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
}
