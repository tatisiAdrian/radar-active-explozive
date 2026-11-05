// Notează investitorii internaționali (scripts/investitori.json) pe cele 14 condiții adaptate (setul „investitori”).
// Scrie src/data/investitori/scores.json; cu --snapshot îngheață public/snapshots/investitori-<data>.json (o singură dată).

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cfg = JSON.parse(await readFile(new URL('./investitori.json', import.meta.url), 'utf8'));
// 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const sc = (c, v = Array(8).fill(null)) => {
  const raw = c.map((x) => x ?? 5).reduce((t, x, i) => t + x * W[i], 0) + v.map((x) => x ?? 5).reduce((t, x, i) => t + x * WV[i], 0);
  return { score: +(raw / 100).toFixed(2), met: [...c, ...v].filter((x) => x != null && x >= 7).length, met14: c.filter((x) => x != null && x >= 7).length, trust: v.filter((x) => x != null && x >= 7).length };
};

const rows = cfg.investors.map((p) => {
  if (p.c.length !== 14) throw new Error(`${p.id}: trebuie 14 note`);
  return { ...p, ...sc(p.c, p.v) };
}).sort((a, b) => b.met - a.met || b.score - a.score);

const self = { ...cfg.self, ...sc(cfg.self.c, cfg.self.v) };
await mkdir(new URL('../src/data/investitori/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/investitori/scores.json', import.meta.url), JSON.stringify({ date: cfg.date, snapshot: `investitori${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`, previousSnapshot: cfg.revision ? `investitori-${cfg.date}` : undefined, rows, self, replies: cfg.replies ?? [] }, null, 1) + '\n');
console.log('Noi:', `${self.met}/22`, `verificare ${self.trust}/8`, self.score);
console.log(rows.map((r, i) => `${i + 1}. ${r.name} ${r.met}/22 (verificare ${r.trust}/8) ${r.score}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const SNAP = `investitori${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`;
  const file = new URL(`../public/snapshots/${SNAP}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'investitori-startups', date: cfg.date, weights: W, verification_weights: WV, met_threshold: 7, rows: rows.map(({ why, whyEn, vwhy, vwhyEn, sources, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${SNAP}.sha256`, import.meta.url), `${h}  ${SNAP}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
