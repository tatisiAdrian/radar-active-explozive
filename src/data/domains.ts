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
    radarMarket: 'comp',
    criteria: 'general',
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
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['GB', 'FR', 'SE', 'DE', 'RO'],
    summary: 'Ecosistemele de start-up europene, comparate pe țări.',
    status: 'activ',
    questions: [
      'Care sunt cele mai finanțate ecosisteme europene?',
      'Ce start-ups europene adună cele mai multe condiții?',
    ],
  },
  {
    slug: 'startups/europa/romania',
    title: 'Start-ups în România',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['RO'],
    summary: 'Ecosistemul românesc: finanțare, sectoare, exit-uri.',
    status: 'planificat',
    questions: [
      'Cum se compară România cu regiunea (Europa Centrală și de Est)?',
      'Care start-ups românești merită urmărite pe aceleași 14 condiții?',
      'Ce exit-uri au avut loc și la ce evaluări?',
    ],
  },
  {
    slug: 'startups/europa/marea-britanie',
    title: 'Start-ups în Marea Britanie',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['GB'],
    summary: 'Londra: fintech și AI, cel mai mare ecosistem din Europa.',
    status: 'activ',
    questions: [
      'Ce start-ups britanice sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/europa/franta',
    title: 'Start-ups în Franța',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['FR'],
    summary: 'Parisul și campionii europeni ai inteligenței artificiale.',
    status: 'activ',
    questions: [
      'Ce start-ups franceze sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/europa/suedia',
    title: 'Start-ups în Suedia',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['SE'],
    summary: 'Stockholm: fintech și software cu ambiții globale.',
    status: 'activ',
    questions: [
      'Ce companii suedeze sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/america-de-nord',
    title: 'Start-ups în America de Nord',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['US', 'CA'],
    summary: 'SUA și Canada: cel mai mare bazin de capital de risc.',
    status: 'activ',
    questions: [
      'Ce pondere are America de Nord în finanțarea globală?',
      'Ce companii nord-americane adună cele mai multe condiții?',
    ],
  },
  {
    slug: 'startups/america-de-nord/sua',
    title: 'Start-ups în SUA',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['US'],
    summary: 'Silicon Valley, New York și restul ecosistemului american.',
    status: 'activ',
    questions: [
      'Ce companii americane sunt pe radar și cum au evoluat cele listate?',
    ],
  },
  {
    slug: 'startups/asia',
    title: 'Start-ups în Asia',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['CN', 'SG', 'IN'],
    summary: 'China, India, Asia de Sud-Est și alte ecosisteme asiatice.',
    status: 'activ',
    questions: [
      'Cum s-a schimbat echilibrul de finanțare între China și India?',
      'Ce companii asiatice sunt pe radar?',
    ],
  },
  {
    slug: 'startups/asia/china',
    title: 'Start-ups în China',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['CN'],
    summary: 'Giganți tehnologici și industriali, cu risc geopolitic ridicat.',
    status: 'activ',
    questions: [
      'Ce companii chineze sunt pe radar și cât cântărește riscul geopolitic?',
    ],
  },
  {
    slug: 'startups/asia/singapore',
    title: 'Start-ups în Singapore',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['SG'],
    summary: 'Hub regional pentru Asia de Sud-Est.',
    status: 'activ',
    questions: [
      'Ce companii cu sediul în Singapore sunt pe radar?',
    ],
  },
  {
    slug: 'startups/asia/india',
    title: 'Start-ups în India',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['IN'],
    summary: 'Al treilea ecosistem de start-up din lume ca număr de companii.',
    status: 'planificat',
    questions: [
      'Ce start-ups indiene merită urmărite pe aceleași 14 condiții?',
    ],
  },
  {
    slug: 'startups/oceania',
    title: 'Start-ups în Oceania',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['AU'],
    summary: 'Australia și Noua Zeelandă.',
    status: 'activ',
    questions: [
      'Ce companii din Oceania sunt pe radar?',
    ],
  },
  {
    slug: 'startups/america-latina',
    title: 'Start-ups în America Latină',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['BR'],
    summary: 'Brazilia, Mexic și restul regiunii.',
    status: 'planificat',
    questions: [
      'Ce fintech-uri latino-americane merită urmărite?',
    ],
  },
  {
    slug: 'startups/africa',
    title: 'Start-ups în Africa',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['NG', 'KE', 'EG', 'ZA'],
    summary: 'Nigeria, Kenya, Egipt și Africa de Sud.',
    status: 'planificat',
    questions: [
      'Unde se concentrează capitalul de risc din Africa?',
    ],
  },
  {
    slug: 'crypto',
    title: 'Criptoactive',
    radarMarket: 'crypto',
    criteria: 'general',
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
    radarMarket: 'comm',
    criteria: 'marfuri',
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
    criteria: 'forex',
    title: 'Forex',
    summary: '15 monede notate pe aceleași 14 condiții, cu date de la FMI, BIS și cursuri săptămânale.',
    status: 'activ',
    questions: [
      'Ce monede au cele mai solide fundamente: cont curent, inflație, datorie, dobândă reală?',
      'Cum influențează diferențialele de dobândă cursurile de schimb?',
      'Unde se află leul românesc față de monedele din regiune și față de cele majore?',
    ],
  },
  {
    slug: 'economii-emergente',
    criteria: 'economii-emergente',
    title: 'Economii emergente',
    summary: 'Creștere, inflație, datorie și riscuri pentru economiile emergente din lume.',
    status: 'planificat',
    questions: ['Care economii emergente au cele mai solide fundamente macro?'],
  },
  {
    slug: 'sp500',
    criteria: 'sp500',
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
