// Notează analizele din categoria Social (scripts/social/*.json) pe cele 14 condiții adaptate fiecărei teme.
// La licee, șase condiții se calculează din date publice (media la BAC, promovarea, ultima medie de admitere),
// după formulele de mai jos; restul notelor sunt judecată, cu justificare și surse la fiecare poziție.
// Scrie src/data/social/<analiză>.json; cu --snapshot îngheață public/snapshots/social-<analiză>-<data>.json (o singură dată).

import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];
// Topurile marcate „verified” au 22 de condiții: primele 14 cântăresc 80%, cele 8 de verificare (C15–C22) 20% (aprobat pe 5 noiembrie 2026).
const W80 = [13, 5, 5, 6, 5, 6, 6, 3, 5, 5, 5, 5, 5, 6];
const WV = [4, 4, 3, 3, 2, 2, 1, 1];
const clamp = (x) => Math.max(0, Math.min(10, Math.round(x)));
const comma = (s) => String(s).replace('.', ',');

export const FORMULAS = {
  licee: {
    C1: 'Media la BAC 2025: nota = 10 − (9,6 − media) × 8 (o medie de 9,35 dă 8).',
    C2: 'Rata de promovare la BAC 2025: nota = 10 − (100 − rata) × 2 (99% dă 8).',
    C3: 'Ultima medie de admitere 2025: nota = 10 − (9,7 − media) × 10 (9,4 dă 7). Fără date dacă liceul nu e în topul național la admitere.',
    C4: 'Rezultate față de cerere: media la BAC minus ultima medie de admitere, din același an; nota = 6 + diferența × 10. O aproximare: cele două medii aparțin unor generații diferite.',
    C5: 'Constanță: liceul apare în ambele topuri naționale (BAC și admitere) = 9; doar într-unul = 5.',
    C10: 'Accesibilitate la intrare (inversul cererii): nota = (9,7 − ultima medie de admitere) × 20 (9,4 dă 6). Fără date dacă liceul nu e în topul la admitere.',
  },
  'licee-eu': {
    C1: 'Matematică, PISA 2022: nota = (scorul − 440) / 7 (510 dă 10, 489 dă 7).',
    C2: 'Citire, PISA 2022: nota = (scorul − 440) / 7.',
    C3: 'Științe, PISA 2022: nota = (scorul − 450) / 7 (500 dă 7).',
  },
  'licee-lume': {
    C1: 'Matematică, PISA 2022: nota = (scorul − 450) / 10 (520 dă 7, 550 sau mai mult dă 10).',
    C2: 'Citire, PISA 2022: nota = (scorul − 450) / 10.',
    C3: 'Științe, PISA 2022: nota = (scorul − 450) / 10.',
  },
};

// Topurile din categoria Social (scripts/social) și topurile pe 22 de condiții din radarul de investiții (scripts/tops).
const jobs = [];
for (const dir of ['social', 'tops']) {
  await mkdir(new URL(`../src/data/${dir}/`, import.meta.url), { recursive: true });
  for (const f of (await readdir(new URL(`./${dir}/`, import.meta.url))).filter((x) => x.endsWith('.json'))) jobs.push([dir, f]);
}
for (const [dir, f] of jobs) {
  const slug = f.replace('.json', '');
  const cfg = JSON.parse(await readFile(new URL(`./${dir}/${f}`, import.meta.url), 'utf8'));
  const rows = cfg.items.map((it) => {
    const c = [...it.c];
    const inputs = {};
    if (cfg.set === 'licee' && it.data) {
      const { bac, rate, adm } = it.data;
      c[0] = clamp(10 - (9.6 - bac) * 8); inputs.C1 = `media la BAC 2025: ${comma(bac)}`;
      c[1] = clamp(10 - (100 - rate) * 2); inputs.C2 = `promovare: ${comma(rate)}%`;
      if (adm) {
        c[2] = clamp(10 - (9.7 - adm) * 10); inputs.C3 = `ultima medie de admitere 2025: ${comma(adm)}`;
        c[3] = clamp(6 + (bac - adm) * 10); inputs.C4 = `BAC ${comma(bac)} − admitere ${comma(adm)} = ${comma((bac - adm).toFixed(2))}`;
        c[9] = clamp((9.7 - adm) * 20); inputs.C10 = inputs.C3;
      }
      c[4] = adm ? 9 : 5; inputs.C5 = adm ? 'în topul la BAC și în cel la admitere' : 'doar în topul la BAC';
    }
    if (cfg.set === 'licee-eu' && it.data) {
      const { math, read, sci } = it.data;
      c[0] = clamp((math - 440) / 7); inputs.C1 = `matematică: ${math} puncte`;
      c[1] = clamp((read - 440) / 7); inputs.C2 = `citire: ${read} puncte`;
      c[2] = clamp((sci - 450) / 7); inputs.C3 = `științe: ${sci} puncte`;
    }
    if (cfg.set === 'licee-lume' && it.data) {
      const { math, read, sci } = it.data;
      c[0] = clamp((math - 450) / 10); inputs.C1 = `matematică: ${math} puncte`;
      c[1] = clamp((read - 450) / 10); inputs.C2 = `citire: ${read} puncte`;
      c[2] = clamp((sci - 450) / 10); inputs.C3 = `științe: ${sci} puncte`;
    }
    const met14 = c.filter((v) => v != null && v >= 7).length;
    if (cfg.verified) {
      const v = it.v ?? Array(8).fill(null);
      const raw = c.map((x) => x ?? 5).reduce((s, x, i) => s + x * W80[i], 0) + v.map((x) => x ?? 5).reduce((s, x, i) => s + x * WV[i], 0);
      const score = +(raw / 100).toFixed(2);
      const met = [...c, ...v].filter((x) => x != null && x >= 7).length;
      const trust = v.filter((x) => x != null && x >= 7).length;
      return { ...it, c, v, inputs, score, met, met14, trust };
    }
    const score = +(c.map((v) => v ?? 5).reduce((s, v, i) => s + v * W[i], 0) / 100).toFixed(2);
    return { ...it, c, inputs, score, met: met14, met14 };
  }).sort((a, b) => b.met - a.met || b.score - a.score);
  const pre = dir === 'social' ? 'social-' : '';
  const snapName = `${pre}${slug}${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`;
  const prevSnap = cfg.revision ? `${pre}${slug}${cfg.revision > 2 ? `-r${cfg.revision - 1}` : ''}-${cfg.date}` : undefined;
  const out = { slug, set: cfg.set, region: cfg.region ?? 'romania', date: cfg.date, snapshot: snapName, previousSnapshot: prevSnap, revisionNote: cfg.revisionNote, revisionNoteEn: cfg.revisionNoteEn, verified: !!cfg.verified, formulas: FORMULAS[cfg.set] ?? {}, rows };
  await writeFile(new URL(`../src/data/${dir}/${slug}.json`, import.meta.url), JSON.stringify(out, null, 1) + '\n');
  console.log(slug, rows.map((r) => `${r.id} ${r.met}/${cfg.verified ? 22 : 14} ${r.score}`).join(' | '));
  if (process.argv.includes('--snapshot')) {
    const name = snapName;
    const file = new URL(`../public/snapshots/${name}.json`, import.meta.url);
    try { await access(file); console.log('  instantaneul există deja'); continue; } catch {}
    const snap = Buffer.from(JSON.stringify({ domain: slug, date: cfg.date, weights: cfg.verified ? W80 : W, ...(cfg.verified ? { verification_weights: WV } : {}), met_threshold: 7, formulas: out.formulas, rows: rows.map(({ why, whyEn, vwhy, vwhyEn, sources, sourcesEn, nameEn, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${name}.sha256`, import.meta.url), `${h}  ${name}.json\n`);
    console.log('  înghețat', h.slice(0, 16));
  }
}
