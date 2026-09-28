import { useSyncExternalStore } from "react";
import type { RegraFrequencia } from "../types";

/** Valores de fábrica, usados pelo botão "Restaurar padrão" */
export const REGRAS_PADRAO: RegraFrequencia = {
  frequenciaMinima: 75,
  mediaMinima: 7,
  pesosAvaliacoes: { AV1: 1, AV2: 1 },
  validadePinMinutos: 5,
  digitosPin: 4,
  limiteAlertaFaltas: 25,
  prazoJustificativaDias: 3,
};

/** Recalcula o limite de faltas a partir da frequência mínima */
export const normalizarRegras = (r: RegraFrequencia): RegraFrequencia => ({
  ...r,
  limiteAlertaFaltas: 100 - r.frequenciaMinima,
});

/** Variáveis "let": quem importa sempre recebe o valor atual. Só o regrasService altera. */
export let REGRAS: RegraFrequencia = normalizarRegras(REGRAS_PADRAO);
export let LIMITE_FALTAS_PCT = REGRAS.limiteAlertaFaltas;
export let FREQ_MINIMA = REGRAS.frequenciaMinima;
export let MEDIA_MINIMA = REGRAS.mediaMinima;

/** Margens para o nível "atenção" */
export const MARGEM_FALTAS_PP = 2;
export const MARGEM_NOTA = 1;

// ---------- Reatividade ----------
const ouvintes = new Set<() => void>();

export function assinarRegras(fn: () => void) {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}

export function aplicarRegras(r: RegraFrequencia) {
  REGRAS = normalizarRegras(r);
  LIMITE_FALTAS_PCT = REGRAS.limiteAlertaFaltas;
  FREQ_MINIMA = REGRAS.frequenciaMinima;
  MEDIA_MINIMA = REGRAS.mediaMinima;
  ouvintes.forEach((fn) => fn());
}

/** Hook: re-renderiza o componente sempre que as regras mudam */
export function useRegras(): RegraFrequencia {
  return useSyncExternalStore(assinarRegras, () => REGRAS);
}
