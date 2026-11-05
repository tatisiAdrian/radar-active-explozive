// Date pentru domeniul Economii emergente (adaptat din fetch-forex.mjs), din surse oficiale și publice:
// - FMI (World Economic Outlook, prin API-ul DataMapper): creștere, inflație, cont curent, sold bugetar, datorie publică
// - BIS (Banca Reglementelor Internaționale): dobânda de politică monetară, inflația anuală (IPC)
// - Yahoo Finance: cursul de schimb (închideri zilnice → vineri; maxim și minim pe 52 de săptămâni)
// Scrie src/data/forex/macro.json. Rulează în GitHub Actions: node scripts/fetch-forex.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = new URL('../src/data/emerging/macro.json', import.meta.url);
const START = '2026-09-04';
const UA = { 'User-Agent': 'Mozilla/5.0 (radar-active-explozive data bot)' };

// cod monedă → [cod FMI, cod BIS, simbol Yahoo, inversat?]
// inversat = Yahoo dă unități de monedă per 1 USD; noi stocăm USD per 1 unitate de monedă.
// țară → [cod FMI, cod BIS, ETF de țară pe Yahoo Finance (null = fără ETF), inversat]
export const CURRENCIES = {
  CN: ['CHN', 'CN', 'MCHI', false],
  IN: ['IND', 'IN', 'INDA', false],
  BR: ['BRA', 'BR', 'EWZ', false],
  MX: ['MEX', 'MX', 'EWW', false],
  ID: ['IDN', 'ID', 'EIDO', false],
  TR: ['TUR', 'TR', 'TUR', false],
  ZA: ['ZAF', 'ZA', 'EZA', false],
  PL: ['POL', 'PL', 'EPOL', false],
  RO: ['ROU', 'RO', ['TVBETETF.RO', '^BET', '^BETI'], false],
  VN: ['VNM', 'VN', 'VNM', false],
  SA: ['SAU', 'SA', 'KSA', false],
  AR: ['ARG', 'AR', 'ARGT', false],
  EG: ['EGY', 'EG', ['EGPT', '^CASE30', 'EGX30.CA'], false],
  PH: ['PHL', 'PH', 'EPHE', false],
  CL: ['CHL', 'CL', 'ECH', false],
  KR: ['KOR', 'KR', 'EWY', false],
  TW: ['TWN', 'TW', 'EWT', false],
  MY: ['MYS', 'MY', 'EWM', false],
  TH: ['THA', 'TH', 'THD', false],
  CO: ['COL', 'CO', 'COLO', false],
  PE: ['PER', 'PE', 'EPU', false],
  AE: ['ARE', 'AE', 'UAE', false],
  EM: [null, null, 'EEM', false],
};
const IMF_IND = {
  NGDP_RPCH: 'Creștere PIB real (%)',
  PCPIPCH: 'Inflație medie (%)',
  BCA_NGDPD: 'Cont curent (% din PIB)',
  GGXCNL_NGDP: 'Sold bugetar (% din PIB)',
  GGXWDG_NGDP: 'Datorie publică brută (% din PIB)',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const day = (ms) => new Date(ms).toISOString().slice(0, 10);
async function get(url, as = 'json', tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA });
    if (r.ok) return as === 'json' ? r.json() : r.text();
    if (r.status === 429 || r.status >= 500) { await sleep(8000 * (i + 1)); continue; }
    throw new Error(`${r.status} ${url}`);
  }
  throw new Error(`prea multe încercări: ${url}`);
}

const errors = [];
const out = { updatedAt: day(Date.now()), start: START, sources: {}, imf: {}, bis: {}, fx: {}, errors };

// ——— FMI ———
const imfCodes = Object.values(CURRENCIES).map((c) => c[0]).filter(Boolean).join('/');
for (const [ind, label] of Object.entries(IMF_IND)) {
  try {
    const j = await get(`https://www.imf.org/external/datamapper/api/v1/${ind}/${imfCodes}?periods=2024,2025,2026,2027`);
    const vals = j.values?.[ind] ?? {};
    out.imf[ind] = { label, values: {} };
    for (const [cur, [imf]] of Object.entries(CURRENCIES)) {
      if (vals[imf]) out.imf[ind].values[cur] = vals[imf];
    }
    console.log(`ok FMI ${ind}: ${Object.keys(out.imf[ind].values).length} țări`);
  } catch (e) { errors.push(`FMI ${ind}: ${e.message}`); console.warn('EROARE', ind, e.message); }
  await sleep(1000);
}
out.sources.imf = {
  name: 'FMI, World Economic Outlook (API DataMapper)',
  url: 'https://www.imf.org/external/datamapper/datasets/WEO',
  retrievedAt: out.updatedAt,
};

// ——— BIS: dobânda de politică monetară și inflația ———
// Parser CSV minimal, cu ghilimele (unele câmpuri de descriere conțin virgule).
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}
function lastFromCsv(csv) {
  const [head, ...lines] = parseCsv(csv.trim());
  const ti = head.findIndex((h) => /TIME_PERIOD/i.test(h));
  const vi = head.findIndex((h) => /OBS_VALUE/i.test(h));
  const rows = lines
    .filter((r) => r[vi] !== undefined && r[vi] !== '' && r[vi] !== 'NaN' && !Number.isNaN(+r[vi]))
    .map((r) => [r[ti], +r[vi]]).sort((a, b) => a[0].localeCompare(b[0]));
  return rows.at(-1);
}
for (const [cur, [, bis]] of Object.entries(CURRENCIES)) {
  if (!bis) continue;
  out.bis[cur] = {};
  for (const [key, url] of [
    ['policyRate', `https://stats.bis.org/api/v1/data/WS_CBPOL/M.${bis}?startPeriod=2025-06&format=csv`],
    ['policyRateDaily', `https://stats.bis.org/api/v1/data/WS_CBPOL/D.${bis}?startPeriod=2026-07-01&format=csv`],
    ['cpiYoY', `https://stats.bis.org/api/v1/data/WS_LONG_CPI/M.${bis}.771?startPeriod=2025-06&format=csv`],
  ]) {
    try {
      const last = lastFromCsv(await get(url, 'text'));
      if (!last) throw new Error('fără observații');
      out.bis[cur][key] = { period: last[0], value: last[1] };
    } catch (e) { errors.push(`BIS ${key} ${cur}: ${e.message}`); console.warn('EROARE BIS', key, cur, e.message); }
    await sleep(700);
  }
  // Seria lunară are uneori întârziere; dacă cea zilnică e mai nouă, o folosim pe ea.
  const m = out.bis[cur].policyRate, d = out.bis[cur].policyRateDaily;
  if (d && (!m || d.period > m.period)) out.bis[cur].policyRate = d;
  delete out.bis[cur].policyRateDaily;
  if (out.bis[cur].policyRate) errors.splice(0, errors.length, ...errors.filter((e) => !e.startsWith(`BIS policyRate ${cur}`) && !e.startsWith(`BIS policyRateDaily ${cur}`)));
  console.log(`BIS ${cur}:`, JSON.stringify(out.bis[cur]));
}
out.sources.bis = {
  name: 'BIS, dobânzile de politică monetară și prețurile de consum',
  url: 'https://data.bis.org/topics/CBPOL',
  retrievedAt: out.updatedAt,
};

// ——— Cursuri (Yahoo Finance) ———
const fridays = [];
for (let d = new Date(START + 'T00:00:00Z'); day(d) <= out.updatedAt; d.setUTCDate(d.getUTCDate() + 7)) fridays.push(day(d));
let old = {};
try { old = JSON.parse(await readFile(OUT, 'utf8')).fx ?? {}; } catch {}
for (let [cur, [, , sym, inv]] of Object.entries(CURRENCIES)) {
  try {
    // Unele țări au mai multe simboluri posibile; îl folosim pe primul care răspunde.
    let j, used;
    for (const cand of [sym].flat()) {
      try { j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cand)}?range=1y&interval=1d`); used = cand; break; }
      catch (e) { console.warn('încerc alt simbol după', cand, e.message); }
    }
    if (!j) throw new Error(`niciun simbol nu a răspuns (${[sym].flat().join(', ')})`);
    sym = used;
    const r = j.chart.result[0];
    const daily = r.timestamp.map((t, i) => [t * 1000, r.indicators.quote[0].close[i]])
      .filter((p) => p[1] != null).map(([t, v]) => [t, inv ? 1 / v : v]);
    const pts = [];
    for (const f of fridays) {
      const lim = Date.parse(f + 'T23:59:59Z');
      const last = daily.filter((p) => p[0] <= lim).at(-1);
      if (last && lim - last[0] < 4 * 86400000) pts.push([f, +last[1].toPrecision(6)]);
    }
    const m = new Map(old[cur]?.points ?? []);
    const freeze = day(Date.now() - 7 * 86400000);
    for (const [d, v] of pts) if (!m.has(d) || d >= freeze) m.set(d, v);
    const vals = daily.map((p) => p[1]);
    out.fx[cur] = {
      symbol: sym,
      url: `https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`,
      unit: sym.startsWith('^') ? 'puncte (indice local)' : 'USD per unitate de ETF',
      points: [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      high52: +Math.max(...vals).toPrecision(6),
      low52: +Math.min(...vals).toPrecision(6),
      last: +vals.at(-1).toPrecision(6),
      oneYearAgo: +vals[0].toPrecision(6),
    };
    console.log(`ok FX ${cur}: ${pts.length} săptămâni, ultim ${out.fx[cur].last}`);
  } catch (e) { errors.push(`FX ${cur}: ${e.message}`); console.warn('EROARE FX', cur, e.message); }
  await sleep(1200);
}
out.sources.fx = { name: 'Yahoo Finance (ETF-uri de țară, indicele BET)', url: 'https://finance.yahoo.com/', retrievedAt: out.updatedAt };

await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`Scris ${OUT.pathname}; ${errors.length} erori`);
