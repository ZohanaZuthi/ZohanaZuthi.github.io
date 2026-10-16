import data from '../data/profile.json';

// Pages CMS can omit empty fields. Keep a complete profile for every page.
const defaults = {
  name: 'Your Name',
  role: '',
  location: '',
  intro: '',
  about: '',
  email: '',
  portrait: '',
  cv: '',
  linkedin: '',
  github: '',
  scholar: '',
  orcid: '',
  researchgate: '',
  arxiv: '',
  pubmed: '',
};

const profile = { ...defaults, ...data };
export default profile;
