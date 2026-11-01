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

## Baza de date săptămânală

`src/data/prices/weekly.json` conține închiderea de vineri pentru fiecare activ cu preț public (CoinGecko, Yahoo Finance) și reperele Bitcoin, S&P 500 și mărfuri (ETF DBC), începând cu 4 septembrie 2026. Fișierul se actualizează automat în fiecare vineri seara (`.github/workflows/data.yml`, scriptul `scripts/fetch-prices.mjs`); punctele mai vechi de 7 zile nu se mai modifică. Paginile Start-ups, Cripto și Mărfuri calculează din el:

- variația fiecărui activ în cele două luni dinaintea instantaneului (test retroactiv, marcat ca atare);
- performanța de la instantaneu încolo, pe zone (10+, 6–9, sub 6 condiții), față de reper.

## Forex

15 monede notate pe cele 14 condiții. Șase condiții se calculează din date oficiale (FMI World Economic Outlook, BIS: dobânzi și inflație, Yahoo Finance: cursuri) după formulele din `scripts/score-forex.mjs`; opt sunt judecată, cu justificare, în `scripts/forex-judgment.json`. Datele se descarcă săptămânal (`scripts/fetch-forex.mjs`). Instantaneul înghețat: `public/snapshots/forex-2026-11-01.json`.

## Economii emergente

15 economii (China, India, Brazilia, Mexic, Indonezia, Turcia, Africa de Sud, Polonia, România, Vietnam, Arabia Saudită, Argentina, Egipt, Filipine, Chile), după aceeași metodă ca Forex: date în `scripts/fetch-emerging.mjs`, formule în `scripts/score-emerging.mjs`, judecată în `scripts/emerging-judgment.json`. Instantaneu: `public/snapshots/emergente-2026-11-01.json`.

## S&P 500

20 dintre cele mai mari companii din indice. Cifrele financiare vin din rapoartele anuale 10-K: direct din SEC EDGAR când serverul o permite, altfel prin seria fundamentală Yahoo Finance (`scripts/fetch-sp500.mjs`). Formule în `scripts/score-sp500.mjs`, judecată în `scripts/sp500-judgment.json`. Instantaneu: `public/snapshots/sp500-2026-11-01.json`.

## Tehnologie

- **Astro**: pagini statice, rapide, cu JavaScript doar unde e nevoie
- **ECharts**: grafice interactive (zoom, tooltip), încărcate doar când apar pe ecran
- **TypeScript**: verifică la build că fiecare set de date are sursă, link și dată

## Structură

- `radar/`: sursa radarului (`assets.json` cu notele, `template.html`, `build_site.py`). După orice modificare: `python3 radar/build_site.py`, care regenerează `public/index.html`, `public/en/index.html` și instantaneul.
- `src/pages/domenii/`: paginile pe domenii. Start-ups are subpagini pe continente și țări (inclusiv România), filtrate după țara sediului (`COUNTRY` în `src/data/radar.ts`).
- `src/data/criteria.ts`: cele 14 condiții adaptate pentru fiecare domeniu (cripto/companii, mărfuri, forex, economii emergente, S&P 500), cu aceleași ponderi.
- `src/data/domains.ts`: registrul domeniilor. Un domeniu nou înseamnă un obiect nou aici, iar pagina lui se generează automat. Subdomeniile folosesc slug-uri ierarhice, ex. `startups/europa/romania`.
- `src/data/datasets.ts`: seturile de date, fiecare cu sursă obligatorie.

## Comenzi

```sh
npm install
npm run dev      # server local
npm run build    # verificare + build în dist/
```

Publicarea se face automat: la fiecare push pe `main`, site-ul construit e pus în branch-ul `gh-pages`, din care îl servește GitHub Pages.
