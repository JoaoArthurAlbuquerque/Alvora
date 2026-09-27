import type { RegraFrequencia } from "../types";

export const REGRAS: RegraFrequencia = {
  frequenciaMinima: 75,
  mediaMinima: 7,
  pesosAvaliacoes: { AV1: 1, AV2: 1 },
  validadePinMinutos: 5,
  digitosPin: 4,
  limiteAlertaFaltas: 25,
  prazoJustificativaDias: 3,
};

/** Derivado: nunca edite à mão */
export const LIMITE_FALTAS_PCT = 100 - REGRAS.frequenciaMinima;
export const FREQ_MINIMA = REGRAS.frequenciaMinima;
