import type { Dataset, Domain, Source } from './types';
import type { Lang } from './i18n';
import { DOMAINS_EN, DATASETS_EN, LABEL_EN, PINK_NOTE_EN, SOURCE_NAME_EN } from './en-content';

/** Ajutoare pentru paginile în două limbi: linkuri, titluri, numere, seturi de date. */
export const isEn = (lang: Lang) => lang === 'en';
export const locale = (lang: Lang) => (lang === 'en' ? 'en-GB' : 'ro-RO');
export const pick = (lang: Lang, ro: string, en: string) => (lang === 'en' ? en : ro);

export function domainHref(slug: string, lang: Lang) {
  const base = import.meta.env.BASE_URL;
  return lang === 'en' ? `${base}en/domains/${slug}/` : `${base}domenii/${slug}/`;
}
export const domainTitle = (d: Pick<Domain, 'slug' | 'title'>, lang: Lang) => (lang === 'en' ? DOMAINS_EN[d.slug]?.title ?? d.title : d.title);
export const domainSummary = (d: Pick<Domain, 'slug' | 'summary'>, lang: Lang) => (lang === 'en' ? DOMAINS_EN[d.slug]?.summary ?? d.summary : d.summary);

export const fmtDate = (d: string, lang: Lang) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString(locale(lang), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const num = (x: number, d: number, lang: Lang) => x.toLocaleString(locale(lang), { maximumFractionDigits: d, minimumFractionDigits: d });
export const pctL = (x: number | undefined, lang: Lang) => (x === undefined ? '—' : `${x > 0 ? '+' : ''}${num(x, 1, lang)}%`);

export function sourceL(s: Source, lang: Lang): Source {
  return lang === 'en' ? { ...s, name: SOURCE_NAME_EN[s.name] ?? s.name } : s;
}

/** Același set de date, cu textul în limba cerută (cifrele rămân identice). */
export function datasetL(ds: Dataset, lang: Lang, en?: { title: string; unit: string; notes?: string; series?: Record<string, string> }): Dataset {
  if (lang === 'ro') return ds;
  const t = en ?? DATASETS_EN[ds.id];
  const notes = t?.notes ?? (ds.notes && ds.notes.startsWith('Primele trei puncte') ? PINK_NOTE_EN : undefined);
  return {
    ...ds,
    title: t?.title ?? ds.title,
    unit: t?.unit ?? ds.unit,
    notes,
    series: ds.series.map((s) => ({ name: t?.series?.[s.name] ?? s.name, points: s.points.map(([k, v]) => [LABEL_EN[k] ?? k, v] as [string, number]) })),
    source: sourceL(ds.source, lang),
  };
}
