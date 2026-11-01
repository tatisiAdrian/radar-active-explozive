import { assets, db } from './radar';
import forex from './forex/scores.json';
import emerging from './emerging/scores.json';
import sp500 from './sp500/scores.json';
import ro from './startups-ro/scores.json';

/** Un punct pe radarul de pe Home: un activ dintr-un domeniu, cu numărul de condiții îndeplinite. */
export interface Dot { name: string; met: number; score: number }
export interface DomainOverview {
  slug: string;
  title: string;
  short: string;
  what: string;
  color: string;
  snapshot: string;
  items: Dot[];
}

type Scored = { rows: { name: string; id: string; met: number; score: number }[] };
const fromScores = (s: Scored, label?: (r: { name: string; id: string }) => string): Dot[] =>
  s.rows.map((r) => ({ name: label ? label(r) : r.name, met: r.met, score: r.score }));
const fromRadar = (m: 'crypto' | 'comp' | 'comm'): Dot[] =>
  assets.filter((a) => a.m === m).map((a) => ({ name: a.n.ro, met: a.k, score: a.s }));

export const OVERVIEW: DomainOverview[] = [
  { slug: 'crypto', title: 'Criptoactive', short: 'Cripto', what: 'tokenuri lansate și nelansate', color: '#2b59ff', snapshot: '2026-10-29.json', items: fromRadar('crypto') },
  { slug: 'startups', title: 'Start-ups la nivel mondial', short: 'Start-ups', what: 'companii listate recent, pre-IPO și start-up-uri', color: '#0e8a8a', snapshot: '2026-10-29.json', items: fromRadar('comp') },
  { slug: 'startups/europa/romania', title: 'Start-ups în România', short: 'România', what: 'companii tech fondate în România', color: '#1d6fa5', snapshot: 'startups-ro-2026-11-01.json', items: fromScores(ro as unknown as Scored) },
  { slug: 'sp500', title: 'S&P 500', short: 'S&P 500', what: 'cele mai mari companii americane', color: '#b0397a', snapshot: 'sp500-2026-11-01.json', items: fromScores(sp500 as unknown as Scored, (r) => `${r.id} · ${r.name}`) },
  { slug: 'marfuri', title: 'Mărfuri', short: 'Mărfuri', what: 'mărfuri mature și emergente', color: '#c2761a', snapshot: '2026-10-29.json', items: fromRadar('comm') },
  { slug: 'forex', title: 'Forex', short: 'Forex', what: 'monede majore și emergente', color: '#7a4fd0', snapshot: 'forex-2026-11-01.json', items: fromScores(forex as unknown as Scored, (r) => `${r.id} · ${r.name}`) },
  { slug: 'economii-emergente', title: 'Economii emergente', short: 'Emergente', what: 'economii emergente, inclusiv România', color: '#c4433b', snapshot: 'emergente-2026-11-01.json', items: fromScores(emerging as unknown as Scored) },
];

export const ALL = OVERVIEW.flatMap((d) => d.items);
export const UPDATED = db.updatedAt;
