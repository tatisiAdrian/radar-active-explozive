// Notează start-up-urile românești (scripts/startups-ro.json) și, pentru cele listate,
// calculează trendul prețului din baza de date săptămânală.
// Scrie src/data/startups-ro/scores.json; cu --snapshot îngheață public/snapshots/startups-ro-<data>.json (o singură dată).

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cfg = JSON.parse(await readFile(new URL('./startups-ro.json', import.meta.url), 'utf8'));
const weekly = JSON.parse(await readFile(new URL('../src/data/prices/weekly.json', import.meta.url), 'utf8'));
// 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const BASELINE = '2026-10-30';

const rows = cfg.companies.map((co) => {
  const c = [...co.c];
  const inputs = {};
  const p = co.priceId && weekly.series[co.priceId];
  if (p?.points?.length >= 4) {
    const first = p.points[0][1];
    const base = p.points.find((x) => x[0] === BASELINE)?.[1] ?? p.points.at(-1)[1];
    const ch = (base / first - 1) * 100;
    c[11] = clamp(5 + ch / 2);
    inputs.C12 = `acțiunea ${ch >= 0 ? '+' : ''}${ch.toFixed(1).replace('.', ',')}% în două luni (${p.provider}, ${p.symbol})`;
  }
  const v = co.v ?? Array(8).fill(null);
  const raw = c.map((x) => x ?? 5).reduce((s, x, i) => s + x * W[i], 0) + v.map((x) => x ?? 5).reduce((s, x, i) => s + x * WV[i], 0);
  const score = +(raw / 100).toFixed(2);
  const met = [...c, ...v].filter((x) => x != null && x >= 7).length;
  // met14: doar primele 14 condiții, pentru comparația cu celelalte domenii de pe prima pagină.
  const met14 = c.filter((x) => x != null && x >= 7).length;
  const trust = v.filter((x) => x != null && x >= 7).length;
  return { ...co, c, v, inputs, score, met, met14, trust, price: p ? { symbol: p.symbol, url: p.url, points: p.points } : undefined };
}).sort((a, b) => b.met - a.met || b.score - a.score);

await mkdir(new URL('../src/data/startups-ro/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/startups-ro/scores.json', import.meta.url), JSON.stringify({ date: cfg.date, snapshot: `startups-ro${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`, previousSnapshot: cfg.revision ? `startups-ro-${cfg.date}` : undefined, updatedAt: weekly.updatedAt, rows }, null, 1) + '\n');
console.log(rows.map((r) => `${r.name} ${r.met}/22 (verificare ${r.trust}/8) ${r.score}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const SNAP = `startups-ro${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`;
  const file = new URL(`../public/snapshots/${SNAP}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'startups/europa/romania', date: cfg.date, weights: W, verification_weights: WV, met_threshold: 7, rows: rows.map(({ why, vwhy, vwhyEn, price, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${SNAP}.sha256`, import.meta.url), `${h}  ${SNAP}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
