// Notează proiectele imobiliare de interes mondial (scripts/proiecte-imobiliare.json) pe cele 14 condiții
// adaptate (setul „proiecte-imobiliare”). Pentru companiile listate, C12 (trendul) se calculează din
// baza de date săptămânală. Scrie src/data/proiecte-imobiliare/scores.json; cu --snapshot îngheață
// public/snapshots/proiecte-imobiliare-<data>.json (o singură dată).

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cfg = JSON.parse(await readFile(new URL('./proiecte-imobiliare.json', import.meta.url), 'utf8'));
const weekly = JSON.parse(await readFile(new URL('../src/data/prices/weekly.json', import.meta.url), 'utf8'));
const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const BASELINE = '2026-10-30';

const rows = cfg.projects.map((p) => {
  const c = [...p.c];
  const inputs = {};
  const s = p.priceId && weekly.series[p.priceId];
  if (s?.points?.length >= 4) {
    const first = s.points[0][1];
    const base = s.points.find((x) => x[0] === BASELINE)?.[1] ?? s.points.at(-1)[1];
    const ch = (base / first - 1) * 100;
    c[11] = clamp(5 + ch / 2);
    inputs.C12 = `acțiunea ${ch >= 0 ? '+' : ''}${ch.toFixed(1).replace('.', ',')}% în două luni (${s.provider}, ${s.symbol})`;
  }
  const score = +(c.map((v) => v ?? 5).reduce((t, v, i) => t + v * W[i], 0) / 100).toFixed(2);
  const met = c.filter((v) => v != null && v >= 7).length;
  return { ...p, c, inputs, score, met, price: s ? { symbol: s.symbol, url: s.url, points: s.points } : undefined };
}).sort((a, b) => b.met - a.met || b.score - a.score);

await mkdir(new URL('../src/data/proiecte-imobiliare/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/proiecte-imobiliare/scores.json', import.meta.url), JSON.stringify({ date: cfg.date, updatedAt: weekly.updatedAt, rows }, null, 1) + '\n');
console.log(rows.map((r) => `${r.name} ${r.met}/14 ${r.score}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const file = new URL(`../public/snapshots/proiecte-imobiliare-${cfg.date}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'proiecte-imobiliare', date: cfg.date, weights: W, met_threshold: 7, rows: rows.map(({ why, whyEn, price, sources, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/proiecte-imobiliare-${cfg.date}.sha256`, import.meta.url), `${h}  proiecte-imobiliare-${cfg.date}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
