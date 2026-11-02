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

/** Analizele din categoria Social (calculate de scripts/score-social.mjs). */
export interface SocialRow {
  id: string; name: string; nameEn: string; c: (number | null)[]; why: string; whyEn: string;
  sources: [string, string][]; sourcesEn: [string, string][]; inputs: Record<string, string>; score: number; met: number;
}
export interface SocialData { slug: string; set: string; region: string; date: string; snapshot: string; previousSnapshot?: string; revisionNote?: string; revisionNoteEn?: string; formulas: Record<string, string>; rows: SocialRow[] }
export const SOCIAL: Record<string, SocialData> = Object.fromEntries(
  [licee, facultati, meserii, angajatori, localitati, liceeEu, facultatiEu, meseriiEu, angajatoriEu, localitatiEu].map((d) => [d.slug, d as unknown as SocialData]),
);
export const SOCIAL_SLUGS = Object.keys(SOCIAL);

/** Regiunile categoriei Social: Europa e vizualizarea implicită (butonul EU), România are butonul RO. */
export const REGIONS = [
  { key: 'europa', code: 'EU', path: { ro: 'social/', en: 'en/social/' }, name: { ro: 'Europa', en: 'Europe' } },
  { key: 'romania', code: 'RO', path: { ro: 'social/romania/', en: 'en/social/romania/' }, name: { ro: 'România', en: 'Romania' } },
] as const;
export type RegionKey = (typeof REGIONS)[number]['key'];
export const regionOf = (slug: string): RegionKey => (slug.endsWith('-europa') ? 'europa' : 'romania');
