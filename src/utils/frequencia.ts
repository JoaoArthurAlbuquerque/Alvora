/** Percentual com 1 casa decimal, arredondado (28/36 → 77.8). */
export const calcularPercentual = (presencas: number, total: number): number =>
  total ? Math.round((presencas / total) * 1000) / 10 : 100;
