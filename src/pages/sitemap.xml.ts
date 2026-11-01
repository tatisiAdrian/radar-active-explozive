import type { APIRoute } from 'astro';
import { domains } from '../data/domains';

// Harta site-ului pentru motoarele de căutare: toate paginile publice.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const paths = ['', 'domenii/', 'fond/', 'finantare/', 'metodologie/', 'radar/', 'radar/en/', ...domains.map((d) => `domenii/${d.slug}/`)];
  const urls = paths.map((p) => `<url><loc>${new URL(base + p, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
