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
  const top = slug.split('/')[0];
  const map: Record<string, string> = { crypto: 'crypto', startups: 'startups', marfuri: 'marfuri', forex: 'forex', 'economii-emergente': 'emergente', sp500: 'sp500', imobiliare: 'imobiliare', 'proiecte-imobiliare': 'proiecte' };
  return map[top] ? photo(map[top]) : undefined;
}
