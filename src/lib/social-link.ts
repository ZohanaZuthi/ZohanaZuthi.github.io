// Match the website hostname locally; no external icon requests are needed.
const platforms = [
  { domain: 'ieeexplore.ieee.org', icon: 'ieee', label: 'IEEE Xplore' },
  { domain: 'ieee.org', icon: 'ieee', label: 'IEEE' },
  { domain: 'orcid.org', icon: 'orcid', label: 'ORCID' },
  { domain: 'researchgate.net', icon: 'researchgate', label: 'ResearchGate' },
  { domain: 'scholar.google.com', icon: 'scholar', label: 'Google Scholar' },
  { domain: 'arxiv.org', icon: 'arxiv', label: 'arXiv' },
  { domain: 'pubmed.ncbi.nlm.nih.gov', icon: 'pubmed', label: 'PubMed' },
  { domain: 'linkedin.com', icon: 'linkedin', label: 'LinkedIn' },
  { domain: 'github.com', icon: 'github', label: 'GitHub' },
  { domain: 'gitlab.com', icon: 'gitlab', label: 'GitLab' },
  { domain: 'youtube.com', icon: 'youtube', label: 'YouTube' },
  { domain: 'youtu.be', icon: 'youtube', label: 'YouTube' },
  { domain: 'facebook.com', icon: 'facebook', label: 'Facebook' },
  { domain: 'instagram.com', icon: 'instagram', label: 'Instagram' },
  { domain: 'stackoverflow.com', icon: 'stackoverflow', label: 'Stack Overflow' },
  { domain: 'kaggle.com', icon: 'kaggle', label: 'Kaggle' },
  { domain: 'medium.com', icon: 'medium', label: 'Medium' },
  { domain: 'x.com', icon: 'x', label: 'X' },
  { domain: 'twitter.com', icon: 'x', label: 'X' },
];

export function socialLink(value = '', label = '') {
  const input = typeof value === 'string' ? value.trim() : '';
  if (!input) return null;
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.')) return null;
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    const platform = platforms.find(item => hostname === item.domain || hostname.endsWith(`.${item.domain}`));
    return { href: url.href, icon: platform?.icon || 'website', label: (typeof label === 'string' ? label.trim() : '') || platform?.label || hostname };
  } catch {
    return null;
  }
}
