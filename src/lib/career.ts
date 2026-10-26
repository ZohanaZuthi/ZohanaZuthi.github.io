import data from '../data/career.json';

interface Career {
  experience: { role: string; organization?: string; period?: string; description?: string; url?: string; urlTitle?: string }[];
  education: { qualification: string; institution?: string; period?: string; description?: string; url?: string; urlTitle?: string; links?: { url?: string; label?: string }[] }[];
  skills: { category: string; items?: string }[];
}

const defaults: Career = { experience: [], education: [], skills: [] };
const career: Career = { ...defaults, ...data };
export default career;
