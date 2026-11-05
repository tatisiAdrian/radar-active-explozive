// Notează investitorii internaționali (scripts/investitori.json) pe cele 14 condiții adaptate (setul „investitori”).
// Scrie src/data/investitori/scores.json; cu --snapshot îngheață public/snapshots/investitori-<data>.json (o singură dată).

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cfg = JSON.parse(await readFile(new URL('./investitori.json', import.meta.url), 'utf8'));
const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];

const rows = cfg.investors.map((p) => {
  if (p.c.length !== 14) throw new Error(`${p.id}: trebuie 14 note`);
  const score = +(p.c.map((v) => v ?? 5).reduce((t, v, i) => t + v * W[i], 0) / 100).toFixed(2);
  const met = p.c.filter((v) => v != null && v >= 7).length;
  return { ...p, score, met };
}).sort((a, b) => b.met - a.met || b.score - a.score);

const sc = (c) => ({ score: +(c.map((v) => v ?? 5).reduce((t, v, i) => t + v * W[i], 0) / 100).toFixed(2), met: c.filter((v) => v != null && v >= 7).length });
const self = { ...cfg.self, ...sc(cfg.self.c) };
await mkdir(new URL('../src/data/investitori/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/investitori/scores.json', import.meta.url), JSON.stringify({ date: cfg.date, rows, self, replies: cfg.replies ?? [] }, null, 1) + '\n');
console.log('Noi:', self.met, self.score);
console.log(rows.map((r, i) => `${i + 1}. ${r.name} ${r.met}/14 ${r.score}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const file = new URL(`../public/snapshots/investitori-${cfg.date}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'investitori-startups', date: cfg.date, weights: W, met_threshold: 7, rows: rows.map(({ why, whyEn, sources, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/investitori-${cfg.date}.sha256`, import.meta.url), `${h}  investitori-${cfg.date}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
