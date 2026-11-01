// Notează monedele pe cele 14 condiții: 6 calculate din date oficiale (formule fixe, publice)
// și 8 din judecată (scripts/forex-judgment.json, cu justificare).
// Scrie src/data/forex/scores.json; la prima rulare dintr-o zi nouă de instantaneu
// îngheață și public/snapshots/forex-<data>.json (nu suprascrie un instantaneu existent).
// Rulare: node scripts/score-forex.mjs [--snapshot]

import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const macro = JSON.parse(await readFile(new URL('../src/data/forex/macro.json', import.meta.url), 'utf8'));
const judg = JSON.parse(await readFile(new URL('./forex-judgment.json', import.meta.url), 'utf8'));
const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const BASELINE = '2026-10-30';

/** Formulele condițiilor calculate. Textele apar pe site, lângă note. */
export const FORMULAS = {
  C1: 'Cont curent 2026 (FMI, % din PIB): nota = 5 + 0,8 × sold. Excedent = cerere reală pentru monedă.',
  C2: 'Inflația anuală (BIS, ultima lună): nota = 10 − 1,5 × |inflație − 2|. Inflație aproape de țintă = bancă centrală disciplinată.',
  C3: 'Datorie și deficite (FMI 2026): nota = 10 − datorie/25 + 0,4 × sold bugetar + 0,3 × deficit de cont curent. Rezervele valutare nu sunt încă incluse.',
  C7: 'Dobânda reală = dobânda băncii centrale − inflația (BIS): nota = 5 + 1,5 × dobânda reală.',
  C10: 'Poziția în intervalul de 52 de săptămâni (Yahoo Finance): aproape de minim = ieftină = notă mare. Aproximare până integrăm cursul real efectiv.',
  C12: 'Trendul pe două luni (de la 4 septembrie): nota = 5 + variația în %.',
};

const rows = [];
const missing = [];
for (const [cur, j] of Object.entries(judg.currencies)) {
  const imf = (ind) => macro.imf[ind]?.values?.[cur]?.['2026'];
  const bis = macro.bis[cur] ?? {};
  const fx = macro.fx[cur];
  const ca = imf('BCA_NGDPD'), debt = imf('GGXWDG_NGDP'), fiscal = imf('GGXCNL_NGDP');
  const cpi = bis.cpiYoY?.value, rate = bis.policyRate?.value;
  const c = {};
  const inputs = {};
  if (ca !== undefined) { c.C1 = clamp(5 + 0.8 * ca); inputs.C1 = `cont curent ${ca}% din PIB`; }
  if (cpi !== undefined) { c.C2 = clamp(10 - 1.5 * Math.abs(cpi - 2)); inputs.C2 = `inflație ${cpi.toFixed(1)}% (${bis.cpiYoY.period})`; }
  if (debt !== undefined && fiscal !== undefined && ca !== undefined) {
    c.C3 = clamp(10 - debt / 25 + 0.4 * fiscal + 0.3 * Math.min(ca, 0));
    inputs.C3 = `datorie ${debt}%, sold bugetar ${fiscal}%, cont curent ${ca}% din PIB`;
  }
  if (cpi !== undefined && rate !== undefined) {
    const real = rate - cpi;
    c.C7 = clamp(5 + 1.5 * real);
    inputs.C7 = `dobândă ${rate}% (${bis.policyRate.period}) − inflație ${cpi.toFixed(1)}% = ${real.toFixed(1)} pp`;
  }
  if (fx) {
    const pos = (fx.last - fx.low52) / (fx.high52 - fx.low52 || 1);
    c.C10 = clamp(10 * (1 - pos));
    inputs.C10 = `la ${Math.round(pos * 100)}% din intervalul de 52 de săptămâni`;
    const first = fx.points[0]?.[1], base = fx.points.find((p) => p[0] === BASELINE)?.[1] ?? fx.last;
    if (first) {
      const ch = (base / first - 1) * 100;
      c.C12 = clamp(5 + ch);
      inputs.C12 = `${ch >= 0 ? '+' : ''}${ch.toFixed(1)}% în două luni`;
    }
  }
  for (const k of ['C4', 'C5', 'C6', 'C8', 'C9', 'C11', 'C13', 'C14']) c[k] = j[k];
  const vec = Array.from({ length: 14 }, (_, i) => c[`C${i + 1}`]);
  const gaps = vec.map((v, i) => (v === undefined ? `C${i + 1}` : null)).filter(Boolean);
  if (gaps.length) missing.push(`${cur}: ${gaps.join(', ')}`);
  // Condițiile fără date primesc 5 (neutru) și sunt marcate; nu le considerăm îndeplinite.
  const filled = vec.map((v) => v ?? 5);
  const score = +(filled.reduce((s, v, i) => s + v * W[i], 0) / 100).toFixed(2);
  const met = vec.filter((v) => v !== undefined && v >= 7).length;
  rows.push({ id: cur, name: j.name, score, met, criteria: vec, inputs, gaps, why: j.why });
}
rows.sort((a, b) => b.met - a.met || b.score - a.score);

const out = {
  date: macro.updatedAt,
  judgmentDate: judg.date,
  formulas: FORMULAS,
  sources: macro.sources,
  rows,
  missing,
};
await writeFile(new URL('../src/data/forex/scores.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(rows.map((r) => `${r.id} ${r.met}/14 ${r.score}${r.gaps.length ? ' lipsă ' + r.gaps : ''}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const date = judg.date;
  const file = new URL(`../public/snapshots/forex-${date}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'forex', date, weights: W, met_threshold: 7, formulas: FORMULAS, sources: macro.sources, rows: rows.map(({ why, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/forex-${date}.sha256`, import.meta.url), `${h}  forex-${date}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
