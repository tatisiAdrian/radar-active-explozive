# Radar Active Explozive

Pre-identificăm din timp activele (crypto, companii, mărfuri) care adună cele mai multe condiții pentru o creștere explozivă a prețului. Acces gratuit, în română și engleză. Nu este o recomandare de investiții.

Site-ul are două părți:

- **Radarul** (prima pagină, RO și `/en/`): 88 de active notate pe 14 condiții, explorator, istoric verificabil, metoda și „Despre noi”.
- **Date oficiale** (`/domenii/`): fundamentarea, cu prețuri și statistici din surse oficiale, fiecare cu link și dată de preluare.

## Instantanee (istoric verificabil)

În fiecare vineri radarul se îngheață ca fișier datat în `public/snapshots/`. Fișierul nu se mai modifică; istoricul commit-urilor arată ce era pe radar și când.

| Data | Fișier | SHA-256 |
| --- | --- | --- |
| 2026-10-29 | [public/snapshots/2026-10-29.json](public/snapshots/2026-10-29.json) | `ad1a3ed5d564848a2a74bc36904d7045d707be51cc910e67d4df40f660995a58` |

Verificare: `sha256sum public/snapshots/2026-10-29.json` trebuie să dea exact amprenta din tabel.

Metoda: 14 condiții notate 0–10, o condiție e îndeplinită de la nota 7; ponderi 16, 6, 6, 8, 6, 8, 8, 4, 6, 6, 6, 6, 6, 8. Performanța se măsoară cu prețuri de închidere publice (CoinGecko, Yahoo Finance, World Bank) față de Bitcoin, S&P 500 și un indice de mărfuri. Performanța trecută nu este un indicator de încredere pentru rezultatele viitoare.

Conflicte de interese: autorul deține sau a deținut poziții în Lighter (LIT) și folosește Polymarket.

## Tehnologie

- **Astro**: pagini statice, rapide, cu JavaScript doar unde e nevoie
- **ECharts**: grafice interactive (zoom, tooltip), încărcate doar când apar pe ecran
- **TypeScript**: verifică la build că fiecare set de date are sursă, link și dată

## Structură

- `radar/`: sursa radarului (`assets.json` cu notele, `template.html`, `build_site.py`). După orice modificare: `python3 radar/build_site.py`, care regenerează `public/index.html`, `public/en/index.html` și instantaneul.
- `src/pages/domenii/`: paginile cu date oficiale.
- `src/data/domains.ts`: registrul domeniilor. Un domeniu nou înseamnă un obiect nou aici, iar pagina lui se generează automat. Subdomeniile folosesc slug-uri ierarhice, ex. `startups/europa/romania`.
- `src/data/datasets.ts`: seturile de date, fiecare cu sursă obligatorie.

## Comenzi

```sh
npm install
npm run dev      # server local
npm run build    # verificare + build în dist/
```

Publicarea se face automat: la fiecare push pe `main`, site-ul construit e pus în branch-ul `gh-pages`, din care îl servește GitHub Pages.
