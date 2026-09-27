import type { RegraFrequencia } from "../types";
import { gravar, ler } from "./storage";

const PADRAO: RegraFrequencia = {
  frequenciaMinima: 75,
  mediaMinima: 7,
  pesosAvaliacoes: { AV1: 0.4, AV2: 0.4, Atividades: 0.2 },
  validadePinMinutos: 10,
  digitosPin: 6,
  limiteAlertaFaltas: 20,
  prazoJustificativaDias: 5,
};

export const regrasService = {
  obter: (): RegraFrequencia => ({ ...PADRAO, ...ler("regras", PADRAO) }),
  salvar: (regras: RegraFrequencia) => gravar("regras", regras),
};
