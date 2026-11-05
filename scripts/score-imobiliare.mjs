// Notează piețele imobiliare naționale pe cele 14 condiții: 5 calculate din date oficiale (formule publice)
// și 9 din judecată (scripts/imobiliare-judgment.json, cu justificare și surse).
// Scrie src/data/imobiliare/scores.json; cu --snapshot îngheață public/snapshots/imobiliare-<data>.json (o singură dată).

import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const macro = JSON.parse(await readFile(new URL('../src/data/imobiliare/macro.json', import.meta.url), 'utf8'));
const judg = JSON.parse(await readFile(new URL('./imobiliare-judgment.json', import.meta.url), 'utf8'));
// 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));

export const FORMULAS = {
  C1: 'Cererea reală (FMI 2026): nota = 2 + 1,2 × creșterea PIB real − 0,3 × șomajul care depășește 5%.',
  C3: 'Datoria gospodăriilor (FMI, ultimul an disponibil, % din PIB): nota = 10 − datoria / 12 (24% dă 8, 60% dă 5, 96% dă 2).',
  C7: 'Costul creditului (BIS): dobânda reală = dobânda de politică monetară − inflația; nota = 9 − 1,5 × distanța față de +1 pp (creditul prea scump frânează piața, creditul prea ieftin umflă bule).',
  C10: 'Evaluarea (BIS): prețul real al locuințelor față de media ultimilor 10 ani; nota = 6 − abaterea în % / 4 (20% peste medie dă 1, 8% sub medie dă 8).',
  C12: 'Trendul (BIS): variația anuală a prețului real al locuințelor, ultimul trimestru; nota = 5 + variația / 2.',
};
const lastYear = (vals) => { const ks = Object.keys(vals ?? {}).sort(); const k = ks.at(-1); return k ? [k, vals[k]] : undefined; };

const rows = [];
const missing = [];
for (const [id, j] of Object.entries(judg.countries)) {
  const imf = (ind, y = '2026') => macro.imf[ind]?.values?.[id]?.[y];
  const bis = macro.bis[id] ?? {};
  const c = {}, inputs = {};
  const g = imf('NGDP_RPCH'), u = imf('LUR');
  if (g !== undefined) {
    c.C1 = clamp(2 + 1.2 * g - 0.3 * Math.max(0, (u ?? 5) - 5));
    inputs.C1 = `creștere ${g}% în 2026${u !== undefined ? `, șomaj ${u}%` : ''}`;
  }
  const hh = lastYear(macro.imf.HH_LS?.values?.[id]);
  if (hh) { c.C3 = clamp(10 - hh[1] / 12); inputs.C3 = `datoria gospodăriilor ${(+hh[1]).toFixed(1)}% din PIB (${hh[0]})`; }
  const cpi = bis.cpiYoY?.value, rate = bis.policyRate?.value;
  if (cpi !== undefined && rate !== undefined) {
    const real = rate - cpi;
    c.C7 = clamp(9 - 1.5 * Math.abs(real - 1));
    inputs.C7 = `dobândă ${rate}% (${bis.policyRate.period}) − inflație ${cpi.toFixed(1)}% = ${real.toFixed(1)} pp`;
  }
  const ri = bis.realIndex;
  if (ri?.length >= 12) {
    const last = ri.at(-1);
    const win = ri.slice(-40);
    const avg = win.reduce((s, p) => s + p[1], 0) / win.length;
    const dev = (last[1] / avg - 1) * 100;
    c.C10 = clamp(6 - dev / 4);
    inputs.C10 = `prețul real ${dev >= 0 ? '+' : ''}${dev.toFixed(1)}% față de media pe ${Math.round(win.length / 4)} ani (${last[0]})`;
  }
  if (bis.realYoY) {
    const y = bis.realYoY.value;
    c.C12 = clamp(5 + y / 2);
    inputs.C12 = `prețul real ${y >= 0 ? '+' : ''}${y.toFixed(1)}% într-un an (${bis.realYoY.period})`;
  }
  for (const k of ['C2', 'C4', 'C5', 'C6', 'C8', 'C9', 'C11', 'C13', 'C14']) c[k] = j[k];
  const vec = Array.from({ length: 14 }, (_, i) => c[`C${i + 1}`]);
  const gaps = vec.map((v, i) => (v === undefined ? `C${i + 1}` : null)).filter(Boolean);
  if (gaps.length) missing.push(`${id}: ${gaps.join(', ')}`);
  const v = j.v ?? Array(8).fill(null);
  const score = +((vec.map((v) => v ?? 5).reduce((s, x, i) => s + x * W[i], 0) + v.map((x) => x ?? 5).reduce((s, x, i) => s + x * WV[i], 0)) / 100).toFixed(2);
  const met14 = vec.filter((x) => x !== undefined && x >= 7).length;
  const trust = v.filter((x) => x != null && x >= 7).length;
  const met = met14 + trust;
  for (const k of Object.keys(inputs)) inputs[k] = inputs[k].replace(/(\d)\.(\d)/g, '$1,$2');
  rows.push({ id, name: j.name, nameEn: j.nameEn, score, met, met14, trust, v, vwhy: j.vwhy, vwhyEn: j.vwhyEn, criteria: vec.map((v) => v ?? null), inputs, gaps, why: j.why, sources: j.sources ?? [] });
}
rows.sort((a, b) => b.met - a.met || b.score - a.score);

const out = {
  snapshot: `imobiliare${judg.revision ? `-r${judg.revision}` : ''}-${judg.date}`, previousSnapshot: judg.revision ? `imobiliare-${judg.date}` : undefined,
  date: macro.updatedAt, judgmentDate: judg.date, formulas: FORMULAS, sources: macro.sources, rows, missing };
await writeFile(new URL('../src/data/imobiliare/scores.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(rows.map((r) => `${r.id} ${r.met}/22 (verificare ${r.trust}/8) ${r.score}${r.gaps.length ? ' lipsă ' + r.gaps : ''}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const date = judg.date;
  const SNAPN = `imobiliare${judg.revision ? `-r${judg.revision}` : ''}-${date}`;
  const file = new URL(`../public/snapshots/${SNAPN}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'imobiliare', date, weights: W, verification_weights: WV, met_threshold: 7, formulas: FORMULAS, sources: macro.sources, rows: rows.map(({ why, vwhy, vwhyEn, sources, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${SNAPN}.sha256`, import.meta.url), `${h}  ${SNAPN}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
