import licee from './social/licee-romania.json';
import facultati from './social/facultati-romania.json';
import meserii from './social/meserii-romania.json';
import angajatori from './social/angajatori-romania.json';
import localitati from './social/localitati-romania.json';

/** Analizele din categoria Social (calculate de scripts/score-social.mjs). */
export interface SocialRow {
  id: string; name: string; nameEn: string; c: (number | null)[]; why: string; whyEn: string;
  sources: [string, string][]; sourcesEn: [string, string][]; inputs: Record<string, string>; score: number; met: number;
}
export interface SocialData { slug: string; set: string; date: string; snapshot: string; previousSnapshot?: string; revisionNote?: string; revisionNoteEn?: string; formulas: Record<string, string>; rows: SocialRow[] }
export const SOCIAL: Record<string, SocialData> = Object.fromEntries(
  [licee, facultati, meserii, angajatori, localitati].map((d) => [d.slug, d as unknown as SocialData]),
);
export const SOCIAL_SLUGS = Object.keys(SOCIAL);
