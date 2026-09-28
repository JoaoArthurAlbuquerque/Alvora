import type { RegraFrequencia } from "../types";

const FREQUENCIA_MINIMA = 75;

export const REGRAS: RegraFrequencia = {
  frequenciaMinima: FREQUENCIA_MINIMA,
  mediaMinima: 7,
  pesosAvaliacoes: { AV1: 1, AV2: 1 },
  validadePinMinutos: 5,
  digitosPin: 4,
  /** Derivado da frequência mínima: nunca edite à mão */
  limiteAlertaFaltas: 100 - FREQUENCIA_MINIMA,
  prazoJustificativaDias: 3,
};

/** Derivados: nunca edite à mão */
export const LIMITE_FALTAS_PCT = REGRAS.limiteAlertaFaltas;
export const FREQ_MINIMA = REGRAS.frequenciaMinima;
export const MEDIA_MINIMA = REGRAS.mediaMinima;

/** Margens para o nível "atenção" */
export const MARGEM_FALTAS_PP = 2;
export const MARGEM_NOTA = 1;
