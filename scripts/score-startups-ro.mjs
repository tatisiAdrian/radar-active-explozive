// Notează start-up-urile românești (scripts/startups-ro.json) și, pentru cele listate,
// calculează trendul prețului din baza de date săptămânală.
// Scrie src/data/startups-ro/scores.json; cu --snapshot îngheață public/snapshots/startups-ro-<data>.json (o singură dată).

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cfg = JSON.parse(await readFile(new URL('./startups-ro.json', import.meta.url), 'utf8'));
const weekly = JSON.parse(await readFile(new URL('../src/data/prices/weekly.json', import.meta.url), 'utf8'));
const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];
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
  const score = +(c.map((v) => v ?? 5).reduce((s, v, i) => s + v * W[i], 0) / 100).toFixed(2);
  const met = c.filter((v) => v != null && v >= 7).length;
  return { ...co, c, inputs, score, met, price: p ? { symbol: p.symbol, url: p.url, points: p.points } : undefined };
}).sort((a, b) => b.met - a.met || b.score - a.score);

await mkdir(new URL('../src/data/startups-ro/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/startups-ro/scores.json', import.meta.url), JSON.stringify({ date: cfg.date, updatedAt: weekly.updatedAt, rows }, null, 1) + '\n');
console.log(rows.map((r) => `${r.name} ${r.met}/14 ${r.score}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const file = new URL(`../public/snapshots/startups-ro-${cfg.date}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'startups/europa/romania', date: cfg.date, weights: W, met_threshold: 7, rows: rows.map(({ why, price, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/startups-ro-${cfg.date}.sha256`, import.meta.url), `${h}  startups-ro-${cfg.date}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
