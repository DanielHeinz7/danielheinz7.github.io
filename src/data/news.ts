type NewsItem = {
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
];
