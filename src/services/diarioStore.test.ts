import { beforeEach, describe, expect, it } from "vitest";
import type { RegistroPresenca, StatusPresenca } from "../types";
import {
  contaComoPresenca,
  aplicarRegistros,
  diarioStore,
  situacaoFrequencia,
  FREQ_MINIMA,
  FREQ_ALERTA,
} from "./diarioStore";

const FALTA = "FALTA" as StatusPresenca; // ajuste se o seu status de falta tiver outro nome

const reg = (
  alunoId: string,
  disciplinaId: string,
  status: StatusPresenca,
  data = "2026-09-27",
): RegistroPresenca => ({
  id: `t1-${data}-${alunoId}-${Math.random()}`,
  alunoId,
  turmaId: "t1",
  disciplinaId,
  status,
  data,
  registradoEm: 0,
});

const base = [
  {
    disciplinaId: "mat",
    presencas: 8,
    faltas: 2,
    totalAulas: 20,
    percentualFrequencia: 80,
  },
];

describe("contaComoPresenca", () => {
  it("aceita PIN e manual", () => {
    expect(contaComoPresenca("PRESENTE_PIN")).toBe(true);
    expect(contaComoPresenca("PRESENTE_MANUAL")).toBe(true);
  });
  it("rejeita falta", () => {
    expect(contaComoPresenca(FALTA)).toBe(false);
  });
});

describe("aplicarRegistros", () => {
  it("sem registros devolve o mesmo item", () => {
    const r = aplicarRegistros(base, [], "a1");
    expect(r[0]).toBe(base[0]);
  });

  it("soma presenças e faltas e recalcula o %", () => {
    const r = aplicarRegistros(
      base,
      [reg("a1", "mat", "PRESENTE_PIN"), reg("a1", "mat", FALTA)],
      "a1",
    );
    expect(r[0]).toMatchObject({
      presencas: 9,
      faltas: 3,
      percentualFrequencia: 75,
    });
  });

  it("ignora outros alunos e outras disciplinas", () => {
    const r = aplicarRegistros(
      base,
      [reg("a2", "mat", FALTA), reg("a1", "port", FALTA)],
      "a1",
    );
    expect(r[0]).toBe(base[0]);
  });

  it("totalAulas nunca fica menor que o número de aulas dadas", () => {
    const pequeno = [{ ...base[0], totalAulas: 10 }];
    const r = aplicarRegistros(
      pequeno,
      [reg("a1", "mat", "PRESENTE_PIN")],
      "a1",
    );
    expect(r[0].totalAulas).toBe(11);
  });
});

describe("diarioStore", () => {
  beforeEach(() => diarioStore.limpar());

  it("salvar grava um registro por aluno", () => {
    const n = diarioStore.salvar({
      turmaId: "t1",
      disciplinaId: "mat",
      data: "2026-09-27",
      statusPorAluno: { a1: "PRESENTE_MANUAL", a2: FALTA },
    });
    expect(n).toBe(2);
    expect(diarioStore.jaSalvo("t1", "mat", "2026-09-27")).toBe(true);
  });

  it("salvar duas vezes no mesmo dia sobrescreve (não duplica)", () => {
    const input = {
      turmaId: "t1",
      disciplinaId: "mat",
      data: "2026-09-27",
      statusPorAluno: { a1: FALTA },
    };
    diarioStore.salvar(input);
    diarioStore.salvar({ ...input, statusPorAluno: { a1: "PRESENTE_MANUAL" } });
    expect(diarioStore.listar()).toHaveLength(1);
    expect(diarioStore.listar()[0].status).toBe("PRESENTE_MANUAL");
  });

  it("marcar via PIN aparece em presentesDaChamada", () => {
    diarioStore.marcar({
      alunoId: "a1",
      turmaId: "t1",
      disciplinaId: "mat",
      chamadaId: "c1",
      status: "PRESENTE_PIN",
    });
    expect(diarioStore.presentesDaChamada("c1")).toEqual(["a1"]);
  });
});

describe("situacaoFrequencia", () => {
  it("abaixo do mínimo é reprovado", () => {
    expect(situacaoFrequencia(FREQ_MINIMA - 0.1)).toBe("reprovado");
  });

  it("entre mínimo e alerta é atenção", () => {
    expect(situacaoFrequencia(FREQ_MINIMA)).toBe("atencao");
    expect(situacaoFrequencia(FREQ_ALERTA - 0.1)).toBe("atencao");
  });

  it("a partir do alerta é segura", () => {
    expect(situacaoFrequencia(FREQ_ALERTA)).toBe("segura");
    expect(situacaoFrequencia(100)).toBe("segura");
  });
});
