export type NewsItem = {
  date: string;
  label: string;
  text: string;
  link?: { href: string; label: string };
};

export const news: NewsItem[] = [
  {
    date: '2026-11',
    label: 'Nov 2026',
    text: 'Coming up: Pandora Dietle will join the lab in November.',
    link: { href: '/lab/', label: 'About the lab' },
  },
  {
    date: '2026-10',
    label: 'Oct 2026',
    text: 'Coming up: our new course Building Digital Services with AI kicks off this October. Students will develop their own web apps with AI coding tools.',
    link: { href: '/teaching/#building-with-ai', label: 'About the course' },
  },
  {
    date: '2026-09',
    label: 'Sep 2026',
    text: 'I began co-leading the Conferences Division of Die WI e.V. with Julia Seitz Sänger.',
    link: { href: 'https://new.wirtschaftsinformatik.de/en/club/club-sections/', label: 'Association divisions' },
  },
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
    date: '2026-06-14',
    label: 'Jun 2026',
    text: 'I took part in the Junior Faculty Consortium at ECIS 2026 in Milan.',
    link: { href: 'https://ecis2026.it/junior-faculty-consortium/', label: 'About the consortium' },
  },
  {
    date: '2026-06',
    label: 'Jun 2026',
    text: 'Best Paper Runner-up at DESRIST 2026 for our work on AI-based coaching for founders.',
    link: { href: '/research/ai-coaching/', label: 'Explore the idea' },
  },
  {
    date: '2026-05',
    label: 'May 2026',
    text: 'I was appointed Chair for Workshops, Tutorials & Community Events at WI 2027 in Karlsruhe.',
    link: { href: 'https://wi2027.wirtschaftsinformatik.de/organisation/organisation/', label: 'Organizing committee' },
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
    date: '2025-09',
    label: 'Sep 2025',
    text: 'Our paper “Actor-Value Constellations in Circular Ecosystems” received the Second Runner-up Best Full Paper Award at WI 2025.',
    link: { href: 'https://publikationen.bibliothek.kit.edu/1000183238', label: 'Read the paper' },
  },
  {
    date: '2025-09',
    label: 'Sep 2025',
    text: 'Ida Meier joined the lab as a research associate, focusing on how organizations adopt AI.',
    link: { href: 'https://dsi.win.kit.edu/team_1232.php', label: 'Ida’s research' },
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
    date: '2025-02',
    label: 'Feb 2025',
    text: 'I initiated a workshop on digital sustainability and the circular economy at KIT with Linda Sagnier Eckert and Christoph Hoppe.',
    link: { href: 'https://www.win.kit.edu/news_1554.php', label: 'Workshop recap' },
  },
  {
    date: '2024-11',
    label: 'Nov 2024',
    text: 'I completed Helmholtz’s InnoSuper program on bringing research into practice and supporting researchers in transfer projects.',
    link: { href: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7292833570765570048/', label: 'About the program' },
  },
  {
    date: '2024-10',
    label: 'Oct 2024',
    text: 'I joined the teaching team for Digital Services at HECTOR School, working with business professionals on digital service innovation.',
    link: { href: '/teaching/#executive-education', label: 'Executive education' },
  },
  {
    date: '2024-09-26',
    label: 'Sep 2024',
    text: 'Our Electronic Markets paper offers a taxonomy for comparing how organizations share data and what they aim to achieve.',
    link: { href: '/research/data-sharing/', label: 'Explore the idea' },
  },
  {
    date: '2024-04',
    label: 'Apr 2024',
    text: 'Jonas Liebschner and Linda Sagnier Eckert joined the Digital Service Design & Innovation Lab as research associates.',
    link: { href: '/lab/', label: 'About the lab' },
  },
  {
    date: '2024-03',
    label: 'Mar 2024',
    text: 'I became head of the Digital Service Design & Innovation Lab at KIT.',
    link: { href: '/lab/', label: 'About the lab' },
  },
  {
    date: '2024-03',
    label: 'Mar 2024',
    text: 'I was a visiting researcher at the University of Cambridge, hosted by Veronica Martinez.',
  },
  {
    date: '2024-02-13',
    label: 'Feb 2024',
    text: 'Our Electronic Markets paper compares business models built around connected car data.',
    link: { href: 'https://doi.org/10.1007/s12525-024-00692-5', label: 'Read the paper' },
  },
  {
    date: '2023-09',
    label: 'Sep 2023',
    text: 'Our paper on digital service innovation for sustainable development was nominated for the Best Paper Award at WI 2023.',
    link: { href: 'https://aisel.aisnet.org/wi2023/75/', label: 'Read the paper' },
  },
  {
    date: '2023-04',
    label: 'Apr 2023',
    text: 'I co-developed and began co-teaching Digital Services: Innovation & Business Models at KIT, combining recorded lectures with live case discussions.',
    link: { href: '/teaching/#digital-services', label: 'About the course' },
  },
  {
    date: '2022-10',
    label: 'Oct 2022',
    text: 'I began a research stay at The University of Queensland, working with Christoph F. Breidbach on smart service innovation.',
  },
  {
    date: '2022-02-18',
    label: 'Feb 2022',
    text: 'I presented my doctoral research on smart service systems at the WI 2022 Doctoral Consortium.',
    link: { href: 'https://publikationen.bibliothek.kit.edu/1000143867', label: 'Doctoral research' },
  },
  {
    date: '2022-02',
    label: 'Feb 2022',
    text: 'Our paper on smart service systems was first runner-up for the Best Paper Award at WI 2022.',
    link: { href: 'https://doi.org/10.5445/IR/1000140996', label: 'Read the paper' },
  },
  {
    date: '2021-10-27',
    label: 'Oct 2021',
    text: 'Our Electronic Markets paper examines how different types of analytics-based services create value for customers.',
    link: { href: 'https://doi.org/10.1007/s12525-021-00506-y', label: 'Read the paper' },
  },
  {
    date: '2021-05',
    label: 'May 2021',
    text: 'I began my doctoral research as a research associate in KIT’s Digital Service Innovation group, studying smart service innovation in incumbent firms.',
    link: { href: '/at-a-glance/', label: 'Research background' },
  },
  {
    date: '2021-04',
    label: 'Apr 2021',
    text: 'I completed my M.Sc. in Industrial Engineering & Management at KIT with distinction.',
  },
  {
    date: '2020-10',
    label: 'Oct 2020',
    text: 'I began teaching exercise sessions for KIT’s master’s course Digital Services: Business Models and Transformation.',
  },
  {
    date: '2020-04',
    label: 'Apr 2020',
    text: 'I joined KIT’s Digital Service Innovation group as a junior researcher.',
  },
];
