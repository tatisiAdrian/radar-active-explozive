import { assets, db } from './radar';
import forex from './forex/scores.json';
import emerging from './emerging/scores.json';
import sp500 from './sp500/scores.json';
import ro from './startups-ro/scores.json';
import imob from './imobiliare/scores.json';
import proj from './proiecte-imobiliare/scores.json';
import { SOCIAL } from './social';
import { type Lang, DOMAIN_EN, NAME_EN, COUNTRY_EN } from './i18n';

/** Un punct pe radarul de pe Home: un activ dintr-un domeniu, cu numărul de condiții îndeplinite. */
export interface Dot { name: string; met: number; score: number; c: (number | null)[] }
export interface DomainOverview {
  slug: string;
  title: string;
  short: string;
  what: string;
  color: string;
  snapshot: string;
  items: Dot[];
}

type Scored = { rows: { name: string; id: string; met: number; score: number; criteria?: (number | null)[]; c?: (number | null)[] }[] };
const fromScores = (s: Scored, label?: (r: { name: string; id: string }) => string): Dot[] =>
  s.rows.map((r) => ({ name: label ? label(r) : r.name, met: r.met, score: r.score, c: r.criteria ?? r.c ?? [] }));
const fromRadar = (m: 'crypto' | 'comp' | 'comm'): Dot[] =>
  assets.filter((a) => a.m === m).map((a) => ({ name: a.n.ro, met: a.k, score: a.s, c: a.c }));

export const OVERVIEW: DomainOverview[] = [
  { slug: 'crypto', title: 'Criptoactive', short: 'Cripto', what: 'tokenuri lansate și nelansate', color: '#2b59ff', snapshot: '2026-10-29.json', items: fromRadar('crypto') },
  { slug: 'startups', title: 'Start-ups la nivel mondial', short: 'Start-ups', what: 'companii listate recent, pre-IPO și start-up-uri', color: '#0e8a8a', snapshot: '2026-10-29.json', items: fromRadar('comp') },
  { slug: 'startups/europa/romania', title: 'Start-ups în România', short: 'România', what: 'companii tech fondate în România', color: '#1d6fa5', snapshot: 'startups-ro-2026-11-01.json', items: fromScores(ro as unknown as Scored) },
  { slug: 'sp500', title: 'S&P 500', short: 'S&P 500', what: 'cele mai mari companii americane', color: '#b0397a', snapshot: 'sp500-2026-11-01.json', items: fromScores(sp500 as unknown as Scored, (r) => `${r.id} · ${r.name}`) },
  { slug: 'marfuri', title: 'Mărfuri', short: 'Mărfuri', what: 'mărfuri mature și emergente', color: '#c2761a', snapshot: '2026-10-29.json', items: fromRadar('comm') },
  { slug: 'forex', title: 'Forex', short: 'Forex', what: 'monede majore și emergente', color: '#7a4fd0', snapshot: 'forex-2026-11-01.json', items: fromScores(forex as unknown as Scored, (r) => `${r.id} · ${r.name}`) },
  { slug: 'imobiliare', title: 'Piața imobiliară națională', short: 'Imobiliare', what: 'piețe imobiliare naționale, inclusiv România', color: '#8a6d3b', snapshot: 'imobiliare-2026-11-02.json', items: fromScores(imob as unknown as Scored) },
  { slug: 'proiecte-imobiliare', title: 'Proiecte imobiliare de interes mondial', short: 'Proiecte', what: 'proiecte imobiliare mari și companiile din spatele lor', color: '#2f8f5b', snapshot: 'proiecte-imobiliare-2026-11-02.json', items: fromScores(proj as unknown as Scored) },
  { slug: 'economii-emergente', title: 'Economii emergente', short: 'Emergente', what: 'economii emergente, inclusiv România', color: '#c4433b', snapshot: 'emergente-2026-11-01.json', items: fromScores(emerging as unknown as Scored) },
  { slug: 'licee-romania', title: 'Cele mai bune licee din România', short: 'Licee', what: 'cele mai bune licee din românia', color: '#7c5cff', snapshot: 'social-licee-romania-2026-11-03.json', items: SOCIAL['licee-romania'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'facultati-romania', title: 'Cele mai bune universități din România', short: 'Facultăți', what: 'cele mai bune universități din românia', color: '#e0568a', snapshot: 'social-facultati-romania-2026-11-03.json', items: SOCIAL['facultati-romania'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'meserii-romania', title: 'Cele mai bune meserii în România', short: 'Meserii', what: 'cele mai bune meserii în românia', color: '#d98a1f', snapshot: 'social-meserii-romania-2026-11-03.json', items: SOCIAL['meserii-romania'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'angajatori-romania', title: 'Cei mai buni angajatori din România', short: 'Angajatori', what: 'cei mai buni angajatori din românia', color: '#2f9c8f', snapshot: 'social-angajatori-romania-2026-11-03.json', items: SOCIAL['angajatori-romania'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'localitati-romania', title: 'Cele mai bune localități din România pentru o viață de calitate', short: 'Localități', what: 'cele mai bune localități din românia pentru o viață de calitate', color: '#4f8de0', snapshot: 'social-localitati-romania-r2-2026-11-03.json', items: SOCIAL['localitati-romania'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'licee-europa', title: "Cele mai bune sisteme de licee din Europa", short: 'Licee', what: "cele mai bune sisteme de licee din europa", color: '#7c5cff', snapshot: 'social-licee-europa-2026-11-03.json', items: SOCIAL['licee-europa'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'facultati-europa', title: "Cele mai bune universități din Europa", short: 'Facultăți', what: "cele mai bune universități din europa", color: '#e0568a', snapshot: 'social-facultati-europa-2026-11-03.json', items: SOCIAL['facultati-europa'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'meserii-europa', title: "Cele mai bune meserii în Europa", short: 'Meserii', what: "cele mai bune meserii în europa", color: '#d98a1f', snapshot: 'social-meserii-europa-2026-11-03.json', items: SOCIAL['meserii-europa'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'angajatori-europa', title: "Cei mai buni angajatori din Europa", short: 'Angajatori', what: "cei mai buni angajatori din europa", color: '#2f9c8f', snapshot: 'social-angajatori-europa-2026-11-03.json', items: SOCIAL['angajatori-europa'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'localitati-europa', title: "Cele mai bune orașe din Europa pentru o viață de calitate", short: 'Localități', what: "cele mai bune orașe din europa pentru o viață de calitate", color: '#4f8de0', snapshot: 'social-localitati-europa-2026-11-03.json', items: SOCIAL['localitati-europa'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'licee-lume', title: "Cele mai bune sisteme de licee din lume", short: 'Licee', what: "cele mai bune sisteme de licee din lume", color: '#7c5cff', snapshot: 'social-licee-lume-2026-11-03.json', items: SOCIAL['licee-lume'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'facultati-lume', title: "Cele mai bune universități din lume", short: 'Facultăți', what: "cele mai bune universități din lume", color: '#e0568a', snapshot: 'social-facultati-lume-2026-11-03.json', items: SOCIAL['facultati-lume'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'meserii-lume', title: "Cele mai bune meserii în lume", short: 'Meserii', what: "cele mai bune meserii în lume", color: '#d98a1f', snapshot: 'social-meserii-lume-2026-11-03.json', items: SOCIAL['meserii-lume'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'angajatori-lume', title: "Cei mai buni angajatori din lume", short: 'Angajatori', what: "cei mai buni angajatori din lume", color: '#2f9c8f', snapshot: 'social-angajatori-lume-2026-11-03.json', items: SOCIAL['angajatori-lume'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
  { slug: 'localitati-lume', title: "Cele mai bune orașe din lume pentru o viață de calitate", short: 'Localități', what: "cele mai bune orașe din lume pentru o viață de calitate", color: '#4f8de0', snapshot: 'social-localitati-lume-2026-11-03.json', items: SOCIAL['localitati-lume'].rows.map((r) => ({ name: r.name, met: r.met, score: r.score, c: r.c })) },
];

export const ALL = OVERVIEW.flatMap((d) => d.items);
export const UPDATED = db.updatedAt;

/** Domeniile cu titluri și nume de active în limba cerută. */
export function overviewFor(lang: Lang, only?: string[]): DomainOverview[] {
  const pick = (xs: DomainOverview[]) => (only ? only.map((s) => xs.find((d) => d.slug === s)!).filter(Boolean) : xs);
  if (lang === 'ro') return pick(OVERVIEW);
  const en = Object.fromEntries(assets.map((a) => [a.n.ro, a.n.en]));
  const sc = { forex, 'economii-emergente': emerging, sp500, imobiliare: imob, 'proiecte-imobiliare': proj } as Record<string, unknown>;
  return pick(OVERVIEW).map((d) => {
    const t = DOMAIN_EN[d.slug];
    const rows = (sc[d.slug] as Scored | undefined)?.rows;
    const items = d.items.map((it, i) => {
      const r = rows?.[i];
      let name = en[it.name] ?? it.name;
      if (r && d.slug === 'forex') name = `${r.id} · ${NAME_EN[r.id] ?? r.name}`;
      if (r && d.slug === 'economii-emergente') name = COUNTRY_EN[r.id] ?? r.name;
      const rr = r as unknown as { nameEn?: string } | undefined;
      if (rr?.nameEn && (d.slug === 'imobiliare' || d.slug === 'proiecte-imobiliare')) name = rr.nameEn;
      if (SOCIAL[d.slug]) name = SOCIAL[d.slug].rows[i]?.nameEn ?? name;
      return { ...it, name };
    });
    return { ...d, title: t?.title ?? d.title, short: t?.short ?? d.short, what: t?.what ?? d.what, items };
  });
}
