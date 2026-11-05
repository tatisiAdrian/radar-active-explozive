import startups from './tops/startups.json';
import ipo from './tops/ipo-preipo.json';
import type { SocialData } from './social';

/** Topurile de 22 din radarul de investiții, pe 22 de condiții (calculate de scripts/score-social.mjs din scripts/tops). */
export const TOPS: Record<string, SocialData> = Object.fromEntries(
  [startups, ipo].map((d) => [d.slug, d as unknown as SocialData]),
);
