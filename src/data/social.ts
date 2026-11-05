import licee from './social/licee-romania.json';
import facultati from './social/facultati-romania.json';
import meserii from './social/meserii-romania.json';
import angajatori from './social/angajatori-romania.json';
import localitati from './social/localitati-romania.json';
import liceeEu from './social/licee-europa.json';
import facultatiEu from './social/facultati-europa.json';
import meseriiEu from './social/meserii-europa.json';
import angajatoriEu from './social/angajatori-europa.json';
import localitatiEu from './social/localitati-europa.json';
import liceeW from './social/licee-lume.json';
import facultatiW from './social/facultati-lume.json';
import meseriiW from './social/meserii-lume.json';
import angajatoriW from './social/angajatori-lume.json';
import localitatiW from './social/localitati-lume.json';
import gradiniteRo from './social/gradinite-romania.json';
import gradiniteEu from './social/gradinite-europa.json';
import gradiniteW from './social/gradinite-lume.json';

/** Analizele din categoria Social (calculate de scripts/score-social.mjs). */
export interface SocialRow {
  id: string; name: string; nameEn: string; c: (number | null)[]; why: string; whyEn: string;
  sources: [string, string][]; sourcesEn: [string, string][]; inputs: Record<string, string>; score: number; met: number;
  met14?: number; trust?: number; v?: (number | null)[]; vwhy?: string; vwhyEn?: string;
}
export interface SocialData { slug: string; set: string; region: string; date: string; snapshot: string; previousSnapshot?: string; revisionNote?: string; revisionNoteEn?: string; verified?: boolean; formulas: Record<string, string>; rows: SocialRow[] }
export const SOCIAL: Record<string, SocialData> = Object.fromEntries(
  [licee, facultati, meserii, angajatori, localitati, liceeEu, facultatiEu, meseriiEu, angajatoriEu, localitatiEu, liceeW, facultatiW, meseriiW, angajatoriW, localitatiW, gradiniteRo, gradiniteEu, gradiniteW].map((d) => [d.slug, d as unknown as SocialData]),
);
export const SOCIAL_SLUGS = Object.keys(SOCIAL);

/** Regiunile categoriei Social: Europa e vizualizarea implicită (butonul EU), România are butonul RO, lumea butonul GLOBAL. */
export const REGIONS = [
  { key: 'europa', code: 'EU', path: { ro: 'social/', en: 'en/social/' }, name: { ro: 'Europa', en: 'Europe' } },
  { key: 'romania', code: 'RO', path: { ro: 'social/romania/', en: 'en/social/romania/' }, name: { ro: 'România', en: 'Romania' } },
  { key: 'lume', code: 'GLOBAL', path: { ro: 'social/lume/', en: 'en/social/world/' }, name: { ro: 'Lume', en: 'World' } },
] as const;
export type RegionKey = (typeof REGIONS)[number]['key'];
export const regionOf = (slug: string): RegionKey => (slug.endsWith('-europa') ? 'europa' : slug.endsWith('-lume') ? 'lume' : 'romania');
