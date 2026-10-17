import type { APIRoute } from 'astro';
import papers from '../data/papers.json';

export const GET: APIRoute = ({ site }) => {
  const routes = ['/', '/research/', '/lab/', '/tools/', '/teaching/', '/at-a-glance/', ...papers.map(paper => `/research/${paper.slug}/`)];
  const urls = routes.map(route => `<url><loc>${new URL(route, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
