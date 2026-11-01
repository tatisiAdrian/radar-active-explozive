// Descarcă fotografiile din scripts/photos.json în public/images/<key>-1600.jpg și <key>-800.jpg.
// Rulează în GitHub Actions (are acces la internet): node scripts/fetch-photos.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const cfg = JSON.parse(await readFile(new URL('./photos.json', import.meta.url), 'utf8'));
await mkdir(new URL('../public/images/', import.meta.url), { recursive: true });
let fail = 0;
for (const p of cfg.photos) {
  for (const w of [1600, 800]) {
    try {
      const r = await fetch(`${p.url}?fm=jpg&q=72&w=${w}&fit=crop&auto=format`);
      if (!r.ok) throw new Error(String(r.status));
      const buf = Buffer.from(await r.arrayBuffer());
      await writeFile(new URL(`../public/images/${p.key}-${w}.jpg`, import.meta.url), buf);
      console.log(`ok ${p.key}-${w}.jpg ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) { fail++; console.warn(`EROARE ${p.key} ${w}: ${e.message}`); }
  }
}
if (fail) process.exit(1);
