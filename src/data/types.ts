/**
 * Regula de bază a site-ului: nicio cifră fără sursă.
 * Fiecare set de date TREBUIE să aibă sursă, link și data preluării,
 * iar fiecare interpretare TREBUIE să indice seturile de date pe care se bazează.
 * TypeScript refuză build-ul dacă aceste câmpuri lipsesc.
 */

export type DomainStatus = 'activ' | 'planificat';

export interface Source {
  /** Numele instituției / furnizorului, ex. "Banca Mondială" */
  name: string;
  /** Link direct către setul de date sau raport */
  url: string;
  /** Data la care am preluat datele (YYYY-MM-DD) */
  retrievedAt: string;
}

export interface Series {
  name: string;
  /** Perechi [eticheta pe axa X, valoare] */
  points: [string, number][];
}

export interface Dataset {
  id: string;
  /** Slug-ul domeniului căruia îi aparține */
  domain: string;
  title: string;
  unit: string;
  chart: 'line' | 'bar';
  series: Series[];
  source: Source;
  notes?: string;
}

export interface Interpretation {
  title: string;
  text: string;
  /** ID-urile seturilor de date care susțin interpretarea (minim unul) */
  basedOn: [string, ...string[]];
}

export interface Domain {
  /** Poate fi ierarhic: "startups/europa/romania" */
  slug: string;
  title: string;
  summary: string;
  status: DomainStatus;
  /** Întrebările la care răspunde analiza domeniului */
  questions: string[];
  interpretations?: Interpretation[];
  /** Piața de pe radar ale cărei active apar pe pagina domeniului (prețuri săptămânale, condiții). */
  radarMarket?: 'crypto' | 'comp' | 'comm';
}
