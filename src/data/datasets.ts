import type { Dataset, Source } from './types';

/**
 * Seturile de date reale, fiecare cu sursă verificabilă.
 * Regula: nicio cifră fără sursă. Valorile sunt copiate exact din sursă;
 * orice valoare derivată (ex. „restul pieței”) e marcată în `notes`.
 */

// ——— Surse ———

const pinkSheetOct2026: Source = {
  name: 'World Bank, Commodity Price Data (Pink Sheet), octombrie 2026',
  url: 'https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Pink-Sheet-October-2026.pdf',
  retrievedAt: '2026-11-01',
};

const coingeckoGlobal: Source = {
  name: 'CoinGecko, Global Cryptocurrency Market Cap Charts',
  url: 'https://www.coingecko.com/en/global-charts',
  retrievedAt: '2026-11-01',
};

// Axa comună pentru Pink Sheet: medii anuale, apoi ultimele trei luni publicate.
const PERIOADE = ['Medie 2023', 'Medie 2024', 'Medie 2025', 'Iul 2026', 'Aug 2026', 'Sep 2026'] as const;
const pe = (values: [number, number, number, number, number, number]): [string, number][] =>
  PERIOADE.map((p, i) => [p, values[i]]);
const NOTA_PINK =
  'Primele trei puncte sunt medii anuale, ultimele trei sunt medii lunare (nominal, USD).';

export const datasets: Dataset[] = [
  // ——— Mărfuri: energie ———
  {
    id: 'marfuri-petrol-brent',
    domain: 'marfuri',
    title: 'Petrol Brent',
    unit: 'USD/baril',
    chart: 'line',
    series: [{ name: 'Brent', points: pe([82.6, 80.7, 69.0, 83.4, 90.9, 116.8]) }],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },
  {
    id: 'marfuri-gaz-sua-europa',
    domain: 'marfuri',
    title: 'Gaz natural: SUA (Henry Hub) vs. Europa',
    unit: 'USD/mmbtu',
    chart: 'line',
    series: [
      { name: 'SUA', points: pe([2.54, 2.19, 3.53, 2.89, 2.77, 2.95]) },
      { name: 'Europa', points: pe([13.11, 10.96, 11.96, 18.06, 21.11, 25.42]) },
    ],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },

  // ——— Mărfuri: agricultură ———
  {
    id: 'marfuri-cereale',
    domain: 'marfuri',
    title: 'Cereale: grâu (SUA, HRW) și porumb',
    unit: 'USD/tonă',
    chart: 'line',
    series: [
      { name: 'Grâu SUA HRW', points: pe([340.4, 268.7, 243.3, 310.0, 330.0, 347.0]) },
      { name: 'Porumb', points: pe([252.7, 190.6, 203.2, 213.4, 224.0, 239.6]) },
    ],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },
  {
    id: 'marfuri-softs',
    domain: 'marfuri',
    title: 'Cacao, cafea Arabica, zahăr și portocale',
    unit: 'USD/kg',
    chart: 'line',
    series: [
      { name: 'Cacao', points: pe([3.28, 7.33, 7.8, 5.61, 5.95, 5.92]) },
      { name: 'Cafea Arabica', points: pe([4.54, 5.62, 8.47, 7.91, 7.97, 7.26]) },
      { name: 'Zahăr (mondial)', points: pe([0.52, 0.45, 0.37, 0.34, 0.38, 0.41]) },
      { name: 'Portocale', points: pe([1.57, 2.26, 1.42, 0.78, 0.77, 0.79]) },
    ],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },

  // ——— Mărfuri: metale ———
  {
    id: 'marfuri-metale-industriale',
    domain: 'marfuri',
    title: 'Metale industriale: cupru, nichel, aluminiu',
    unit: 'USD/tonă',
    chart: 'line',
    series: [
      { name: 'Cupru', points: pe([8490, 9142, 9947, 13543, 14326, 14474]) },
      { name: 'Nichel', points: pe([21521, 16814, 15162, 16651, 16751, 16324]) },
      { name: 'Aluminiu', points: pe([2256, 2419, 2632, 3161, 3251, 3283]) },
    ],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },
  {
    id: 'marfuri-minereu-fier',
    domain: 'marfuri',
    title: 'Minereu de fier',
    unit: 'USD/tonă uscată',
    chart: 'line',
    series: [{ name: 'Minereu de fier', points: pe([120.6, 109.4, 100.2, 98.2, 96.3, 97.7]) }],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },
  {
    id: 'marfuri-aur-platina',
    domain: 'marfuri',
    title: 'Metale prețioase: aur și platină',
    unit: 'USD/uncie troy',
    chart: 'line',
    series: [
      { name: 'Aur', points: pe([1943, 2388, 3442, 4073, 4411, 4319]) },
      { name: 'Platină', points: pe([966, 955, 1278, 1622, 1780, 1784]) },
    ],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },
  {
    id: 'marfuri-argint',
    domain: 'marfuri',
    title: 'Argint',
    unit: 'USD/uncie troy',
    chart: 'line',
    series: [{ name: 'Argint', points: pe([23.4, 28.3, 39.8, 58.8, 65.4, 64.6]) }],
    source: pinkSheetOct2026,
    notes: NOTA_PINK,
  },

  // ——— Cripto ———
  {
    id: 'crypto-dominanta',
    domain: 'crypto',
    title: 'Ponderea în capitalizarea totală a pieței cripto',
    unit: '%',
    chart: 'bar',
    series: [
      {
        name: 'Pondere',
        points: [
          ['Bitcoin', 57.7],
          ['Ethereum', 10.2],
          ['Restul pieței', 32.1],
        ],
      },
    ],
    source: coingeckoGlobal,
    notes:
      'Instantaneu din ziua preluării; capitalizarea totală afișată: 2,711 trilioane USD. „Restul pieței” e calculat ca 100% minus Bitcoin minus Ethereum.',
  },
];

export const datasetsFor = (domain: string) => datasets.filter((d) => d.domain === domain);
export const datasetById = (id: string) => datasets.find((d) => d.id === id);
