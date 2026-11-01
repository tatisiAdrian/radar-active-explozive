import raw from '../../radar/assets.json';
import weekly from './prices/weekly.json';
import type { Source } from './types';

/** Un activ de pe radar (din radar/assets.json, aceeași sursă ca prima pagină). */
export interface RadarAsset {
  id: string;
  m: 'crypto' | 'comp' | 'comm';
  g: string;
  n: { ro: string; en: string };
  /** scor 0–10 */
  s: number;
  /** condiții îndeplinite (nota ≥ 7), din 14 */
  k: number;
  c: number[];
  w: { ro: string; en: string };
  x: { ro: string; en: string };
  l: string;
  lt: string;
}
export type Market = RadarAsset['m'];

export interface PriceSeries {
  provider: string;
  symbol: string;
  url: string;
  currency: string;
  note?: string;
  label?: string;
  points: [string, number][];
}
interface WeeklyDb {
  updatedAt: string;
  method: string;
  start: string;
  series: Record<string, PriceSeries>;
  benchmarks: Record<string, PriceSeries>;
  errors: string[];
}

export const assets = raw as RadarAsset[];
export const db = weekly as unknown as WeeklyDb;

/** Data instantaneului #1 și prima vineri de după el (baza pentru performanța de după). */
export const SNAPSHOT_DATE = '2026-10-29';
export const BASELINE = '2026-10-30';

export const GROUP: Record<string, string> = {
  pre: 'Crypto nelansat',
  post: 'Crypto lansat, sub vârf',
  ipo: 'Listate recent',
  preipo: 'Pre-IPO',
  startup: 'Start-up cu produs',
  seed: 'Start-up fără produs',
  mature: 'Matură, sub vârf',
  emerging: 'Emergentă',
};

/** Țara sediului principal, pentru companiile de pe radar (ISO 3166-1 alpha-2). */
export const COUNTRY: Record<string, string> = {
  'spacex-spcx': 'US', 'cerebras-cbrs': 'US', 'coreweave-crwv': 'US', 'circle-crcl': 'US', 'figma-fig': 'US',
  'klarna-klar': 'SE', 'chime-chym': 'US', 'gemini-gemi': 'US', 'stubhub-stub': 'US', 'catl-3750-hk': 'CN', shein: 'SG',
  openai: 'US', databricks: 'US', stripe: 'US', revolut: 'GB', bytedance: 'CN', anduril: 'US', ramp: 'US', canva: 'AU',
  'kraken-payward': 'US', discord: 'US', plaid: 'US',
  lovable: 'SE', mercor: 'US', elevenlabs: 'GB', harvey: 'US', sierra: 'US', 'mistral-ai': 'FR', cognition: 'US',
  glean: 'US', replit: 'US', perplexity: 'US', 'figure-ai': 'US',
  'safe-superintelligence-ssi': 'US', 'thinking-machines-lab': 'US', 'project-prometheus': 'US', 'ami-labs': 'FR',
  'ineffable-intelligence': 'GB', 'physical-intelligence': 'US', 'periodic-labs': 'US', 'unconventional-ai': 'US',
  'reflection-ai': 'US', humans: 'US', 'merge-labs': 'US',
};
export const COUNTRY_NAME: Record<string, string> = {
  US: 'SUA', CA: 'Canada', GB: 'Marea Britanie', FR: 'Franța', SE: 'Suedia', DE: 'Germania', RO: 'România',
  CN: 'China', SG: 'Singapore', IN: 'India', AU: 'Australia', BR: 'Brazilia',
};

export type Zone = 'puternic' | 'observatie' | 'slab';
export const zone = (k: number): Zone => (k >= 10 ? 'puternic' : k >= 6 ? 'observatie' : 'slab');
export const ZONE_LABEL: Record<Zone, string> = {
  puternic: '10+ condiții',
  observatie: '6–9 condiții',
  slab: 'sub 6 condiții',
};

export const BENCH_FOR: Record<Market, string> = { crypto: 'bitcoin', comp: 'sp500', comm: 'marfuri' };

export const dbSource: Source = {
  name: 'Baza de date săptămânală Radar (închideri CoinGecko și Yahoo Finance)',
  url: 'https://github.com/TatisiAdrian/radar-active-explozive/blob/main/src/data/prices/weekly.json',
  retrievedAt: db.updatedAt,
};

const at = (s: PriceSeries, date: string) => s.points.find((p) => p[0] === date)?.[1];

/** Variația procentuală între două vineri; undefined dacă lipsește un capăt. */
export function change(s: PriceSeries | undefined, from: string, to: string): number | undefined {
  if (!s) return undefined;
  const a = at(s, from);
  const b = at(s, to);
  return a && b ? (b / a - 1) * 100 : undefined;
}

export const latest = (s: PriceSeries) => s.points.at(-1)![0];

/** Seria rebazată la 100 în prima săptămână (pentru comparații pe același grafic). */
export const rebased = (s: PriceSeries): [string, number][] =>
  s.points.map(([d, v]) => [d, +((v / s.points[0][1]) * 100).toFixed(2)]);

export const median = (xs: number[]) => {
  if (!xs.length) return undefined;
  const v = [...xs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

export const pct = (x: number | undefined) =>
  x === undefined ? '—' : `${x > 0 ? '+' : ''}${x.toLocaleString('ro-RO', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;

/** Tot ce are nevoie pagina unui domeniu despre activele lui de pe radar. */
export function radarView(market: Market, countries?: string[]) {
  const list = assets
    .filter((a) => a.m === market && (!countries || countries.includes(COUNTRY[a.id]))).sort((a, b) => b.k - a.k || b.s - a.s);
  const bench = db.benchmarks[BENCH_FOR[market]];
  const start = db.start;
  const rows = list.map((a) => {
    const p = db.series[a.id];
    return {
      a,
      zone: zone(a.k),
      price: p,
      retro: change(p, start, BASELINE),
      after: p && latest(p) > BASELINE ? change(p, BASELINE, latest(p)) : undefined,
    };
  });
  const priced = rows.filter((r) => r.price);
  const benchRetro = change(bench, start, BASELINE);
  const benchAfter = bench && latest(bench) > BASELINE ? change(bench, BASELINE, latest(bench)) : undefined;
  const byZone = (['puternic', 'observatie', 'slab'] as Zone[]).map((z) => {
    const xs = priced.filter((r) => r.zone === z && r.retro !== undefined).map((r) => r.retro!);
    return { z, n: xs.length, med: median(xs) };
  });
  return { rows, priced, bench, benchRetro, benchAfter, byZone, start };
}
