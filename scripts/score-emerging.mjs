// Notează economiile emergente pe cele 14 condiții: 6 calculate din date oficiale (formule fixe, publice)
// și 8 din judecată (scripts/emerging-judgment.json, cu justificare).
// Scrie src/data/emerging/scores.json; la prima rulare dintr-o zi nouă de instantaneu
// îngheață și public/snapshots/emergente-<data>.json (nu suprascrie un instantaneu existent).
// Rulare: node scripts/score-emerging.mjs [--snapshot]

import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const macro = JSON.parse(await readFile(new URL('../src/data/emerging/macro.json', import.meta.url), 'utf8'));
const judg = JSON.parse(await readFile(new URL('./emerging-judgment.json', import.meta.url), 'utf8'));
// 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const BASELINE = '2026-10-30';

/** Formulele condițiilor calculate. Textele apar pe site, lângă note. */
export const FORMULAS = {
  C1: 'Creșterea PIB real în 2026 (FMI): nota = 2 + 1,2 × creșterea în %.',
  C2: 'Soldul bugetar în 2026 (FMI, % din PIB): nota = 10 + soldul (un deficit de 3% dă 7).',
  C3: 'Datoria publică și contul curent (FMI 2026): nota = 10 − datorie/15 + 0,4 × deficitul de cont curent.',
  C7: 'Dobânda reală (BIS): nota = 5 + dobânda reală − 0,3 × inflația care depășește 5%.',
  C10: 'Poziția bursei (ETF de țară sau indice local) în intervalul de 52 de săptămâni: aproape de minim = ieftină = notă mare. Aproximare până integrăm raportul preț/profit.',
  C12: 'Trendul bursei pe două luni (de la 4 septembrie): nota = 5 + variația în %.',
};

const rows = [];
const missing = [];
for (const [cur, j] of Object.entries(judg.countries)) {
  const imf = (ind) => macro.imf[ind]?.values?.[cur]?.['2026'];
  const bis = macro.bis[cur] ?? {};
  const fx = macro.fx[cur];
  const ca = imf('BCA_NGDPD'), debt = imf('GGXWDG_NGDP'), fiscal = imf('GGXCNL_NGDP'), growth = imf('NGDP_RPCH');
  const cpi = bis.cpiYoY?.value, rate = bis.policyRate?.value;
  const c = {};
  const inputs = {};
  if (growth !== undefined) { c.C1 = clamp(2 + 1.2 * growth); inputs.C1 = `creștere ${growth}% în 2026`; }
  if (fiscal !== undefined) { c.C2 = clamp(10 + fiscal); inputs.C2 = `sold bugetar ${fiscal}% din PIB`; }
  if (debt !== undefined && ca !== undefined) {
    c.C3 = clamp(10 - debt / 15 + 0.4 * Math.min(ca, 0));
    inputs.C3 = `datorie ${debt}% din PIB, cont curent ${ca}%`;
  }
  if (cpi !== undefined && rate !== undefined) {
    const real = rate - cpi;
    c.C7 = clamp(5 + real - 0.3 * Math.max(0, cpi - 5));
    inputs.C7 = `dobândă ${rate}% (${bis.policyRate.period}) − inflație ${cpi.toFixed(1)}% = ${real.toFixed(1)} pp`;
  }
  if (fx && fx.points.length >= 4) {
    const pos = (fx.last - fx.low52) / (fx.high52 - fx.low52 || 1);
    c.C10 = clamp(10 * (1 - pos));
    inputs.C10 = `bursa la ${Math.round(pos * 100)}% din intervalul de 52 de săptămâni (${fx.symbol})`;
    const first = fx.points[0]?.[1], base = fx.points.find((p) => p[0] === BASELINE)?.[1] ?? fx.last;
    if (first) {
      const ch = (base / first - 1) * 100;
      c.C12 = clamp(5 + ch);
      inputs.C12 = `bursa ${ch >= 0 ? '+' : ''}${ch.toFixed(1)}% în două luni`;
    }
  }
  for (const k of ['C4', 'C5', 'C6', 'C8', 'C9', 'C11', 'C13', 'C14']) c[k] = j[k];
  const vec = Array.from({ length: 14 }, (_, i) => c[`C${i + 1}`]);
  const gaps = vec.map((v, i) => (v === undefined ? `C${i + 1}` : null)).filter(Boolean);
  if (gaps.length) missing.push(`${cur}: ${gaps.join(', ')}`);
  // Condițiile fără date primesc 5 (neutru) și sunt marcate; nu le considerăm îndeplinite.
  const filled = vec.map((v) => v ?? 5);
  const v = j.v ?? Array(8).fill(null);
  const score = +((filled.reduce((s, x, i) => s + x * W[i], 0) + v.map((x) => x ?? 5).reduce((s, x, i) => s + x * WV[i], 0)) / 100).toFixed(2);
  const met14 = vec.filter((x) => x !== undefined && x >= 7).length;
  const trust = v.filter((x) => x != null && x >= 7).length;
  const met = met14 + trust;
  // Zecimale cu virgulă, ca în restul site-ului (datele calendaristice nu sunt afectate).
  for (const k of Object.keys(inputs)) inputs[k] = inputs[k].replace(/(\d)\.(\d)/g, '$1,$2');
  rows.push({ id: cur, name: j.name, score, met, met14, trust, v, vwhy: j.vwhy, vwhyEn: j.vwhyEn, criteria: vec, inputs, gaps, why: j.why });
}
rows.sort((a, b) => b.met - a.met || b.score - a.score);

const out = {
  snapshot: `emergente${judg.revision ? `-r${judg.revision}` : ''}-${judg.date}`, previousSnapshot: judg.revision ? `emergente-${judg.date}` : undefined,
  date: macro.updatedAt,
  judgmentDate: judg.date,
  formulas: FORMULAS,
  sources: macro.sources,
  rows,
  missing,
};
await writeFile(new URL('../src/data/emerging/scores.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(rows.map((r) => `${r.id} ${r.met}/22 (verificare ${r.trust}/8) ${r.score}${r.gaps.length ? ' lipsă ' + r.gaps : ''}`).join('\n'));

if (process.argv.includes('--snapshot')) {
  const date = judg.date;
  const SNAPN = `emergente${judg.revision ? `-r${judg.revision}` : ''}-${date}`;
  const file = new URL(`../public/snapshots/${SNAPN}.json`, import.meta.url);
  try { await access(file); console.log('Instantaneul există deja; nu îl modific.'); }
  catch {
    const snap = Buffer.from(JSON.stringify({ domain: 'economii-emergente', date, weights: W, verification_weights: WV, met_threshold: 7, formulas: FORMULAS, sources: macro.sources, rows: rows.map(({ why, vwhy, vwhyEn, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${SNAPN}.sha256`, import.meta.url), `${h}  ${SNAPN}.json\n`);
    console.log('Instantaneu înghețat:', h);
  }
}
