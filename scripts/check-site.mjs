import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const required = ['index.html', 'research/index.html', 'ideas/index.html', 'lab/index.html', 'tools/index.html', 'teaching/index.html', 'at-a-glance/index.html', 'cv/index.html', 'privacy/index.html', '404.html', 'sitemap.xml', 'files/daniel-heinz-cv.pdf'];
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
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${pages.length} pages: local links, responsive images, downloads, metadata, sitemap coverage, and private-path exclusions passed.`);
