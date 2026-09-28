import { useSyncExternalStore } from "react";
import type { RegraFrequencia } from "../types";
import { gravar, ler } from "./storage";
import { REGRAS, REGRAS_PADRAO, aplicarRegras } from "../config/regras";

const ouvintes = new Set<() => void>();

// Carrega o que foi salvo assim que o módulo é importado
aplicarRegras({ ...REGRAS_PADRAO, ...ler("regras", REGRAS_PADRAO) });

const emitir = () => ouvintes.forEach((f) => f());

export function validarRegras(r: RegraFrequencia): string[] {
  const erros: string[] = [];
  if (r.frequenciaMinima < 1 || r.frequenciaMinima > 100) erros.push("Frequência mínima deve estar entre 1 e 100%.");
  if (r.mediaMinima < 0 || r.mediaMinima > 10) erros.push("Média mínima deve estar entre 0 e 10.");
  if (Object.values(r.pesosAvaliacoes).some((p) => p <= 0)) erros.push("Todos os pesos devem ser maiores que zero.");
  if (r.validadePinMinutos < 1 || r.validadePinMinutos > 60) erros.push("Validade do PIN: de 1 a 60 minutos.");
  if (r.digitosPin < 4 || r.digitosPin > 8) erros.push("O PIN deve ter de 4 a 8 dígitos.");
  if (r.prazoJustificativaDias < 1 || r.prazoJustificativaDias > 30) erros.push("Prazo de justificativa: de 1 a 30 dias.");
  return erros;
}

export const regrasService = {
  obter: (): RegraFrequencia => REGRAS,
  salvar: (r: RegraFrequencia) => {
    const erros = validarRegras(r);
    if (erros.length) throw new Error(erros.join(" "));
    aplicarRegras(r);
    gravar("regras", REGRAS);
    emitir();
  },
  restaurarPadrao: () => regrasService.salvar(REGRAS_PADRAO),
  assinar: (f: () => void) => {
    ouvintes.add(f);
    return () => ouvintes.delete(f);
  },
};

/** Faz a tela renderizar de novo quando as regras mudam */
export const useRegras = () =>
  useSyncExternalStore(regrasService.assinar, regrasService.obter);
