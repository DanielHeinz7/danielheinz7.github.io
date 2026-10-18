export type NewsItem = {
  date: string;
  label: string;
  text: string;
  link?: { href: string; label: string };
};

export const news: NewsItem[] = [
  {
    date: '2026-09',
    label: 'Sep 2026',
    text: 'Visiting Fellow Grant from the University of Jyväskylä for a research stay in spring 2027.',
  },
  {
    date: '2026-06-30',
    label: 'Jun 2026',
    text: 'Our paper in the Journal of Information Technology explains how firms can reconfigure legacy systems to support digital renewal.',
    link: { href: '/research/legacy-systems/', label: 'Explore the idea' },
  },
  {
    date: '2026-06-27',
    label: 'Jun 2026',
    text: 'Our Information & Management paper maps how B2B smart services combine technical capabilities with service outcomes and users.',
    link: { href: '/research/smart-services/', label: 'Explore the idea' },
  },
  {
    date: '2026-06',
    label: 'Jun 2026',
    text: 'Best Paper Runner-up at DESRIST 2026 for our work on AI-based coaching for founders.',
    link: { href: '/research/ai-coaching/', label: 'Explore the idea' },
  },
  {
    date: '2026-04',
    label: 'Apr 2026',
    text: 'I became President of AIS SIG Services, the community for research on services and information systems.',
    link: { href: 'https://communities.aisnet.org/sigservices-thrive/home', label: 'AIS SIG Services' },
  },
  {
    date: '2025-12',
    label: 'Dec 2025',
    text: 'I completed my doctorate at KIT on smart service innovation in incumbent firms.',
    link: { href: 'https://publikationen.bibliothek.kit.edu/1000191287', label: 'Dissertation record' },
  },
  {
    date: '2025-07-08',
    label: 'Jul 2025',
    text: 'Our Electronic Markets paper introduces a framework for how people and AI work together in service ecosystems.',
    link: { href: '/research/human-ai-work/', label: 'Explore the idea' },
  },
  {
    date: '2025-06-02',
    label: 'Jun 2025',
    text: 'Our Business & Information Systems Engineering paper introduces a mechanism for estimating which data assets improve a prediction before buying them.',
    link: { href: '/research/data-selection/', label: 'Explore the idea' },
  },
  {
    date: '2024-09-26',
    label: 'Sep 2024',
    text: 'Our Electronic Markets paper offers a taxonomy for comparing how organizations share data and what they aim to achieve.',
    link: { href: '/research/data-sharing/', label: 'Explore the idea' },
  },
  {
    date: '2024-02-13',
    label: 'Feb 2024',
    text: 'Our Electronic Markets paper compares business models built around connected car data.',
    link: { href: 'https://doi.org/10.1007/s12525-024-00692-5', label: 'Read the paper' },
  },
  {
    date: '2021-10-27',
    label: 'Oct 2021',
    text: 'Our Electronic Markets paper examines how different types of analytics-based services create value for customers.',
    link: { href: 'https://doi.org/10.1007/s12525-021-00506-y', label: 'Read the paper' },
  },
];
