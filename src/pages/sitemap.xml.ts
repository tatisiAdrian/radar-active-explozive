import type { APIRoute } from 'astro';
import { domains } from '../data/domains';

// Harta site-ului pentru motoarele de căutare: toate paginile publice.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const paths = ['', 'domenii/', 'fond/', 'finantare/', 'metodologie/', 'en/', 'en/funding/', 'investitii/', 'macro/', 'social/', 'en/social/', 'social/romania/', 'en/social/romania/', 'social/lume/', 'en/social/world/', 'en/investments/', 'en/macro/', 'en/domains/', 'en/substance/', 'en/methodology/', ...domains.map((d) => `domenii/${d.slug}/`), ...domains.map((d) => `en/domains/${d.slug}/`)];
  const urls = paths.map((p) => `<url><loc>${new URL(base + p, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
