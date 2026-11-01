// Date pentru domeniul S&P 500:
// - SEC EDGAR (rapoartele anuale 10-K, API-ul XBRL companyfacts): venituri, flux de numerar, investiții,
//   numerar, datorie, răscumpărări, acțiuni în circulație
// - Yahoo Finance: prețul acțiunii (închideri zilnice → vineri; S&P 500 ca reper)
// Scrie src/data/sp500/macro.json. Rulează în GitHub Actions: node scripts/fetch-sp500.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = new URL('../src/data/sp500/macro.json', import.meta.url);
const START = '2026-09-04';
// SEC cere un User-Agent de forma „Nume adresă-de-contact”; folosim adresa noreply a contului GitHub al proiectului.
const SEC_UA = { 'User-Agent': 'RadarActiveExplozive radar-active-explozive@users.noreply.github.com', 'Accept-Encoding': 'gzip, deflate' };
const UA = { 'User-Agent': 'Mozilla/5.0 (radar-active-explozive data bot)' };

export const COMPANIES = {
  AAPL: 'Apple', MSFT: 'Microsoft', NVDA: 'Nvidia', AMZN: 'Amazon', GOOGL: 'Alphabet', META: 'Meta Platforms',
  AVGO: 'Broadcom', TSLA: 'Tesla', LLY: 'Eli Lilly', V: 'Visa', XOM: 'Exxon Mobil', WMT: 'Walmart',
  UNH: 'UnitedHealth', JNJ: 'Johnson & Johnson', PG: 'Procter & Gamble', ORCL: 'Oracle', COST: 'Costco',
  NFLX: 'Netflix', AMD: 'AMD', PLTR: 'Palantir',
};
const TAGS = {
  revenue: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet', 'RevenueFromContractWithCustomerIncludingAssessedTax'],
  netIncome: ['NetIncomeLoss'],
  opCashFlow: ['NetCashProvidedByUsedInOperatingActivities'],
  capex: ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsToAcquireProductiveAssets'],
  buybacks: ['PaymentsForRepurchaseOfCommonStock'],
  cash: ['CashAndCashEquivalentsAtCarryingValue', 'CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
  debt: ['LongTermDebt', 'LongTermDebtNoncurrent', 'LongTermDebtAndCapitalLeaseObligations'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const day = (ms) => new Date(ms).toISOString().slice(0, 10);
async function get(url, headers, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers });
    if (r.ok) return r.json();
    if (r.status === 429 || r.status >= 500) { await sleep(5000 * (i + 1)); continue; }
    throw new Error(`${r.status} ${url}`);
  }
  throw new Error(`prea multe încercări: ${url}`);
}

// Valori anuale (10-K, perioadă de ~1 an) pentru un tag; pentru solduri (fără start) luăm valorile de la sfârșitul anului fiscal.
function annual(facts, tags, isFlow) {
  for (const tag of tags) {
    const units = facts['us-gaap']?.[tag]?.units?.USD;
    if (!units) continue;
    const rows = units.filter((u) => u.form === '10-K' && (!isFlow || (u.start && (Date.parse(u.end) - Date.parse(u.start)) / 86400000 > 350 && (Date.parse(u.end) - Date.parse(u.start)) / 86400000 < 380)));
    if (!rows.length) continue;
    const byEnd = new Map();
    for (const r of rows) if (!byEnd.has(r.end) || r.filed > byEnd.get(r.end).filed) byEnd.set(r.end, r);
    const sorted = [...byEnd.values()].sort((a, b) => a.end.localeCompare(b.end));
    const last = sorted.at(-1);
    const prev = sorted.filter((r) => Date.parse(last.end) - Date.parse(r.end) > 300 * 86400000).at(-1);
    return { tag, end: last.end, value: last.val, prevEnd: prev?.end, prev: prev?.val, accn: last.accn };
  }
  return undefined;
}
function shares(facts) {
  const units = facts.dei?.EntityCommonStockSharesOutstanding?.units?.shares;
  if (!units) return undefined;
  // Mai multe clase de acțiuni raportate la aceeași dată se adună.
  const byEnd = new Map();
  for (const u of units) {
    const k = u.end;
    const cur = byEnd.get(k) ?? { end: k, accn: u.accn, value: 0, seen: new Set() };
    if (u.accn === cur.accn && !cur.seen.has(u.frame ?? u.val)) { cur.value += u.val; cur.seen.add(u.frame ?? u.val); }
    byEnd.set(k, cur);
  }
  const sorted = [...byEnd.values()].sort((a, b) => a.end.localeCompare(b.end));
  const last = sorted.at(-1);
  const yearAgo = sorted.filter((r) => Date.parse(last.end) - Date.parse(r.end) > 330 * 86400000).at(-1);
  return { end: last.end, value: last.value, yearAgoEnd: yearAgo?.end, yearAgo: yearAgo?.value };
}

const errors = [];
const out = { updatedAt: day(Date.now()), start: START, sources: {}, companies: {}, prices: {}, errors };

const tickers = await get('https://www.sec.gov/files/company_tickers.json', SEC_UA);
const cikOf = Object.fromEntries(Object.values(tickers).map((t) => [t.ticker, String(t.cik_str).padStart(10, '0')]));

for (const [tk, name] of Object.entries(COMPANIES)) {
  try {
    const cik = cikOf[tk];
    if (!cik) throw new Error('CIK negăsit');
    const j = await get(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, SEC_UA);
    const f = j.facts;
    const c = { name, cik, url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=10-K` };
    for (const [k, tags] of Object.entries(TAGS)) {
      const v = annual(f, tags, !['cash', 'debt'].includes(k));
      if (v) c[k] = v;
    }
    const sh = shares(f);
    if (sh) c.shares = sh;
    out.companies[tk] = c;
    console.log(`ok SEC ${tk}: venituri ${c.revenue?.value} (${c.revenue?.end}), acțiuni ${c.shares?.value}`);
  } catch (e) { errors.push(`SEC ${tk}: ${e.message}`); console.warn('EROARE SEC', tk, e.message); }
  await sleep(400);
}
out.sources.sec = { name: 'SEC EDGAR, rapoarte anuale 10-K (XBRL companyfacts)', url: 'https://www.sec.gov/edgar/search/', retrievedAt: out.updatedAt };

const fridays = [];
for (let d = new Date(START + 'T00:00:00Z'); day(d) <= out.updatedAt; d.setUTCDate(d.getUTCDate() + 7)) fridays.push(day(d));
let old = {};
try { old = JSON.parse(await readFile(OUT, 'utf8')).prices ?? {}; } catch {}
for (const tk of [...Object.keys(COMPANIES), '^GSPC']) {
  const sym = tk === 'GOOGL' ? 'GOOGL' : tk;
  try {
    const j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1y&interval=1d`, UA);
    const r = j.chart.result[0];
    const daily = r.timestamp.map((t, i) => [t * 1000, r.indicators.quote[0].close[i]]).filter((p) => p[1] != null);
    const pts = [];
    for (const fr of fridays) {
      const lim = Date.parse(fr + 'T23:59:59Z');
      const last = daily.filter((p) => p[0] <= lim).at(-1);
      if (last && lim - last[0] < 4 * 86400000) pts.push([fr, +last[1].toPrecision(6)]);
    }
    const m = new Map(old[tk]?.points ?? []);
    const freeze = day(Date.now() - 7 * 86400000);
    for (const [d, v] of pts) if (!m.has(d) || d >= freeze) m.set(d, v);
    const vals = daily.map((p) => p[1]);
    out.prices[tk] = {
      symbol: sym, url: `https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`,
      points: [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      last: +vals.at(-1).toPrecision(6), high52: +Math.max(...vals).toPrecision(6), low52: +Math.min(...vals).toPrecision(6),
    };
    console.log(`ok preț ${tk}: ${out.prices[tk].last}`);
  } catch (e) { errors.push(`Yahoo ${tk}: ${e.message}`); console.warn('EROARE Yahoo', tk, e.message); }
  await sleep(1000);
}
out.sources.prices = { name: 'Yahoo Finance (prețuri de închidere)', url: 'https://finance.yahoo.com/', retrievedAt: out.updatedAt };

await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`Scris ${OUT.pathname}; ${errors.length} erori`);
