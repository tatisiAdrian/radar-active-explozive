import type { Lang } from './i18n';

/**
 * Cele două categorii ale site-ului: activele în care investești direct
 * și contextul macroeconomic (monede, economii, mărfuri).
 */
export type CatKey = 'investitii' | 'macro';
export interface Category {
  key: CatKey;
  slugs: string[];
  path: Record<Lang, string>;
  color: string;
  t: Record<Lang, { name: string; title: string; question: string; lede: string; cta: string; eyebrow: string }>;
}

export const CATEGORIES: Record<CatKey, Category> = {
  investitii: {
    key: 'investitii',
    slugs: ['crypto', 'startups', 'startups/europa/romania', 'sp500', 'proiecte-imobiliare'],
    path: { ro: 'investitii/', en: 'en/investments/' },
    color: '#2b59ff',
    t: {
      ro: {
        name: 'Investiții',
        eyebrow: 'Categoria 1 · Active și investiții',
        title: 'Radarul investițiilor',
        question: 'În ce active ai putea investi?',
        lede: 'Criptoactive, start-ups din lume și din România, cele mai mari companii americane și proiecte imobiliare de interes mondial: active pe care le poți cumpăra, folosi sau urmări direct. Aceleași 14 condiții, de la cerere reală la riscuri.',
        cta: 'Deschide radarul investițiilor →',
      },
      en: {
        name: 'Investments',
        eyebrow: 'Category 1 · Assets and investments',
        title: 'The investment radar',
        question: 'Which assets could you invest in?',
        lede: 'Crypto assets, start-ups worldwide and in Romania, the largest US companies and real-estate projects of worldwide interest: assets you can buy, use or follow directly. The same 14 conditions, from real demand to risks.',
        cta: 'Open the investment radar →',
      },
    },
  },
  macro: {
    key: 'macro',
    slugs: ['forex', 'economii-emergente', 'imobiliare', 'marfuri'],
    path: { ro: 'macro/', en: 'en/macro/' },
    color: '#c4433b',
    t: {
      ro: {
        name: 'Macroeconomie',
        eyebrow: 'Categoria 2 · Macroeconomie',
        title: 'Radarul macroeconomic',
        question: 'Încotro se mișcă economiile, monedele, locuințele și mărfurile?',
        lede: 'Monede, economii naționale emergente, piețele imobiliare naționale (toate inclusiv România) și mărfuri: contextul în care trăiesc toate investițiile. Aceleași 14 condiții, adaptate: inflație, dobândă reală, datorie, prețul real al locuințelor, cerere și ofertă fizică.',
        cta: 'Deschide radarul macroeconomic →',
      },
      en: {
        name: 'Macroeconomics',
        eyebrow: 'Category 2 · Macroeconomics',
        title: 'The macroeconomic radar',
        question: 'Where are economies, currencies, housing and commodities heading?',
        lede: 'Currencies, emerging national economies, national housing markets (all including Romania) and commodities: the backdrop every investment lives in. The same 14 conditions, adapted: inflation, real interest rate, debt, real house prices, physical supply and demand.',
        cta: 'Open the macroeconomic radar →',
      },
    },
  },
};
export const CAT_LIST = [CATEGORIES.investitii, CATEGORIES.macro];
export const catOf = (slug: string) => CAT_LIST.find((c) => c.slugs.some((s) => slug === s || slug.startsWith(s + '/'))) ?? CATEGORIES.investitii;
