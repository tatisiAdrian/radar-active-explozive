// Baza de date săptămânală: descarcă prețuri de închidere din surse publice
// și le adaugă în src/data/prices/weekly.json (un punct pe vineri, UTC).
// Rulează în GitHub Actions (are acces la internet): node scripts/fetch-prices.mjs
//
// Reguli:
// - punctele mai vechi de 7 zile nu se mai modifică (istoricul e înghețat);
// - fiecare serie păstrează sursa, simbolul și linkul de verificare;
// - activele fără preț public zilnic nu primesc serie (nu inventăm nimic).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = new URL('../src/data/prices/weekly.json', import.meta.url);
const START = '2026-09-04'; // prima vineri din fereastra de două luni
const UA = { 'User-Agent': 'Mozilla/5.0 (radar-active-explozive data bot; +https://github.com/TatisiAdrian/radar-active-explozive)' };

// id activ (din radar/assets.json) → sursă
const CRYPTO = {
  'megaeth-mega': ['MegaETH', 'MEGA'],
  'arcium-arx': ['Arcium', 'ARX'],
  'starknet-strk': ['Starknet', 'STRK'],
  'linea-linea': ['Linea', 'LINEA'],
  'monad-mon': ['Monad', 'MON'],
  'story-ip': ['Story Protocol', 'IP', 'story-2'],
  'somnia-somi': ['Somnia', 'SOMI'],
  'plasma-xpl': ['Plasma', 'XPL'],
  'berachain-bera': ['Berachain', 'BERA'],
  'bio-protocol-bio': ['Bio Protocol', 'BIO'],
  'movement-move': ['Movement', 'MOVE'],
  'lighter-lit': ['Lighter', 'LIT'],
};
const YAHOO = {
  'spacex-spcx': ['SPCX'],
  'cerebras-cbrs': ['CBRS'],
  'coreweave-crwv': ['CRWV'],
  'circle-crcl': ['CRCL'],
  'figma-fig': ['FIG'],
  'klarna-klar': ['KLAR'],
  'chime-chym': ['CHYM'],
  'gemini-gemi': ['GEMI'],
  'stubhub-stub': ['STUB'],
  'catl-3750-hk': ['3750.HK'],
  'ro-uipath': ['PATH'],
  // Proiecte imobiliare de interes mondial (companiile listate din spatele lor)
  'pi-equinix': ['EQIX'],
  'pi-digital-realty': ['DLR'],
  'pi-prologis': ['PLD'],
  'pi-welltower': ['WELL'],
  'pi-vonovia': ['VNA.DE'],
  'pi-ctp': ['CTPNV.AS'],
  'pi-emaar': ['EMAAR.AE'],
  'pi-mitsui-fudosan': ['8801.T'],
  'pi-shkp': ['0016.HK'],
  'pi-one-united': ['ONE.RO'],
  'litiu-carbonat': ['LIT', 'ETF pe companii de litiu (aproximare)'],
  'paladiu': ['PALL', 'ETF fizic'],
  'portocale-suc-de-portocale': ['OJ=F', 'futures ICE'],
  'gaz-natural-sua-henry-hub': ['NG=F', 'futures NYMEX'],
  'grau-sua-hrw': ['KE=F', 'futures KC HRW'],
  'porumb': ['ZC=F', 'futures CBOT'],
  'zahar': ['SB=F', 'futures ICE'],
  'cacao': ['CC=F', 'futures ICE'],
  'pamanturi-rare-ndpr-oxid': ['REMX', 'ETF pe companii de pământuri rare (aproximare)'],
  'credite-de-eliminare-a-carbonului-cdr': ['KRBN', 'ETF pe carbon reglementat (aproximare)'],
};
const BENCH = {
  bitcoin: { label: 'Bitcoin', provider: 'coingecko', id: 'bitcoin' },
  sp500: { label: 'S&P 500', provider: 'yahoo', symbol: '^GSPC' },
  marfuri: { label: 'Mărfuri (ETF DBC)', provider: 'yahoo', symbol: 'DBC' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const day = (ms) => new Date(ms).toISOString().slice(0, 10);

function fridays(from, to) {
  const out = [];
  for (let d = new Date(from + 'T00:00:00Z'); day(d) <= to; d.setUTCDate(d.getUTCDate() + 7)) out.push(day(d));
  return out;
}

// Din puncte zilnice [ms, preț] → închiderea fiecărei vineri (ultimul preț cu data ≤ vinerea).
function weekly(daily, weeks) {
  const sorted = [...daily].sort((a, b) => a[0] - b[0]);
  const pts = [];
  for (const f of weeks) {
    const limit = Date.parse(f + 'T23:59:59Z');
    let last;
    for (const p of sorted) if (p[0] <= limit) last = p; else break;
    // nu folosim un preț mai vechi de 4 zile față de vineri
    if (last && limit - last[0] < 4 * 86400000 && Number.isFinite(last[1])) pts.push([f, +last[1].toPrecision(6)]);
  }
  return pts;
}

async function getJSON(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r.json();
    if (r.status === 429 || r.status >= 500) { await sleep(15000 * (i + 1)); continue; }
    throw new Error(`${r.status} ${url}`);
  }
  throw new Error(`prea multe încercări: ${url}`);
}

const CG = 'https://api.coingecko.com/api/v3';
// Caută după nume; ID-ul găsit se salvează în bază și se refolosește data viitoare.
async function coingeckoResolve(name, symbol) {
  const j = await getJSON(`${CG}/search?query=${encodeURIComponent(name)}`);
  const c = j.coins
    .filter((c) => c.symbol.toUpperCase() === symbol)
    .sort((a, b) => (a.market_cap_rank ?? 1e9) - (b.market_cap_rank ?? 1e9))[0];
  if (!c) throw new Error(`CoinGecko: nu găsesc ${name} (${symbol})`);
  return c.id;
}
async function coingeckoDaily(id) {
  const j = await getJSON(`${CG}/coins/${id}/market_chart?vs_currency=usd&days=120&interval=daily`);
  return j.prices;
}
async function yahooDaily(symbol) {
  const j = await getJSON(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=6mo&interval=1d`);
  const r = j.chart.result?.[0];
  if (!r) throw new Error(`Yahoo: fără date pentru ${symbol}`);
  const closes = r.indicators.quote[0].close;
  return r.timestamp.map((t, i) => [t * 1000, closes[i]]).filter((p) => p[1] != null);
}

function merge(old, fresh, today) {
  const freezeBefore = day(Date.parse(today) - 7 * 86400000);
  const m = new Map(old ?? []);
  for (const [d, v] of fresh) if (!m.has(d) || d >= freezeBefore) m.set(d, v);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

const today = day(Date.now());
const weeks = fridays(START, today);
let db = { series: {}, benchmarks: {} };
try { db = JSON.parse(await readFile(OUT, 'utf8')); } catch {}
const errors = [];

async function run(target, key, meta, loader) {
  try {
    const pts = weekly(await loader(), weeks);
    if (!pts.length) throw new Error('niciun punct în fereastră');
    target[key] = { ...meta, points: merge(target[key]?.points, pts, today) };
    console.log(`ok ${key}: ${pts.length} săptămâni, ultima ${pts.at(-1).join(' = ')}`);
  } catch (e) {
    errors.push(`${key}: ${e.message}`);
    console.warn(`EROARE ${key}: ${e.message}`);
  }
}

for (const [id, [name, symbol, fixedId]] of Object.entries(CRYPTO)) {
  let cg = db.series[id]?.symbol ?? fixedId;
  await run(db.series, id, {}, async () => {
    if (!cg) { cg = await coingeckoResolve(name, symbol); await sleep(6000); }
    return coingeckoDaily(cg);
  });
  if (db.series[id]) Object.assign(db.series[id], {
    provider: 'CoinGecko', symbol: cg, url: `https://www.coingecko.com/en/coins/${cg}`, currency: 'USD',
  });
  await sleep(6000);
}
for (const [id, [symbol, note]] of Object.entries(YAHOO)) {
  await run(db.series, id, {
    provider: 'Yahoo Finance', symbol, url: `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`,
    currency: symbol.endsWith('.HK') ? 'HKD' : 'USD', ...(note ? { note } : {}),
  }, () => yahooDaily(symbol));
  await sleep(1500);
}
for (const [key, b] of Object.entries(BENCH)) {
  const meta = b.provider === 'coingecko'
    ? { label: b.label, provider: 'CoinGecko', symbol: b.id, url: `https://www.coingecko.com/en/coins/${b.id}`, currency: 'USD' }
    : { label: b.label, provider: 'Yahoo Finance', symbol: b.symbol, url: `https://finance.yahoo.com/quote/${encodeURIComponent(b.symbol)}`, currency: 'USD' };
  await run(db.benchmarks, key, meta, () => (b.provider === 'coingecko' ? coingeckoDaily(b.id) : yahooDaily(b.symbol)));
  await sleep(6000);
}

db = {
  updatedAt: today,
  method: 'Închiderea zilnică publicată de sursă, luată pentru fiecare vineri (UTC). Punctele mai vechi de 7 zile nu se mai modifică.',
  start: START,
  series: db.series,
  benchmarks: db.benchmarks,
  errors,
};
await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(db, null, 1) + '\n');
console.log(`Scris ${OUT.pathname}: ${Object.keys(db.series).length} active, ${errors.length} erori`);
if (!Object.keys(db.series).length) process.exit(1);
