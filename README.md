# Radar Active

Site de analize structurate pe domenii (start-ups, cripto, mărfuri și altele), fiecare susținută de date statistice reale și surse verificabile.

## Tehnologie

- **Astro**: pagini statice, rapide, cu JavaScript doar unde e nevoie
- **ECharts**: grafice interactive (zoom, tooltip), încărcate doar când apar pe ecran
- **TypeScript**: verifică la build că fiecare set de date are sursă, link și dată

## Structură

- `src/data/domains.ts`: registrul domeniilor. Un domeniu nou înseamnă un obiect nou aici, iar pagina lui se generează automat. Subdomeniile folosesc slug-uri ierarhice, ex. `startups/europa/romania`.
- `src/data/datasets.ts`: seturile de date, fiecare cu sursă obligatorie.
- `src/pages/domenii/[...slug].astro`: șablonul paginii de domeniu.

## Comenzi

```sh
npm install
npm run dev      # server local
npm run build    # verificare + build în dist/
```

Publicarea se face automat: la fiecare push pe `main`, site-ul construit e pus în branch-ul `gh-pages`, din care îl servește GitHub Pages.
