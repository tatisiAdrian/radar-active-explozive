// Notează analizele din categoria Social (scripts/social/*.json) pe cele 14 condiții adaptate fiecărei teme.
// La licee, șase condiții se calculează din date publice (media la BAC, promovarea, ultima medie de admitere),
// după formulele de mai jos; restul notelor sunt judecată, cu justificare și surse la fiecare poziție.
// Scrie src/data/social/<analiză>.json; cu --snapshot îngheață public/snapshots/social-<analiză>-<data>.json (o singură dată).

import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const W = [16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8];
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
};

const files = (await readdir(new URL('./social/', import.meta.url))).filter((f) => f.endsWith('.json'));
await mkdir(new URL('../src/data/social/', import.meta.url), { recursive: true });
for (const f of files) {
  const slug = f.replace('.json', '');
  const cfg = JSON.parse(await readFile(new URL(`./social/${f}`, import.meta.url), 'utf8'));
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
    const score = +(c.map((v) => v ?? 5).reduce((s, v, i) => s + v * W[i], 0) / 100).toFixed(2);
    const met = c.filter((v) => v != null && v >= 7).length;
    return { ...it, c, inputs, score, met };
  }).sort((a, b) => b.met - a.met || b.score - a.score);
  const snapName = `social-${slug}${cfg.revision ? `-r${cfg.revision}` : ''}-${cfg.date}`;
  const prevSnap = cfg.revision ? `social-${slug}${cfg.revision > 2 ? `-r${cfg.revision - 1}` : ''}-${cfg.date}` : undefined;
  const out = { slug, set: cfg.set, date: cfg.date, snapshot: snapName, previousSnapshot: prevSnap, revisionNote: cfg.revisionNote, revisionNoteEn: cfg.revisionNoteEn, formulas: FORMULAS[cfg.set] ?? {}, rows };
  await writeFile(new URL(`../src/data/social/${slug}.json`, import.meta.url), JSON.stringify(out, null, 1) + '\n');
  console.log(slug, rows.map((r) => `${r.id} ${r.met}/14 ${r.score}`).join(' | '));
  if (process.argv.includes('--snapshot')) {
    const name = snapName;
    const file = new URL(`../public/snapshots/${name}.json`, import.meta.url);
    try { await access(file); console.log('  instantaneul există deja'); continue; } catch {}
    const snap = Buffer.from(JSON.stringify({ domain: slug, date: cfg.date, weights: W, met_threshold: 7, formulas: out.formulas, rows: rows.map(({ why, whyEn, sources, sourcesEn, nameEn, ...r }) => r) }, null, 1));
    await writeFile(file, snap);
    const h = createHash('sha256').update(snap).digest('hex');
    await writeFile(new URL(`../public/snapshots/${name}.sha256`, import.meta.url), `${h}  ${name}.json\n`);
    console.log('  înghețat', h.slice(0, 16));
  }
}
