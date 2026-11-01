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
    slug: 'companii-top-500',
    title: 'Top 500 companii listate în SUA',
    summary: 'Cele mai mari companii listate pe Wall Street după capitalizare.',
    status: 'planificat',
    questions: ['Cât de concentrată este capitalizarea în primele 10 companii?'],
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
