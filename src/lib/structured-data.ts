import { site } from '../data/site';
import profile from '../data/profile.json';

// Schema.org data mirrors what the pages already show. Explainer pages and the
// original articles stay separate resources: the explainer is a WebPage about
// the ScholarlyArticle, never the article itself.

type Paper = {
  slug: string;
  title: string;
  full_authors: string;
  venue: string;
  url: string;
};

const conferences = new Set(['WI', 'ICIS', 'ECIS', 'DESRIST']);

export function personId(origin: URL) {
  return new URL('/#person', origin).href;
}

export function person(origin: URL) {
  return {
    '@type': 'Person',
    '@id': personId(origin),
    name: site.name,
    url: new URL('/', origin).href,
    image: new URL('/images/portrait.jpg', origin).href,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    worksFor: { '@type': 'CollegeOrUniversity', name: site.institution, url: 'https://www.kit.edu/' },
    sameAs: [site.scholar, site.orcid, site.linkedin, profile.profileUrl],
  };
}

export function profilePage(origin: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: new URL('/', origin).href,
    mainEntity: person(origin),
  };
}

function splitAuthors(names: string) {
  return names.replace(/,? and /, ', ').split(', ').map(name => name.trim()).filter(Boolean);
}

export function paperPage(paper: Paper, pageUrl: URL, origin: URL) {
  const [venueName, year, status] = paper.venue.split(' · ');
  const accepted = status === 'Accepted';
  const article: Record<string, unknown> = {
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    name: paper.title,
    url: paper.url,
    author: splitAuthors(paper.full_authors).map(name => name === site.name
      ? { '@id': personId(origin) }
      : { '@type': 'Person', name }),
  };
  if (accepted) article.creativeWorkStatus = 'Accepted';
  else if (year) article.datePublished = year;
  if (!conferences.has(venueName)) article.isPartOf = { '@type': 'Periodical', name: venueName };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person(origin),
      {
        '@type': 'WebPage',
        url: pageUrl.href,
        author: { '@id': personId(origin) },
        about: article,
      },
    ],
  };
}
