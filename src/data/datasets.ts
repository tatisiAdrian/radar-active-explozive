import type { Dataset } from './types';

/**
 * Seturile de date reale, fiecare cu sursă verificabilă.
 * Intenționat gol: nu afișăm cifre până nu sunt preluate din surse oficiale.
 */
export const datasets: Dataset[] = [];

export const datasetsFor = (domain: string) => datasets.filter((d) => d.domain === domain);
export const datasetById = (id: string) => datasets.find((d) => d.id === id);
