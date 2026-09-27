import { useMemo } from "react";
import {
  listaAlunosTurmaMock,
  historicoBaseTurmaMock,
  sessaoFrequenciaAtiva,
} from "../mocks/data";
import { useRegistros, contaComoPresenca } from "./diarioStore";
import type { RegistroPresenca } from "../types";

export const TURMA_ID = "turma-a";
export const DISCIPLINA_ID = sessaoFrequenciaAtiva.disciplinaId;
export const LIMITE_FALTAS_PCT = 20;

const hoje = () => new Date().toLocaleDateString("sv-SE");

export interface ResumoFrequenciaAluno {
  id: string;
  nome: string;
  matricula: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  percentualFrequencia: number;
  percentualFaltas: number;
  emRisco: boolean;
}

export function calcularFrequenciaTurma(
  registros: RegistroPresenca[],
): ResumoFrequenciaAluno[] {
  return listaAlunosTurmaMock.map((a) => {
    const base = historicoBaseTurmaMock[a.id] ?? {
      totalAulas: 0,
      presencas: 0,
      faltas: 0,
    };
    const meus = registros.filter(
      (r) =>
        r.alunoId === a.id &&
        r.turmaId === TURMA_ID &&
        r.disciplinaId === DISCIPLINA_ID,
    );
    const novasPresencas = meus.filter((r) =>
      contaComoPresenca(r.status),
    ).length;
    const presencas = base.presencas + novasPresencas;
    const faltas = base.faltas + (meus.length - novasPresencas);
    const totalAulas = Math.max(base.totalAulas, presencas + faltas) || 1;
    const percentualFaltas = Number(((faltas / totalAulas) * 100).toFixed(1));

    return {
      id: a.id,
      nome: a.nome,
      matricula: a.matricula,
      totalAulas,
      presencas,
      faltas,
      percentualFrequencia: Number((100 - percentualFaltas).toFixed(1)),
      percentualFaltas,
      emRisco: percentualFaltas > LIMITE_FALTAS_PCT,
    };
  });
}

export function useFrequenciaTurma() {
  const registros = useRegistros();
  return useMemo(() => {
    const alunos = calcularFrequenciaTurma(registros);
    const emRisco = alunos
      .filter((a) => a.emRisco)
      .sort((x, y) => y.percentualFaltas - x.percentualFaltas);
    const mediaFrequencia = alunos.length
      ? Number(
          (
            alunos.reduce((s, a) => s + a.percentualFrequencia, 0) /
            alunos.length
          ).toFixed(1),
        )
      : 0;
    const diasRegistrados = new Set(
      registros
        .filter(
          (r) => r.turmaId === TURMA_ID && r.disciplinaId === DISCIPLINA_ID,
        )
        .map((r) => r.data),
    ).size;
    const diarioHojeSalvo = registros.some(
      (r) =>
        r.turmaId === TURMA_ID &&
        r.disciplinaId === DISCIPLINA_ID &&
        r.data === hoje(),
    );
    return {
      alunos,
      emRisco,
      mediaFrequencia,
      diasRegistrados,
      diarioHojeSalvo,
    };
  }, [registros]);
}
