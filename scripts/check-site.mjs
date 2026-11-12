import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const required = ['index.html', 'research/index.html', 'ideas/index.html', 'lab/index.html', 'tools/index.html', 'teaching/index.html', 'at-a-glance/index.html', 'cv/index.html', 'privacy/index.html', 'impressum/index.html', '404.html', 'sitemap.xml', 'files/daniel-heinz-cv.pdf'];
const errors = [];
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
for (const file of required) {
  try { await access(path.join(root, file)); } catch { errors.push(`Missing route or download: ${file}`); }
}
const files = await walk(root);
const pages = files.filter(f => f.endsWith('.html'));
const cache = new Map(await Promise.all(pages.map(async f => [f, await readFile(f, 'utf8')])));
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1])));
for (const [file, html] of cache) {
  const name = path.relative(root, file);
  for (const legalPage of ['/impressum/', '/privacy/']) {
    if (!html.includes(`href="${legalPage}"`)) errors.push(`${name}: missing legal link ${legalPage}`);
  }
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${name}: expected one h1`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) errors.push(`${name}: missing description`);
  if (!/<link\s+rel="canonical"\s+href="https:\/\/[^\"]+"/.test(html)) errors.push(`${name}: missing canonical`);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (canonical && !/<meta\s+name="robots"\s+content="[^"]*noindex/.test(html) && !sitemapUrls.has(decode(canonical))) errors.push(`${name}: canonical page missing from sitemap`);
  if (/\/Users\/|dh-private|dh-hq|_planning|localhost|127\.0\.0\.1|#cv-note|#contact-details|INSERT_URL/.test(html)) errors.push(`${name}: private path or prototype content`);
  const references = [...html.matchAll(/\b(?:href|src)="([^"]*)"/g)].map(m => m[1]);
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    references.push(...match[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
  }
  for (const reference of references) {
    const value = decode(reference);
    if (/^(?:[a-z]+:|\/\/)/i.test(value)) continue;
    if (!value || value === '#') { errors.push(`${name}: empty link`); continue; }
    const url = new URL(value, `https://local.test/${name.replace(/index\.html$/, '')}`);
    let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
    if (target !== root && !target.startsWith(root + path.sep)) { errors.push(`${name}: path escape`); continue; }
    try { await access(target); } catch { errors.push(`${name}: missing ${value}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      const targetHtml = cache.get(target) || await readFile(target, 'utf8');
      const ids = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map(m => decode(m[1]));
      if (!ids.includes(decodeURIComponent(url.hash.slice(1)))) errors.push(`${name}: missing fragment ${value}`);
    }
  }
}
// Every publication actually offered in the CV must have a click label.
const cvHtml = cache.get(path.join(root, 'cv/index.html')) || '';
const analyticsJson = cvHtml.match(/<script[^>]*id="site-analytics"[^>]*>([\s\S]*?)<\/script>/)?.[1];
if (!analyticsJson) {
  errors.push('cv/index.html: missing analytics configuration');
} else {
  const analytics = JSON.parse(analyticsJson);
  const publications = JSON.parse(await readFile('src/data/cv-publications.json', 'utf8'));
  for (const paper of [...publications.journal_articles, ...publications.selected_conference_papers]) {
    if (!analytics.links[new URL(paper.url).href]) errors.push(`cv/index.html: publication click is not counted: ${paper.url}`);
  }
}
// Research visions preserve every existing paper and its deep link.
const researchHtml = cache.get(path.join(root, 'research/index.html')) || '';
const visions = [
  ['agentic-enterprise', ['renewal', 'smart-services', 'pilot-production']],
  ['ai-native-venturing', ['entrepreneurship', 'startup-agency']],
  ['agentic-ecosystems', ['circular-industry', 'circular-value', 'enterprise-ai', 'data-ecosystems', 'data-selection']],
];
const researchNav = researchHtml.match(/<nav class="research-contents"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
const visionLinks = [...researchNav.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
if (JSON.stringify(visionLinks) !== JSON.stringify(visions.map(([id]) => id))) errors.push('Research: expected exactly three vision navigation targets');
const papers = JSON.parse(await readFile('src/data/papers.json', 'utf8'));
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
for (const [vision, ids] of visions) {
  const group = researchHtml.match(new RegExp(`<section class="research-vision" id="${vision}"[^>]*>([\\s\\S]*?)</section>`))?.[1] || '';
  const actual = [...group.matchAll(/<article class="research-stream" id="([^"]+)"/g)].map(match => match[1]);
  if (JSON.stringify(actual) !== JSON.stringify(ids)) errors.push(`Research: wrong paper grouping for ${vision}`);
  if (!group.includes(`<h2 id="${vision}-title">`) || !group.includes('class="vision-question"')) errors.push(`Research: missing vision heading or guiding question for ${vision}`);
}
if ((researchHtml.match(/class="research-stream"/g) || []).length !== 10) errors.push('Research: expected exactly ten papers');
for (const paper of papers) {
  const article = researchHtml.match(new RegExp(`<article class="research-stream" id="${paper.id}"[^>]*>([\\s\\S]*?)</article>`))?.[1] || '';
  if ((researchHtml.match(new RegExp(`id="${paper.id}"`, 'g')) || []).length !== 1) errors.push(`Research: paper anchor must occur exactly once: ${paper.id}`);
  for (const text of [paper.question, paper.idea, paper.title, paper.authors, paper.venue]) {
    if (!article.includes(escapeHtml(text))) errors.push(`Research: changed or missing paper content: ${paper.id}`);
  }
  for (const url of [paper.url, `/research/${paper.slug}/`, paper.image_source?.url].filter(Boolean)) {
    if (!article.includes(`href="${escapeHtml(url)}"`)) errors.push(`Research: missing paper link: ${paper.id}: ${url}`);
  }
  if (!article.includes(`<h3 id="${paper.id}-title">`)) errors.push(`Research: paper question must be h3: ${paper.id}`);
}
const toolsHtml = cache.get(path.join(root, 'tools/index.html')) || '';
if (!toolsHtml.includes('id="venturetool"') || !toolsHtml.includes('VentureTool (working title)')) errors.push('Tools: VentureTool working title must be visible');
for (const file of files) {
  if (/innocompass/i.test(file)) errors.push(`Old public tool path: ${file}`);
  if (/\.(?:html|css|js|json|md|txt|xml)$/.test(file) && /innocompass/i.test(await readFile(file, 'utf8'))) errors.push(`Old public tool name: ${file}`);
}
const boundedRole = 'I provide day-to-day research advising for Jonas Liebschner, Linda Sagnier Eckert, and Ida Meier. Prof. Gerhard Satzger provides formal doctoral supervision for these three researchers.';
for (const route of ['lab/index.html', 'cv/index.html']) {
  const html = cache.get(path.join(root, route)) || '';
  for (const text of ['Pandora Dietle', 'Human–agentic AI collaboration', 'Since November 2026', 'https://www.win.kit.edu/news_2135.php', boundedRole]) {
    if (!html.includes(text)) errors.push(`${route}: missing Pandora source data or bounded roles: ${text}`);
  }
  if (html.includes('for the projects below')) errors.push(`${route}: universal supervision claim`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Research: ten unchanged papers, three vision groups, stable anchors and links; VentureTool naming; Pandora source/date and bounded roles passed.');
console.log(`Checked ${pages.length} pages: local links, responsive images, downloads, metadata, sitemap coverage, and private-path exclusions passed.`);
