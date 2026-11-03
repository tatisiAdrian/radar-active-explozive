import cfg from '../../scripts/photos.json';

/** Fotografiile site-ului (licența Unsplash), descărcate în public/images/<key>-1600.jpg și <key>-800.jpg. */
export interface Photo { key: string; alt: string; author: string; page: string }
const photos = cfg.photos as Photo[];
export const photo = (key: string) => photos.find((p) => p.key === key);

/** Fotografia potrivită pentru un domeniu (subdomeniile o moștenesc de la părinte). */
export function photoForDomain(slug: string): Photo | undefined {
  if (slug.startsWith('startups/europa/romania')) return photo('romania');
  // Fiecare regiune de start-up-uri are fotografia ei (orașul-simbol al regiunii).
  const sub = slug.startsWith('startups/') ? slug.split('/').at(-1)! : '';
  if (sub && photo(sub)) return photo(sub);
  if (photo(slug)) return photo(slug);
  // Analizele europene fără fotografie proprie o folosesc pe cea a analizei românești pereche.
  if (slug.endsWith('-europa') && photo(slug.replace('-europa', '-romania'))) return photo(slug.replace('-europa', '-romania'));
  // Analizele mondiale: o fotografie dintr-un loc de top al analizei, altfel cea a analizei românești pereche.
  const W: Record<string, string> = { 'licee-lume': 'singapore', 'facultati-lume': 'sua', 'localitati-lume': 'oceania' };
  if (W[slug]) return photo(W[slug]);
  if (slug.endsWith('-lume') && photo(slug.replace('-lume', '-romania'))) return photo(slug.replace('-lume', '-romania'));
  const top = slug.split('/')[0];
  const map: Record<string, string> = { crypto: 'crypto', startups: 'startups', marfuri: 'marfuri', forex: 'forex', 'economii-emergente': 'emergente', sp500: 'sp500', imobiliare: 'imobiliare', 'proiecte-imobiliare': 'proiecte' };
  return map[top] ? photo(map[top]) : undefined;
}
