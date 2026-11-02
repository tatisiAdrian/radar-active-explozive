// Date pentru domeniul Piața imobiliară națională, din surse oficiale:
// - BIS (Selected residential property prices): indicele prețului real al locuințelor și variația anuală;
//   dobânda de politică monetară; inflația anuală (IPC)
// - FMI (DataMapper): creșterea PIB real, șomajul, datoria gospodăriilor (% din PIB)
// Scrie src/data/imobiliare/macro.json. Rulează în GitHub Actions: node scripts/fetch-imobiliare.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = new URL('../src/data/imobiliare/macro.json', import.meta.url);
const UA = { 'User-Agent': 'Mozilla/5.0 (radar-active-explozive data bot)' };

// țară → [cod FMI, cod BIS pentru prețuri și inflație, cod BIS pentru dobânda de politică monetară]
export const COUNTRIES = {
  RO: ['ROU', 'RO', 'RO'], PL: ['POL', 'PL', 'PL'], HU: ['HUN', 'HU', 'HU'], CZ: ['CZE', 'CZ', 'CZ'],
  DE: ['DEU', 'DE', 'XM'], ES: ['ESP', 'ES', 'XM'], PT: ['PRT', 'PT', 'XM'], FR: ['FRA', 'FR', 'XM'],
  IT: ['ITA', 'IT', 'XM'], NL: ['NLD', 'NL', 'XM'], GB: ['GBR', 'GB', 'GB'], US: ['USA', 'US', 'US'],
  CA: ['CAN', 'CA', 'CA'], AU: ['AUS', 'AU', 'AU'], CN: ['CHN', 'CN', 'CN'], AE: ['ARE', 'AE', 'AE'],
};
const IMF_IND = {
  NGDP_RPCH: 'Creștere PIB real (%)',
  LUR: 'Rata șomajului (%)',
  HH_LS: 'Datoria gospodăriilor (% din PIB)',
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
function seriesFromCsv(csv) {
  const [head, ...lines] = parseCsv(csv.trim());
  const ti = head.findIndex((h) => /TIME_PERIOD/i.test(h));
  const vi = head.findIndex((h) => /OBS_VALUE/i.test(h));
  return lines
    .filter((r) => r[vi] !== undefined && r[vi] !== '' && r[vi] !== 'NaN' && !Number.isNaN(+r[vi]))
    .map((r) => [r[ti], +r[vi]]).sort((a, b) => a[0].localeCompare(b[0]));
}

const errors = [];
const out = { updatedAt: day(Date.now()), sources: {}, imf: {}, bis: {}, errors };

// ——— FMI ———
const codes = Object.values(COUNTRIES).map((c) => c[0]).join('/');
for (const [ind, label] of Object.entries(IMF_IND)) {
  try {
    const periods = ind === 'HH_LS' ? '2019,2020,2021,2022,2023,2024,2025' : '2024,2025,2026,2027';
    const j = await get(`https://www.imf.org/external/datamapper/api/v1/${ind}/${codes}?periods=${periods}`);
    const vals = j.values?.[ind] ?? {};
    out.imf[ind] = { label, values: {} };
    for (const [c, [imf]] of Object.entries(COUNTRIES)) if (vals[imf]) out.imf[ind].values[c] = vals[imf];
    console.log(`ok FMI ${ind}: ${Object.keys(out.imf[ind].values).length} țări`);
  } catch (e) { errors.push(`FMI ${ind}: ${e.message}`); console.warn('EROARE', ind, e.message); }
  await sleep(1000);
}
out.sources.imf = { name: 'FMI, World Economic Outlook și Global Debt Database (API DataMapper)', url: 'https://www.imf.org/external/datamapper/datasets', retrievedAt: out.updatedAt };

// ——— BIS ———
for (const [c, [, bis, pol]] of Object.entries(COUNTRIES)) {
  out.bis[c] = {};
  // Indicele prețului real al locuințelor (2010 = 100), trimestrial, din 2010
  try {
    const s = seriesFromCsv(await get(`https://stats.bis.org/api/v1/data/WS_SPP/Q.${bis}.R.628?startPeriod=2010-Q1&format=csv`, 'text'));
    if (!s.length) throw new Error('fără observații');
    out.bis[c].realIndex = s;
  } catch (e) { errors.push(`BIS preț real ${c}: ${e.message}`); console.warn('EROARE BIS SPP', c, e.message); }
  await sleep(700);
  for (const [key, url] of [
    ['realYoY', `https://stats.bis.org/api/v1/data/WS_SPP/Q.${bis}.R.771?startPeriod=2023-Q1&format=csv`],
    ['nominalYoY', `https://stats.bis.org/api/v1/data/WS_SPP/Q.${bis}.N.771?startPeriod=2023-Q1&format=csv`],
    ['policyRate', `https://stats.bis.org/api/v1/data/WS_CBPOL/M.${pol}?startPeriod=2025-06&format=csv`],
    ['policyRateDaily', `https://stats.bis.org/api/v1/data/WS_CBPOL/D.${pol}?startPeriod=2026-07-01&format=csv`],
    ['cpiYoY', `https://stats.bis.org/api/v1/data/WS_LONG_CPI/M.${bis}.771?startPeriod=2025-06&format=csv`],
  ]) {
    try {
      const last = seriesFromCsv(await get(url, 'text')).at(-1);
      if (!last) throw new Error('fără observații');
      out.bis[c][key] = { period: last[0], value: last[1] };
    } catch (e) { if (key !== 'policyRateDaily') { errors.push(`BIS ${key} ${c}: ${e.message}`); console.warn('EROARE BIS', key, c, e.message); } }
    await sleep(700);
  }
  const m = out.bis[c].policyRate, d = out.bis[c].policyRateDaily;
  if (d && (!m || d.period > m.period)) out.bis[c].policyRate = d;
  delete out.bis[c].policyRateDaily;
  // Dacă variația anuală reală lipsește, o calculăm din indice (același trimestru, cu un an în urmă).
  const ri = out.bis[c].realIndex;
  if (!out.bis[c].realYoY && ri?.length > 4) {
    const [p, v] = ri.at(-1), prev = ri.at(-5);
    out.bis[c].realYoY = { period: p, value: +((v / prev[1] - 1) * 100).toFixed(2), derived: true };
  }
  console.log(`BIS ${c}: indice ${ri?.length ?? 0} trimestre, real ${JSON.stringify(out.bis[c].realYoY)}, dobândă ${JSON.stringify(out.bis[c].policyRate)}`);
}
out.sources.bis = { name: 'BIS, Selected residential property prices, Central bank policy rates și Consumer prices', url: 'https://data.bis.org/topics/RPP', retrievedAt: out.updatedAt };

await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`Scris ${OUT.pathname}; ${errors.length} erori`);
