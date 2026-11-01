import type { Domain } from './types';

/**
 * Registrul domeniilor. Pentru un domeniu nou: adaugă un obiect aici.
 * Pagina lui (/domenii/<slug>/) se generează automat.
 * Subdomeniile se definesc prin slug ierarhic, ex. "startups/europa/romania".
 */
export const domains: Domain[] = [
  // ——— Domenii active ———
  {
    slug: 'startups',
    title: 'Start-ups la nivel mondial',
    summary: 'Finanțare, evaluări și dinamica ecosistemelor de start-up la nivel global.',
    status: 'activ',
    questions: [
      'Cât capital de risc s-a investit, pe ani și pe regiuni?',
      'Ce sectoare atrag cea mai mare parte a finanțării?',
      'Cum evoluează numărul de companii „unicorn”?',
    ],
  },
  {
    slug: 'startups/europa',
    title: 'Start-ups în Europa',
    summary: 'Ecosistemele de start-up europene, comparate pe țări.',
    status: 'planificat',
    questions: ['Care sunt cele mai finanțate ecosisteme europene?'],
  },
  {
    slug: 'startups/europa/romania',
    title: 'Start-ups în România',
    summary: 'Ecosistemul românesc: finanțare, sectoare, exit-uri.',
    status: 'planificat',
    questions: ['Cum se compară România cu regiunea (Europa Centrală și de Est)?'],
  },
  {
    slug: 'startups/america-de-nord',
    title: 'Start-ups în America de Nord',
    summary: 'SUA și Canada: cel mai mare bazin de capital de risc.',
    status: 'planificat',
    questions: ['Ce pondere are America de Nord în finanțarea globală?'],
  },
  {
    slug: 'startups/asia',
    title: 'Start-ups în Asia',
    summary: 'China, India, Asia de Sud-Est și alte ecosisteme asiatice.',
    status: 'planificat',
    questions: ['Cum s-a schimbat echilibrul de finanțare între China și India?'],
  },
  {
    slug: 'crypto',
    title: 'Criptoactive',
    summary: 'Capitalizare, volatilitate, adopție și reglementare pe piața cripto.',
    status: 'activ',
    questions: [
      'Cum a evoluat capitalizarea totală a pieței?',
      'Cât de volatile sunt principalele active comparativ cu acțiunile și aurul?',
      'Ce indicatori de adopție sunt verificabili public?',
    ],
    interpretations: [
      {
        title: 'Piața e dominată de Bitcoin',
        text: 'Bitcoin are 57,7% din capitalizarea totală, de peste cinci ori ponderea Ethereum (10,2%). Toate celelalte criptoactive la un loc cântăresc circa o treime. Practic, direcția Bitcoin decide în mare măsură direcția întregii piețe, iar un activ mic poate crește spectaculos doar dacă iese din această corelație.',
        basedOn: ['crypto-dominanta'],
      },
    ],
  },
  {
    slug: 'marfuri',
    title: 'Mărfuri',
    summary: 'Energie, metale și produse agricole: prețuri, cerere și ofertă.',
    status: 'activ',
    questions: [
      'Cum au evoluat prețurile principalelor mărfuri?',
      'Ce factori de ofertă și cerere explică mișcările recente?',
    ],
    interpretations: [
      {
        title: 'Energia: șoc de preț în Europa, nu și în SUA',
        text: 'În septembrie 2026, petrolul Brent a ajuns la 116,8 USD/baril, cu 69% peste media din 2025. Gazul european a urcat la 25,42 USD/mmbtu, mai mult decât dublu față de media 2025, în timp ce gazul american (2,95) e chiar sub media de anul trecut. Diferența dintre cele două piețe a crescut de la circa 3,4 ori în 2025 la 8,6 ori.',
        basedOn: ['marfuri-petrol-brent', 'marfuri-gaz-sua-europa'],
      },
      {
        title: 'Metalele: cuprul și argintul conduc',
        text: 'Față de media 2025, cuprul a crescut cu 45% (14.474 USD/tonă), argintul cu 62%, platina cu 40% și aurul cu 26%. Aurul costă acum de peste două ori cât în 2023. Nichelul (+8%) și minereul de fier (în scădere ușoară) rămân în urmă: oferta lor e abundentă.',
        basedOn: ['marfuri-metale-industriale', 'marfuri-aur-platina', 'marfuri-argint', 'marfuri-minereu-fier'],
      },
      {
        title: 'Agricultura: cerealele urcă, cacaoa și portocalele coboară',
        text: 'Grâul american e cu 43% peste media 2025, iar porumbul cu 18%. În sens opus, cacaoa a scăzut cu 24% după vârful crizei din 2024, iar portocalele au ajuns la circa o treime din media 2024. Mărfurile agricole se pot mișca puternic în ambele direcții în doar câteva luni.',
        basedOn: ['marfuri-cereale', 'marfuri-softs'],
      },
    ],
  },

  // ——— Domenii planificate ———
  {
    slug: 'forex',
    title: 'Forex',
    summary: 'Principalele perechi valutare, politica monetară și fluxurile de capital.',
    status: 'planificat',
    questions: ['Cum influențează diferențialele de dobândă cursurile de schimb?'],
  },
  {
    slug: 'economii-emergente',
    title: 'Economii emergente',
    summary: 'Creștere, inflație, datorie și riscuri pentru economiile emergente din lume.',
    status: 'planificat',
    questions: ['Care economii emergente au cele mai solide fundamente macro?'],
  },
  {
    slug: 'sp500',
    title: 'S&P 500',
    summary: 'Cele 500 de companii mari listate în SUA din indicele S&P 500: capitalizare, sectoare, randamente.',
    status: 'planificat',
    questions: [
      'Cât de concentrată este capitalizarea indicelui în primele 10 companii?',
      'Ce sectoare au contribuit cel mai mult la randamentul indicelui?',
    ],
  },
];

export const getDomain = (slug: string) => domains.find((d) => d.slug === slug);

export const topLevel = () => domains.filter((d) => !d.slug.includes('/'));

export const childrenOf = (slug: string) =>
  domains.filter((d) => {
    const parent = d.slug.split('/').slice(0, -1).join('/');
    return parent === slug;
  });

export const breadcrumbs = (slug: string) =>
  slug
    .split('/')
    .map((_, i, parts) => getDomain(parts.slice(0, i + 1).join('/')))
    .filter((d): d is Domain => Boolean(d));
