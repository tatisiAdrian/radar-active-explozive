import { assets, GROUP } from './radar';
import forex from './forex/scores.json';
import emerging from './emerging/scores.json';
import sp500 from './sp500/scores.json';
import ro from './startups-ro/scores.json';
import { OVERVIEW } from './overview';
import { fondTag, FOND_LABEL } from './explain';
import { type Lang, DOMAIN_EN, NAME_EN, COUNTRY_EN, STAGE_EN, GROUP_EN, ACCESS_EN, FOND_EN } from './i18n';

/** Un activ, oricare ar fi domeniul lui, în forma de care are nevoie prima pagină. */
export interface HomeItem {
  name: string;
  domain: string; // slug
  dshort: string;
  color: string;
  group: string;
  access: 'Cumpărabil' | 'Prin utilizare' | 'Acces restrâns' | 'Indirect';
  met: number;
  score: number;
  c: (number | null)[];
  set: string; // setul de condiții (criteria.ts)
  launched: boolean | null; // înainte / după lansare, unde are sens
  fond: string;
  /** Numele în engleză (unde diferă) și cheia grupului, pentru traducere. */
  nameEn?: string;
  gkey?: string;
}

const meta = Object.fromEntries(OVERVIEW.map((d) => [d.slug, d]));
const mk = (slug: string, x: Omit<HomeItem, 'domain' | 'dshort' | 'color' | 'fond'>): HomeItem => ({
  ...x,
  domain: slug,
  dshort: meta[slug].short,
  color: meta[slug].color,
  fond: FOND_LABEL[fondTag(x.c)],
});

const ACCESS: Record<string, HomeItem['access']> = {
  pre: 'Prin utilizare', post: 'Cumpărabil', ipo: 'Cumpărabil', preipo: 'Acces restrâns',
  startup: 'Acces restrâns', seed: 'Acces restrâns', mature: 'Cumpărabil', emerging: 'Indirect',
};
const LAUNCHED: Record<string, boolean> = { pre: false, post: true, preipo: false, ipo: true, seed: false, startup: true, emerging: false, mature: true };

type Row = { id: string; name: string; score: number; met: number; criteria?: (number | null)[]; c?: (number | null)[]; stage?: string; priceId?: string };

export const ITEMS: HomeItem[] = [
  ...assets.map((a) => mk(a.m === 'crypto' ? 'crypto' : a.m === 'comp' ? 'startups' : 'marfuri', {
    name: a.n.ro, group: GROUP[a.g] ?? a.g, access: ACCESS[a.g] ?? 'Indirect', met: a.k, score: a.s, c: a.c,
    set: a.m === 'comm' ? 'marfuri' : 'general', launched: LAUNCHED[a.g] ?? null, nameEn: a.n.en, gkey: a.g,
  })),
  ...(ro.rows as unknown as Row[]).map((r) => mk('startups/europa/romania', {
    name: r.name, group: r.stage ?? 'Start-up', access: r.priceId ? 'Cumpărabil' : 'Acces restrâns', met: r.met, score: r.score, c: r.c ?? [], set: 'general', launched: null, gkey: r.stage,
  })),
  ...(sp500.rows as unknown as Row[]).map((r) => mk('sp500', {
    name: `${r.name} (${r.id})`, group: 'Listată în S&P 500', access: 'Cumpărabil', met: r.met, score: r.score, c: r.criteria ?? [], set: 'sp500', launched: null, gkey: 'sp',
  })),
  ...(forex.rows as unknown as Row[]).map((r) => mk('forex', {
    name: `${r.name} (${r.id})`, group: 'Monedă', access: 'Cumpărabil', met: r.met, score: r.score, c: r.criteria ?? [], set: 'forex', launched: null, nameEn: `${NAME_EN[r.id] ?? r.name} (${r.id})`, gkey: 'fx',
  })),
  ...(emerging.rows as unknown as Row[]).map((r) => mk('economii-emergente', {
    name: r.name, group: 'Economie emergentă', access: 'Indirect', met: r.met, score: r.score, c: r.criteria ?? [], set: 'economii-emergente', launched: null, nameEn: COUNTRY_EN[r.id] ?? r.name, gkey: 'em',
  })),
];

export const byRank = (a: HomeItem, b: HomeItem) => b.met - a.met || b.score - a.score;

const GROUP_EN_EXTRA: Record<string, string> = { fx: 'Currency', em: 'Emerging economy', sp: 'Listed in the S&P 500' };
/** Același activ, cu textul în limba cerută (notele rămân identice). */
export function localize(it: HomeItem, lang: Lang): HomeItem {
  if (lang === 'ro') return it;
  const g = it.gkey ?? '';
  return {
    ...it,
    name: it.nameEn ?? it.name,
    dshort: DOMAIN_EN[it.domain]?.short ?? it.dshort,
    group: GROUP_EN[g] ?? STAGE_EN[g] ?? GROUP_EN_EXTRA[g] ?? it.group,
    access: (ACCESS_EN[it.access] ?? it.access) as HomeItem['access'],
    fond: FOND_EN[it.fond] ?? it.fond,
  };
}
export const itemsFor = (lang: Lang, only?: string[]) => ITEMS.filter((i) => !only || only.includes(i.domain)).map((i) => localize(i, lang));
