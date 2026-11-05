// Notează companiile din S&P 500 pe cele 14 condiții: 6 calculate din rapoartele anuale SEC și din preț
// (formule fixe, publice), 8 din judecată (scripts/sp500-judgment.json, cu justificare).
// Scrie src/data/sp500/scores.json; cu --snapshot îngheață public/snapshots/sp500-<data>.json (o singură dată).

import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const macro = JSON.parse(await readFile(new URL('../src/data/sp500/macro.json', import.meta.url), 'utf8'));
const judg = JSON.parse(await readFile(new URL('./sp500-judgment.json', import.meta.url), 'utf8'));
// 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const BASELINE = '2026-10-30';
const bn = (x) => `${(x / 1e9).toFixed(1)} mld. USD`;

export const FORMULAS = {
  C1: 'Creșterea veniturilor în ultimul an fiscal (raport 10-K): nota = 5 + creșterea în % / 3. O creștere de 15% dă 10.',
  C2: 'Variația numărului de acțiuni în ultimul an (SEC): nota = 6 − 1,5 × variația în %. Răscumpărările care reduc numărul de acțiuni cresc nota; emisiunile o scad.',
  C3: 'Datoria netă (datorie pe termen lung − numerar) raportată la fluxul de numerar din exploatare: nota = 10 − 2 × raport. Numerar mai mult decât datorie = 10.',
  C7: 'Marja fluxului de numerar liber = (flux din exploatare − investiții) / venituri: nota = marja în % / 3. O marjă de 30% dă 10.',
  C10: 'Randamentul fluxului de numerar liber = flux liber / capitalizare (preț Yahoo × acțiuni SEC): nota = 2 × randamentul în %. Un randament de 5% dă 10.',
  C12: 'Trendul acțiunii pe două luni (de la 4 septembrie): nota = 5 + variația în % / 2.',
};

const rows = [];
for (const [tk, j] of Object.entries(judg.companies)) {
  const co = macro.companies[tk];
  const px = macro.prices[tk];
  const c = {};
  const inputs = {};
  if (co?.revenue?.prev) {
    const g = (co.revenue.value / co.revenue.prev - 1) * 100;
    c.C1 = clamp(5 + g / 3);
    inputs.C1 = `venituri ${bn(co.revenue.value)} (an fiscal încheiat ${co.revenue.end}), ${g >= 0 ? '+' : ''}${g.toFixed(1)}% față de anul anterior`;
  }
  if (co?.shares?.yearAgo) {
    const ch = (co.shares.value / co.shares.yearAgo - 1) * 100;
    c.C2 = clamp(6 - 1.5 * ch);
    inputs.C2 = `acțiuni în circulație ${ch >= 0 ? '+' : ''}${ch.toFixed(1)}% într-un an`;
  }
  const ocf = co?.opCashFlow?.value, capex = co?.capex?.value ?? 0, rev = co?.revenue?.value;
  if (ocf !== undefined && co?.cash) {
    const net = (co.debt?.value ?? 0) - co.cash.value;
    const ratio = ocf > 0 ? net / ocf : 99;
    c.C3 = clamp(net <= 0 ? 10 : 10 - 2 * ratio);
    inputs.C3 = `datorie ${bn(co.debt?.value ?? 0)}, numerar ${bn(co.cash.value)}, flux din exploatare ${bn(ocf)}`;
  }
  if (ocf !== undefined && rev) {
    const fcf = ocf - capex;
    const m = (fcf / rev) * 100;
    c.C7 = clamp(m / 3);
    inputs.C7 = `flux de numerar liber ${bn(fcf)}, marjă ${m.toFixed(1)}%`;
    if (px && co?.shares) {
      const cap = px.last * co.shares.value;
      const y = (fcf / cap) * 100;
      c.C10 = clamp(2 * y);
      inputs.C10 = `capitalizare ${(cap / 1e12).toFixed(2)} trilioane USD, randament al fluxului liber ${y.toFixed(1)}%`;
    }
  }
  if (px?.points?.length >= 4) {
    const first = px.points[0][1], base = px.points.find((p) => p[0] === BASELINE)?.[1] ?? px.last;
    const ch = (base / first - 1) * 100;
    c.C12 = clamp(5 + ch / 2);
    inputs.C12 = `acțiunea ${ch >= 0 ? '+' : ''}${ch.toFixed(1)}% în două luni`;
  }
  for (const k of ['C4', 'C5', 'C6', 'C8', 'C9', 'C11', 'C13', 'C14']) c[k] = j[k];
  for (const k of Object.keys(inputs)) inputs[k] = inputs[k].replace(/(\d)\.(\d)/g, '$1,$2');
  const vec = Array.from({ length: 14 }, (_, i) => c[`C${i + 1}`]);
  const gaps = vec.map((v, i) => (v === undefined ? `C${i + 1}` : null)).filter(Boolean);
  const v = j.v ?? Array(8).fill(null);
  const raw = vec.map((x) => x ?? 5).reduce((s, x, i) => s + x * W[i], 0) + v.map((x) => x ?? 5).reduce((s, x, i) => s + x * WV[i], 0);
  const score = +(raw / 100).toFixed(2);
  const met14 = vec.filter((x) => x !== undefined && x >= 7).length;
  const trust = v.filter((x) => x != null && x >= 7).length;
  const met = met14 + trust;
  rows.push({ id: tk, name: co?.name ?? tk, score, met, met14, trust, criteria: vec, v, inputs, gaps, why: j.why, vwhy: j.vwhy, vwhyEn: j.vwhyEn, filing: co?.url });
}
rows.sort((a, b) => b.met - a.met || b.score - a.score);

const SNAP = `sp500${judg.revision ? `-r${judg.revision}` : ''}-${judg.date}`;
const out = { date: macro.updatedAt, judgmentDate: judg.date, snapshot: SNAP, previousSnapshot: judg.revision ? `sp500-${judg.date}` : undefined, formulas: FORMULAS, sources: macro.sources, rows };
await writeFile(new URL('../src/data/sp500/scores.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(rows.map((r) => `${r.id} ${r.met}/22 (verificare ${r.trust}/8) ${r.score}${r.gaps.length ? ' lipsă ' + r.gaps : ''}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const date = judg.date;
  const file = new URL(`../public/snapshots/${SNAP}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'sp500', date, weights: W, verification_weights: WV, met_threshold: 7, formulas: FORMULAS, sources: macro.sources, rows: rows.map(({ why, vwhy, vwhyEn, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${SNAP}.sha256`, import.meta.url), `${h}  ${SNAP}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
